import { landingCandidates, type Competitor } from "./spheres";

export type FoundLanding = {
  competitor: string;
  host: string;
  url: string;
  title: string;
  snippet: string;
  status: number | null;
  live: boolean;
  matched: string[];
};

const UA = "InnsontResearch/1.0 (+https://innsont.ru)";

function decode(html: string) {
  return html
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(html: string, re: RegExp) {
  const m = html.match(re);
  return m ? decode(m[1]).slice(0, 220) : "";
}

export async function probeUrl(url: string): Promise<{
  status: number | null;
  title: string;
  snippet: string;
  live: boolean;
}> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(2800),
    });
    const html = await res.text();
    const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const desc = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
    const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    return {
      status: res.status,
      title: title || h1 || url,
      snippet: desc || h1,
      live: res.ok,
    };
  } catch {
    return { status: null, title: "", snippet: "", live: false };
  }
}

async function readLocs(url: string): Promise<string[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(2500),
  });
  if (!res.ok) return [];
  const xml = (await res.text()).slice(0, 400_000);
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => decode(m[1]));
}

async function sitemapUrls(host: string, limit = 80): Promise<string[]> {
  const roots = [`https://${host}/sitemap.xml`, `https://${host}/sitemap_index.xml`];
  let locs: string[] = [];
  for (const root of roots) {
    try {
      locs = await readLocs(root);
      if (locs.length) break;
    } catch {
      /* next */
    }
  }
  const childMaps = locs.filter((u) => /sitemap/i.test(u)).slice(0, 4);
  if (childMaps.length) {
    const prefer = [...childMaps].sort((a, b) => {
      const score = (u: string) =>
        /post|page|product|category|uslug|catalog/i.test(u) ? 0 : 1;
      return score(a) - score(b);
    });
    const nested = await Promise.all(prefer.slice(0, 3).map((u) => readLocs(u).catch(() => [])));
    locs = nested.flat();
  }
  return [...new Set(locs.filter((u) => !/sitemap/i.test(u)))].slice(0, limit);
}

function tokens(phrase: string) {
  return phrase
    .toLowerCase()
    .split(/[^a-zа-яё0-9]+/i)
    .filter((w) => w.length > 2);
}

function matchScore(url: string, title: string, phrase: string) {
  const t = tokens(phrase);
  const hay = `${url} ${title}`.toLowerCase();
  return t.filter((w) => hay.includes(w)).length;
}

export async function findCompetitorLandings(opts: {
  phrases: string[];
  competitors: Competitor[];
  extraHosts?: string[];
}): Promise<FoundLanding[]> {
  const phrases = opts.phrases.slice(0, 8);
  const extras: Competitor[] = (opts.extraHosts || [])
    .map((h) => h.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim())
    .filter(Boolean)
    .map((host) => ({ name: host, host, landings: [] }));
  const comps = [...opts.competitors, ...extras].slice(0, 8);

  const out: FoundLanding[] = [];

  await Promise.all(
    comps.map(async (c) => {
      const known = c.landings.map((l) => ({
        url: `https://${c.host}${l.path}`,
        title: l.title,
        keys: l.keys,
      }));
      const generated = phrases.flatMap((p) =>
        landingCandidates(c.host, p)
          .slice(0, 2)
          .map((url) => ({ url, title: "", keys: tokens(p) }))
      );
      let sitemapHits: { url: string; title: string; keys: string[] }[] = [];
      try {
        const sm = await sitemapUrls(c.host, 60);
        sitemapHits = sm
          .filter((u) => phrases.some((p) => matchScore(u, "", p) >= 1))
          .slice(0, 4)
          .map((url) => ({ url, title: "", keys: phrases.flatMap(tokens) }));
      } catch {
        /* ignore */
      }

      const pool = [...known, ...sitemapHits, ...generated]
        .filter((x, i, arr) => arr.findIndex((y) => y.url === x.url) === i)
        .slice(0, 4);

      const probed = await Promise.all(
        pool.map(async (item) => {
          const live = await probeUrl(item.url);
          const matched = phrases.filter(
            (p) => matchScore(item.url, `${item.title} ${live.title}`, p) > 0 || item.keys.some((k) => p.includes(k))
          );
          if (!live.live && !item.title) return null;
          return {
            competitor: c.name,
            host: c.host,
            url: item.url,
            title: live.title || item.title || c.name,
            snippet: live.snippet,
            status: live.status,
            live: live.live,
            matched: matched.slice(0, 4),
          } satisfies FoundLanding;
        })
      );
      out.push(...probed.filter((x): x is FoundLanding => Boolean(x)));
    })
  );

  return out
    .sort((a, b) => Number(b.live) - Number(a.live) || b.matched.length - a.matched.length)
    .slice(0, 24);
}
