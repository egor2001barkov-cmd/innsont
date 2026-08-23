import Link from "next/link";
import { Breadcrumbs } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";
import type { SiteSection } from "@/lib/site-map";

export function HubPage({
  section,
  lead,
}: {
  section: SiteSection;
  lead: string;
}) {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14">
      <Breadcrumbs path={section.href} lastName={section.title} />
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Раздел
      </p>
      <h1 className="mt-3 text-4xl md:text-5xl">{section.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{lead}</p>
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
