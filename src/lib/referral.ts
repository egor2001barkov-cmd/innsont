export const REF_BONUS = 0.2;
export const REF_CAP = 8;
export const PENDING_KEY = "innsont.pendingRef";

export function makeRefCode(email: string) {
  const base = email
    .split("@")[0]
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase();
  let h = 0;
  for (const c of email.toLowerCase()) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return `${base || "IN"}${String(h % 10000).padStart(4, "0")}`;
}

export function bonusMultiplier(count: number) {
  return 1 + REF_BONUS * Math.min(Math.max(count, 0), REF_CAP);
}

export function scaleLimit(value: number, count: number) {
  return Math.max(value, Math.round(value * bonusMultiplier(count)));
}

export type ReferralInvite = {
  email: string;
  at: string;
};

export type ReferralAccount = {
  email: string;
  code: string;
  invites: ReferralInvite[];
};

export function rememberPendingRef(code: string) {
  if (typeof window === "undefined") return;
  const clean = code.trim().toUpperCase();
  if (clean) localStorage.setItem(PENDING_KEY, clean);
}

export function readPendingRef() {
  if (typeof window === "undefined") return "";
  return (localStorage.getItem(PENDING_KEY) || "").toUpperCase();
}

export function clearPendingRef() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_KEY);
}

export function referralLink(code: string, origin?: string) {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "https://innsont.ru");
  return `${base}/registratsiya?ref=${encodeURIComponent(code)}`;
}
