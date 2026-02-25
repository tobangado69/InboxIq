# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
InboxIQ is an email data extraction SaaS platform (pnpm monorepo). Two services:
- **`apps/api-fastify`** — Fastify REST API (port 4000)
- **`apps/inboxiq`** — React/Vite SPA (port 5173)

All backend persistence is file-based JSON (`data/` directory). No database required.

### Running services
- **Backend:** `cd apps/api-fastify && pnpm run dev` (requires `.env` — see below)
- **Frontend:** `cd apps/inboxiq && pnpm run dev --host 0.0.0.0`
- The frontend's "Dev mock login" button bypasses OAuth and works without a real backend connection.

### Environment variables
The backend requires a `.env` file in `apps/api-fastify/` with these keys: `PORT`, `API_BASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_REDIRECT_URI`, `JWT_SECRET`, `STATE_SECRET`. For local dev, dummy values work (see `.env.example` in root). The server will crash on startup if any are missing.

### Gotchas
- The root `package.json` `prepare` script runs `moon setup`, but Moon CLI is optional and not installed. Use `pnpm install --ignore-scripts` if `pnpm install` fails due to the `prepare` hook, then run `pnpm install` a second time (it will succeed with cached modules).
- `@fastify/cors`, `@fastify/helmet`, `@fastify/formbody` all require Fastify 5. The project uses `fastify@^5.0.0`.
- The `pnpm.onlyBuiltDependencies` allowlist in root `package.json` controls which packages may run postinstall scripts.

### Lint / typecheck / build
- **Biome (monorepo-wide):** `npx @biomejs/biome lint .` from root
- **ESLint (per app):** `pnpm run lint` inside each app directory
- **Typecheck:** `npx tsc --noEmit` inside each app directory
- **Frontend build:** `pnpm run build` in `apps/inboxiq`

### SDD (Spec-Driven Development)
Roadmap and specs live in `specs/` and `.sdd/`. See `progress.md` for current status. Epic-001 (Auth & Identity) is complete.
