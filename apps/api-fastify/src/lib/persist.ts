import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { env } from "../config/env";

const ensureDir = async () => {
  await mkdir(env.dataDir, { recursive: true });
};

export const loadJson = async <T>(file: string, fallback: T): Promise<T> => {
  await ensureDir();
  try {
    const buf = await readFile(path.join(env.dataDir, file), "utf8");
    return JSON.parse(buf) as T;
  } catch {
    return fallback;
  }
};

export const saveJson = async <T>(file: string, data: T) => {
  await ensureDir();
  await writeFile(path.join(env.dataDir, file), JSON.stringify(data, null, 2), "utf8");
};

