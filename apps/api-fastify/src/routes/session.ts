import { FastifyInstance } from "fastify";
import { verifyAccess, signAccess, signRefreshId } from "../auth/jwt";
import { getTokens, deleteTokens, saveTokensForUser } from "../auth/token-store";
import { saveRefresh, rotateRefresh, getRefresh, revokeRefresh } from "../auth/session-store";
import { env } from "../config/env";
import { ensureUser, markProviderConnected } from "../users/user-store";
import { getMfa } from "../users/mfa-store";
import { getRoles } from "../users/rbac-store";
import { rateLimit } from "../lib/rate-limit";
import { auditEvent } from "../lib/audit";
import { checkOrigin } from "../lib/origin-check";

const REFRESH_TTL = env.refreshTtlSeconds;

export const registerSession = (app: FastifyInstance) => {
  // Exchange provider token bundle (referenced by state) for app tokens.
  app.post("/auth/session/exchange", { preHandler: [checkOrigin(), rateLimit({ limit: 60, windowMs: 60_000 })] }, async (req, reply) => {
    const { state, userId, email, name } = (req.body ?? {}) as {
      state?: string;
      userId?: string;
      email?: string;
      name?: string;
    };
    if (!state) {
      reply.status(400);
      return { error: "missing state" };
    }
    const effectiveUserId = userId ?? state;
    const user = await ensureUser(effectiveUserId, email, name);
    const bundle = await getTokens(state);
    if (!bundle) {
      reply.status(400);
      return { error: "state not found" };
    }
    if (bundle.userId && bundle.userId !== effectiveUserId) {
      reply.status(400);
      return { error: "state/user mismatch" };
    }
    await markProviderConnected(user.id, bundle.provider);
    await saveTokensForUser(effectiveUserId, bundle.provider, bundle);
    await deleteTokens(state);
    await auditEvent("session_exchange", userId, { provider: bundle.provider });

    const access = await signAccess(effectiveUserId);
    const refreshId = signRefreshId();
    const now = Math.floor(Date.now() / 1000);
    await saveRefresh({
      id: refreshId,
      sub: effectiveUserId,
      jti: access.jti,
      exp: now + REFRESH_TTL,
      revoked: false,
      createdAt: Date.now(),
    });

    const mfa = await getMfa(effectiveUserId);
    const roles = await getRoles(effectiveUserId);
    return {
      user_id: effectiveUserId,
      access_token: access.token,
      access_expires_at: access.exp,
      refresh_token: refreshId,
      refresh_expires_at: now + REFRESH_TTL,
      token_type: "Bearer",
      mfa_enabled: mfa?.enabled ?? false,
      roles,
    };
  });

  // Refresh rotation
  app.post("/auth/session/refresh", { preHandler: [checkOrigin(), rateLimit({ limit: 120, windowMs: 60_000 })] }, async (req, reply) => {
    const { refresh_token: refreshToken } = (req.body ?? {}) as { refresh_token?: string };
    if (!refreshToken) {
      reply.status(400);
      return { error: "missing refresh_token" };
    }
    const current = await getRefresh(refreshToken);
    if (!current || current.revoked) {
      reply.status(401);
      return { error: "invalid refresh" };
    }
    const now = Math.floor(Date.now() / 1000);
    if (current.exp < now) {
      reply.status(401);
      return { error: "refresh expired" };
    }

    const access = await signAccess(current.sub);
    const nextRefreshId = signRefreshId();
    await rotateRefresh(refreshToken, {
      id: nextRefreshId,
      sub: current.sub,
      jti: access.jti,
      exp: now + REFRESH_TTL,
      revoked: false,
      createdAt: Date.now(),
    });

    await auditEvent("session_refresh", current.sub);
    const mfa = await getMfa(current.sub);
    const roles = await getRoles(current.sub);
    return {
      user_id: current.sub,
      access_token: access.token,
      access_expires_at: access.exp,
      refresh_token: nextRefreshId,
      refresh_expires_at: now + REFRESH_TTL,
      token_type: "Bearer",
      mfa_enabled: mfa?.enabled ?? false,
      roles,
    };
  });

  // Logout/revoke
  app.post("/auth/session/logout", { preHandler: [checkOrigin(), rateLimit({ limit: 120, windowMs: 60_000 })] }, async (req, reply) => {
    const { refresh_token: refreshToken } = (req.body ?? {}) as { refresh_token?: string };
    if (!refreshToken) {
      reply.status(400);
      return { error: "missing refresh_token" };
    }
    await revokeRefresh(refreshToken);
    await auditEvent("session_logout", undefined, { refresh_token: refreshToken });
    return { status: "revoked" };
  });

  // Example protected route
  app.get("/auth/session/me", async (req, reply) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      reply.status(401);
      return { error: "missing bearer token" };
    }
    const token = auth.substring("Bearer ".length);
    try {
      const payload = await verifyAccess(token);
      const mfa = await getMfa(payload.sub as string);
      const roles = await getRoles(payload.sub as string);
      return {
        sub: payload.sub,
        jti: payload.jti,
        iss: payload.iss,
        aud: payload.aud,
        mfa_enabled: mfa?.enabled ?? false,
        roles,
      };
    } catch (err) {
      req.log.warn({ err }, "invalid access token");
      reply.status(401);
      return { error: "invalid access token" };
    }
  });
};

