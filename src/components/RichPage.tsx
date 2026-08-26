import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { SITE } from "@/lib/site";

export type RichPageData = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  answer: string;
  image?: string;
  imageCaption?: string;
  imageAlt?: string;
  bullets?: string[];
  stats?: { k: string; v: string }[];
  table?: { head: string[]; rows: string[][] };
  checklist?: string[];
  how: { title: string; text: string }[];
  caseStudy?: { title: string; text: string; href: string };
  sections?: { title: string; text: string; points?: string[] }[];
  faqs: { q: string; a: string }[];
  related: { href: string; title: string }[];
  keywords?: string[];
};

export function richMetadata(page: RichPageData) {
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      locale: "ru_RU",
      type: "website" as const,
    },
  };
}

export function RichPage({ page }: { page: RichPageData }) {
  const url = `${SITE.url}${page.path}`;
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.h1,
      description: page.description,
      url,
      inLanguage: "ru-RU",
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      description: page.description,
      url,
      serviceType: page.eyebrow,
      areaServed: "RU",
      provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <div className="rays">
      <JsonLd data={json} />
      <article className="mx-auto max-w-[1100px] px-5 py-12">
        <Breadcrumbs path={page.path} lastName={page.h1} />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.1] md:text-5xl">{page.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3a3632]">{page.answer}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Заказать демо
          </Link>
          <Link href="/tseny" className="btn-outline">
            Тарифы
          </Link>
        </div>
        {page.stats && (
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4">
            {page.stats.map((s) => (
              <div key={s.k} className="flex items-baseline gap-2">
                <dt className="text-sm text-muted">{s.k}</dt>
                <dd className="text-sm font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        )}
        {page.image && (
          <figure className="mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.image}
              alt={
                page.imageAlt ||
                page.imageCaption ||
                `Скриншот кабинета INSONT. ${page.h1}`
              }
              className="w-full"
            />
            {page.imageCaption && (
              <figcaption className="mt-2 text-sm text-muted">{page.imageCaption}</figcaption>
            )}
          </figure>
        )}
        {page.bullets && (
          <ul className="mt-10 max-w-3xl list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
            {page.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {page.table && (
          <div className="table-wrap mt-10">
            <table className="sheet">
              <thead>
                <tr>
                  {page.table.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c) => (
                      <td key={c}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {page.checklist && (
          <section className="mt-10 border-t border-line pt-10">
            <h2 className="text-2xl md:text-[28px]">Чек-лист</h2>
            <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px]">
              {page.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-10 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Как это делает INSONT</h2>
          <dl className="mt-6 max-w-3xl">
            {page.how.map((h) => (
              <div key={h.title} className="border-t border-line py-5 first:border-t-0 first:pt-0">
                <dt className="font-semibold">{h.title}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-muted">{h.text}</dd>
              </div>
            ))}
          </dl>
        </section>
        {page.sections?.map((s) => (
          <section key={s.title} className="border-t border-line py-10">
            <h2 className="text-2xl md:text-[28px]">{s.title}</h2>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">{s.text}</p>
            {s.points && (
              <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px]">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        {page.caseStudy && (
          <section className="border-t border-line pt-10">
            <p className="text-sm text-muted">Разбор сайта</p>
            <h2 className="mt-1 text-2xl md:text-[28px]">{page.caseStudy.title}</h2>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
              {page.caseStudy.text}
            </p>
            <Link href={page.caseStudy.href} className="mt-4 inline-flex text-sm font-semibold hover:underline">
              Почему сайт заработал — полный разбор
            </Link>
          </section>
        )}
        <PageAdvantages path={page.path} />
        <FaqList items={page.faqs} />
        <SeeAlso
          links={[
            ...page.related.map((r) => ({ href: r.href, title: r.title })),
            { href: "/tseny", title: "Тарифы" },
            { href: "/platforma", title: "Платформа" },
          ]}
        />
      </article>
      <CtaBand />
    </div>
  );
}
