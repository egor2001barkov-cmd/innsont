import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { CASES } from "@/lib/cases";
import { FEATURES, SOLUTIONS_PAGES } from "@/lib/features";
import { allLongPages } from "@/lib/geo-pages";
import { SITE } from "@/lib/site";

const UPDATED = new Date(`${SITE.contentUpdated}T00:00:00+03:00`);

function entry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: path === "/" ? SITE.url : `${SITE.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/seo", priority: 0.9 },
    { path: "/geo", priority: 0.9 },
    { path: "/karta-sayta", priority: 0.4 },
    { path: "/priorizirovat", priority: 0.7 },
    { path: "/deystvovat", priority: 0.7 },
    { path: "/pochemu-insont", priority: 0.7 },
    { path: "/dlya-komand", priority: 0.7 },
    { path: "/platforma", priority: 0.8 },
    { path: "/resheniya", priority: 0.8 },
    { path: "/resursy", priority: 0.6 },
    { path: "/tseny", priority: 0.8 },
    { path: "/demo", priority: 0.6 },
    { path: "/registratsiya", priority: 0.5 },
    { path: "/blog", priority: 0.6 },
    { path: "/kompaniya", priority: 0.5 },
    { path: "/politika", priority: 0.3 },
    { path: "/oferta", priority: 0.3 },
    { path: "/cookies", priority: 0.3 },
    { path: "/instrumenty", priority: 0.5 },
    { path: "/instrumenty/llms-txt", priority: 0.5 },
    { path: "/instrumenty/proverka-krawlerov", priority: 0.5 },
    { path: "/resursy/indeks-reklamy", priority: 0.5 },
    { path: "/resursy/rukovodstvo-geo", priority: 0.5 },
    { path: "/resursy/pomoshch", priority: 0.4 },
    { path: "/resursy/api", priority: 0.4 },
    { path: "/keysy", priority: 0.7 },
    { path: "/strategiya", priority: 0.75 },
    { path: "/strategiya/seo", priority: 0.75 },
    { path: "/strategiya/kontent", priority: 0.75 },
    { path: "/resursy/partnerskaya", priority: 0.5 },
    { path: "/resursy/integratsii", priority: 0.4 },
    { path: "/seo/robots-txt", priority: 0.75 },
    { path: "/seo/posadochnye", priority: 0.75 },
  ];

  const longPages = allLongPages().filter((p) => p.path !== "/seo");

  return [
    ...staticPaths.map(({ path, priority }) =>
      entry(path, UPDATED, path === "/" ? "weekly" : "monthly", priority)
    ),
    ...FEATURES.map((f) => entry(f.path, UPDATED, "monthly", 0.8)),
    ...SOLUTIONS_PAGES.map((f) => entry(f.path, UPDATED, "monthly", 0.7)),
    ...POSTS.map((p) =>
      entry(`/blog/${p.slug}`, new Date(`${p.date}T00:00:00+03:00`), "monthly", 0.6)
    ),
    ...CASES.map((c) => entry(`/keysy/${c.slug}`, UPDATED, "monthly", 0.65)),
    ...longPages.map((p) =>
      entry(
        p.path,
        UPDATED,
        "monthly",
        p.path.startsWith("/seo/") ? 0.75 : 0.7
      )
    ),
  ];
}
