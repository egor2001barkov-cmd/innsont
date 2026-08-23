import { NextResponse } from "next/server";
import { claimInvite, getByCode, upsertOwner } from "@/lib/referral-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "";
  const code = url.searchParams.get("code") || "";
  if (email) {
    const acc = upsertOwner(email);
    return NextResponse.json({ ...acc, count: acc.invites.length });
  }
  if (code) {
    const acc = getByCode(code);
    if (!acc) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ code: acc.code, count: acc.invites.length });
  }
  return NextResponse.json({ error: "email or code required" }, { status: 400 });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: string; email?: string };
  if (!body.code || !body.email) {
    return NextResponse.json({ error: "Нужны code и email" }, { status: 400 });
  }
  const res = claimInvite(body.code, body.email);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({
    ok: true,
    count: res.account?.invites.length || 0,
    invites: res.account?.invites || [],
  });
}
