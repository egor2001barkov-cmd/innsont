export type PageProbe = {
  url: string;
  ok: boolean;
  status: number | null;
  title: string;
};

export type SiteScan = {
  home: PageProbe;
  robots: PageProbe & { snippet: string };
  sitemap: PageProbe & { urls: number };
  pages: PageProbe[];
};

const UA = "InsontAudit/1.0 (+https://insont.ru)";

async function probe(url: string): Promise<PageProbe & { body?: string }> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,text/plain,application/xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
    });
    const body = await res.text();
    const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || "";
    return { url, ok: res.ok, status: res.status, title, body: body.slice(0, 80_000) };
  } catch {
    return { url, ok: false, status: null, title: "" };
  }
}

export async function scanSite(input: {
  site: string;
  sitemapUrl?: string;
  robotsUrl?: string;
  pages?: string[];
}): Promise<SiteScan> {
  const origin = input.site.replace(/\/$/, "");
  const home = await probe(origin);
  const robots = await probe(input.robotsUrl || `${origin}/robots.txt`);
  const sitemap = await probe(input.sitemapUrl || `${origin}/sitemap.xml`);
  const locs = sitemap.body ? [...sitemap.body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].length : 0;
  const extra = (input.pages || []).slice(0, 8);
  const pages = await Promise.all(extra.map((u) => probe(u)));
  return {
    home: { url: home.url, ok: home.ok, status: home.status, title: home.title },
    robots: {
      url: robots.url,
      ok: robots.ok,
      status: robots.status,
      title: robots.ok ? "robots.txt" : "",
      snippet: (robots.body || "").slice(0, 400),
    },
    sitemap: {
      url: sitemap.url,
      ok: sitemap.ok,
      status: sitemap.status,
      title: sitemap.ok ? "sitemap" : "",
      urls: locs,
    },
    pages: pages.map(({ url, ok, status, title }) => ({ url, ok, status, title })),
  };
}
