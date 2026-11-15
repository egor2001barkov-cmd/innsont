import { NextResponse } from "next/server";
import { badRequest, currentAccount, unauthorized } from "@/lib/api";
import { buildBrief } from "@/lib/brief";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** POST /api/brief { key, urls: string[] } — структура страниц конкурентов. */
export async function POST(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { key?: unknown; urls?: unknown };
  const key = typeof body.key === "string" ? body.key.trim().slice(0, 160) : "";
  const urls = Array.isArray(body.urls) ? body.urls.filter((u): u is string => typeof u === "string") : [];

  if (!key) return badRequest("Нужен key");
  if (urls.length === 0) return badRequest("Добавьте 1–3 URL конкурентов");

  const brief = await buildBrief(key, urls);
  return NextResponse.json({ brief });
}
