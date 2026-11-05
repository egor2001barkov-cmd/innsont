import { NextResponse } from "next/server";
import { clientIp, rateLimitOk } from "@/lib/auth";
import { findCannibalization, type PageEntry } from "@/lib/cannibalization";

export const runtime = "nodejs";

/** Публичная проверка каннибализации: без авторизации, IP-лимит 5/10мин. */
export async function POST(req: Request) {
  if (!rateLimitOk(clientIp(req), "pub-cannibal", 5)) {
    return NextResponse.json({ error: "Слишком часто. Подождите 10 минут." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { titles?: string };
  const titles = String(body.titles || "");
  if (!titles.trim()) return NextResponse.json({ error: "Вставьте заголовки страниц" }, { status: 400 });

  const pages: PageEntry[] = titles
    .split(/\n+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 3)
    .slice(0, 50)
    .map((t, i) => ({ url: `#${i + 1}`, title: t, source: "вставка" }));

  if (pages.length < 2) {
    return NextResponse.json({ report: { totalPages: pages.length, totalConflicts: 0, conflicts: [], message: "Нужно минимум 2 заголовка" } });
  }

  const report = findCannibalization(pages);
  return NextResponse.json({ report });
}
