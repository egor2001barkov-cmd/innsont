import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/SiteChrome";
import { SITE_SECTIONS } from "@/lib/site-map";
import { SITE } from "@/lib/site";
import { PageAdvantages } from "@/components/Advantages";
import { POSTS } from "@/lib/blog";
import { keywordNav } from "@/lib/keyword-pages";

export const metadata: Metadata = {
  title: "Карта сайта INSONT — все разделы",
  description:
    "Все страницы INSONT: продвижение в Яндексе и Google, тарифы, кейсы, города, отрасли и кабинет.",
  alternates: { canonical: "/karta-sayta" },
};

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Карта сайта INSONT",
          url: `${SITE.url}/karta-sayta`,
          numberOfItems: SITE_SECTIONS.reduce((n, s) => n + s.items.length, 0),
        }}
      />
      <Breadcrumbs path="/karta-sayta" />
      <h1 className="text-4xl md:text-5xl">Карта сайта</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Если ищете конкретный раздел — он здесь. Платформа, тарифы, SEO по
        городам и отраслям, помощь.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {SITE_SECTIONS.map((sec) => (
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
            {keywordNav().map((it) => (
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
