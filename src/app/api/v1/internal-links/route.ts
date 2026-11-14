import { apiGuard, jsonError, jsonOk, quotaCheck, spendApi } from "@/lib/api-auth";
import { auditInternalLinks } from "@/lib/internal-links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/v1/internal-links { url, maxPages? }
 * Аудит внутренней перелинковки: граф контекстных ссылок, сироты, анкоры,
 * кандидаты на усиление. maxPages — 5..100, по умолчанию 40.
 */
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

  const body = (await req.json().catch(() => ({}))) as { url?: unknown; maxPages?: unknown };
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url) return jsonError(400, "bad_request", "Передайте url сайта: { \"url\": \"https://insont.ru\" }");

  const maxPages = Number(body.maxPages) || 40;
  const result = await auditInternalLinks(url, { maxPages });
  if ("error" in result) return jsonError(422, "audit_failed", result.error);

  return jsonOk(result, spendApi(guard.ctx));
}
