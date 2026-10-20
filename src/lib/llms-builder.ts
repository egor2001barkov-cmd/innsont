/**
 * Генератор llms.txt по реальному обходу сайта: robots → sitemap → страницы,
 * вытягиваем title/description/H1, группируем по разделам, добавляем факты.
 */

const UA =
  "Mozilla/5.0 (compatible; InsontLlmsBot/1.0; +https://insont.ru) AppleWebKit/537.36";

export type LlmsResult = {
  markdown: string;
  stats: { pagesScanned: number; urlsInSitemap: number; sections: string[]; skipped: number };
  warnings: string[];
};

type PageInfo = {
  url: string;
  path: string;
  title: string;
  description: string;
  section: string;
  depth: number;
};

function decode(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionOf(path: string): string {
  const p = path.toLowerCase();
  if (/^\/$/.test(p)) return "Главное";
  if (/(ceny|price|tseny|stoimost|tarif)/.test(p)) return "Цены";
  if (/(catalog|categor|katalog|shop|uslugi|service|uslug)/.test(p)) return "Услуги и каталог";
  if (/(product|tovar|item|card)/.test(p)) return "Товары и карточки";
  if (/(blog|stat|news|novost|guide|gaid|obzor|article)/.test(p)) return "Блог и гайды";
  if (/(case|keysy|portfolio|kejs|keys)/.test(p)) return "Кейсы";
  if (/(kontakt|contact|about|o-kompanii|kompaniya|oferta|politika|dostavka|oplata|faq|pomoshch)/.test(p)) {
    return "О компании и условия";
  }
  return "Страницы";
}

const SECTION_ORDER = [
  "Главное",
  "Услуги и каталог",
  "Товары и карточки",
  "Цены",
  "Блог и гайды",
  "Кейсы",
  "О компании и условия",
  "Страницы",
];

async function fetchText(url: string, timeoutMs = 12_000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xml,text/plain" },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function buildLlmsTxt(rawSite: string, maxPages = 50): Promise<LlmsResult | { error: string }> {
  const warnings: string[] = [];
  let origin: URL;
  try {
    origin = new URL(rawSite.trim().match(/^https?:\/\//i) ? rawSite.trim() : `https://${rawSite.trim()}`);
  } catch {
    return { error: "Некорректный адрес сайта" };
  }
  const homeUrl = origin.origin + "/";

  // robots → sitemap
  const robots = (await fetchText(origin.origin + "/robots.txt", 8_000)) || "";
  let sitemapUrls = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (!sitemapUrls.length) sitemapUrls = [origin.origin + "/sitemap.xml"];

  let locs: string[] = [];
  let lastmods = new Map<string, string>();
  for (const sm of sitemapUrls.slice(0, 3)) {
    if (locs.length >= maxPages * 4) break;
    let body = await fetchText(sm, 12_000);
    if (body && /<sitemapindex/i.test(body)) {
      // индексный файл — берём первые дочерние карты
      const children = [...body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim()).slice(0, 3);
      for (const child of children) {
        const cb = await fetchText(child, 12_000);
        if (cb) {
          const parsed = parseSitemap(cb, lastmods);
          locs = locs.concat(parsed);
        }
      }
    } else if (body) {
      locs = locs.concat(parseSitemap(body, lastmods));
    }
  }
  if (!locs.length) warnings.push("Sitemap не найден — проверен только корень сайта");

  // чистим и ограничиваем
  const seen = new Set<string>();
  const cleanUrls = locs.filter((u) => {
    try {
      const url = new URL(u);
      if (url.origin !== origin.origin) return false;
      if (/\.(pdf|jpg|jpeg|png|webp|gif|svg|zip|xml|css|js|ico|mp4)$/i.test(url.pathname)) return false;
      if (url.search) return false;
      const key = url.origin + url.pathname.replace(/\/$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    } catch {
      return false;
    }
  });
  // корень первым, дальше — мелкие пути (глубина растёт), лимит; дубли корня отбрасываем
  cleanUrls.sort((a, b) => depthOf(a) - depthOf(b));
  const homeNorm = homeUrl.replace(/\/$/, "");
  const selected = [homeUrl, ...cleanUrls.filter((u) => u.replace(/\/$/, "") !== homeNorm)].slice(0, maxPages);

  // обходим страницы с конкурентностью 6
  const pages: PageInfo[] = [];
  let skipped = 0;
  const queue = [...selected];
  async function worker() {
    while (queue.length) {
      const url = queue.shift()!;
      const html = (await fetchText(url, 10_000)) || "";
      if (!html) {
        skipped++;
        return;
      }
      const path = (() => {
        try {
          return new URL(url).pathname;
        } catch {
          return "/";
        }
      })();
      const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
      const description = decode(
        html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
          html.match(/<meta\s+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] || ""
      );
      const h1 = decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "").replace(/<[^>]+>/g, " "));
      if (!title && !description && !h1) {
        skipped++;
        return;
      }
      pages.push({
        url,
        path: path === "/" ? "/" : path.replace(/\/$/, ""),
        title: (title || h1 || path).slice(0, 90),
        description: (description || h1 || "").slice(0, 150),
        section: sectionOf(path),
        depth: depthOf(url),
      });
    }
  }
  await Promise.all(Array.from({ length: 6 }, () => worker()));
  pages.sort((a, b) => a.depth - b.depth || a.url.localeCompare(b.url));

  const home = pages.find((p) => p.path === "/") || pages[0];
  const siteName = home
    ? home.title.split(/[|—–-]/)[0].trim() || origin.hostname
    : origin.hostname;

  // факты с главной: телефон, почта, цены
  const homeHtml = home ? await fetchText(home.url, 8_000) : null;
  const facts: string[] = [];
  if (homeHtml) {
    const text = decode(homeHtml.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " "));
    const phone = text.match(/(\+7|8)[\s(-]?\d{3}[\s)]?-?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}/);
    if (phone) facts.push(`Телефон: ${phone[0].trim()}`);
    const email = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    if (email) facts.push(`Почта: ${email[0]}`);
    if (/₽|руб\.|руб\b/i.test(text)) facts.push("Цены указаны на сайте в рублях");
  }

  // сборка файла
  const lines: string[] = [`# ${siteName}`, ""];
  lines.push(`> ${(home?.description || `${siteName}: сайт ${origin.hostname}`).slice(0, 220)}`);
  lines.push("");
  for (const section of SECTION_ORDER) {
    const items = pages.filter((p) => p.section === section);
    if (!items.length) continue;
    lines.push(`## ${section === "Главное" ? "Главное" : section}`);
    lines.push("");
    for (const p of items) {
      const desc = p.description && p.description !== p.title ? `: ${p.description}` : "";
      lines.push(`- [${p.title}](${p.url})${desc}`);
    }
    lines.push("");
  }
  if (facts.length) {
    lines.push("## Факты", "");
    for (const f of facts) lines.push(`- ${f}`);
    lines.push("");
  }
  lines.push(`<!-- Сгенерировано INSONT (insont.ru) по sitemap: ${pages.length} страниц, ${new Date().toISOString().slice(0, 10)} -->`);

  return {
    markdown: lines.join("\n"),
    stats: {
      pagesScanned: pages.length,
      urlsInSitemap: cleanUrls.length,
      sections: SECTION_ORDER.filter((s) => pages.some((p) => p.section === s)),
      skipped,
    },
    warnings,
  };
}

function depthOf(url: string) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).length;
  } catch {
    return 9;
  }
}

function parseSitemap(body: string, lastmods: Map<string, string>): string[] {
  const entries = [...body.matchAll(/<url>([\s\S]*?)<\/url>/gi)];
  if (entries.length) {
    const locs: string[] = [];
    for (const e of entries) {
      const loc = e[1].match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim();
      const lm = e[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim();
      if (loc) {
        locs.push(loc);
        if (lm) lastmods.set(loc, lm);
      }
    }
    return locs;
  }
  return [...body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
}
