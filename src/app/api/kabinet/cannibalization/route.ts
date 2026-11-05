import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { listArticles } from "@/lib/store/accounts";
import { findCannibalization, type PageEntry } from "@/lib/cannibalization";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Проверка каннибализации: статьи проекта + живой sitemap сайта.
 * mode: "library" (по умолчанию) — статьи из кабинета
 * mode: "sitemap" — заголовки из живого sitemap сайта
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    mode?: "library" | "sitemap";
    siteUrl?: string;
    maxPages?: number;
  };
  if (!body.projectId) return badRequest("Нужен projectId");

  const pages: PageEntry[] = [];

  if (body.mode === "sitemap") {
    const siteUrl = String(body.siteUrl || "");
    if (!siteUrl) return badRequest("Нужен siteUrl проекта");

    // sitemap → заголовки страниц
    let urls: string[] = [];
    try {
      const smRes = await fetch(`${siteUrl.replace(/\/$/, "")}/sitemap.xml`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (smRes.ok) {
        const xml = await smRes.text();
        urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim()).filter(Boolean);
      }
    } catch { /* нет sitemap */ }

    if (!urls.length) return badRequest("Sitemap не найден — используйте режим «статьи»");

    const maxPages = Math.min(Math.max(Number(body.maxPages) || 30, 5), 100);
    urls = urls.slice(0, maxPages);

    // собираем заголовки (конкурентно, батчами по 5)
    const batch = 5;
    for (let i = 0; i < urls.length; i += batch) {
      const chunk = urls.slice(i, i + batch);
      const titles = await Promise.all(
        chunk.map(async (u) => {
          try {
            const res = await fetch(u, {
              headers: { "User-Agent": "Mozilla/5.0 (compatible; InsontAudit/1.0)" },
              signal: AbortSignal.timeout(8_000),
            });
            if (!res.ok) return null;
            const html = await res.text();
            const title = (html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "").trim().slice(0, 150);
            return title ? { url: u, title, source: "sitemap" } : null;
          } catch { return null; }
        })
      );
      for (const t of titles) {
        if (t) pages.push(t);
      }
    }

    if (pages.length < 2) {
      return NextResponse.json({
        report: { totalPages: pages.length, totalConflicts: 0, conflicts: [], message: "Не удалось прочитать заголовки из sitemap (мало страниц)" },
      });
    }
  } else {
    // режим "library" — статьи из кабинета
    const articles = listArticles(acc.id).filter((a) => a.projectId === body.projectId);
    for (const a of articles) {
      pages.push({ url: `/kabinet/kontent#${a.id}`, title: a.title, source: "статья" });
    }
    if (pages.length < 2) {
      return NextResponse.json({
        report: { totalPages: pages.length, totalConflicts: 0, conflicts: [], message: "Нужно минимум 2 статьи в библиотеке" },
      });
    }
  }

  const report = findCannibalization(pages);
  return NextResponse.json({ report });
}
