const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const apiBase = API_BASE.replace(/\/$/, "");

export const getJson = async <T>(path: string) => {
  const res = await fetch(`${apiBase}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return (await res.json()) as T;
};

export const postJson = async <T>(path: string, body: unknown) => {
  const res = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
};

