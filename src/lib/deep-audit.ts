import { analyze } from "./humanizer";

const UA = "InsontAudit/1.0 (+https://insont.ru)";

export type DeepPage = {
  url: string;
  status: number;
  ms: number;
  words: number;
  h1: number;
  h2: number;
  questions: number;
  tables: number;
  noindex: boolean;
  canonical: string;
  schema: string[];
  humanHits: number;
  firstParagraphWords: number;
  titleLen: number;
  descLen: number;
};

export type DeepAction = {
  priority: "P0" | "P1" | "P2";
  title: string;
  evidence: string;
  action: string;
  verify: string;
};

export type DeepAudit = {
  pages: DeepPage[];
  summary: {
    pages: number;
    avgWords: number;
    thinPages: number;
    withoutH1: number;
    noindexPages: number;
    canonicalMismatch: number;
    humanHits: number;
    questionsPages: number;
    tablesPages: number;
    llms: { status: number; bytes: number };
    slowPages: number;
    avgMs: number;
    missingTitle: number;
    missingDesc: number;
    pagesWithSchema: number;
  };
  schema: { found: string[]; missing: string[] };
  cannibalization: { a: string; b: string; overlap: number }[];
  actions: DeepAction[];
};

const clean = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const heads = (html: string, t: string) => [...html.matchAll(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, "gi"))].map((m) => clean(m[1])).filter(Boolean);
const ldTypes = (html: string) => {
  const found = new Set<string>();
  const walk = (v: unknown) => {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o["@type"] === "string") found.add(o["@type"] as string);
      Object.values(o).forEach(walk);
    }
  };
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(m[1])); } catch { /* ignore */ }
  }
  return [...found];
};

async function get(url: string) {
  const t0 = performance.now();
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xml" }, redirect: "follow", signal: AbortSignal.timeout(12_000) });
    const body = await res.text();
    return { url, status: res.status, body, ms: Math.round(performance.now() - t0) };
  } catch {
    return { url, status: 0, body: "", ms: Math.round(performance.now() - t0) };
  }
}

