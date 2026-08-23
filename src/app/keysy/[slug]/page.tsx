import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";
import { CASES, getCase } from "@/lib/cases";
import { CASE_STORIES } from "@/lib/case-stories";
import { CASE_STORY_EXTRA } from "@/lib/case-stories-extra";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return {
    title: `${item.company}, ${item.city}: почему сайт заработал`,
    description: item.description,
    alternates: { canonical: `/keysy/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `/keysy/${item.slug}`,
      locale: "ru_RU",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();
  return (
    <div className="rays">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.description,
          author: { "@type": "Organization", name: SITE.name },
        }}
      />
      <article className="mx-auto max-w-[800px] px-5 py-14">
        <Breadcrumbs path={`/keysy/${item.slug}`} lastName={item.company} />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          {item.industry} · {item.city} · {item.period}
        </p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{item.title}</h1>
        <p className="mt-5 text-lg text-[#3a3632]">{item.description}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {item.result.map((r) => (
            <div key={r.k} className="card p-4">
              <div className="text-xl font-semibold">{r.v}</div>
              <p className="mt-1 text-xs text-muted">{r.k}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-12 text-2xl">С какой задачей пришли</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">{item.problem}</p>
        <h2 className="mt-10 text-2xl">Что сделали</h2>
        <ul className="mt-3 space-y-2 leading-relaxed">
          {item.done.map((d) => (
            <li key={d} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 text-2xl">Почему сайт стал лучше</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">{item.whyBetter}</p>
        <h2 className="mt-10 text-2xl">Что увидели Яндекс, Google и другие поисковики</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">{item.searchSaw}</p>
        <h2 className="mt-10 text-2xl">Страницы, которые сработали</h2>
        <ul className="mt-4 space-y-4">
          {item.pagesThatWorked.map((p) => (
            <li key={p.name} className="card p-5">
              <h3 className="text-lg">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.why}</p>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-2xl">Что из этого можно взять себе</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">{item.takeaway}</p>
        {(CASE_STORIES[item.slug] || CASE_STORY_EXTRA[item.slug]) && (
          <div className="mt-14">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
              Полный разбор
            </p>
            {[
              ...(CASE_STORIES[item.slug] ?? []),
              ...(CASE_STORY_EXTRA[item.slug] ?? []),
            ].map((block) => (
              <section key={block.title} className="mt-10">
                <h2 className="text-2xl">{block.title}</h2>
                {block.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="mt-3 leading-relaxed text-[#3a3632]">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        )}
        <blockquote className="card mt-10 p-6 text-lg leading-relaxed">
          «{item.quote}»
          <footer className="mt-3 text-sm text-muted">
            {item.person}, {item.company}
          </footer>
        </blockquote>
        <p className="mt-8 text-sm text-muted">
          Ссылки не покупали, поведение не накручивали. Как работаем — на
          странице{" "}
          <Link href="/seo" className="font-semibold text-orange">
            продвижения в поиске
          </Link>
          . Цифры по рынку — в{" "}
          <Link href="/blog/issledovanie-ii-vidimosti-rf" className="font-semibold text-orange">
            исследовании
          </Link>
          .
        </p>
        <PageAdvantages path={`/keysy/${item.slug}`} />
        <SeeAlso
          links={[
            ...item.related,
            { href: "/strategiya/seo", title: "SEO-стратегия" },
            { href: "/strategiya/kontent", title: "Контент-стратегия" },
            { href: "/keysy", title: "Все кейсы" },
            { href: "/tseny", title: "Тарифы" },
          ]}
        />
      </article>
      <CtaBand />
    </div>
  );
}
