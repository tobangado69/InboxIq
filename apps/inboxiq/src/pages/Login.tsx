import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getJson } from "../lib/api";

export default function Login() {
  const { loginMock } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLogin = async (provider: "google" | "microsoft" = "google") => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJson<{ url: string; state: string }>(
        `/auth/oauth/start?provider=${provider}`
      );
      window.location.href = res.url;
    } catch (err) {
      console.error(err);
      setError("Failed to start login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white shadow-sm rounded-xl p-8 max-w-md w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            InboxIQ Login
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to access the dashboard.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => startLogin("google")}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#208096] text-white rounded-lg hover:bg-[#165A69] transition-colors disabled:opacity-60"
          >
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>
          <button
            onClick={loginMock}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Dev mock login
          </button>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <p className="text-xs text-gray-500 text-center">
            Production login will be wired to OAuth once backend endpoints are
            reachable from the app.
          </p>
        </div>
      </div>
    </div>
  );
}
