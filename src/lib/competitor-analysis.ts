/**
 * Лёгкий профиль сайта для сравнения с конкурентами: реальными замерами
 * по живому HTTP — без выдуманных оценок.
 */

const UA =
  "Mozilla/5.0 (compatible; InsontAudit/1.0; +https://insont.ru) AppleWebKit/537.36 Chrome/128 Safari/537.36";

export type SiteProfile = {
  site: string;
  ok: boolean;
  statusCode: number | null;
  https: boolean;
  ttfbMs: number;
  title: string;
  titleLen: number;
  descriptionLen: number;
  h1Count: number;
  schemaTypes: string[];
  htmlKb: number;
  sitemapUrls: number;
  lastmodNewest: string;
  llmsTxt: boolean;
  aiBotsAllowed: boolean | null;
  phone: boolean;
  prices: boolean;
  blogPages: number;
  error?: string;
};

async function fetchWithTtfb(url: string, timeoutMs = 12_000) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,text/plain,application/xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await res.text().catch(() => "");
    return { res, body, ttfbMs: Date.now() - t0 };
  } catch (e) {
    return { res: null, body: "", ttfbMs: Date.now() - t0, error: e instanceof Error ? e.message : "сеть" };
  }
}

function decode(s: string) {
  return s.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export async function profileSite(rawSite: string): Promise<SiteProfile> {
  let url: URL;
  try {
    url = new URL(rawSite.trim().match(/^https?:\/\//i) ? rawSite.trim() : `https://${rawSite.trim()}`);
  } catch {
    return {
      site: rawSite,
      ok: false,
      statusCode: null,
      https: false,
      ttfbMs: 0,
      title: "",
      titleLen: 0,
      descriptionLen: 0,
      h1Count: 0,
      schemaTypes: [],
      htmlKb: 0,
      sitemapUrls: 0,
      lastmodNewest: "",
      llmsTxt: false,
      aiBotsAllowed: null,
      phone: false,
      prices: false,
      blogPages: 0,
      error: "Некорректный адрес",
    };
  }
  const origin = url.origin;

  const [home, robotsRaw, llmsRaw] = await Promise.all([
    fetchWithTtfb(origin + "/"),
    fetchWithTtfb(origin + "/robots.txt", 8_000),
    fetchWithTtfb(origin + "/llms.txt", 6_000),
  ]);
  const html = home.body?.slice(0, 400_000) || "";
  const robots = robotsRaw.res?.ok ? robotsRaw.body.slice(0, 30_000) : "";

  // sitemap: из robots или стандартный путь
  let sitemapUrls = 0;
  let lastmodNewest = "";
  let blogPages = 0;
  const smUrl = robots.match(/^sitemap:\s*(\S+)/im)?.[1] || `${origin}/sitemap.xml`;
  const sm = await fetchWithTtfb(smUrl, 10_000);
  if (sm.res?.ok && /<urlset|<sitemapindex/i.test(sm.body || "")) {
    let body = sm.body;
    if (/<sitemapindex/i.test(body)) {
      const child = body.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim();
      if (child) {
        const cb = await fetchWithTtfb(child, 10_000);
        if (cb.res?.ok) body = cb.body;
      }
    }
    const paths = [...body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
    sitemapUrls = paths.length;
    lastmodNewest = [...body.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi)]
      .map((m) => m[1].trim().slice(0, 10))
      .sort()
      .pop() || "";
    blogPages = paths.filter((p) => /blog|stat|novost|guide/i.test(p)).length;
  }

  // AI-боты: не забанены ли в robots
  const banned = ["GPTBot", "ClaudeBot", "PerplexityBot"].filter((bot) => {
    const block = robots.match(new RegExp(`user-agent:\\s*${bot}[\\s\\S]*?(?=\\n\\s*user-agent:|$)`, "i"))?.[0] || "";
    return /disallow:\s*\/\s*$/im.test(block);
  });
  const aiBotsAllowed = robots ? banned.length === 0 : null;

  const text = decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " "));
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");

  return {
    site: origin,
    ok: Boolean(home.res?.ok),
    statusCode: home.res?.status ?? null,
    https: origin.startsWith("https://"),
    ttfbMs: home.ttfbMs,
    title: title.slice(0, 120),
    titleLen: title.length,
    descriptionLen: decode(
      html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || ""
    ).length,
    h1Count: (html.match(/<h1[\s>]/gi) || []).length,
    schemaTypes: [...new Set([...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]))].slice(0, 8),
    htmlKb: Math.round(html.length / 1024),
    sitemapUrls,
    lastmodNewest,
    llmsTxt: llmsRaw.res?.status === 200,
    aiBotsAllowed,
    phone: /(\+7|8)[\s(-]?\d{3}[\s)]?-?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}/.test(text),
    prices: /(₽|руб\.|цена|стоимость|тариф)/i.test(text),
    blogPages,
    error: home.error,
  };
}

export async function compareSites(sites: string[], max = 6): Promise<SiteProfile[]> {
  const list = sites.map((s) => s.trim()).filter(Boolean).slice(0, max);
  return Promise.all(list.map((s) => profileSite(s)));
}
