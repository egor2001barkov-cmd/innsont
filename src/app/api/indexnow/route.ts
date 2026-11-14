import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import {
  INDEXNOW_KEY,
  INDEXNOW_MAX_URLS,
  indexNowKeyLocation,
  submitIndexNow,
} from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Публичный статус: ключ и его расположение секретом не являются. */
export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: indexNowKeyLocation(),
    endpoint: "https://api.indexnow.org/indexnow",
    secretConfigured: Boolean(process.env.INDEXNOW_SECRET),
  });
}

async function urlsFromSitemap(): Promise<string[]> {
  const res = await fetch(`${SITE.url}/sitemap.xml`, { cache: "no-store" });
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/**
 * POST /api/indexnow — пинг поисковиков после публикации.
 * Тело: { "urls": ["https://insont.ru/blog/..."] } (пусто = весь sitemap).
 * Заголовок x-indexnow-secret должен совпадать с INDEXNOW_SECRET в .env.
 */
export async function POST(request: Request) {
  const secret = process.env.INDEXNOW_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "INDEXNOW_SECRET не задан на сервере — эндпоинт отключён" },
      { status: 503 },
    );
  }
  if (request.headers.get("x-indexnow-secret") !== secret) {
    return NextResponse.json({ error: "forbidden" }, { status: 401 });
  }

  let urls: string[] = [];
  try {
    const body = (await request.json()) as { urls?: unknown };
    if (Array.isArray(body?.urls)) {
      urls = body.urls.filter((u): u is string => typeof u === "string");
    }
  } catch {
    // пустое тело — значит отправляем весь sitemap
  }

  try {
    if (urls.length === 0) urls = await urlsFromSitemap();
    urls = [...new Set(urls)].filter((u) => u.startsWith(`${SITE.url}/`) || u === SITE.url);
    if (urls.length === 0) {
      return NextResponse.json({ error: "нечего отправлять" }, { status: 400 });
    }
    if (urls.length > INDEXNOW_MAX_URLS) urls = urls.slice(0, INDEXNOW_MAX_URLS);

    const result = await submitIndexNow(urls);
    return NextResponse.json({ sent: urls.length, ...result }, { status: result.ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "IndexNow failed" },
      { status: 500 },
    );
  }
}
