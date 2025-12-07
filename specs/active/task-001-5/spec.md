# Task-001-5 — Rate limiting & security controls

## Objective
Add rate limiting, security headers/CSRF protections, and audit logging for auth-sensitive endpoints.

## Scope
- Rate limits: login/oauth/callback/refresh/logout/mfa/roles.
- Security headers: helmet-like defaults, CORS already present; add sensible defaults.
- CSRF: not critical for pure API + bearer, but protect stateful flows (oauth/state already enforced); add optional origin check for POST auth endpoints.
- Audit log: record auth events (login, refresh, logout, MFA actions, role changes) to disk.

## Acceptance
- Rate limits applied to sensitive routes with sane defaults.
- Security headers middleware enabled.
- Audit log entries persisted for auth/mfa/role events.
- Lint/build passing.

