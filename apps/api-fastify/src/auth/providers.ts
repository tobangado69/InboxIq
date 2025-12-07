import { env } from "../config/env";
import { createChallenge, createVerifier } from "../lib/pkce";
import { createState } from "../lib/state";

type Provider = "google" | "microsoft";

type StartResponse = {
  url: string;
  state: string;
  verifier: string;
  challenge: string;
};

const googleAuthBase = "https://accounts.google.com/o/oauth2/v2/auth";
const googleTokenUrl = "https://oauth2.googleapis.com/token";

const msAuthBase = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const msTokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

export const buildStart = (provider: Provider): StartResponse => {
  const state = createState();
  const verifier = createVerifier();
  const challenge = createChallenge(verifier);

  if (provider === "google") {
    const scope = encodeURIComponent(
      "openid email profile https://www.googleapis.com/auth/gmail.readonly"
    );
    const url =
      `${googleAuthBase}?response_type=code&client_id=${encodeURIComponent(env.googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(env.googleRedirectUri)}` +
      `&scope=${scope}` +
      `&state=${state}` +
      `&code_challenge=${challenge}&code_challenge_method=S256&access_type=offline&prompt=consent`;
    return { url, state, verifier, challenge };
  }

  const scope = encodeURIComponent("openid email profile offline_access Mail.Read");
  const url =
    `${msAuthBase}?response_type=code&client_id=${encodeURIComponent(env.msClientId)}` +
    `&redirect_uri=${encodeURIComponent(env.msRedirectUri)}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&code_challenge=${challenge}&code_challenge_method=S256`;
  return { url, state, verifier, challenge };
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
};

const postForm = async (url: string, body: Record<string, string>) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TokenResponse;
};

export const exchangeCode = async (provider: Provider, code: string, verifier: string) => {
  if (provider === "google") {
    return postForm(googleTokenUrl, {
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: env.googleRedirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    });
  }

  return postForm(msTokenUrl, {
    code,
    client_id: env.msClientId,
    client_secret: env.msClientSecret,
    redirect_uri: env.msRedirectUri,
    grant_type: "authorization_code",
    code_verifier: verifier,
  });
};

