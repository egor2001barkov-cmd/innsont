import { NextResponse } from "next/server";
import { clientIp, rateLimitOk } from "@/lib/auth";
import { claimInvite, confirmedCount, getByCode, inviteConfirmed, upsertOwner } from "@/lib/referral-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!rateLimitOk(clientIp(req), "ref-get", 20)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "";
  const code = url.searchParams.get("code") || "";
  if (email) {
    const acc = upsertOwner(email);
    // считаем только подтверждённые приглашения (аккаунт реально создан)
    const confirmed = confirmedCount(acc);
    return NextResponse.json({
      ...acc,
      count: confirmed,
      invites: acc.invites.map((i) => ({ ...i, confirmed: inviteConfirmed(i) })),
    });
  }
  if (code) {
    const acc = getByCode(code);
    if (!acc) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ code: acc.code, count: confirmedCount(acc) });
  }
  return NextResponse.json({ error: "email or code required" }, { status: 400 });
}

export async function POST(req: Request) {
  if (!rateLimitOk(clientIp(req), "ref-post", 10)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { code?: string; email?: string };
  if (!body.code || !body.email) {
    return NextResponse.json({ error: "Нужны code и email" }, { status: 400 });
  }
  const res = claimInvite(body.code, body.email);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({
    ok: true,
    count: res.account ? confirmedCount(res.account) : 0,
    invites: (res.account?.invites || []).map((i) => ({ ...i, confirmed: inviteConfirmed(i) })),
  });
}
