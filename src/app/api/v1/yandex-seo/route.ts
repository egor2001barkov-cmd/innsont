import { apiGuard, jsonError, jsonOk, quotaCheck, spendApi } from "@/lib/api-auth";
import { auditSite } from "@/lib/site-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const UA = "InsontApi/1.0 (+https://insont.ru)";

type CommercialSignals = {
  phone: boolean;
  telLink: boolean;
  email: boolean;
  inn: boolean;
  ogrn: boolean;
  prices: boolean;
  messengers: boolean;
  requisitesBlock: boolean;
};

const COMMERCIAL_CHECKS: { id: keyof CommercialSignals; label: string; weight: number }[] = [
  { id: "phone", label: "Телефон на странице", weight: 20 },
  { id: "telLink", label: "Кликабельный tel:", weight: 10 },
  { id: "email", label: "Почта или mailto", weight: 10 },
  { id: "inn", label: "ИНН", weight: 15 },
  { id: "ogrn", label: "ОГРН/ОГРНИП", weight: 15 },
  { id: "prices", label: "Цены или тарифы", weight: 10 },
  { id: "messengers", label: "Мессенджеры", weight: 10 },
  { id: "requisitesBlock", label: "Реквизиты отдельным блоком", weight: 10 },
];

/** POST /api/v1/yandex-seo { url } — технический аудит сайта + коммерческие факторы Яндекса. */
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

  const body = (await req.json().catch(() => ({}))) as { url?: unknown };
  const raw = typeof body.url === "string" ? body.url.trim() : "";
  if (!raw) return jsonError(400, "bad_request", "Передайте url сайта: { \"url\": \"https://insont.ru\" }");

  let origin: string;
  try {
    origin = new URL(raw.match(/^https?:\/\//i) ? raw : `https://${raw}`).origin;
  } catch {
    return jsonError(400, "bad_request", "Некорректный адрес сайта");
  }

  const audit = await auditSite(origin);
  if ("error" in audit) return jsonError(422, "audit_failed", audit.error);

  let html = "";
  try {
    const res = await fetch(origin, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(10_000) });
    html = res.ok ? (await res.text()).slice(0, 300_000) : "";
  } catch {
    html = "";
  }

  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
  const signals: CommercialSignals = {
    phone: /(\+7|8)[\s(.-]*\d{3}[\s).-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}/.test(text),
    telLink: /href=["']tel:/i.test(html),
    email: /mailto:/i.test(html) || /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text),
    inn: /ИНН\s*[:\s]*\d{10,12}/i.test(text),
    ogrn: /ОГРНИП?\s*[:\s]*\d{13,15}/i.test(text),
    prices: /(₽|руб\.|рублей|цена|стоимость|тариф)/i.test(text),
    messengers: /(t\.me\/|wa\.me\/|whatsapp\.com)/i.test(html),
    requisitesBlock: /(реквизиты|юридический адрес|ИП\s+[А-ЯЁ])/i.test(text),
  };

  const passed = COMMERCIAL_CHECKS.filter((c) => signals[c.id]);
  const commercialScore = passed.reduce((sum, c) => sum + c.weight, 0);
  const missing = COMMERCIAL_CHECKS.filter((c) => !signals[c.id]).map((c) => c.label);

  return jsonOk(
    {
      url: origin,
      audit,
      commercial: {
        score: commercialScore,
        signals,
        missing,
        note: missing.length
          ? "Коммерческие факторы Яндекса: отсутствующие сигналы снижают шансы на коммерческую выдачу"
          : "Все базовые коммерческие сигналы на месте",
      },
    },
    spendApi(guard.ctx),
  );
}
