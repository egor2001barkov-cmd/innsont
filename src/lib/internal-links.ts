const UA = "InsontLinks/1.0 (+https://insont.ru)";

export type InternalLinkEdge = { from: string; to: string; anchor: string };

export type InternalLinksAudit = {
  site: string;
  pagesScanned: number;
  pagesFoundInSitemap: number;
  linksFound: number;
  navigationLinks: number;
  contextualLinks: number;
  orphans: string[];
  lowIncoming: { url: string; incoming: number }[];
  topTargets: { url: string; incoming: number }[];
  anchors: { anchor: string; count: number }[];
  suggestions: { target: string; donor: string; reason: string }[];
  notes: string[];
};

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xml,text/plain" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function normalizeUrl(raw: string, base: string): string | null {
  try {
    const url = new URL(raw, base);
    if (!/^https?:$/.test(url.protocol)) return null;
    url.hash = "";
    url.search = "";
    let path = url.pathname.replace(/\/+$/, "");
    if (path === "") path = "/";
    return url.origin + path;
  } catch {
    return null;
  }
}

function extractLinks(html: string, base: string): { to: string; anchor: string }[] {
  const out: { to: string; anchor: string }[] = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const to = normalizeUrl(m[1], base);
    if (!to) continue;
    const anchor = m[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
    out.push({ to, anchor });
  }
  return out;
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Аудит внутренней перелинковки по живому сайту: sitemap → страницы → ссылки.
 * Навигационные ссылки (встречаются почти на всех страницах) отделяются от
 * контекстных: иначе меню и футер создают ложную картину «всё перелинковано».
 */
export async function auditInternalLinks(
  rawSite: string,
  opts: { maxPages?: number } = {},
): Promise<InternalLinksAudit | { error: string }> {
  let origin: string;
  try {
    const url = new URL(rawSite.trim().match(/^https?:\/\//i) ? rawSite.trim() : `https://${rawSite.trim()}`);
    origin = url.origin;
  } catch {
    return { error: "Некорректный адрес сайта" };
  }

  const maxPages = Math.min(Math.max(opts.maxPages ?? 40, 5), 100);
  const notes: string[] = [];

  const sitemap = await fetchText(`${origin}/sitemap.xml`);
  let urls: string[] = sitemap
    ? [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
        .map((m) => normalizeUrl(m[1].trim(), origin))
        .filter((u): u is string => Boolean(u) && u!.startsWith(origin))
    : [];

  if (urls.length === 0) {
    notes.push("sitemap.xml не найден или пуст — стартовали с главной страницы");
    urls = [origin + "/"];
  }

  const unique = [...new Set(urls)];
  const pagesVisited = unique.slice(0, maxPages);
  if (unique.length > maxPages) {
    notes.push(`В sitemap ${unique.length} URL, проверены первые ${maxPages}: увеличьте maxPages для полного обхода`);
  }

  const fetched = await pool(pagesVisited, 6, async (pageUrl) => ({
    url: pageUrl,
    html: await fetchText(pageUrl),
  }));

  const pages = fetched.filter((p): p is { url: string; html: string } => Boolean(p.html));
  if (pages.length === 0) {
    return { error: "Не удалось загрузить ни одной страницы сайта" };
  }

  const edges: InternalLinkEdge[] = [];
  const targetsOnPage = new Map<string, Set<string>>();

  for (const page of pages) {
    const seen = new Set<string>();
    const links = extractLinks(page.html, page.url).filter((l) => l.to.startsWith(origin));
    for (const link of links) {
      if (seen.has(link.to)) continue;
      seen.add(link.to);
      edges.push({ from: page.url, to: link.to, anchor: link.anchor });
    }
    targetsOnPage.set(page.url, seen);
  }

  const navThreshold = Math.max(2, Math.ceil(pages.length * 0.8));
  const perTarget = new Map<string, number>();
  for (const edge of edges) {
    perTarget.set(edge.to, (perTarget.get(edge.to) || 0) + 1);
  }

  const navigation = new Set<string>();
  for (const [target, count] of perTarget) {
    if (count >= navThreshold) navigation.add(target);
  }

  const contextual = edges.filter((e) => !navigation.has(e.to) && e.from !== e.to);

  const incoming = new Map<string, number>();
  for (const edge of contextual) {
    incoming.set(edge.to, (incoming.get(edge.to) || 0) + 1);
  }

  const scanned = new Set(pages.map((p) => p.url));
  const orphans = [...scanned].filter((u) => !incoming.has(u));
  const lowIncoming = [...incoming.entries()]
    .filter(([u, n]) => scanned.has(u) && n === 1)
    .map(([url, n]) => ({ url, incoming: n }));

  const topTargets = [...incoming.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([url, n]) => ({ url, incoming: n }));

  const anchorsMap = new Map<string, number>();
  for (const edge of contextual) {
    const key = edge.anchor.toLowerCase().trim();
    if (!key) continue;
    anchorsMap.set(key, (anchorsMap.get(key) || 0) + 1);
  }
  const anchors = [...anchorsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([anchor, count]) => ({ anchor, count }));

  // Эвристика, не редакционное решение: донором предлагаем страницу того же
  // раздела с наибольшим числом исходящих ссылок, которая ещё не ссылается на цель.
  const outgoingByPage = new Map<string, number>();
  for (const edge of contextual) {
    outgoingByPage.set(edge.from, (outgoingByPage.get(edge.from) || 0) + 1);
  }

  const suggestions: { target: string; donor: string; reason: string }[] = [];
  for (const target of orphans.slice(0, 15)) {
    const prefix = target.replace(origin, "").split("/").filter(Boolean)[0] || "";
    const candidates = [...outgoingByPage.entries()]
      .filter(([page]) => page !== target)
      .filter(([page]) => {
        const pagePrefix = page.replace(origin, "").split("/").filter(Boolean)[0] || "";
        return prefix === "" ? true : pagePrefix === prefix;
      })
      .sort((a, b) => b[1] - a[1]);
    const donor = candidates[0]?.[0];
    if (!donor) continue;
    suggestions.push({
      target,
      donor,
      reason: prefix
        ? `Тот же раздел «/${prefix}», у донора больше всего контекстных ссылок`
        : "Раздел не определён — предложен донор с наибольшим числом ссылок",
    });
  }

  return {
    site: origin,
    pagesScanned: pages.length,
    pagesFoundInSitemap: unique.length,
    linksFound: edges.length,
    navigationLinks: edges.length - contextual.length,
    contextualLinks: contextual.length,
    orphans,
    lowIncoming,
    topTargets,
    anchors,
    suggestions,
    notes,
  };
}
