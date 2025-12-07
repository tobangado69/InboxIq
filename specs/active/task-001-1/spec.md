# Task-001-1 — Auth flows & threat model

## Objective
Document login/auth flows (OAuth → JWT/refresh → session handling), identify threats, and define mitigations for InboxIQ.

## Scope
- Providers: Google, Microsoft (Graph)
- Tokens: access + refresh, rotation, revocation, storage
- Sessions: validation middleware, expiry, logout
- MFA: consider TOTP as follow-on (see task-001-4)
- FE: login initiation, callback handling, token storage/renewal

## Flows
1) Login via OAuth
   - User -> /auth/oauth/{provider} -> provider consent -> callback -> exchange code -> store tokens -> issue app JWT+refresh.
2) Token refresh
   - Client presents refresh token -> validate + rotate -> new access/JWT, new refresh; revoke old refresh.
3) Logout
   - Invalidate refresh (server-side store/revocation list), clear client tokens, optional provider revoke.
4) Session guard
   - Middleware validates JWT, checks revocation/expiry, enforces RBAC and rate limits for auth endpoints.

## Threats & Mitigations
- Stolen refresh tokens → rotate on use, short TTL, store hashed, bind to device metadata, revoke on logout.
- OAuth code interception → PKCE + HTTPS only, strict redirect URIs.
- Token replay → jti + server-side revocation list; aud/iss checks.
- Bruteforce/login abuse → rate-limit by IP/user, captcha after threshold, audit logging.
- CSRF on login → state parameter, same-site cookie where applicable.
- Scope misuse → request minimal scopes; segregate provider tokens from app tokens.

## Data & Storage
- Provider tokens: encrypted at rest, hash refresh if stored; associate with user/provider.
- App tokens: JWT signed (HS/RS), short-lived access; refresh stored hashed with expiry and device info.
- Logs: auth attempts, successes/failures, revocations, MFA setup/verify events.

## Interfaces (draft)
- POST /auth/oauth/{provider}/start → redirect URL
- GET /auth/oauth/{provider}/callback?code=...&state=... → issues app JWT/refresh
- POST /auth/refresh → rotates refresh, returns new JWT/refresh
- POST /auth/logout → revokes refresh, clears session

## Acceptance
- Flows documented and reviewed with security checklist.
- Threats mapped to controls; rate-limit and revocation approach agreed.
- Defined fields for provider token storage, JWT claims (aud/iss/sub/jti/exp), and rotation rules.

