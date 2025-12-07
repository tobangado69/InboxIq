/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AuthState, clearAuth, loadAuth, saveAuth } from "../lib/auth-store";
import { postJson } from "../lib/api";

type AuthContextType = AuthState & {
  loginMock: () => void;
  loginWithSession: (auth: {
    accessToken: string;
    roles: string[];
    mfaEnabled: boolean;
    refreshToken: string;
    accessExpiresAt: number;
    refreshExpiresAt: number;
    userId?: string;
  }) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth());
  const [timer, setTimer] = useState<number | null>(null);

  const loginMock = useCallback(() => {
    const next: AuthState = {
      accessToken: "dev-token",
      roles: ["user"],
      mfaEnabled: false,
    };
    saveAuth(next);
    setAuth(next);
  }, []);

  const loginWithSession = useCallback(
    (payload: {
      accessToken: string;
      roles: string[];
      mfaEnabled: boolean;
      refreshToken: string;
      accessExpiresAt: number;
      refreshExpiresAt: number;
      userId?: string;
    }) => {
      const next: AuthState = {
        accessToken: payload.accessToken,
        roles: payload.roles ?? [],
        mfaEnabled: payload.mfaEnabled ?? false,
        refreshToken: payload.refreshToken,
        accessExpiresAt: payload.accessExpiresAt,
        refreshExpiresAt: payload.refreshExpiresAt,
        userId: payload.userId,
      };
      saveAuth(next);
      setAuth(next);
    },
    []
  );

  const logout = useCallback(async () => {
    if (auth.refreshToken) {
      try {
        await postJson("/auth/session/logout", {
          refresh_token: auth.refreshToken,
        });
      } catch (err) {
        console.error("logout failed (ignored)", err);
      }
    }
    clearAuth();
    setAuth({ accessToken: null, roles: [], mfaEnabled: false });
    if (timer) window.clearTimeout(timer);
  }, [auth.refreshToken, timer]);

  const refresh = useCallback(async () => {
    if (!auth.refreshToken) return logout();
    try {
      const res = await postJson<{
        user_id: string;
        access_token: string;
        access_expires_at: number;
        refresh_token: string;
        refresh_expires_at: number;
        token_type: string;
        mfa_enabled?: boolean;
        roles?: string[];
      }>("/auth/session/refresh", { refresh_token: auth.refreshToken });
      loginWithSession({
        accessToken: res.access_token,
        roles: res.roles ?? [],
        mfaEnabled: res.mfa_enabled ?? false,
        refreshToken: res.refresh_token,
        accessExpiresAt: res.access_expires_at,
        refreshExpiresAt: res.refresh_expires_at,
        userId: res.user_id,
      });
      const now = Date.now();
      const delay = Math.max(
        res.access_expires_at * 1000 - now - 30_000,
        5_000
      );
      if (timer) window.clearTimeout(timer);
      const id = window.setTimeout(() => {
        void refresh();
      }, delay);
      setTimer(id);
    } catch (err) {
      console.error(err);
      logout();
    }
  }, [auth.refreshToken, loginWithSession, logout, timer]);

  useEffect(() => {
    if (auth.accessExpiresAt) {
      const now = Date.now();
      const delay = Math.max(auth.accessExpiresAt * 1000 - now - 30_000, 5_000);
      if (timer) window.clearTimeout(timer);
      const id = window.setTimeout(() => {
        void refresh();
      }, delay);
      setTimer(id);
    }
  }, [auth.accessExpiresAt, refresh, timer]);

  const value = useMemo(
    () => ({ ...auth, loginMock, loginWithSession, logout, refresh }),
    [auth, loginMock, loginWithSession, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
