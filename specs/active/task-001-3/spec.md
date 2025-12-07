# Task-001-3 — Token & session service

## Objective
Issue and manage app access/refresh tokens, including rotation, revocation, storage, and verification middleware for protected routes.

## Scope
- Access token (short-lived JWT) and refresh token (rotatable, server-tracked).
- Rotation on refresh; revoke old refresh on use.
- In-memory store for refresh tokens (replace with persistent store later).
- Middleware/utility to verify access token and attach session claims.
- Error handling for expired/invalid/blocked tokens.

## Claims / formats
- Access JWT: { sub, aud: "app", iss: "inboxiq", jti, exp, iat }
- Refresh token: random opaque id mapped server-side to { sub, jti, exp, revoked }.
- Signing: HS256 (for now) with `JWT_SECRET` from env.

## Flows
1) Exchange provider tokens → issue app access + refresh
   - Input: userId (placeholder) and provider token state reference.
   - Output: access, refresh, expiresIn.
   - Store refresh token server-side; return access/refresh to client.
2) Refresh
   - Validate refresh (exists, not revoked, not expired); rotate: create new refresh + access; revoke previous.
3) Logout/revoke
   - Mark refresh as revoked.
4) Guard
   - verifyAccess(token) for protected routes; reject if expired/invalid.

## Acceptance
- Functions for sign/verify access, issue/rotate refresh, revoke.
- Routes: `/auth/session/exchange`, `/auth/session/refresh`, `/auth/session/logout`.
- In-memory stores acceptable for now; ready to swap to persistent store later.
- Lint/build passing.

