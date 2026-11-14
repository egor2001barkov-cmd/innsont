import { apiGuard, jsonError, jsonOk, quotaCheck, spendApi } from "@/lib/api-auth";
import { fetchWordstat, resolveWordstatToken, suggestAsWordstat, yandexSuggest } from "@/lib/wordstat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/v1/wordstat { phrase, region? }
 * С токеном Вордстата — частотность, динамика и регионы. Без токена — честные
 * подсказки Яндекса без выдуманных цифр (source: "suggest").
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

  const body = (await req.json().catch(() => ({}))) as { phrase?: unknown; region?: unknown };
  const phrase = typeof body.phrase === "string" ? body.phrase.trim() : "";
  if (!phrase) return jsonError(400, "bad_request", "Передайте phrase: { \"phrase\": \"продвижение сайта\" }");

  const region = Number(body.region) || undefined;
  const token = resolveWordstatToken();

  if (token) {
    try {
      const bundle = await fetchWordstat(token, phrase, region);
      return jsonOk({ ...bundle, region: region ?? null }, spendApi(guard.ctx));
    } catch (error) {
      return jsonError(502, "provider_error", error instanceof Error ? error.message : "Вордстат недоступен");
    }
  }

  const suggests = await yandexSuggest(phrase);
  const bundle = suggestAsWordstat(phrase, suggests);
  return jsonOk(
    {
      ...bundle,
      region: region ?? null,
      note: "YANDEX_WORDSTAT_TOKEN не задан: отдаём подсказки Яндекса без частотности",
    },
    spendApi(guard.ctx),
  );
}
