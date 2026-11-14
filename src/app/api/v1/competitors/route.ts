import { apiGuard, jsonError, jsonOk, quotaCheck, spendApi } from "@/lib/api-auth";
import { compareSites } from "@/lib/competitor-analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

/** POST /api/v1/competitors { sites: ["a.ru", "b.ru"] } — до 6 сайтов. */
export async function POST(req: Request) {
  const guard = apiGuard(req);
  if (!guard.ok) return guard.response;

  const quota = quotaCheck(guard.ctx);
  if (!quota.ok) {
    return jsonError(429, "quota_exceeded", `Квота ${quota.limit} вызовов в месяц исчерпана`, {
      used: quota.used,
      limit: quota.limit,
    });
  }

  const body = (await req.json().catch(() => ({}))) as { sites?: unknown };
  const sites = Array.isArray(body.sites)
    ? body.sites.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];
  if (sites.length === 0) {
    return jsonError(400, "bad_request", "Передайте sites: { \"sites\": [\"insont.ru\", \"competitor.ru\"] }");
  }

  try {
    const profiles = await compareSites(sites);
    return jsonOk({ sites: sites.slice(0, 6), profiles }, spendApi(guard.ctx));
  } catch (error) {
    return jsonError(502, "provider_error", error instanceof Error ? error.message : "Не удалось получить сайты");
  }
}
