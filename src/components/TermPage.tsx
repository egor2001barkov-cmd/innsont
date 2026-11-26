import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { FaqList } from "@/components/FaqList";
import { OG_IMAGE, SITE } from "@/lib/site";
import type { Term } from "@/lib/slovar";

export function termMetadata(term: Term) {
  return {
    title: term.title,
    description: term.description,
    alternates: { canonical: `/slovar/${term.slug}` },
    openGraph: {
      title: term.title,
      description: term.description,
      url: `/slovar/${term.slug}`,
      locale: "ru_RU",
      type: "article" as const,
      images: OG_IMAGE,
    },
  };
}

export function TermPage({ term }: { term: Term }) {
  const url = `${SITE.url}/slovar/${term.slug}`;
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: term.term,
      description: term.description,
      url,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Словарь SEO и GEO",
        url: `${SITE.url}/slovar`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: term.faqs.map((f) => ({
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
        <Breadcrumbs path={`/slovar/${term.slug}`} lastName={term.term} />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          {term.category}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.1] md:text-5xl">{term.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3a3632]">{term.lead}</p>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">Определение</h2>
          {term.definition.map((p) => (
            <p key={p.slice(0, 40)} className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">
              {p}
            </p>
          ))}
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">Как это работает</h2>
          {term.how.map((p) => (
            <p key={p.slice(0, 40)} className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">
              {p}
            </p>
          ))}
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">Пример</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">{term.example.text}</p>
          {term.example.code && (
            <pre className="mt-5 max-w-3xl overflow-x-auto border border-line bg-[#f6f3ee] p-4 text-sm leading-relaxed">
              <code>{term.example.code}</code>
            </pre>
          )}
          {term.example.table && (
            <div className="table-wrap mt-5 max-w-3xl">
              <table className="sheet">
                <thead>
                  <tr>
                    {term.example.table.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {term.example.table.rows.map((r) => (
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
          {term.example.points && (
            <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px]">
              {term.example.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">Как проверить</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">{term.check.text}</p>
          <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-[15px]">
            {term.check.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">Частые ошибки</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">{term.mistakes.text}</p>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px]">
            {term.mistakes.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {term.deep?.map((d) => (
          <section key={d.title} className="mt-10 border-t border-line pt-8">
            <h2 className="text-2xl md:text-[28px]">{d.title}</h2>
            {d.text.split(/\n\n+/).map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">
                {p}
              </p>
            ))}
            {d.points && (
              <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px]">
                {d.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">{term.service.title}</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-[1.75] text-[#3a3632]">{term.service.text}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={term.service.href} className="btn-primary">
              {term.service.title}
            </Link>
            <Link href="/demo" className="btn-outline">
              Заказать демо
            </Link>
          </div>
        </section>

        <FaqList items={term.faqs} />

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-2xl md:text-[28px]">Соседние термины</h2>
          <ul className="mt-4 max-w-3xl space-y-2">
            {term.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="font-semibold hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/slovar" className="font-semibold hover:underline">
                Все термины словаря
              </Link>
            </li>
          </ul>
        </section>
      </article>
      <CtaBand />
    </div>
  );
}
