import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { env } from "./config/env";
import { registerAuth } from "./routes/auth";
import { registerSession } from "./routes/session";
import { registerMfa } from "./routes/mfa";
import { registerRoles } from "./routes/roles";
import helmet from "@fastify/helmet";

export const buildServer = () => {
  const app = Fastify({ logger: true });

  app.register(helmet);
  app.register(cors, { origin: true });
  app.register(formbody);

  app.get("/health", async () => ({ status: "ok" }));

  registerAuth(app);
  registerSession(app);
  registerMfa(app);
  registerRoles(app);

  return app;
};

export const startServer = async () => {
  const app = buildServer();
  await app.listen({ port: env.port, host: "0.0.0.0" });
};

