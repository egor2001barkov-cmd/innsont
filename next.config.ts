import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
