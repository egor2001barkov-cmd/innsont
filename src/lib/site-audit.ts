/**
 * Аудит всего сайта по методике seo-ru (Google + Яндекс одновременно):
 * robots/sitemap/редиректы/404/скорость/on-page/заголовки безопасности/
 * коммерческие факторы Яндекса/GEO-готовность + двойной скоринг.
 * Без headless-браузера: читаем только серверный HTML.
 */

export type AuditSeverity = "critical" | "high" | "medium" | "low";

export type SiteFinding = {
  id: string;
  severity: AuditSeverity;
  area: string;
  title: string;
  detail: string;
  fix: string;
  watch: string; // как понять, что помогло
};

export type BlockScore = {
  engine: "google" | "yandex";
  block: string;
  weight: number;
  score: number; // 0–100
  comment: string;
};

export type SiteAudit = {
  site: string;
  startedAt: string;
  durationMs: number;
  googleScore: number;
  yandexScore: number;
  blocks: BlockScore[];
  findings: SiteFinding[];
  facts: {
    robots: { found: boolean; yandexBlock: boolean; cleanParam: boolean; sitemapDirective: boolean; disallowAll: boolean; aiBotsBanned: string[] };
    sitemap: { found: boolean; urls: number; lastmodNewest: string; lastmodSame: boolean };
    redirects: { httpToHttps: boolean; wwwResolve: boolean; note: string };
    notFound: { returns404: boolean; status: number };
    speed: { pages: { url: string; ttfbMs: number }[]; avgTtfbMs: number };
    homepage: {
      title: string;
      description: string;
      h1: string[];
      h1Count: number;
      viewport: boolean;
      schemaTypes: string[];
      htmlKb: number;
      mixedContent: number;
      https: boolean;
    };
    headers: { hsts: boolean; nosniff: boolean; frameOptions: boolean; poweredBy: boolean };
    commercial: { phone: boolean; email: boolean; innOrOgrn: boolean; address: boolean; prices: boolean; messenger: boolean };
    geo: { llmsTxt: boolean; aiBotsAllowed: boolean; faqLike: boolean };
  };
  note: string;
};

const UA =
  "Mozilla/5.0 (compatible; InsontAudit/1.0; +https://insont.ru) AppleWebKit/537.36 Chrome/128 Safari/537.36";

