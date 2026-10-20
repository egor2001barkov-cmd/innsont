import { NextResponse } from "next/server";
import { clientIp, rateLimitOk } from "@/lib/auth";
import { buildLlmsTxt } from "@/lib/llms-builder";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Публичный генератор llms.txt по живому обходу сайта. Троттлинг: 3 запуска / 10 мин с IP. */
export async function POST(req: Request) {
  if (!rateLimitOk(clientIp(req), "llms", 3)) {
    return NextResponse.json(
      { error: "Слишком часто. Генератор обходит сайт целиком — подождите 10 минут." },
      { status: 429 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as { site?: string; maxPages?: number };
  const site = String(body.site || "").trim();
  if (!site) return NextResponse.json({ error: "Нужен адрес сайта" }, { status: 400 });
  const maxPages = Math.min(Math.max(Number(body.maxPages) || 50, 10), 100);
  const result = await buildLlmsTxt(site, maxPages);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
