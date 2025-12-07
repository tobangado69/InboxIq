import { FastifyInstance } from "fastify";
import { ensureUser } from "../users/user-store";
import { disableMfa, generateSecret, getMfa, upsertMfa, verifyTotp } from "../users/mfa-store";
import { requireAuth } from "../guards";
import { rateLimit } from "../lib/rate-limit";
import { auditEvent } from "../lib/audit";
import { checkOrigin } from "../lib/origin-check";

export const registerMfa = (app: FastifyInstance) => {
  // Start MFA setup: issue secret and otpauth URI
  app.post("/auth/mfa/setup", { preHandler: [requireAuth(), checkOrigin(), rateLimit({ limit: 20, windowMs: 60_000 })] }, async (req, reply) => {
    const { userId } = (req.body ?? {}) as { userId?: string };
    if (!userId) {
      reply.status(400);
      return { error: "missing userId" };
    }
    await ensureUser(userId);
    const secret = generateSecret();
    const uri = `otpauth://totp/InboxIQ:${userId}?secret=${secret}&issuer=InboxIQ`;
    await upsertMfa({
      userId,
      secret,
      enabled: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await auditEvent("mfa_setup", userId);
    return { secret, otpauth_uri: uri };
  });

  // Verify MFA code to enable
  app.post("/auth/mfa/verify", { preHandler: [requireAuth(), checkOrigin(), rateLimit({ limit: 30, windowMs: 60_000 })] }, async (req, reply) => {
    const { userId, code } = (req.body ?? {}) as { userId?: string; code?: string };
    if (!userId || !code) {
      reply.status(400);
      return { error: "missing userId or code" };
    }
    const record = await getMfa(userId);
    if (!record) {
      reply.status(400);
      return { error: "mfa not initialized" };
    }
    if (!verifyTotp(record.secret, code)) {
      reply.status(401);
      return { error: "invalid code" };
    }
    await upsertMfa({ ...record, enabled: true, updatedAt: Date.now() });
    await auditEvent("mfa_verify", userId);
    return { status: "enabled" };
  });

  // Disable MFA
  app.post("/auth/mfa/disable", { preHandler: [requireAuth(), checkOrigin(), rateLimit({ limit: 20, windowMs: 60_000 })] }, async (req, reply) => {
    const { userId, code } = (req.body ?? {}) as { userId?: string; code?: string };
    if (!userId) {
      reply.status(400);
      return { error: "missing userId" };
    }
    const record = await getMfa(userId);
    if (!record) {
      return { status: "disabled" };
    }
    if (record.enabled) {
      if (!code || !verifyTotp(record.secret, code)) {
        reply.status(401);
        return { error: "invalid code" };
      }
    }
    await disableMfa(userId);
    await auditEvent("mfa_disable", userId);
    return { status: "disabled" };
  });
};

