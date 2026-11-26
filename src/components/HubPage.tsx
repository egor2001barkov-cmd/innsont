import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import type { SiteSection } from "@/lib/site-map";
import { SITE } from "@/lib/site";

/**
 * Хаб раздела: вступительный текст, список подразделов и вопросы-ответы.
 * `intro` и `faq` добавлены по аудиту 26.11.2026: у хабов было 39–223 слова, брать было нечего.
 */
export function HubPage({
  section,
  lead,
  intro = [],
  faq = [],
}: {
  section: SiteSection;
  lead: string;
  intro?: string[];
  faq?: { q: string; a: string }[];
}) {
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: section.title,
      url: `${SITE.url}${section.href}`,
      inLanguage: "ru-RU",
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      hasPart: section.items.map((it) => ({ "@type": "WebPage", name: it.name, url: `${SITE.url}${it.href}` })),
    },
    ...(faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14">
      <JsonLd data={json} />
      <Breadcrumbs path={section.href} lastName={section.title} />
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Раздел
      </p>
      <h1 className="mt-3 text-4xl md:text-5xl">{section.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{lead}</p>
      {intro.map((p) => (
        <p key={p.slice(0, 48)} className="mt-4 max-w-2xl text-[16px] leading-[1.75] text-[#3a3632]">
          {p}
        </p>
      ))}
      <ul className="mt-8 max-w-[720px] border-t border-line">
        {section.items.map((it) => (
          <li key={it.href} className="border-b border-line">
            <Link href={it.href} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
              <span className="font-semibold group-hover:underline">{it.name}</span>
              {it.desc ? (
                <span className="text-sm leading-relaxed text-muted sm:max-w-[22rem] sm:text-right">{it.desc}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {section.href && <PageAdvantages path={section.href} />}
      <FaqList items={faq} />
      <SeeAlso
        links={[
          { href: "/tseny", title: "Тарифы", desc: "Месяц или год, скидка 10%" },
          { href: "/seo", title: "Продвижение в поиске", desc: "Яндекс, Google, Вебмастер" },
          { href: "/demo", title: "Демо", desc: "Разберём ваш сайт" },
          { href: "/karta-sayta", title: "Все разделы", desc: "Если не нашли нужное" },
        ]}
      />
    </div>
  );
}
