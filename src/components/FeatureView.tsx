import Link from "next/link";
import type { FeaturePage } from "@/lib/features";
import { FEATURE_MEDIA } from "@/lib/enrich";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "./SiteChrome";
import { SeeAlso } from "./SeeAlso";
import { FaqList } from "./FaqList";
import { PageAdvantages } from "./Advantages";

export function FeatureView({ page }: { page: FeaturePage; section: string }) {
  const extra = FEATURE_MEDIA[page.slug];
  const faqs = extra ? [...page.faqs, ...extra.extraFaqs] : page.faqs;
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${SITE.name} — ${page.h1}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE.url}${page.path}`,
      description: page.description,
      offers: { "@type": "Offer", priceCurrency: "RUB", price: "4490" },
    },

    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
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
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.1] md:text-6xl">{page.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3a3632]">{page.lead}</p>
        <div className="cta-row mt-8">
          <Link href="/demo" className="btn-primary">
            Заказать демо
          </Link>
          <Link href="/registratsiya" className="btn-outline">
            5 запросов бесплатно
          </Link>
        </div>
        {extra && (
          <figure className="mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={extra.image}
              alt={`Скриншот кабинета INSONT. ${extra.caption}`}
              className="w-full"
            />
            <figcaption className="mt-2 text-sm text-muted">{extra.caption}</figcaption>
          </figure>
        )}
        <ul className="mt-10 max-w-3xl list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
          {page.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="mt-8">
          {page.sections.map((s) => (
            <section key={s.title} className="border-t border-line py-10">
              <h2 className="text-2xl md:text-[28px]">{s.title}</h2>
              <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">{s.text}</p>
              {s.points && (
                <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px]">
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        {extra && (
          <section className="border-t border-line pt-10">
            <h2 className="text-2xl md:text-[28px]">Как работает функция</h2>
            <dl className="mt-6 max-w-3xl">
              {extra.how.map((h) => (
                <div key={h.title} className="border-t border-line py-5 first:border-t-0 first:pt-0">
                  <dt className="font-semibold">{h.title}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">{h.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {extra && (
          <section className="border-t border-line pt-10">
            <p className="text-sm text-muted">Разбор сайта</p>
            <h2 className="mt-1 text-2xl md:text-[28px]">{extra.caseStudy.title}</h2>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed">{extra.caseStudy.text}</p>
            <Link href={extra.caseStudy.href} className="mt-4 inline-flex text-sm font-semibold hover:underline">
              Почему сайт заработал — полный разбор
            </Link>
          </section>
        )}
        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />
        <SeeAlso
          links={[
            ...page.related,
            { href: "/priorizirovat", title: "Центр действий" },
            { href: "/seo", title: "Продвижение в поиске" },
            { href: "/tseny", title: "Тарифы" },
          ]}
        />
      </article>
      <CtaBand />
    </div>
  );
}

export function pageMetadata(page: FeaturePage) {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      locale: "ru_RU",
      type: "website",
    },
  };
}
