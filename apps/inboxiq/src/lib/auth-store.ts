const ACCESS_KEY = 'inboxiq_access_token';
const ROLES_KEY = 'inboxiq_roles';
const MFA_KEY = 'inboxiq_mfa';

export type AuthState = {
  accessToken: string | null;
  refreshToken?: string | null;
  roles: string[];
  mfaEnabled: boolean;
  accessExpiresAt?: number | null;
  refreshExpiresAt?: number | null;
  userId?: string | null;
};

export const loadAuth = (): AuthState => ({
  accessToken: localStorage.getItem(ACCESS_KEY),
  refreshToken: localStorage.getItem("inboxiq_refresh_token"),
  roles: JSON.parse(localStorage.getItem(ROLES_KEY) ?? '[]'),
  mfaEnabled: localStorage.getItem(MFA_KEY) === 'true',
  accessExpiresAt: Number(localStorage.getItem("inboxiq_access_exp") ?? "0") || null,
  refreshExpiresAt: Number(localStorage.getItem("inboxiq_refresh_exp") ?? "0") || null,
  userId: localStorage.getItem("inboxiq_user_id"),
});

export const saveAuth = (state: AuthState) => {
  if (state.accessToken) localStorage.setItem(ACCESS_KEY, state.accessToken);
  else localStorage.removeItem(ACCESS_KEY);
  if (state.refreshToken) localStorage.setItem("inboxiq_refresh_token", state.refreshToken);
  else localStorage.removeItem("inboxiq_refresh_token");
  localStorage.setItem(ROLES_KEY, JSON.stringify(state.roles ?? []));
  localStorage.setItem(MFA_KEY, state.mfaEnabled ? 'true' : 'false');
  if (state.accessExpiresAt) localStorage.setItem("inboxiq_access_exp", String(state.accessExpiresAt));
  else localStorage.removeItem("inboxiq_access_exp");
  if (state.refreshExpiresAt) localStorage.setItem("inboxiq_refresh_exp", String(state.refreshExpiresAt));
  else localStorage.removeItem("inboxiq_refresh_exp");
  if (state.userId) localStorage.setItem("inboxiq_user_id", state.userId);
  else localStorage.removeItem("inboxiq_user_id");
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem("inboxiq_refresh_token");
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(MFA_KEY);
  localStorage.removeItem("inboxiq_access_exp");
  localStorage.removeItem("inboxiq_refresh_exp");
  localStorage.removeItem("inboxiq_user_id");
};

