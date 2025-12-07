import { loadJson, saveJson } from "./persist";

type AuditEntry = {
  ts: number;
  event: string;
  userId?: string;
  detail?: Record<string, unknown>;
};

const FILE = "audit.json";

export const appendAudit = async (entry: AuditEntry) => {
  const existing = await loadJson<AuditEntry[]>(FILE, []);
  existing.push(entry);
  await saveJson(FILE, existing);
};

export const auditEvent = (event: string, userId?: string, detail?: Record<string, unknown>) =>
  appendAudit({ ts: Date.now(), event, userId, detail });

