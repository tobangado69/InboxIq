import { loadJson, saveJson } from "../lib/persist";

export type User = {
  id: string;
  email?: string;
  name?: string;
  providers?: Record<string, { connectedAt: number }>;
  roles?: string[];
  mfaEnabled?: boolean;
  createdAt: number;
  updatedAt: number;
};

type StoreShape = Record<string, User>;

const FILE = "users.json";

const loadStore = async (): Promise<StoreShape> => loadJson<StoreShape>(FILE, {});
const persist = async (data: StoreShape) => saveJson<StoreShape>(FILE, data);

export const getUser = async (id: string) => {
  const store = await loadStore();
  return store[id];
};

export const upsertUser = async (user: User) => {
  const store = await loadStore();
  store[user.id] = user;
  await persist(store);
  return user;
};

export const ensureUser = async (id: string, email?: string, name?: string) => {
  const existing = await getUser(id);
  const now = Date.now();
  if (existing) {
    const next: User = {
      ...existing,
      email: email ?? existing.email,
      name: name ?? existing.name,
      updatedAt: now,
    };
    await upsertUser(next);
    return next;
  }
  const created: User = {
    id,
    email,
    name,
    createdAt: now,
    updatedAt: now,
    providers: {},
  };
  await upsertUser(created);
  return created;
};

export const markProviderConnected = async (userId: string, provider: string) => {
  const user = await getUser(userId);
  if (!user) return;
  const next: User = {
    ...user,
    providers: {
      ...user.providers,
      [provider]: { connectedAt: Date.now() },
    },
    updatedAt: Date.now(),
  };
  await upsertUser(next);
};

