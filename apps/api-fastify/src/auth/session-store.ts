import { loadJson, saveJson } from "../lib/persist";

export type StoredRefresh = {
  id: string;
  sub: string;
  jti: string;
  exp: number;
  revoked: boolean;
  createdAt: number;
};

type StoreShape = Record<string, StoredRefresh>;

const FILE = "refreshStore.json";

const loadStore = async (): Promise<StoreShape> => loadJson<StoreShape>(FILE, {});

const persist = async (data: StoreShape) => saveJson<StoreShape>(FILE, data);

export const saveRefresh = async (record: StoredRefresh) => {
  const store = await loadStore();
  store[record.id] = record;
  await persist(store);
};

export const getRefresh = async (id: string) => {
  const store = await loadStore();
  return store[id];
};

export const revokeRefresh = async (id: string) => {
  const store = await loadStore();
  const found = store[id];
  if (found) {
    found.revoked = true;
    await persist(store);
  }
};

export const deleteRefresh = async (id: string) => {
  const store = await loadStore();
  delete store[id];
  await persist(store);
};

export const rotateRefresh = async (oldId: string, next: StoredRefresh) => {
  const store = await loadStore();
  if (store[oldId]) {
    store[oldId].revoked = true;
  }
  store[next.id] = next;
  await persist(store);
  return next;
};

