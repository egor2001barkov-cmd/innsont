import { apiGuard, jsonError, jsonOk, quotaCheck, spendApi } from "@/lib/api-auth";
import { loadIntegrations } from "@/lib/store/integrations";
import { webmasterHosts, webmasterSummary } from "@/lib/yandex-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/v1/webmaster { host?, hostId? }
 * Токен Вебмастера берётся из интеграций аккаунта (кабинет → Интеграции),
 * а не из тела запроса: ключ API не должен давать доступ к чужим кабинетам.
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

  const body = (await req.json().catch(() => ({}))) as { host?: unknown; hostId?: unknown };
  const integrations = loadIntegrations(guard.ctx.account.id);
  const wm = integrations.webmaster;

  if (!wm?.token || !wm.uid) {
    return jsonError(
      409,
      "integration_required",
      "Подключите Яндекс.Вебмастер в кабинете (/kabinet/integratsii): API использует токен аккаунта",
    );
  }

  const hosts = await webmasterHosts(wm.token, wm.uid);
  if (hosts.length === 0) {
    return jsonError(502, "provider_error", "Вебмастер не вернул список сайтов — проверьте токен");
  }

  let hostId = typeof body.hostId === "string" ? body.hostId : "";
  if (!hostId && typeof body.host === "string" && body.host.trim()) {
    const needle = body.host.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    hostId = hosts.find((h) => h.host.includes(needle) || needle.includes(h.host.replace(/^https?:\/\//, "")))?.host_id || "";
  }
  if (!hostId) hostId = hosts.find((h) => h.verified)?.host_id || hosts[0].host_id;

  const summary = await webmasterSummary(wm.token, wm.uid, hostId);
  return jsonOk({ hostId, hosts, ...summary }, spendApi(guard.ctx));
}
