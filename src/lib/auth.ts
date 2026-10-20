import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const SESSIONS_DIR = join(DATA_DIR, "sessions");

export const SESSION_COOKIE = "insont_sid";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Хэш-запись пароля. Исходный пароль не хранится нигде и не пишется в логи. */
export type PasswordRecord = {
  scheme: "scrypt";
  N: number;
  r: number;
  p: number;
  salt: string;
  hash: string;
};

const SCRYPT_OPTS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function hashPassword(password: string): PasswordRecord {
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize("NFKC"), salt, 64, SCRYPT_OPTS);
  return {
    scheme: "scrypt",
    N: SCRYPT_OPTS.N,
    r: SCRYPT_OPTS.r,
    p: SCRYPT_OPTS.p,
    salt: salt.toString("base64"),
    hash: hash.toString("base64"),
  };
}

export function verifyPassword(password: string, stored: PasswordRecord): boolean {
  try {
    const salt = Buffer.from(stored.salt, "base64");
    const expected = Buffer.from(stored.hash, "base64");
    const actual = scryptSync(password.normalize("NFKC"), salt, expected.length, {
      N: stored.N,
      r: stored.r,
      p: stored.p,
      maxmem: 64 * 1024 * 1024,
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "Пароль — минимум 8 символов";
  if (password.length > 128) return "Пароль слишком длинный";
  return null;
}

export function emailProblem(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!e || e.length > 254) return "Некорректная почта";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return "Некорректная почта";
  return null;
}

/** Идентификатор аккаунта — sha256 почты; сама почта в имени файла не светится. */
export function accountIdFor(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 16);
}

// --- Сессии ------------------------------------------------------------------
// Токен живёт только в httpOnly-куке; на диске лежит sha256(токен).

export type SessionRecord = {
  sid: string;
  accountId: string;
  createdAt: string;
  expiresAt: string;
};

function sessionPath(sid: string) {
  return join(SESSIONS_DIR, `${sid}.json`);
}

export function createSession(accountId: string): { token: string; record: SessionRecord } {
  const token = randomBytes(32).toString("base64url");
  const sid = createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const record: SessionRecord = {
    sid,
    accountId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };
  mkdirSync(SESSIONS_DIR, { recursive: true });
  writeFileSync(sessionPath(sid), JSON.stringify(record), "utf8");
  return { token, record };
}

export function resolveSession(token: string | undefined | null): SessionRecord | null {
  if (!token) return null;
  try {
    const sid = createHash("sha256").update(token).digest("hex");
    const record = JSON.parse(readFileSync(sessionPath(sid), "utf8")) as SessionRecord;
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      rmSync(sessionPath(sid), { force: true });
      return null;
    }
    return record;
  } catch {
    return null;
  }
}

export function destroySession(token: string | undefined | null) {
  if (!token) return;
  try {
    const sid = createHash("sha256").update(token).digest("hex");
    rmSync(sessionPath(sid), { force: true });
  } catch {
    /* уже нет — хорошо */
  }
}

// --- Ограничение частоты запросов ---------------------------------------------
// In-memory: процесс один, контейнер один. Окно 10 минут.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const failuresByEmail = new Map<string, { count: number; resetAt: number }>();

function take(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= max;
}

export function rateLimitOk(ip: string, action: string, max = 30) {
  if (buckets.size > 10_000) buckets.clear();
  return take(`${action}:${ip}`, max, 10 * 60 * 1000);
}

export function loginBlockedFor(email: string) {
  const rec = failuresByEmail.get(email);
  if (!rec) return false;
  if (rec.resetAt < Date.now()) {
    failuresByEmail.delete(email);
    return false;
  }
  return rec.count >= 5;
}

export function noteLoginFailure(email: string) {
  const prev = failuresByEmail.get(email);
  const now = Date.now();
  if (!prev || prev.resetAt < now) {
    failuresByEmail.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return;
  }
  prev.count += 1;
}

export function noteLoginSuccess(email: string) {
  failuresByEmail.delete(email);
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
