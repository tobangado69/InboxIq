# Task-001-2 — OAuth provider setup (Google/Microsoft)

## Objective
Configure OAuth apps for Google and Microsoft Graph, define redirect URIs, scopes, and local env, and ensure secure consent/code/token handling.

## Deliverables
- Registered apps (Google/Microsoft) with client IDs/secrets stored in env.
- Redirect URIs for local/dev/prod documented.
- Scopes list (minimum needed) defined.
- Endpoint wiring for start + callback with PKCE/state.
- Token exchange flow tested for both providers.

## Steps
1) App registration
   - Google: OAuth client (web), redirect URIs (local/prod), scopes: `openid email profile https://www.googleapis.com/auth/gmail.readonly` (adjust if broader).
   - Microsoft: App registration, redirect URIs, scopes: `openid email profile offline_access Mail.Read`.
2) Secrets/env
   - Store in `.env` (local) and vault/secrets manager for other envs.
   - Variables: GOOGLE_CLIENT_ID/SECRET, MS_CLIENT_ID/SECRET, OAUTH_REDIRECT_BASE, OAUTH_STATE_SECRET.
3) Start endpoint
   - `/auth/oauth/:provider/start` builds auth URL with PKCE + state; validates provider allowlist.
4) Callback endpoint
   - Validates state/PKCE; exchanges code for tokens; captures refresh/access, expiry, provider user profile.
5) Security/controls
   - HTTPS-only redirects, strict allowlist of redirect URIs.
   - State includes nonce + user/device hint; short-lived.
   - Handle consent denied/errors gracefully.
6) Hand-off
   - Return provider tokens to token service for app JWT issuance (task-001-3).
   - Persist provider token bundle (encrypted/hashed refresh) with user linkage.

## Acceptance
- Both providers tested end-to-end locally with valid tokens returned.
- State/PKCE enforced; redirect URIs limited to configured allowlist.
- Secrets only in env/secret store; no commits.
- Scopes minimal and documented.

