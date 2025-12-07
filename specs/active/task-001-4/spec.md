# Task-001-4 — MFA & RBAC policy

## Objective
Add TOTP-based MFA and role/permission enforcement for protected routes and operations.

## Scope
- MFA: TOTP enrollment, verify, disable; per-user secret storage.
- RBAC: roles (e.g., admin, user) and permission checks at route level.
- Session guard: enforce MFA-required paths and role checks using existing access tokens.
- Storage: persist MFA secrets and flags per user; persist roles/permissions per user.

## Flows
1) MFA setup: issue secret + otpauth URI → user confirms with TOTP code → mark mfaEnabled.
2) MFA verify (login/step-up): validate TOTP; mark session claim `mfa: true`.
3) MFA disable: require valid TOTP or admin override.
4) RBAC: assign roles; guard routes with role allowlists.

## Acceptance
- Endpoints for MFA setup/verify/disable.
- Role assignment persisted; guard middleware checks roles.
- Protected routes reject when MFA required and not satisfied.
- Lint/build passing.

