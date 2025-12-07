import { loadJson, saveJson } from "../lib/persist";

export type Role = "admin" | "user";

type RoleStore = Record<string, Role[]>;

const FILE = "roles.json";

const loadRoles = async (): Promise<RoleStore> => loadJson<RoleStore>(FILE, {});
const persist = async (data: RoleStore) => saveJson<RoleStore>(FILE, data);

export const getRoles = async (userId: string): Promise<Role[]> => {
  const store = await loadRoles();
  return store[userId] ?? [];
};

export const setRoles = async (userId: string, roles: Role[]) => {
  const store = await loadRoles();
  store[userId] = Array.from(new Set(roles));
  await persist(store);
};

export const hasRole = async (userId: string, required: Role[]) => {
  const roles = await getRoles(userId);
  return required.some((r) => roles.includes(r));
};

