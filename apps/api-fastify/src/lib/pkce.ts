import { createHash, randomBytes } from "crypto";

export const base64url = (input: Buffer) =>
  input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export const createVerifier = () => base64url(randomBytes(32));

export const createChallenge = (verifier: string) => {
  const hash = createHash("sha256").update(verifier).digest();
  return base64url(hash);
};