async function get(url: string, timeoutMs = 12_000) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,text/plain,application/xml,*/*" },
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { res, body: await res.text().catch(() => "") };
  } catch {
    return null;
  }
}

async function statusOf(url: string, timeoutMs = 10_000) {
  const r = await get(url, timeoutMs);
  return r ? r.res.status : null;
}

function decode(s: string) {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

type CheckResult = { pass: boolean | null; weight: number; comment?: string };
type BlockChecks = { [blockId: string]: CheckResult[] };

export async function auditSite(
  rawSite: string,
  opts: { bounceRate?: number } = {}
): Promise<SiteAudit | { error: string }> {
  const startedAt = new Date().toISOString();
  const t0 = Date.now();
  let host: URL;
  try {
    host = new URL(rawSite.trim().match(/^https?:\/\//i) ? rawSite.trim() : `https://${rawSite.trim()}`);
  } catch {
    return { error: "Некорректный адрес сайта" };
  }
  const origin = host.origin;
  const findings: SiteFinding[] = [];
  const checks: BlockChecks = {};

  // ---------- robots.txt ----------
  const robotsRaw = await get(`${origin}/robots.txt`);
  const robotsText = robotsRaw?.res.ok ? robotsRaw.body.slice(0, 60_000) : "";
  const robotsBlocks = parseRobots(robotsText);
  const uaAll = robotsBlocks["*"] || [];
  const uaYandex = robotsBlocks["yandex"] || robotsBlocks["yandexbot"] || [];
  const robots = {
    found: Boolean(robotsText),
    yandexBlock: robotsBlocks["yandex"] !== undefined || robotsBlocks["yandexbot"] !== undefined,
    cleanParam: /clean-param/i.test(robotsText),
    sitemapDirective: /^sitemap:\s*\S+/im.test(robotsText),
    disallowAll: [...uaAll, ...uaYandex].some((r) => r.disallow.some((d) => d.replace(/\s/g, "") === "/")),
    aiBotsBanned: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "YandexBot"].filter((bot) => {
      const rules = robotsBlocks[bot.toLowerCase()];
      if (!rules) return false;
      return rules.some((r) => r.disallow.some((d) => d.replace(/\s/g, "") === "/"));
    }),
  };

  checks.robots = [
    { pass: robots.found, weight: 10, comment: robots.found ? "robots.txt на месте" : "robots.txt не найден" },
    { pass: robots.disallowAll ? false : true, weight: 20, comment: robots.disallowAll ? "Сайт целиком закрыт Disallow: /" : "глобального запрета нет" },
    { pass: robots.sitemapDirective, weight: 10, comment: robots.sitemapDirective ? "Sitemap указан" : "Sitemap не указан в robots" },
    { pass: robots.cleanParam, weight: 5, comment: robots.cleanParam ? "Clean-param есть" : "Clean-param нет (UTM-дубли)" },
  ];
  if (!robots.found) {
    findings.push(mk("robots-missing", "high", "Индексация", "Нет robots.txt", "Поисковые роботы будут ходить по всем URL, включая служебные.", "Создайте robots.txt: раздельные блоки Yandex/Googlebot, Sitemap, закрыть /cart, /checkout, /search, /admin.", "Вебмастер → «Исключённые страницы» через 1–2 нед"));
  }
  if (robots.disallowAll) {
    findings.push(mk("robots-disallow-all", "critical", "Индексация", "Сайт закрыт от индексации (Disallow: /)", "robots.txt запрещает обход всего сайта.", "Уберите глобальный Disallow, оставьте только служебные разделы.", "Появление страниц в индексе, Вебмастер → Страницы в поиске"));
  }
  if (!robots.cleanParam) {
    findings.push(mk("clean-param", "medium", "Индексация", "Нет Clean-param для UTM-хвостов", "Яндекс может плодить дубли страниц по меткам.", "Добавьте: Clean-param: utm_source&utm_medium&utm_campaign&yclid&gclid&_openstat", "Вебмастер → дубли ↓ через 2–4 нед"));
  }

  // ---------- sitemap ----------
  let sitemapUrl = robotsText.match(/^sitemap:\s*(\S+)/im)?.[1] || `${origin}/sitemap.xml`;
  let sitemapBody = "";
  let smRes = await get(sitemapUrl, 10_000);
  if (!smRes?.res.ok) {
    // иногда индексный файл назван иначе
    sitemapUrl = `${origin}/sitemap_index.xml`;
    smRes = await get(sitemapUrl, 10_000);
  }
  if (smRes?.res.ok && /<urlset|<sitemapindex/i.test(smRes.body)) sitemapBody = smRes.body.slice(0, 2_000_000);
  const locs = [...sitemapBody.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim()).slice(0, 5000);
  const lastmods = [...sitemapBody.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi)].map((m) => m[1].trim().slice(0, 10)).filter(Boolean);
  const lastmodUnique = new Set(lastmods);
  const newest = lastmods.sort().pop() || "";
  const newestAgeDays = newest ? Math.round((Date.now() - Date.parse(newest)) / 86400_000) : null;
  const sitemap = {
    found: Boolean(sitemapBody),
    urls: locs.length,
    lastmodNewest: newest,
    lastmodSame: lastmods.length > 5 && lastmodUnique.size <= 2,
  };
  checks.sitemap = [
    { pass: sitemap.found, weight: 15, comment: sitemap.found ? `${sitemap.urls} URL` : "sitemap не найден" },
    {
      pass: sitemap.found ? (newestAgeDays !== null && newestAgeDays <= 60) : null,
      weight: 5,
      comment: newestAgeDays !== null ? `последний lastmod ${newestAgeDays} дн. назад` : "",
    },
  ];
  if (!sitemap.found) {
    findings.push(mk("sitemap-missing", "high", "Индексация", "Не найден sitemap.xml", "Обход и попадание новых страниц в индекс замедляются.", "Сгенерируйте sitemap (все канонические URL, честный lastmod) и укажите в robots.txt и Вебмастере/GSC.", "GSC/Вебмастер → покрытие, 1–2 нед"));
  } else if (newestAgeDays !== null && newestAgeDays > 90) {
    findings.push(mk("sitemap-stale", "medium", "Индексация", `Sitemap не обновлялся ${newestAgeDays} дней`, `Последний lastmod: ${newest}.`, "Обновляйте lastmod только у реально изменённых страниц — поиск перестаёт доверять застывшим датам.", "Частота обхода в Вебмастере ↑"));
  }

  // ---------- редиректы ----------
  const httpStatus = await statusOf(origin.replace("https://", "http://"));
  const wwwStatus = await statusOf(origin.replace("://", "://www."));
  const httpToHttps = [301, 308].includes(httpStatus ?? 0);
  const wwwResolve = [301, 302, 308].includes(wwwStatus ?? 0);
  checks.redirects = [
    { pass: httpToHttps, weight: 10, comment: `http→: ${httpStatus ?? "нет ответа"}` },
    { pass: wwwResolve ? true : null, weight: 5, comment: wwwResolve ? "www редиректит" : "www не редиректит (ок, если DNS без www)" },
  ];
  if (!httpToHttps) {
    findings.push(mk("https-redirect", "high", "Индексация", "HTTP не редиректит на HTTPS", `http отвечает ${httpStatus ?? "без ответа"}.`, "Настройте 301 (или 308) редирект на https-версию на уровне сервера.", "GSC: единственная версия в отчёте через 2–4 нед"));
  }

  // ---------- 404 ----------
  const nfStatus = await statusOf(`${origin}/insont-audit-${Date.now().toString(36)}`);
  const notFound = { returns404: nfStatus === 404, status: nfStatus ?? 0 };
  checks.notFound404 = [{ pass: notFound.returns404, weight: 10, comment: `код ${notFound.status}` }];
  if (!notFound.returns404) {
    findings.push(mk("soft-404", "medium", "Индексация", `Несуществующая страница отдаёт ${notFound.status}, а не 404`, "«Мягкие 404» забирают краулинговый бюджет и плодят мусор в индексе.", "Отдайте честный 404 на несуществующих URL.", "Вебмастер → исключённые ↓"));
  }

  // ---------- скорость ----------
  const speedPages: { url: string; ttfbMs: number }[] = [];
  const innerCandidates = locs.filter((u) => u !== origin + "/" && u !== origin).slice(0, 2);
  for (const p of [origin + "/", ...innerCandidates]) {
    const t0p = Date.now();
    const r = await get(p, 12_000);
    if (r) speedPages.push({ url: p, ttfbMs: Date.now() - t0p });
  }
  const avgTtfb = speedPages.length ? Math.round(speedPages.reduce((s, p) => s + p.ttfbMs, 0) / speedPages.length) : 0;
  const speedOk = avgTtfb > 0 && avgTtfb < 800;
  const speedMid = avgTtfb >= 800 && avgTtfb < 2000;
  checks.speed = [{ pass: speedOk ? true : speedMid ? null : false, weight: 20, comment: `средний TTFB ${avgTtfb} мс` }];
  if (!speedOk && avgTtfb > 0) {
    findings.push(mk("ttfb", speedMid ? "medium" : "high", "Скорость", `Средний TTFB ${avgTtfb} мс`, `Проверено страниц: ${speedPages.length}.`, speedMid ? "Включите серверный кэш HTML, цель — до 800 мс." : "Критично: включите полный кэш HTML (страница должна отдаваться из кэша, не из CMS).", "PSI/CWV в GSC через 2–4 нед"));
  }

  // ---------- главная on-page ----------
  const home = await get(origin + "/");
  const homeHtml = home?.res.ok ? home.body.slice(0, 500_000) : "";
  const title = decode(homeHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = decode(
    homeHtml.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || ""
  );
  const h1s = [...homeHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1])).filter(Boolean);
  const viewportOk = /width=device-width/i.test(homeHtml.match(/<meta\s+name=["']viewport["'][^>]*content=["']([^"']*)["']/i)?.[1] || "");
  const schemaTypes = [...new Set([...homeHtml.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]))].slice(0, 12);
  const mixedContent = (homeHtml.match(/(src|href)=["']http:\/\//gi) || []).length;
  const homepage = {
    title,
    description,
    h1: h1s,
    h1Count: h1s.length,
    viewport: viewportOk,
    schemaTypes,
    htmlKb: Math.round(homeHtml.length / 1024),
    mixedContent,
    https: origin.startsWith("https://"),
  };
  checks.onpage = [
    { pass: Boolean(title) && title.length >= 20 && title.length <= 75, weight: 10, comment: `title ${title.length} симв.` },
    { pass: description ? description.length >= 70 && description.length <= 165 : false, weight: 5, comment: `description ${description.length} симв.` },
    { pass: homepage.h1Count === 1, weight: 10, comment: `H1 ×${homepage.h1Count}` },
    { pass: viewportOk, weight: 10, comment: viewportOk ? "viewport ок" : "viewport нет" },
    { pass: homepage.mixedContent === 0 ? true : false, weight: 5, comment: mixedContent ? `${mixedContent} http-ссылок` : "" },
  ];
  checks.schemaBlock = [
    { pass: schemaTypes.length > 0, weight: 10, comment: schemaTypes.join(", ") || "нет" },
    { pass: schemaTypes.some((t) => /Organization|LocalBusiness|Store|Company/i.test(t)) ? true : null, weight: 5, comment: "Organization/LocalBusiness" },
  ];
  if (!schemaTypes.length) {
    findings.push(mk("schema", "medium", "Разметка", "Нет Schema.org на главной", "Поиск и нейросети хуже понимают сайт.", "Добавьте JSON-LD Organization (+ Product на товарных, Article на статьях).", "Rich Results Test / сниппеты, 1–3 нед"));
  }
  if (homepage.h1Count !== 1) {
    findings.push(mk("h1", homepage.h1Count === 0 ? "high" : "medium", "Контент", homepage.h1Count === 0 ? "На главной нет H1" : `На главной ${homepage.h1Count} H1`, "H1 — главный заголовок, по нему поиск сверяет тему страницы.", "Ровно один H1 с главным запросом.", "Позиции главной по бренду/ключу"));
  }
  if (mixedContent > 0) {
    findings.push(mk("mixed-content", "high", "Техника", `Смешанный контент: ${mixedContent} http-ссылок в коде`, "Браузеры блокируют незащищённые ресурсы на https-странице.", "Замените все http:// на https:// (или относительные пути).", "Замок в браузере без предупреждений"));
  }

  // ---------- заголовки безопасности ----------
  const homeHeaders = home?.res.headers;
  const headers = {
    hsts: Boolean(homeHeaders?.get("strict-transport-security")),
    nosniff: Boolean(homeHeaders?.get("x-content-type-options")),
    frameOptions: Boolean(homeHeaders?.get("x-frame-options") || homeHeaders?.get("content-security-policy")),
    poweredBy: Boolean(homeHeaders?.get("x-powered-by")),
  };
  checks.security = [
    { pass: headers.hsts, weight: 6, comment: headers.hsts ? "HSTS есть" : "HSTS нет" },
    { pass: headers.nosniff, weight: 4, comment: headers.nosniff ? "nosniff" : "nosniff нет" },
    { pass: headers.frameOptions, weight: 4, comment: headers.frameOptions ? "frame-защита" : "нет X-Frame-Options/CSP" },
    { pass: headers.poweredBy ? false : true, weight: 3, comment: headers.poweredBy ? "x-powered-by светится" : "" },
    { pass: homepage.https, weight: 3, comment: homepage.https ? "HTTPS" : "нет HTTPS" },
  ];
  if (!headers.hsts) {
    findings.push(mk("hsts", "low", "Безопасность", "Нет HSTS-заголовка", "Браузер может первый раз уйти на http-версию.", "Strict-Transport-Security: max-age=63072000; includeSubDomains", "—"));
  }

  // ---------- коммерческие факторы Яндекса ----------
  const pageText = homeHtml.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const plain = decode(pageText.replace(/<[^>]+>/g, " "));
  // контакты часто в футере всех страниц — проверяем и страницу /kontakty если есть
  let contactText = plain;
  for (const cu of ["/kontakty", "/contacts", "/contact"]) {
    if (contactText.length > 2000) break;
    const cr = await get(origin + cu, 8_000);
    if (cr?.res.ok) {
      contactText += " " + decode(cr.body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ")).slice(0, 20_000);
    }
  }
  const commercial = {
    phone: /(\+7|8)[\s(-]?\d{3}[\s)]?-?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}/.test(contactText),
    email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(contactText),
    innOrOgrn: /(ИНН|ОГРН|инн|огрн)\s*:?\s*\d{4,}/.test(contactText),
    address: /(ул\.|улица|просп\.|пр-т|шоссе|,\s*Москва|,\s*Санкт-Петербург|,\s*[а-яё]+\s+(город|г\.))/i.test(contactText),
    prices: /(₽|руб\.|руб\b|цена|стоимость|тариф)/i.test(plain),
    messenger: /(whatsapp|viber|telegram|t\.me|мессенджер)/i.test(contactText),
  };
  const commercialScore = [
    commercial.phone,
    commercial.email,
    commercial.innOrOgrn,
    commercial.address,
    commercial.prices,
    commercial.messenger,
  ].filter(Boolean).length;
  checks.commercial = [
    { pass: commercial.phone, weight: 8, comment: commercial.phone ? "телефон есть" : "телефона нет" },
    { pass: commercial.innOrOgrn, weight: 5, comment: commercial.innOrOgrn ? "ИНН/ОГРН есть" : "ИНН/ОГРН не найден" },
    { pass: commercial.address, weight: 4, comment: commercial.address ? "адрес есть" : "адреса нет" },
    { pass: commercial.prices, weight: 3, comment: commercial.prices ? "цены видны" : "цен не видно" },
  ];
  if (!commercial.phone) {
    findings.push(mk("phone", "high", "Коммерческие факторы", "На сайте не найден телефон", "Яндекс ранжирует коммерческие страницы по витринным факторам; без телефона дорога в товарную выдачу закрыта.", "Добавьте телефон (+мессенджер-виджет) в футер и на ключевые страницы; сверьте с Яндекс.Бизнес.", "Позиции по коммерческим запросам, 2–6 нед"));
  }
  if (!commercial.innOrOgrn) {
    findings.push(mk("inn", "medium", "Коммерческие факторы", "Не найдены ИНН/ОГРН", "Доверие и «Информация о сайте» в Вебмастере.", "Укажите реквизиты на странице «О компании»/в футере.", "Снимок Вебмастера, 2–4 нед"));
  }
  if (!commercial.address) {
    findings.push(mk("address", "medium", "Коммерческие факторы", "Не найден адрес", "Региональность и NAP-консистентность с Яндекс.Бизнес.", "Адрес (город, улица) на сайте и в Яндекс.Бизнес должны совпадать.", "Запросы «город + услуга», 1–3 нед"));
  }

  // ---------- GEO/AI ----------
  const llms = await statusOf(`${origin}/llms.txt`, 8_000);
  const aiBotsAllowed = robots.aiBotsBanned.filter((b) => b !== "YandexBot").length === 0;
  const faqLike = /(<h[23][^>]*>[^<]{0,120}\?|частые вопросы|вопрос[ыи] и ответ|FAQ)/i.test(homeHtml);
  const geo = { llmsTxt: llms === 200, aiBotsAllowed, faqLike };
  checks.geoBlock = [
    { pass: aiBotsAllowed, weight: 5, comment: aiBotsAllowed ? "AI-боты не запрещены" : `запрещены: ${robots.aiBotsBanned.join(", ")}` },
    { pass: geo.llmsTxt ? true : null, weight: 3, comment: geo.llmsTxt ? "llms.txt есть" : "llms.txt нет" },
    { pass: faqLike ? true : null, weight: 2, comment: faqLike ? "FAQ-контент есть" : "" },
  ];
  if (!aiBotsAllowed) {
    findings.push(mk("ai-bots", "high", "GEO/AI", `AI-боты закрыты в robots: ${robots.aiBotsBanned.join(", ")}`, "Модели не смогут читать сайт — вас не будет в их ответах.", "Откройте GPTBot/ClaudeBot/PerplexityBot (Allow: /), если нет причин закрывать.", "Упоминания бренда в ответах моделей, 2–6 нед"));
  }
  if (!geo.llmsTxt) {
    findings.push(mk("llms", "low", "GEO/AI", "Нет /llms.txt", "Краткая карта сайта для LLM помогает цитируемости.", "Опишите структуру и цены в llms.txt по спецификации.", "—"));
  }

  // ---------- Скоринг по методике seo-ru ----------
  function blockScore(cs: CheckResult[]) {
    const scored = cs.filter((c) => c.pass !== null);
    if (!scored.length) return null;
    const wSum = scored.reduce((s, c) => s + c.weight, 0);
    const wGot = scored.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
    return Math.round((wGot / wSum) * 100);
  }

  const idxChecks = [...checks.robots, ...checks.sitemap, ...checks.redirects, ...checks.notFound404];
  const googleBlocks: BlockScore[] = [
    { engine: "google", block: "Индексация (sitemap, robots, дубли)", weight: 25, score: blockScore(idxChecks) ?? 50, comment: `${locs.length} URL в sitemap` },
    { engine: "google", block: "Скорость (TTFB)", weight: 20, score: blockScore(checks.speed) ?? 50, comment: `средний ${avgTtfb} мс` },
    { engine: "google", block: "Контент и структура", weight: 20, score: blockScore(checks.onpage) ?? 50, comment: `title ${title.length}, H1 ×${homepage.h1Count}` },
    { engine: "google", block: "Schema.org", weight: 15, score: blockScore(checks.schemaBlock) ?? 50, comment: schemaTypes.slice(0, 4).join(", ") || "нет" },
    { engine: "google", block: "Мобильная версия", weight: 10, score: viewportOk ? 100 : 30, comment: viewportOk ? "viewport корректный" : "viewport отсутствует" },
    { engine: "google", block: "Безопасность (HTTPS, заголовки)", weight: 10, score: blockScore(checks.security) ?? 50, comment: headers.hsts ? "HSTS есть" : "HSTS нет" },
  ];

  const behaviorComment =
    opts.bounceRate !== undefined
      ? `отказы ${opts.bounceRate}% (Метрика)`
      : "не проверено: подключите Метрику";
  const behaviorScore =
    opts.bounceRate === undefined ? 50 : opts.bounceRate < 40 ? 85 : opts.bounceRate < 55 ? 60 : 40;
  const yandexBlocks: BlockScore[] = [
    { engine: "yandex", block: "Индексация (robots, Вебмастер)", weight: 20, score: blockScore(idxChecks) ?? 50, comment: robots.cleanParam ? "Clean-param есть" : "Clean-param нет" },
    { engine: "yandex", block: "Коммерческие факторы", weight: 20, score: Math.round((commercialScore / 6) * 100), comment: `${commercialScore} из 6 факторов` },
    { engine: "yandex", block: "Поведенческие (Метрика)", weight: 15, score: behaviorScore, comment: behaviorComment },
    { engine: "yandex", block: "Контент и ИКС-факторы", weight: 15, score: blockScore(checks.onpage) ?? 50, comment: `текст главной ~${Math.round(plain.length / 1000)} тыс. знаков` },
    { engine: "yandex", block: "Скорость для бота", weight: 10, score: blockScore(checks.speed) ?? 50, comment: `средний ${avgTtfb} мс` },
    { engine: "yandex", block: "Регион и NAP", weight: 10, score: Math.round(((commercial.address ? 1 : 0) + (commercial.phone ? 1 : 0) + (commercial.address && commercial.phone ? 1 : 0)) / 3 * 100), comment: commercial.address && commercial.phone ? "адрес и телефон есть" : "NAP неполный" },
  ];

  const googleScore = Math.round(googleBlocks.reduce((s, b) => s + (b.score * b.weight) / 100, 0));
  const yandexScore = Math.round(yandexBlocks.reduce((s, b) => s + (b.score * b.weight) / 100, 0));

  const sevRank: Record<AuditSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

  return {
    site: origin,
    startedAt,
    durationMs: Date.now() - t0,
    googleScore,
    yandexScore,
    blocks: [...googleBlocks, ...yandexBlocks],
    findings,
    facts: {
      robots,
      sitemap,
      redirects: { httpToHttps, wwwResolve, note: `http: ${httpStatus ?? "—"}, www: ${wwwStatus ?? "—"}` },
      notFound,
      speed: { pages: speedPages, avgTtfbMs: avgTtfb },
      homepage,
      headers,
      commercial,
      geo,
    },
    note: "Аудит по методике seo-ru: HTML читается без выполнения JavaScript; поведенческий блок Яндекса считается по отказам из Метрики, если счётчик подключён.",
  };
}

function mk(
  id: string,
  severity: AuditSeverity,
  area: string,
  title: string,
  detail: string,
  fix: string,
  watch: string
): SiteFinding {
  return { id, severity, area, title, detail, fix, watch };
}

export type RobotsRules = { disallow: string[]; allow: string[] };

/** Разбор robots.txt на блоки User-agent → правила. */
/** Разбор robots.txt на блоки User-agent → правила. */
export function parseRobots(text: string): Record<string, RobotsRules[]> {
  const blocks: Record<string, RobotsRules[]> = {};
  let currentAgents: string[] = [];
  let current: RobotsRules | null = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^(user-agent|disallow|allow|clean-param|sitemap|host)\s*:\s*(.*)$/i);
    if (!m) continue;
    const [, keyRaw, value] = m;
    const key = keyRaw.toLowerCase();
    if (key === "user-agent") {
      // подряд идущие User-agent относятся к одному и тому же блоку правил
      if (current && currentAgents.length && (current.disallow.length || current.allow.length)) {
        for (const a of currentAgents) pushRule(blocks, a, current);
        current = { disallow: [], allow: [] };
        currentAgents = [value.trim().toLowerCase()];
      } else {
        current = current || { disallow: [], allow: [] };
        currentAgents.push(value.trim().toLowerCase());
      }
    } else if (current) {
      if (key === "disallow") current.disallow.push(value.trim());
      if (key === "allow") current.allow.push(value.trim());
    }
  }
  if (current && currentAgents.length) {
    for (const a of currentAgents) pushRule(blocks, a, current);
  }
  return blocks;
}

function pushRule(blocks: Record<string, RobotsRules[]>, agent: string, rule: RobotsRules) {
  blocks[agent] = blocks[agent] || [];
  blocks[agent].push(rule);
}
