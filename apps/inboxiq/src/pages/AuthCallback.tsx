import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { postJson } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type ExchangeResponse = {
  user_id: string;
  access_token: string;
  access_expires_at: number;
  refresh_token: string;
  refresh_expires_at: number;
  token_type: string;
  mfa_enabled?: boolean;
  roles?: string[];
};

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithSession } = useAuth();

  useEffect(() => {
    const state = params.get("state");
    const provider = params.get("provider") ?? "google";
    if (!state) {
      navigate("/login");
      return;
    }
    const exchange = async () => {
      try {
        const res = await postJson<ExchangeResponse>("/auth/session/exchange", {
          state,
          provider,
        });
        loginWithSession({
          accessToken: res.access_token,
          roles: res.roles ?? [],
          mfaEnabled: res.mfa_enabled ?? false,
          refreshToken: res.refresh_token,
          accessExpiresAt: res.access_expires_at,
          refreshExpiresAt: res.refresh_expires_at,
          userId: res.user_id,
        });
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      }
    };
    void exchange();
  }, [loginWithSession, navigate, params]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-sm text-gray-600">Signing you in…</div>
    </div>
  );
}
