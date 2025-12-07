# InboxIQ Roadmap (`first-initialize`)

**Status:** Planning  
**Execution Mode:** One-by-one (interactive)  
**SDD Version:** 2.5  
**Scope:** Auth/Identity, Email Connect & Sync, Extraction Pipeline, Notifications, API/Developer Surface, Observability/Ops, Frontend Dashboard, Deployment/Security.  

## 🎯 Objectives
- Ship a vertically integrated InboxIQ slice in the new monorepo (frontend, backend surfaces, infra scaffolding).
- Support Gmail/Outlook connects, extraction with heuristics + LLM fallback, notifications, and a usable dashboard.
- Establish observability, rate limits, and deployment pathway (Docker/compose-first).

## ✅ Success Criteria
- Users can connect email, ingest/sync with watch/webhooks, extract structured data with confidence scoring.
- Notifications deliver across configured channels with retries.
- API surface secured (auth, rate limits, API keys), with webhooks and logging.
- Dashboard reflects live data; basic analytics and health signals visible.

## ⚠️ Risks / Mitigations
- OAuth/provider limits → cache tokens, backoff, rate-limit guards.
- LLM latency/cost → heuristics first, LLM fallback; batch where possible.
- Webhook reliability → DLQ + retries + idempotency keys.
- Bundle size on FE → code-split charts/heavy routes later.

## 🗺️ Proposed Epics (to create one-by-one)
1. Auth & Identity (OAuth, JWT, MFA/RBAC guardrails) — created  
2. Email Connect & Sync (Gmail/Outlook, watch/webhooks, rate limits)  
3. Extraction Pipeline (regex/heuristics, LLM fallback, confidence)  
4. Notifications & Channels (WhatsApp/Telegram/Email; templates, retries)  
5. API/Developer Surface (REST, API keys, rate limiting, webhooks)  
6. Observability & Ops (logging, metrics, Sentry/Datadog, DLQ)  
7. Frontend Dashboard (React/Vite app in monorepo; data, auth, charts)  
8. Deployment & Security Hardening (Docker/compose, secrets, backups)  

## 🔄 Execution Flow (One-by-one)
- For each epic: propose subtasks (research/spec/plan/implement/tests), wait for approval, then write epic + task JSON, update `roadmap.json` and this file, and log progress.
- Dependencies will reflect critical path (e.g., Auth → Email Sync; Extraction → Notifications; API before clients).

## 📅 Timeline / Complexity
- Estimate: 6–10 weeks, team size 2–4, complexity: medium-complex.

## 📂 File Structure
```
specs/todo-roadmap/first-initialize/
├── roadmap.json
├── roadmap.md
├── tasks/
└── execution-log.md
```

## 🧭 Next Steps
- Done: `/execute-task task-001-1` (spec) at `specs/active/task-001-1/spec.md`.
- Done: `/execute-task task-001-2` (implement) at `specs/active/task-001-2/spec.md`.
- Done: `/execute-task task-001-3` (implement) at `specs/active/task-001-3/spec.md`.
- Done: `/execute-task task-001-4` (implement) at `specs/active/task-001-4/spec.md` — MFA TOTP setup/verify/disable; RBAC role store + admin assignment; guards; session returns roles/mfa flags.
- Done: `/execute-task task-001-5` (implement) at `specs/active/task-001-5/spec.md` — Rate limits on auth/mfa/roles/session, helmet headers, audit logging, origin checks, reorganized backend structure.
- Done: `/execute-task task-001-6` (implement) at `specs/active/task-001-6/spec.md` — Frontend auth integration (OAuth start/callback, session exchange, refresh/logout wiring, protected routes, user menu with logout/roles/MFA badges).
- Epic-001 (Auth & Identity): done.
- After Auth, move to Epic 2 creation.

## 📝 Change History
- 2025-12-07: Initialized roadmap (skeleton, no tasks yet).

