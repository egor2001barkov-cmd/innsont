import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { auditSite } from "@/lib/site-audit";
import { loadIntegrations } from "@/lib/store/integrations";
import { metrikaStats } from "@/lib/yandex-api";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Полный аудит сайта по методике seo-ru: двойной скор Google/Яндекс.
 * Если к проекту привязан счётчик Метрики — поведенческий блок считается по отказам.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { site?: string; projectId?: string };
  const site = String(body.site || "").trim();
  if (!site) return badRequest("Нужен адрес сайта");

  const spend = trySpend(acc, "audit");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит аудитов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 }
    );
  }

  // отказы из Метрики, если счётчик привязан
  let bounceRate: number | undefined;
  const integrations = loadIntegrations(acc.id);
  const counterId = body.projectId ? integrations.metrika?.counterByProject[body.projectId] : undefined;
  if (integrations.metrika?.token && counterId) {
    const stats = await metrikaStats(integrations.metrika.token, counterId, 30);
    if (stats.totals) bounceRate = stats.totals.bounceRate;
  }

  const audit = await auditSite(site, { bounceRate });
  if ("error" in audit) return badRequest(audit.error);
  return NextResponse.json({ audit, profile: publicProfile(spend.acc) });
}
