import { loadJson, saveJson } from "../lib/persist";

export type ProviderTokenBundle = {
  provider: "google" | "microsoft";
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
  createdAt: number;
  userId?: string;
};

type StoreShape = Record<string, ProviderTokenBundle>;

const FILE = "providerTokens.json";

const loadStore = async (): Promise<StoreShape> => loadJson<StoreShape>(FILE, {});
const persist = async (data: StoreShape) => saveJson<StoreShape>(FILE, data);

const stateKey = (state: string) => `state:${state}`;
const userKey = (userId: string, provider: string) => `user:${userId}:${provider}`;

export const saveTokens = async (state: string, bundle: ProviderTokenBundle) => {
  const store = await loadStore();
  store[stateKey(state)] = bundle;
  await persist(store);
};

export const getTokens = async (state: string) => {
  const store = await loadStore();
  return store[stateKey(state)];
};

export const deleteTokens = async (state: string) => {
  const store = await loadStore();
  delete store[stateKey(state)];
  await persist(store);
};

export const saveTokensForUser = async (userId: string, provider: string, bundle: ProviderTokenBundle) => {
  const store = await loadStore();
  store[userKey(userId, provider)] = { ...bundle, userId };
  await persist(store);
};

export const getTokensForUser = async (userId: string, provider: string) => {
  const store = await loadStore();
  return store[userKey(userId, provider)];
};

