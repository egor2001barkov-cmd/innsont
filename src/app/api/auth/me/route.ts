import { NextResponse } from "next/server";
import { currentAccount, unauthorized } from "@/lib/api";
import { limitsFor, publicProfile, saveAccount } from "@/lib/store/accounts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  return NextResponse.json({ profile: publicProfile(acc), limits: limitsFor(acc) });
}

/** Обновление полей профиля (страница «Аккаунт»). Пароль здесь не меняется. */
export async function PUT(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const fields = ["name", "company", "phone", "inn", "city", "site", "job", "region", "timezone"] as const;
  for (const f of fields) {
    const v = body[f];
    if (typeof v === "string") {
      (acc as unknown as Record<string, string>)[f] = v.slice(0, 150);
    }
  }
  saveAccount(acc);
  return NextResponse.json({ profile: publicProfile(acc) });
}
