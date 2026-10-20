"use client";

import { loadContent } from "@/lib/workspace";
import { emptySession, saveSession, type Session } from "@/lib/session";

const MIGRATED_FLAG = "insont.migrated.v1";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function post<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) return { ok: false, error: data.error || `Ошибка ${res.status}` };
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Сеть недоступна, попробуйте ещё раз" };
  }
}

function rememberProfile(profile: Partial<Session> & Pick<Session, "email">) {
  const session = emptySession({
    ...profile,
    // сервер — источник правды по счётчикам и плану
    articlesUsed: profile.articlesUsed ?? 0,
    promptsUsed: profile.promptsUsed ?? 0,
    freeQueriesUsed: profile.freeQueriesUsed ?? 0,
  });
  saveSession(session);
  return session;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const res = await post<{ profile: Partial<Session> & Pick<Session, "email"> }>("/api/auth/login", {
    email,
    password,
  });
  if (!res.ok) return res;
  const session = rememberProfile(res.data.profile);
  await migrateLocalContentOnce();
  return { ok: true, session };
}

export async function apiRegister(input: {
  name: string;
  company: string;
  email: string;
  password: string;
  refCode?: string;
}): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const res = await post<{ profile: Partial<Session> & Pick<Session, "email"> }>("/api/auth/register", input);
  if (!res.ok) return res;
  const session = rememberProfile(res.data.profile);
  await migrateLocalContentOnce();
  return { ok: true, session };
}

export async function apiMe(): Promise<Session | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { profile: Partial<Session> & Pick<Session, "email"> };
    return rememberProfile(data.profile);
  } catch {
    return null;
  }
}

export async function apiLogout() {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
}

/** Разовая заливка статей из localStorage на сервер (после включения серверного ЛК). */
export async function migrateLocalContentOnce() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATED_FLAG)) return;
  const items = loadContent();
  try {
    const res = await fetch("/api/content/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (res.ok) localStorage.setItem(MIGRATED_FLAG, "1");
  } catch {
    /* повторим при следующем входе */
  }
}
