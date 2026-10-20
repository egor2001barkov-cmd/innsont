import { NextResponse } from "next/server";
import {
  clientIp,
  createSession,
  emailProblem,
  hashPassword,
  passwordProblem,
  rateLimitOk,
  SESSION_COOKIE,
} from "@/lib/auth";
import { cookieOptions } from "@/lib/api";
import { createAccount, findByEmail, publicProfile, saveAccount } from "@/lib/store/accounts";
import { claimInvite, confirmedCount, upsertOwner } from "@/lib/referral-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimitOk(clientIp(req), "register", 10)) {
    return NextResponse.json({ error: "Слишком много попыток. Подождите 10 минут." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    company?: string;
    email?: string;
    password?: string;
    refCode?: string;
  };
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const emailErr = emailProblem(email);
  if (emailErr) return NextResponse.json({ error: emailErr }, { status: 400 });
  const passErr = passwordProblem(password);
  if (passErr) return NextResponse.json({ error: passErr }, { status: 400 });

  const created = createAccount({
    email,
    password: hashPassword(password),
    name: body.name ? String(body.name) : "",
    company: body.company ? String(body.company) : "",
    referredBy: body.refCode ? String(body.refCode).trim().toUpperCase() : "",
  });
  if ("error" in created) {
    return NextResponse.json({ error: created.error }, { status: 409 });
  }

  upsertOwner(email);
  if (created.referredBy) {
    const invite = claimInvite(created.referredBy, email);
    if (invite.ok && invite.account) {
      const inviter = findByEmail(invite.account.email);
      if (inviter) {
        // считаем только подтверждённые: приглашённый стал реальным аккаунтом
        inviter.referralCount = confirmedCount(invite.account);
        saveAccount(inviter);
      }
    }
  }

  const { token } = createSession(created.id);
  const res = NextResponse.json({ profile: publicProfile(created) });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions());
  return res;
}
