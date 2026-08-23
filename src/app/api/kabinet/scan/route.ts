import { NextResponse } from "next/server";
import { normalizeSiteUrl, splitLines } from "@/lib/profile";
import { scanSite } from "@/lib/site-scan";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    site?: string;
    sitemapUrl?: string;
    robotsUrl?: string;
    mainPages?: string;
    blogUrl?: string;
    casesUrl?: string;
    formsUrl?: string;
  };
  const site = normalizeSiteUrl(body.site || "");
  if (!site) return NextResponse.json({ error: "Нужна ссылка на сайт" }, { status: 400 });
  const pages = [
    ...splitLines(body.mainPages || ""),
    body.blogUrl,
    body.casesUrl,
    body.formsUrl,
  ].filter((u): u is string => Boolean(u));
  const scan = await scanSite({
    site,
    sitemapUrl: body.sitemapUrl || undefined,
    robotsUrl: body.robotsUrl || undefined,
    pages,
  });
  return NextResponse.json(scan);
}
