const UA = "InsontLinks/1.0 (+https://insont.ru)";

export type InternalLinkEdge = { from: string; to: string; anchor: string };

export type InternalLinksAudit = {
  site: string;
  /** Оценка структуры /100 по методике скилла internal-linking */
  score: number;
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

  // Оценка структуры /100 (скилл internal-linking): −10 сирота, −5 важная глубже
  // 3 кликов, −5 без контекстных входящих, −10 остров; пол 0.
  let penalty = 0;
  penalty += orphans.length * 10;
  const noIncoming = [...scanned].filter((u) => !incoming.has(u)).length;
  penalty += Math.max(0, noIncoming - orphans.length) * 5;
  const sections = new Map<string, Set<string>>();
  for (const p of pages) {
    const key = p.url.replace(origin, "").split("/").filter(Boolean).slice(0, 1).join("/") || "/";
    if (!sections.has(key)) sections.set(key, new Set());
    sections.get(key)!.add(p.url);
  }
  for (const [sec, set] of sections) {
    if (set.size < 2 || sec === "/") continue;
    let internal = 0;
    for (const e of contextual) {
      const fromSec = e.from.replace(origin, "").split("/").filter(Boolean).slice(0, 1).join("/") || "/";
      const toSec = e.to.replace(origin, "").split("/").filter(Boolean).slice(0, 1).join("/") || "/";
      if (fromSec === sec && toSec === sec) internal++;
    }
    if (internal === 0) penalty += 10;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    site: origin,
    score,
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

// ─── Кампания по скиллу internal-linking ────────────────────────────────────
// Анкор = ДОСЛОВНАЯ подстрока текста донора (не выдумывается), гейт валидации:
// донор ещё не ссылается на цель; ≤3 ссылок с донора; ≤3 входящих предложений
// на цель; один анкор ≤2 раз на кампанию; анкор вне существующих ссылок.

export type CampaignLink = {
  donor: string;
  anchor: string;
  target: string;
  targetTitle: string;
  reason: string;
};

export type LinkCampaign = {
  site: string;
  targetsConsidered: number;
  links: CampaignLink[];
  rejected: { target: string; reason: string }[];
  anchorsUsed: { anchor: string; count: number }[];
};

function bodyText(html: string): string {
  return html
    .replace(/<(nav|header|footer|aside|script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleOf(html: string, fallbackUrl: string): string {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    ?.replace(/\s*[|—–-]\s*[^|—–-]*$/u, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t && t.length > 3) return t.slice(0, 140);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, " ")?.trim();
  return (h1 || fallbackUrl).slice(0, 140);
}

/** Кандидаты анкоров: словосочетания 2–4 слова из заголовка цели,
 *  которые ДОСЛОВНО встречаются в тексте донора (регистронезависимо). */
function anchorCandidates(targetTitle: string, donorBody: string): string[] {
  const words = targetTitle
    .toLowerCase()
    .split(/[^a-zа-яё0-9]+/i)
    .filter((w) => w.length >= 4);
  const phrases: string[] = [];
  for (let n = 4; n >= 2; n--) {
    for (let i = 0; i + n <= words.length; i++) {
      phrases.push(words.slice(i, i + n).join(" "));
    }
  }
  const lower = " " + donorBody.toLowerCase().replace(/\s+/g, " ") + " ";
  return phrases.filter((ph) => lower.includes(" " + ph + " "));
}

export async function buildLinkCampaign(
  rawSite: string,
  opts: { maxPages?: number; focusTargets?: string[] } = {},
): Promise<LinkCampaign | { error: string }> {
  const audit = await auditInternalLinks(rawSite, opts);
  if ("error" in audit) return audit;

  let origin: string;
  try {
    origin = new URL(rawSite.trim().match(/^https?:\/\//i) ? rawSite.trim() : `https://${rawSite.trim()}`).origin;
  } catch {
    return { error: "Некорректный адрес сайта" };
  }

  const sitemap = await fetchText(`${origin}/sitemap.xml`);
  const urls = sitemap
    ? [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
        .map((m) => normalizeUrl(m[1].trim(), origin))
        .filter((u): u is string => Boolean(u) && u!.startsWith(origin))
    : [origin + "/"];
  const unique = [...new Set(urls)].slice(0, Math.min(Math.max(opts.maxPages ?? 40, 5), 100));

  const fetched = await pool(unique, 6, async (pageUrl) => ({
    url: pageUrl,
    html: await fetchText(pageUrl),
  }));
  const pages = fetched.filter((p): p is { url: string; html: string } => Boolean(p.html));
  if (pages.length < 2) return { error: "Нужно минимум 2 читаемые страницы для кампании" };

  const titleByPage = new Map(pages.map((p) => [p.url, titleOf(p.html, p.url)]));
  const bodyByPage = new Map(pages.map((p) => [p.url, bodyText(p.html)]));

  // граф существующих контекстных ссылок
  const edges: InternalLinkEdge[] = [];
  for (const page of pages) {
    const seen = new Set<string>();
    for (const l of extractLinks(page.html, page.url).filter((x) => x.to.startsWith(origin))) {
      if (seen.has(l.to)) continue;
      seen.add(l.to);
      edges.push({ from: page.url, to: l.to, anchor: l.anchor });
    }
  }
  const perTarget = new Map<string, number>();
  for (const e of edges) perTarget.set(e.to, (perTarget.get(e.to) || 0) + 1);
  const navThreshold = Math.max(2, Math.ceil(pages.length * 0.8));
  const navigation = new Set<string>([...perTarget.entries()].filter(([, c]) => c >= navThreshold).map(([u]) => u));
  const contextual = edges.filter((e) => !navigation.has(e.to) && e.from !== e.to);
  const incoming = new Map<string, number>();
  const linkedFrom = new Map<string, Set<string>>();
  for (const e of contextual) {
    incoming.set(e.to, (incoming.get(e.to) || 0) + 1);
    if (!linkedFrom.has(e.to)) linkedFrom.set(e.to, new Set());
    linkedFrom.get(e.to)!.add(e.from);
  }
  const outgoingByPage = new Map<string, number>();
  for (const e of contextual) outgoingByPage.set(e.from, (outgoingByPage.get(e.from) || 0) + 1);

  // Цели (скилл: приоритет владельца → сироты → недосвязанные)
  const scanned = new Set(pages.map((p) => p.url));
  const orphanList = [...scanned].filter((u) => !incoming.has(u));
  const focus = (opts.focusTargets || []).map((t) => normalizeUrl(t, origin)).filter(Boolean) as string[];
  const targetQueue = [
    ...focus.filter((t) => scanned.has(t)),
    ...orphanList.filter((u) => !focus.includes(u)),
    ...[...incoming.entries()].filter(([, n]) => n <= 1).map(([u]) => u).filter((u) => !orphanList.includes(u) && !focus.includes(u)),
  ].slice(0, 20);

  const links: CampaignLink[] = [];
  const rejected: { target: string; reason: string }[] = [];
  const perDonorCount = new Map<string, number>();
  const perTargetCount = new Map<string, number>();
  const anchorUsage = new Map<string, number>();

  for (const target of targetQueue) {
    if ((perTargetCount.get(target) || 0) >= 3) continue;
    const targetTitle = titleByPage.get(target) || target;
    const section = target.replace(origin, "").split("/").filter(Boolean)[0] || "";

    const donors = pages
      .map((p) => p.url)
      .filter((u) => u !== target)
      .filter((u) => !linkedFrom.get(target)?.has(u))
      .filter((u) => (perDonorCount.get(u) || 0) < 3)
      .sort((a, b) => {
        const sa = (a.replace(origin, "").split("/").filter(Boolean)[0] || "") === section ? 1 : 0;
        const sb = (b.replace(origin, "").split("/").filter(Boolean)[0] || "") === section ? 1 : 0;
        if (sa !== sb) return sb - sa;
        return (outgoingByPage.get(b) || 0) - (outgoingByPage.get(a) || 0);
      });

    let placed = 0;
    for (const donor of donors) {
      if (placed >= 3 || (perTargetCount.get(target) || 0) >= 3) break;
      if ((perDonorCount.get(donor) || 0) >= 3) continue;
      const anchor = anchorCandidates(targetTitle, bodyByPage.get(donor) || "")
        .find((ph) => (anchorUsage.get(ph) || 0) < 2);
      if (!anchor) continue;
      const donorSection = donor.replace(origin, "").split("/").filter(Boolean)[0] || "";
      links.push({
        donor,
        anchor,
        target,
        targetTitle,
        reason: incoming.has(target)
          ? `входящих: ${incoming.get(target) || 0}${donorSection === section ? ", донор из того же раздела" : ""}`
          : `сирота${donorSection === section ? ", донор из того же раздела" : ""}`,
      });
      perDonorCount.set(donor, (perDonorCount.get(donor) || 0) + 1);
      perTargetCount.set(target, (perTargetCount.get(target) || 0) + 1);
      anchorUsage.set(anchor, (anchorUsage.get(anchor) || 0) + 1);
      placed++;
    }
    if (placed === 0) {
      rejected.push({
        target,
        reason: incoming.has(target)
          ? "не нашлось донора с дословным анкором из текста (гейт валидации)"
          : "сирота без совпадений фраз в текстах доноров",
      });
    }
  }

  return {
    site: origin,
    targetsConsidered: targetQueue.length,
    links,
    rejected,
    anchorsUsed: [...anchorUsage.entries()].map(([anchor, count]) => ({ anchor, count })),
  };
}
