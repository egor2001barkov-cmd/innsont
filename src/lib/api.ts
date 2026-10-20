import { NextResponse } from "next/server";
import { SESSION_COOKIE, resolveSession } from "@/lib/auth";
import { findById, type Account } from "@/lib/store/accounts";

/** Достаёт аккаунт из cookie-сессии. null — если не авторизован. */
export function currentAccount(req: Request): Account | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  const record = resolveSession(decodeURIComponent(match[1]));
  if (!record) return null;
  return findById(record.accountId);
}

export function unauthorized() {
  return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function cookieOptions(maxAgeSec = 30 * 24 * 3600) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}

/** Content-Disposition с кириллицей: HTTP-заголовки не терпят >255, кодируем по RFC 5987. */
export function attachmentHeader(filename: string) {
  const ascii = `attachment; filename="insont-export"`;
  return `${ascii}; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
