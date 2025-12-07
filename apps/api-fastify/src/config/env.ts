import dotenv from "dotenv";

dotenv.config();

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  apiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:4000",
  dataDir: process.env.DATA_DIR ?? "data",
  accessTtlSeconds: Number(process.env.ACCESS_TTL_SECONDS ?? 900),
  refreshTtlSeconds: Number(process.env.REFRESH_TTL_SECONDS ?? 7 * 24 * 60 * 60),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET"),
  googleRedirectUri: required("GOOGLE_REDIRECT_URI"),
  msClientId: required("MS_CLIENT_ID"),
  msClientSecret: required("MS_CLIENT_SECRET"),
  msRedirectUri: required("MS_REDIRECT_URI"),
  jwtSecret: required("JWT_SECRET"),
  stateSecret: required("STATE_SECRET"),
};

