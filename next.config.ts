import type { NextConfig } from "next";

// Каннибализация (аудит 29.10.2026): тонкие маркетинг-гайды склеены с полными статьями блога (301),
// старый кластер «продвижение сайта» — на одну страницу /seo.
const CANIBAL_REDIRECTS: { from: string; to: string }[] = [
  { from: "/seo/robots-txt", to: "/blog/robots-txt-dlya-yandex-i-google-primery" },
  { from: "/seo/vebmaster", to: "/blog/yandex-vebmaster-instrumenty" },
  { from: "/seo/search-console", to: "/blog/search-console-dlya-russkogo-saita" },
  { from: "/seo/kommercheskie-faktory", to: "/blog/kommercheskie-faktory-chek-list" },
  { from: "/seo/tekhnicheskiy-audit", to: "/blog/tehnicheskiy-audit-saita-samostoyatelno" },
  { from: "/seo/mikrorazmetka", to: "/blog/mikrorazmetka-schema-org-2026" },
  { from: "/seo/semantika-wordstat", to: "/blog/wordstat-instrukciya-s-chastotoy" },
  { from: "/seo/skolko-stoit", to: "/blog/skolko-stoit-seo-v-2026" },
  { from: "/seo/posadochnye", to: "/blog/posadochnaya-stranica-anatomiya" },
  { from: "/seo/regionalnoe-prodvizhenie", to: "/blog/geozaprosy-i-regionalnoe-prodvizhenie" },
  { from: "/geo/kak-popast-v-gigachat", to: "/blog/kak-popast-v-otvety-gigachat" },
  { from: "/seo/prodvizhenie", to: "/seo" },
  { from: "/seo/prodvizhenie-sayta", to: "/seo" },
  { from: "/seo/raskrutka-sayta", to: "/seo" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Сервер сборки — VPS с 1 ГБ RAM: фаза typecheck получает OOM-Kill.
  // Типы проверяются локально перед каждым пушем (npx tsc --noEmit);
  // линт в next build не выполняется (Next 16 его не запускает).
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      ...CANIBAL_REDIRECTS.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
      {
        source: "/seo/minusinsk-baden-baden",
        destination: "/seo/pravila-poiska",
        permanent: true,
      },
      {
        source: "/pochemu-innsont",
        destination: "/pochemu-insont",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
