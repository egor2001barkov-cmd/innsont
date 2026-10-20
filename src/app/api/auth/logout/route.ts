import { NextResponse } from "next/server";
import { SESSION_COOKIE, destroySession } from "@/lib/auth";
import { cookieOptions } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (match) destroySession(decodeURIComponent(match[1]));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
  return res;
}
