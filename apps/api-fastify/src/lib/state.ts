import { createHmac, randomBytes } from "crypto";
import { env } from "../config/env";

const hmac = (value: string) =>
  createHmac("sha256", env.stateSecret).update(value).digest("hex");

export const createState = () => {
  const nonce = randomBytes(16).toString("hex");
  const sig = hmac(nonce);
  return `${nonce}.${sig}`;
};

export const verifyState = (state: string) => {
  const [nonce, sig] = state.split(".");
  if (!nonce || !sig) return false;
  const expected = hmac(nonce);
  return expected === sig;
};

