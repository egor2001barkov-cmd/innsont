import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { ReferralAccount } from "@/lib/referral";
import { makeRefCode } from "@/lib/referral";

const FILE = join(process.cwd(), "data", "referrals.json");

function load(): Record<string, ReferralAccount> {
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as Record<string, ReferralAccount>;
  } catch {
    return {};
  }
}

function save(db: Record<string, ReferralAccount>) {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(db, null, 2), "utf8");
}

export function upsertOwner(email: string): ReferralAccount {
  const db = load();
  const code = makeRefCode(email);
  const existing = Object.values(db).find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const acc: ReferralAccount = { email: email.toLowerCase(), code, invites: [] };
  db[code] = acc;
  save(db);
  return acc;
}

export function getByCode(code: string): ReferralAccount | null {
  const db = load();
  return db[code.trim().toUpperCase()] || null;
}

export function claimInvite(code: string, inviteeEmail: string): { ok: boolean; error?: string; account?: ReferralAccount } {
  const db = load();
  const key = code.trim().toUpperCase();
  const acc = db[key];
  if (!acc) return { ok: false, error: "Ссылка не найдена" };
  const email = inviteeEmail.trim().toLowerCase();
  if (!email || !email.includes("@")) return { ok: false, error: "Некорректная почта" };
  if (acc.email === email) return { ok: false, error: "Нельзя пригласить свой аккаунт" };
  if (acc.invites.some((i) => i.email === email)) return { ok: true, account: acc };
  acc.invites.push({ email, at: new Date().toISOString() });
  db[key] = acc;
  save(db);
  return { ok: true, account: acc };
}
