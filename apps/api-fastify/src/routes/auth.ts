import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { buildStart, exchangeCode } from "../auth/providers";
import { verifyState } from "../lib/state";
import { saveTokens } from "../auth/token-store";
import { ensureUser } from "../users/user-store";
import { rateLimit } from "../lib/rate-limit";
import { auditEvent } from "../lib/audit";
import { checkOrigin } from "../lib/origin-check";

type Provider = "google" | "microsoft";

type StartQuery = {
  provider: Provider;
};

type CallbackQuery = {
  code?: string;
  state?: string;
  provider: Provider;
};

// Simple in-memory store for PKCE verifiers keyed by state
const verifierStore = new Map<string, string>();

export const registerAuth = (app: FastifyInstance) => {
  app.get<{
    Querystring: StartQuery;
  }>("/auth/oauth/start", { preHandler: [checkOrigin(), rateLimit({ limit: 20, windowMs: 60_000 })] }, async (req) => {
    const provider = req.query.provider;
    if (!["google", "microsoft"].includes(provider)) {
      return { error: "unsupported provider" };
    }
    const { url, state, verifier } = buildStart(provider);
    verifierStore.set(state, verifier);
    return { url, state };
  });

  app.get<{
    Querystring: CallbackQuery;
  }>("/auth/oauth/callback", { preHandler: [checkOrigin(), rateLimit({ limit: 60, windowMs: 60_000 })] }, async (req, reply) => {
    const { code, state, provider } = req.query;
    if (!code || !state) {
      reply.status(400);
      return { error: "missing code or state" };
    }
    if (!verifyState(state)) {
      reply.status(400);
      return { error: "invalid state" };
    }
    const verifier = verifierStore.get(state);
    if (!verifier) {
      reply.status(400);
      return { error: "missing verifier" };
    }
    verifierStore.delete(state);

    try {
      const tokenResponse = await exchangeCode(provider, code, verifier);
      // Ensure placeholder user exists (anonymous until session exchange binds it)
      await ensureUser(state);
      await saveTokens(state, {
        provider,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in,
        tokenType: tokenResponse.token_type,
        scope: tokenResponse.scope,
        createdAt: Date.now(),
      });
      // TODO(task-001-3): bind to user identity and issue app JWT/refresh
      await auditEvent("oauth_callback", state, { provider });
      return {
        provider,
        expires_in: tokenResponse.expires_in,
        token_type: tokenResponse.token_type,
        scope: tokenResponse.scope,
        redirect: env.apiBaseUrl,
      };
    } catch (err) {
      req.log.error({ err }, "token exchange failed");
      reply.status(500);
      return { error: "token exchange failed" };
    }
  });
};

