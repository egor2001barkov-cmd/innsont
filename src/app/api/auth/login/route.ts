import { NextResponse } from "next/server";
import {
  clientIp,
  createSession,
  emailProblem,
  hashPassword,
  loginBlockedFor,
  noteLoginFailure,
  noteLoginSuccess,
  passwordProblem,
  rateLimitOk,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";
import { cookieOptions } from "@/lib/api";
import { findByEmail, publicProfile } from "@/lib/store/accounts";
import { upsertOwner } from "@/lib/referral-store";

export const runtime = "nodejs";

// Одинаковая задержка для любой почты — нельзя понять по времени, существует ли аккаунт.
const DUMMY = hashPassword("insont-timing-equalizer");

export async function POST(req: Request) {
  if (!rateLimitOk(clientIp(req), "login", 20)) {
    return NextResponse.json({ error: "Слишком много попыток. Подождите 10 минут." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (emailProblem(email) || passwordProblem(password)) {
    return NextResponse.json({ error: "Неверная почта или пароль" }, { status: 401 });
  }
  if (loginBlockedFor(email)) {
    return NextResponse.json(
      { error: "Вход заблокирован на 15 минут после 5 неудачных попыток" },
      { status: 429 }
    );
  }

  const acc = findByEmail(email);
  const ok = verifyPassword(password, acc?.password ?? DUMMY);

  if (!acc || !ok) {
    noteLoginFailure(email);
    return NextResponse.json({ error: "Неверная почта или пароль" }, { status: 401 });
  }

  noteLoginSuccess(email);
  upsertOwner(email);
  const { token } = createSession(acc.id);
  const res = NextResponse.json({ profile: publicProfile(acc) });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions());
  return res;
}
