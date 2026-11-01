import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { listArticles } from "@/lib/store/accounts";
import { findCannibalization, type PageEntry } from "@/lib/cannibalization";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Проверка каннибализации: сравнивает заголовки статей проекта (+опционально sitemap сайта)
 * и находит пары/группы с пересекающимся интентом.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { projectId?: string; includeSitemap?: boolean };
  if (!body.projectId) return badRequest("Нужен projectId");

  const pages: PageEntry[] = [];

  // статьи из библиотеки контента
  const articles = listArticles(acc.id).filter((a) => a.projectId === body.projectId);
  for (const a of articles) {
    pages.push({
      url: `/kabinet/kontent (id: ${a.id.slice(0, 8)})`,
      title: a.title,
      source: "статья",
    });
  }

  // опционально: живой sitemap сайта проекта
  if (body.includeSitemap) {
    try {
      const projectUrl = articles[0]?.meta?.key ? "" : ""; // TODO: получать URL проекта из настроек
      void projectUrl;
    } catch {
      // sitemap недоступен — работаем с тем что есть
    }
  }

  if (pages.length < 2) {
    return NextResponse.json({
      report: { totalPages: pages.length, totalConflicts: 0, conflicts: [], message: "Нужно минимум 2 страницы для сравнения" },
    });
  }

  const report = findCannibalization(pages);
  return NextResponse.json({ report });
}
