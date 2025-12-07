import { FastifyInstance } from "fastify";
import { getRoles, setRoles, Role } from "../users/rbac-store";
import { requireAuth, requireRoles } from "../guards";
import { rateLimit } from "../lib/rate-limit";
import { auditEvent } from "../lib/audit";
import { checkOrigin } from "../lib/origin-check";

export const registerRoles = (app: FastifyInstance) => {
  // Admin-only role assignment
  app.post(
    "/auth/roles/assign",
    {
      preHandler: [requireAuth(), requireRoles(["admin"]), checkOrigin(), rateLimit({ limit: 60, windowMs: 60_000 })],
    },
    async (req, reply) => {
      const { userId, roles } = (req.body ?? {}) as { userId?: string; roles?: Role[] };
      if (!userId || !Array.isArray(roles)) {
        reply.status(400);
        return { error: "missing userId or roles" };
      }
      await setRoles(userId, roles);
      await auditEvent("role_assign", (req as unknown as { user?: { sub: string } }).user?.sub, {
        targetUser: userId,
        roles,
      });
      return { userId, roles };
    },
  );

  // View roles (self or admin)
  app.get<{
    Querystring: { userId?: string };
  }>(
    "/auth/roles",
    {
      preHandler: [requireAuth(), rateLimit({ limit: 60, windowMs: 60_000 })],
    },
    async (req, reply) => {
      const user = (req as unknown as { user?: { sub: string; roles: string[] } }).user;
      const targetUserId = req.query.userId ?? user?.sub;
      if (!targetUserId) {
        reply.status(400);
        return { error: "missing userId" };
      }
      // If requesting other user, require admin
      if (targetUserId !== user?.sub) {
        const hasAdmin = (user?.roles ?? []).includes("admin");
        if (!hasAdmin) {
          reply.status(403);
          return { error: "forbidden" };
        }
      }
      const roles = await getRoles(targetUserId);
      return { userId: targetUserId, roles };
    },
  );
};

