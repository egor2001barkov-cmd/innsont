import { NextResponse, type NextRequest } from "next/server";
import { KNOWN_PATHS } from "@/lib/route-manifest";

/**
 * Канонизация слэшей без лишних хопов (фикс мягкой 404 от 05.11.2026).
 *
 * Раньше ЛЮБОЙ путь со слэшем получал 308 на бесслэшевый вариант — включая
 * несуществующие страницы: краулер тратил два запроса, чтобы узнать про 404.
 *
 * Теперь: путь существует → 308 на канонический (как прежде); пути нет →
 * запрос проходит дальше без редиректа, маршрут не находится и Next отдаёт
 * not-found сразу со статусом 404 — один запрос вместо двух.
 *
 * Манифест путей: src/lib/route-manifest.ts (автогенерат
 * scripts/gen-route-manifest.mjs — перегенерировать при изменении маршрутов).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // корень и обычные (бесслэшевые) пути не трогаем
  if (pathname === "/" || !pathname.endsWith("/")) return NextResponse.next();

  const stripped = pathname.replace(/\/+$/, "");
  if (stripped === "") return NextResponse.next(); // «//» после нормализации

  // ВАЖНО: чистый URL, а не nextUrl.clone() — нормализатор NextURL под
  // skipTrailingSlashRedirect сохраняет слэш при присваивании pathname,
  // и redirect уходит на самого себя (цикл 308).
  const target = new URL(stripped + req.nextUrl.search, req.url);

  if (KNOWN_PATHS.has(stripped)) {
    // существующая страница: постоянная канонизация, как раньше
    return NextResponse.redirect(target, 308);
  }

  // Несуществующий путь со слэшем: просто пропускаем. Штатный слэш-редирект
  // отключён (skipTrailingSlashRedirect), маршрут не находится — Next рендерит
  // not-found сразу со статусом 404, один запрос вместо «308 → 404».
  // (Реврайт на абсолютный URL тут не годится: за TLS-терминатором Caddy
  // Next ходит сам в себя по https на http-порт — EPROTO/500.)
  return NextResponse.next();
}

export const config = {
  // пропускаем API, ассеты Next и файлы с расширениями (robots.txt, sitemap.xml, иконки)
  matcher: ["/((?!api/|_next/static/|_next/image/|.*\\..*).*)"],
};
