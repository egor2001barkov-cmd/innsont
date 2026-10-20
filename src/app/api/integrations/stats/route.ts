import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { loadIntegrations } from "@/lib/store/integrations";
import { metrikaStats, webmasterSummary } from "@/lib/yandex-api";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Данные подключённых интеграций по проекту: Метрика (трафик) + Вебмастер (индексация). */
export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return badRequest("Нужен projectId");
  const raw = loadIntegrations(acc.id);

  const result: {
    metrika?: Awaited<ReturnType<typeof metrikaStats>>;
    webmaster?: Awaited<ReturnType<typeof webmasterSummary>>;
  } = {};

  const counterId = raw.metrika?.counterByProject[projectId];
  if (raw.metrika?.token && counterId) {
    result.metrika = await metrikaStats(raw.metrika.token, counterId, 30);
  }

  const hostId = raw.webmaster?.hostByProject[projectId];
  if (raw.webmaster?.token && raw.webmaster.uid && hostId) {
    result.webmaster = await webmasterSummary(raw.webmaster.token, raw.webmaster.uid, hostId);
  }

  return NextResponse.json({
    metrikaConfigured: Boolean(raw.metrika && counterId),
    webmasterConfigured: Boolean(raw.webmaster && hostId),
    counterId: counterId || null,
    hostId: hostId || null,
    ...result,
  });
}
