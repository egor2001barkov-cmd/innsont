import { apiGuard, jsonError, jsonOk, quotaCheck, spendApi } from "@/lib/api-auth";
import { analyzeLocalMarket, type LocalBusiness } from "@/lib/local-competitors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAMPLE: LocalBusiness = { name: "", rating: 4.8, reviews: 120, website: "https://example.ru", city: "Москва" };

/**
 * POST /api/v1/competitors/local { businesses: [{ name, rating, reviews, website?, email?, category? }] }
 * Анализ локального рынка по выгрузке карточек (Google Maps / 2ГИС) — без внешних API.
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

  const body = (await req.json().catch(() => ({}))) as { businesses?: unknown };
  if (!Array.isArray(body.businesses)) {
    return jsonError(400, "bad_request", "Передайте businesses: массив карточек", { example: { businesses: [SAMPLE] } });
  }
  if (body.businesses.length > 500) {
    return jsonError(413, "payload_too_large", "Максимум 500 карточек за вызов");
  }

  const businesses = body.businesses
    .filter((b): b is Record<string, unknown> => Boolean(b) && typeof b === "object")
    .map((b) => ({
      name: String(b.name ?? ""),
      rating: Number(b.rating) || 0,
      reviews: Number(b.reviews) || 0,
      website: typeof b.website === "string" ? b.website : "",
      email: typeof b.email === "string" ? b.email : "",
      address: typeof b.address === "string" ? b.address : "",
      category: typeof b.category === "string" ? b.category : "",
      phone: typeof b.phone === "string" ? b.phone : "",
    }));

  const report = analyzeLocalMarket(businesses);
  return jsonOk(report, spendApi(guard.ctx));
}
