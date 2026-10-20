import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { listArticles } from "@/lib/store/accounts";
import { loadIntegrations } from "@/lib/store/integrations";
import { metrikaWindow } from "@/lib/yandex-api";
import { buildWeeklyReport } from "@/lib/weekly-report";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Недельный отчёт (методика seo-weekly-report): 28 дней против предыдущих 28.
 * Трафик — из подключённой Метрики; активность контента и аудит — из INSONT.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    lastAuditAt?: string | null;
    lastAuditScores?: { google: number; yandex: number } | null;
  };
  if (!body.projectId) return badRequest("Нужен projectId");

  const articles = listArticles(acc.id)
    .filter((a) => a.projectId === body.projectId)
    .map((a) => ({ updated: a.updated }));

  let metrika;
  const integrations = loadIntegrations(acc.id);
  const counterId = integrations.metrika?.counterByProject[body.projectId];
  if (integrations.metrika?.token && counterId) {
    metrika = await metrikaWindow(integrations.metrika.token, counterId, 28);
  }

  const report = buildWeeklyReport({
    projectId: body.projectId,
    metrika,
    articles,
    lastAuditAt: body.lastAuditAt ?? null,
    lastAuditScores: body.lastAuditScores ?? null,
  });

  return NextResponse.json({ report });
}