async function sitemapUrls(origin: string): Promise<string[]> {
  for (const path of ["/sitemap.xml", "/wp-sitemap.xml", "/sitemap_index.xml"]) {
    const r = await get(origin + path);
    if (r.status !== 200 || !r.body.includes("<loc>")) continue;
    const locs = [...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const isIndex = r.body.includes("<sitemapindex");
    if (!isIndex) return locs;
    const out: string[] = [];
    for (const sm of locs.slice(0, 4)) {
      const sub = await get(sm);
      out.push(...[...sub.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
      await new Promise((res) => setTimeout(res, 250));
    }
    if (out.length) return out;
  }
  return [];
}

const tokens = (s: string) => new Set(s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter((w) => w.length > 3));

/** Полный аудит: контент, humanizer, каннибализация, schema, AEO. Только измеренное. */
export async function deepAudit(rawSite: string, opts: { maxPages?: number; onPage?: (page: DeepPage, index: number, total: number) => void } = {}): Promise<DeepAudit> {
  const origin = new URL(rawSite.match(/^https?:\/\//i) ? rawSite : `https://${rawSite}`).origin;
  const maxPages = Math.min(Math.max(opts.maxPages ?? 60, 3), 200);

  const sitemap = await sitemapUrls(origin);
  const pool = [...new Set(sitemap)].filter((u) => !/\.(jpg|jpeg|png|webp|svg|pdf|xml|zip)$/i.test(u));
  const sample = [origin + "/", ...pool.filter((u) => u.replace(/\/$/, "") !== origin).slice(0, maxPages - 1)];

  const pages: DeepPage[] = [];

  async function probe(url: string): Promise<DeepPage> {
    const r = await get(url);
    if (r.status !== 200) {
      return { url, status: r.status, ms: r.ms, words: 0, h1: 0, h2: 0, questions: 0, tables: 0, noindex: false, canonical: "", schema: [], humanHits: 0, firstParagraphWords: 0, titleLen: 0, descLen: 0 };
    }
    const text = clean(r.body);
    const h2 = heads(r.body, "h2");
    const paras = [...r.body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => clean(m[1])).filter((t) => t.length > 40);
    const title = (r.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";
    const desc = (r.body.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || [])[1] || "";
    return {
      url,
      status: r.status,
      ms: r.ms,
      words: text.split(/\s+/).filter(Boolean).length,
      h1: heads(r.body, "h1").length,
      h2: h2.length,
      questions: h2.filter((h) => h.includes("?")).length,
      tables: (r.body.match(/<table/gi) || []).length,
      noindex: /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(r.body),
      canonical: (r.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1] || "",
      schema: ldTypes(r.body),
      humanHits: analyze(text, false).totalHits,
      firstParagraphWords: (paras[0] || "").split(/\s+/).filter(Boolean).length,
      titleLen: clean(title).length,
      descLen: clean(desc).length,
    };
  }

  // Параллельно по 5 страниц: 200 URL укладываются в минуту вместо часа.
  const BATCH = 5;
  for (let i = 0; i < sample.length; i += BATCH) {
    const chunk = await Promise.all(sample.slice(i, i + BATCH).map(probe));
    for (const page of chunk) {
      pages.push(page);
      opts.onPage?.(page, pages.length, sample.length);
    }
    await new Promise((res) => setTimeout(res, 250));
  }

  const ok = pages.filter((p) => p.status === 200);
  const words = ok.map((p) => p.words).sort((a, b) => a - b);
  const avgWords = words.length ? Math.round(words.reduce((s, n) => s + n, 0) / words.length) : 0;

  const cannibalization: DeepAudit["cannibalization"] = [];
  for (let i = 0; i < ok.length; i++) {
    for (let j = i + 1; j < ok.length; j++) {
      const a = tokens(ok[i].url + " " + ok[i].schema.join(" "));
      const b = tokens(ok[j].url + " " + ok[j].schema.join(" "));
      if (!a.size || !b.size) continue;
      const inter = [...a].filter((w) => b.has(w)).length;
      const union = new Set([...a, ...b]).size;
      const overlap = Math.round((inter / union) * 100);
      if (overlap >= 45) cannibalization.push({ a: ok[i].url, b: ok[j].url, overlap });
    }
  }

  const found = [...new Set(ok.flatMap((p) => p.schema))];
  const wanted = ["Organization", "WebSite", "BreadcrumbList", "Article", "Product", "Offer", "FAQPage"];
  const missing = wanted.filter((t) => !found.includes(t));

  const llms = await get(origin + "/llms.txt");
  const humanHits = ok.reduce((s, p) => s + p.humanHits, 0);
  const thin = ok.filter((p) => p.words < 300).length;
  const noH1 = ok.filter((p) => p.h1 !== 1).length;
  const noindex = ok.filter((p) => p.noindex).length;
  const canonMismatch = ok.filter((p) => p.canonical && p.canonical.replace(/\/$/, "") !== p.url.replace(/\/$/, "")).length;

  const actions: DeepAction[] = [];
  if (avgWords > 0 && thin > 0) actions.push({ priority: "P1", title: `Тонкие страницы: ${thin}`, evidence: `${thin} из ${ok.length} проверенных страниц короче 300 слов`, action: "Дополнить фактами, цифрами и таблицей или склеить с релевантной страницей", verify: "Повторный аудит: thinPages = 0" });
  if (noH1 > 0) actions.push({ priority: "P1", title: `H1 не один: ${noH1} страниц`, evidence: `У ${noH1} страниц H1 отсутствует или их несколько`, action: "Оставить один H1, остальные понизить до H2", verify: "Повторный аудит: withoutH1 = 0" });
  if (noindex > 0) actions.push({ priority: "P0", title: `noindex на ${noindex} страницах`, evidence: `Мета robots закрывает ${noindex} из ${ok.length} страниц`, action: "Снять noindex, если страница должна ранжироваться", verify: "Проверка HTML и «Страницы в поиске»" });
  if (canonMismatch > 0) actions.push({ priority: "P1", title: `Canonical не на себя: ${canonMismatch}`, evidence: `Canonical указывает на другой URL у ${canonMismatch} страниц`, action: "Проверить, какая версия главная, и выставить самоканоникл", verify: "Повторный аудит: canonicalMismatch = 0" });
  if (humanHits > 0) actions.push({ priority: "P1", title: `ИИ-паттерны: ${humanHits}`, evidence: `Проверка текста нашла ${humanHits} шаблонов на ${ok.length} страницах`, action: "Прогнать проверку текста, убрать шаблоны и тире", verify: "Повторный аудит: humanHits = 0" });
  if (missing.includes("FAQPage") && ok.some((p) => p.questions > 0)) actions.push({ priority: "P2", title: "FAQPage для страниц с вопросами", evidence: `Вопросы в H2 есть у ${ok.filter((p) => p.questions > 0).length} страниц, FAQPage нет`, action: "Добавить FAQPage JSON-LD с этими вопросами", verify: "Rich Results Test" });
  if (llms.status !== 200) actions.push({ priority: "P2", title: "llms.txt отсутствует", evidence: `GET /llms.txt → ${llms.status}`, action: "Сгенерировать llms.txt по sitemap", verify: "GET /llms.txt → 200" });
  const slow = ok.filter((p) => p.ms > 800).length;
  if (slow > 0) actions.push({ priority: "P1", title: `Медленные страницы: ${slow}`, evidence: `${slow} из ${ok.length} страниц отвечают дольше 800 мс (среднее ${Math.round(ok.reduce((s2, p) => s2 + p.ms, 0) / Math.max(ok.length, 1))} мс)`, action: "Включить кэш и проверить тяжёлые запросы к БД", verify: "Повторный аудит: slowPages = 0" });
  if (ok.some((p) => p.titleLen === 0)) actions.push({ priority: "P1", title: `Без title: ${ok.filter((p) => p.titleLen === 0).length}`, evidence: `У ${ok.filter((p) => p.titleLen === 0).length} страниц нет title`, action: "Прописать уникальный title с ключом", verify: "Повторный аудит: missingTitle = 0" });
  if (ok.some((p) => p.descLen === 0)) actions.push({ priority: "P2", title: `Без description: ${ok.filter((p) => p.descLen === 0).length}`, evidence: `У ${ok.filter((p) => p.descLen === 0).length} страниц нет description`, action: "Добавить описание 70–160 символов", verify: "Повторный аудит: missingDesc = 0" });
  if (cannibalization.length) actions.push({ priority: "P0", title: `Каннибализация: ${cannibalization.length} пар`, evidence: cannibalization.slice(0, 3).map((c) => `${c.a} ↔ ${c.b} (${c.overlap}%)`).join("; "), action: "Оставить сильный URL, второй — 301, уникальное перенести", verify: "В Вебмастере по запросу один URL" });

  return {
    pages,
    summary: { pages: ok.length, avgWords, thinPages: thin, withoutH1: noH1, noindexPages: noindex, canonicalMismatch: canonMismatch, humanHits, questionsPages: ok.filter((p) => p.questions > 0).length, tablesPages: ok.filter((p) => p.tables > 0).length, llms: { status: llms.status, bytes: llms.body.length }, slowPages: ok.filter((p) => p.ms > 800).length, avgMs: ok.length ? Math.round(ok.reduce((s2, p) => s2 + p.ms, 0) / ok.length) : 0, missingTitle: ok.filter((p) => p.titleLen === 0).length, missingDesc: ok.filter((p) => p.descLen === 0).length, pagesWithSchema: ok.filter((p) => p.schema.length > 0).length },
    schema: { found, missing },
    cannibalization,
    actions,
  };
}
