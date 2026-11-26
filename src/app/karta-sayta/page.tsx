import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/SiteChrome";
import { SITE_SECTIONS } from "@/lib/site-map";
import { SITE } from "@/lib/site";
import { PageAdvantages } from "@/components/Advantages";
import { POSTS } from "@/lib/blog";
import { keywordNav } from "@/lib/keyword-pages";
import { REDIRECTED_PATHS } from "@/lib/redirected";

export const metadata: Metadata = {
  title: "Карта сайта: все разделы и страницы",
  description:
    "Все страницы INSONT в одном списке: продвижение в Яндексе и Google, нейросети, платформа, тарифы, инструменты, кейсы, города и отрасли.",
  alternates: { canonical: "/karta-sayta" },
};

const cleanPath = (href: string) => href.replace(/\/$/, "") || "/";
// адреса, ушедшие в редирект, в карте сайта не показываем: посетитель идёт сразу на конечную страницу
const live = <T extends { href: string }>(items: T[]) => items.filter((it) => !REDIRECTED_PATHS.has(cleanPath(it.href)));
const SECTIONS = SITE_SECTIONS.map((s) => ({ ...s, items: live(s.items) }));
const KEYWORDS = live(keywordNav());

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Карта сайта INSONT",
          url: `${SITE.url}/karta-sayta`,
          numberOfItems: SECTIONS.reduce((n, s) => n + s.items.length, 0) + KEYWORDS.length + POSTS.length,
        }}
      />
      <Breadcrumbs path="/karta-sayta" />
      <h1 className="text-4xl md:text-5xl">Карта сайта</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Если ищете конкретный раздел — он здесь. Платформа, тарифы, SEO по
        городам и отраслям, помощь.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {SECTIONS.map((sec) => (
          <section key={sec.title}>
            <h2 className="text-2xl">
              {sec.href ? (
                <Link href={sec.href} className="hover:text-orange">
                  {sec.title}
                </Link>
              ) : (
                sec.title
              )}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sec.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="text-ink hover:text-orange">
                    {it.name}
                  </Link>
                  {it.desc && (
                    <span className="ml-2 text-muted">— {it.desc}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section>
          <h2 className="text-2xl">По запросам из Wordstat</h2>
          <p className="mt-2 text-sm text-muted">
            Посадочные под живые формулировки. В меню разделов их нет, в карте
            и в sitemap.xml они есть.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {KEYWORDS.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="text-ink hover:text-orange">
                  {it.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl">
            <Link href="/blog" className="hover:text-orange">
              Статьи блога
            </Link>
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="hover:text-orange">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <PageAdvantages path="/karta-sayta" />
    </div>
  );
}
