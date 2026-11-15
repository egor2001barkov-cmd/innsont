import { NextResponse } from "next/server";
import { clientIp, rateLimitOk } from "@/lib/auth";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { compareSites } from "@/lib/competitor-analysis";

export const runtime = "nodejs";
export const maxDuration = 180;

/** Сравнение своего сайта с конкурентами реальными замерами. */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  if (!rateLimitOk(clientIp(req), "competitors", 30)) {
    return NextResponse.json({ error: "Слишком часто: 30 сравнений за 10 минут. Подождите немного." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { sites?: string[] };
  const sites = Array.isArray(body.sites) ? body.sites : [];
  if (!sites.length) return badRequest("Нужен список сайтов (свой + конкуренты)");
  const profiles = await compareSites(sites);
  return NextResponse.json({ profiles });
}
