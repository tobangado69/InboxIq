import { FastifyReply, FastifyRequest } from "fastify";

type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  key?: (req: FastifyRequest) => string;
};

export const rateLimit = ({ limit, windowMs, key }: RateLimitOptions) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const k = key ? key(req) : req.ip;
    const now = Date.now();
    const bucket = buckets.get(k);
    if (!bucket) {
      buckets.set(k, { tokens: limit - 1, updatedAt: now });
      return;
    }

    const elapsed = now - bucket.updatedAt;
    if (elapsed > windowMs) {
      bucket.tokens = limit - 1;
      bucket.updatedAt = now;
      buckets.set(k, bucket);
      return;
    }

    if (bucket.tokens <= 0) {
      reply.status(429);
      return reply.send({ error: "rate_limited" });
    }

    bucket.tokens -= 1;
    buckets.set(k, bucket);
  };
};

