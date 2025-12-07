import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env";

const allowedHost = (() => {
  try {
    const url = new URL(env.apiBaseUrl);
    return url.host;
  } catch {
    return null;
  }
})();

export const checkOrigin = () => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!allowedHost) return;
    const origin = req.headers.origin;
    if (!origin) return;
    try {
      const host = new URL(origin).host;
      if (host !== allowedHost) {
        reply.status(403);
        return reply.send({ error: "forbidden_origin" });
      }
    } catch {
      // ignore malformed origin
    }
  };
};

