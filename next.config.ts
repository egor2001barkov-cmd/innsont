import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Сервер сборки — VPS с 1 ГБ RAM: фазы typecheck/eslint получают OOM-Kill.
  // Типы и линт проверяются локально перед каждым пушем (npx tsc --noEmit).
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
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
