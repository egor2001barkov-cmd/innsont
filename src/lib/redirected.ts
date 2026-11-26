/**
 * Пути, ушедшие в постоянный редирект (склейка каннибализации 29.10.2026 и аудит 26.11.2026).
 * Редиректы объявлены в next.config.ts; здесь — единый список для sitemap и llms-файлов,
 * чтобы в карте сайта и файлах для ИИ не оставалось адресов, отвечающих 301/308.
 */
export const REDIRECTED_PATHS: ReadonlySet<string> = new Set([
  "/seo/robots-txt",
  "/seo/posadochnye",
  "/seo/vebmaster",
  "/seo/search-console",
  "/seo/kommercheskie-faktory",
  "/seo/tekhnicheskiy-audit",
  "/seo/mikrorazmetka",
  "/seo/semantika-wordstat",
  "/seo/skolko-stoit",
  "/seo/regionalnoe-prodvizhenie",
  "/geo/kak-popast-v-gigachat",
  "/seo/glossariy",
  "/seo/prodvizhenie",
  "/seo/prodvizhenie-sayta",
  "/seo/raskrutka-sayta",
]);
