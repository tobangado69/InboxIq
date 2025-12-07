import { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccess } from "./auth/jwt";
import { getRoles } from "./users/rbac-store";
import { getMfa } from "./users/mfa-store";

type Authenticated = FastifyRequest & { user?: { sub: string; roles: string[]; mfaEnabled: boolean } };

export const requireAuth = () => {
  return async (req: Authenticated, reply: FastifyReply) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      reply.status(401);
      return reply.send({ error: "missing bearer token" });
    }
    const token = auth.substring("Bearer ".length);
    try {
      const payload = await verifyAccess(token);
      const sub = payload.sub as string;
      const roles = await getRoles(sub);
      const mfa = await getMfa(sub);
      req.user = { sub, roles, mfaEnabled: mfa?.enabled ?? false };
    } catch (err) {
      req.log.warn({ err }, "invalid access token");
      reply.status(401);
      return reply.send({ error: "invalid access token" });
    }
  };
};

export const requireRoles = (required: string[]) => {
  return async (req: Authenticated, reply: FastifyReply) => {
    if (!req.user) {
      reply.status(401);
      return reply.send({ error: "unauthenticated" });
    }
    const has = required.some((r) => req.user?.roles.includes(r));
    if (!has) {
      reply.status(403);
      return reply.send({ error: "forbidden" });
    }
  };
};

export const requireMfa = () => {
  return async (req: Authenticated, reply: FastifyReply) => {
    if (!req.user) {
      reply.status(401);
      return reply.send({ error: "unauthenticated" });
    }
    if (!req.user.mfaEnabled) {
      reply.status(401);
      return reply.send({ error: "mfa_required" });
    }
  };
};

