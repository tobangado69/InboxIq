import { randomBytes, createHmac } from "crypto";
import { loadJson, saveJson } from "../lib/persist";

export type MfaRecord = {
  userId: string;
  secret: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
};

type StoreShape = Record<string, MfaRecord>;

const FILE = "mfa.json";

const loadStore = async (): Promise<StoreShape> => loadJson<StoreShape>(FILE, {});
const persist = async (data: StoreShape) => saveJson<StoreShape>(FILE, data);

export const generateSecret = () => randomBytes(20).toString("hex");

const totp = (secret: string, window: number) => {
  const timeStep = Math.floor(Date.now() / 1000 / 30) + window;
  const counter = Buffer.alloc(8);
  counter.writeBigInt64BE(BigInt(timeStep));
  const hmac = createHmac("sha1", Buffer.from(secret, "hex")).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
};

export const verifyTotp = (secret: string, token: string) => {
  const windows = [-1, 0, 1];
  return windows.some((w) => totp(secret, w) === token);
};

export const upsertMfa = async (record: MfaRecord) => {
  const store = await loadStore();
  store[record.userId] = record;
  await persist(store);
  return record;
};

export const getMfa = async (userId: string) => {
  const store = await loadStore();
  return store[userId];
};

export const disableMfa = async (userId: string) => {
  const store = await loadStore();
  const rec = store[userId];
  if (!rec) return;
  store[userId] = { ...rec, enabled: false, updatedAt: Date.now() };
  await persist(store);
};

