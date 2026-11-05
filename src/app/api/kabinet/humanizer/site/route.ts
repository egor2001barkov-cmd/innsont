import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { loadIntegrations } from "@/lib/store/integrations";
import { analyze } from "@/lib/humanizer";

export const runtime = "nodejs";
export const maxDuration = 180;

/**
 * Очеловечиватель сайта: сканирует страницы проекта и проверяет текст каждой на ИИ-паттерны.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { projectId?: string; maxPages?: number };
  if (!body.projectId) return badRequest("Нужен projectId");

  // URL проекта из localStorage на клиенте — передаём явно
  const projectUrl = String((body as Record<string, unknown>).siteUrl || "");
  if (!projectUrl) return badRequest("Нужен siteUrl проекта");

  const maxPages = Math.min(Math.max(Number(body.maxPages) || 5, 1), 10);

  // sitemap
  let urls: string[] = [];
  try {
    const smRes = await fetch(`${projectUrl.replace(/\/$/, "")}/sitemap.xml`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (smRes.ok) {
      const xml = await smRes.text();
      urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim()).filter(Boolean);
    }
  } catch { /* нет sitemap */ }

  if (!urls.length) urls = [projectUrl.replace(/\/$/, "") + "/"];
  urls = urls.slice(0, maxPages);

  interface PageResult {
    url: string;
    title: string;
    score: number;
    totalPatterns: number;
    totalHits: number;
    patterns: { name: string; severity: string; count: number }[];
  }

  const results: PageResult[] = [];

  for (const pageUrl of urls) {
    try {
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; InsontAudit/1.0)" },
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      const title = (html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "").trim().slice(0, 100);
      // извлечь текст: убрать скрипты/стили/теги
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 50_000);
      if (text.length < 100) continue;

      const report = analyze(text, false);
      results.push({
        url: pageUrl,
        title,
        score: report.score,
        totalPatterns: report.totalPatterns,
        totalHits: report.totalHits,
        patterns: report.patterns.map((p) => ({ name: p.name, severity: p.severity, count: p.hits.length })),
      });
    } catch {
      // страница недоступна — пропускаем
    }
  }

  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
  return NextResponse.json({
    pages: results,
    totalPages: results.length,
    avgScore,
    scannedUrls: urls.length,
  });
}
