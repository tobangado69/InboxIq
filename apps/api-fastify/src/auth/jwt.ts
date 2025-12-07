import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { randomUUID } from "crypto";
import { env } from "../config/env";

const encoder = new TextEncoder();
const secret = encoder.encode(env.jwtSecret);

export const signAccess = async (sub: string, ttlSeconds = env.accessTtlSeconds) => {
  const jti = randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub,
    aud: "app",
    iss: "inboxiq",
    jti,
    iat: now,
    exp: now + ttlSeconds,
  };
  return {
    token: await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(secret),
    jti,
    exp: payload.exp!,
  };
};

export const verifyAccess = async (token: string) => {
  const result = await jwtVerify(token, secret, {
    issuer: "inboxiq",
    audience: "app",
  });
  return result.payload as JWTPayload;
};

export const signRefreshId = () => randomUUID();

