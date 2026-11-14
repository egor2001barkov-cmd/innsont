import { createHash, randomBytes } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * API-ключи подписчиков. В файле аккаунта лежит только sha256 ключа:
 * сам ключ показывается один раз при создании и больше не хранится.
 *
 * Ключ: ins_live_<40 hex>. Для поиска по ключу есть глобальный индекс
 * data/api-key-index.json (hash → accountId/keyId): перебирать все аккаунты
 * на каждый запрос нельзя.
 */

export type ApiKeyRecord = {
  id: string;
  name: string;
  prefix: string;
  hash: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type PublicApiKey = Omit<ApiKeyRecord, "hash">;

const KEY_PREFIX = "ins_live_";
const MAX_ACTIVE_KEYS = 10;

function accountDir(accountId: string) {
  return join(process.cwd(), "data", "accounts", accountId);
}

function keysPath(accountId: string) {
  return join(accountDir(accountId), "api-keys.json");
}

function indexPath() {
  return join(process.cwd(), "data", "api-key-index.json");
}

function readKeys(accountId: string): ApiKeyRecord[] {
  try {
    return JSON.parse(readFileSync(keysPath(accountId), "utf8")) as ApiKeyRecord[];
  } catch {
    return [];
  }
}

function writeKeys(accountId: string, keys: ApiKeyRecord[]) {
  mkdirSync(accountDir(accountId), { recursive: true });
  writeFileSync(keysPath(accountId), JSON.stringify(keys, null, 2), "utf8");
}

function readIndex(): Record<string, { accountId: string; keyId: string }> {
  try {
    return JSON.parse(readFileSync(indexPath(), "utf8")) as Record<string, { accountId: string; keyId: string }>;
  } catch {
    return {};
  }
}

function writeIndex(index: Record<string, { accountId: string; keyId: string }>) {
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(indexPath(), JSON.stringify(index, null, 2), "utf8");
}

export function hashApiKey(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function listApiKeys(accountId: string): PublicApiKey[] {
  return readKeys(accountId).map(({ hash: _hash, ...rest }) => rest);
}

export function createApiKey(accountId: string, name: string): { key: string; record: PublicApiKey } {
  const keys = readKeys(accountId);
  if (keys.filter((k) => !k.revokedAt).length >= MAX_ACTIVE_KEYS) {
    throw new Error(`Не больше ${MAX_ACTIVE_KEYS} активных ключей`);
  }

  const raw = KEY_PREFIX + randomBytes(20).toString("hex");
  const record: ApiKeyRecord = {
    id: "key_" + randomBytes(6).toString("hex"),
    name: (name || "Ключ").slice(0, 60),
    prefix: raw.slice(0, KEY_PREFIX.length + 6),
    hash: hashApiKey(raw),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revokedAt: null,
  };

  keys.push(record);
  writeKeys(accountId, keys);

  const index = readIndex();
  index[record.hash] = { accountId, keyId: record.id };
  writeIndex(index);

  const { hash: _hash, ...rest } = record;
  return { key: raw, record: rest };
}

export function revokeApiKey(accountId: string, keyId: string): boolean {
  const keys = readKeys(accountId);
  const key = keys.find((k) => k.id === keyId);
  if (!key) return false;

  key.revokedAt = new Date().toISOString();
  writeKeys(accountId, keys);

  const index = readIndex();
  delete index[key.hash];
  writeIndex(index);
  return true;
}

export function resolveApiKey(raw: string): { accountId: string; keyId: string } | null {
  if (!raw.startsWith(KEY_PREFIX)) return null;

  const hit = readIndex()[hashApiKey(raw)];
  if (!hit) return null;

  const key = readKeys(hit.accountId).find((k) => k.id === hit.keyId);
  if (!key || key.revokedAt) return null;
  return hit;
}

/** Отметка «ключ использован» — не чаще раза в 5 минут, чтобы не писать файл на каждый запрос. */
export function touchApiKey(accountId: string, keyId: string) {
  const keys = readKeys(accountId);
  const key = keys.find((k) => k.id === keyId);
  if (!key) return;
  const last = key.lastUsedAt ? Date.parse(key.lastUsedAt) : 0;
  if (Date.now() - last < 5 * 60_000) return;
  key.lastUsedAt = new Date().toISOString();
  writeKeys(accountId, keys);
}
