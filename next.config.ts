import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Сервер сборки — VPS с 1 ГБ RAM: фаза typecheck получает OOM-Kill.
  // Типы проверяются локально перед каждым пушем (npx tsc --noEmit);
  // линт в next build не выполняется (Next 16 его не запускает).
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
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
