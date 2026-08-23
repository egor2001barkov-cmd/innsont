import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { CASES } from "@/lib/cases";
import { SITE } from "@/lib/site";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Кейсы: почему сайты выросли в Яндексе и Google",
  description:
    "Разборы СМ-Клиники, МойСклада, Фабрики Окон, Фоксфорда, Центр-инвеста, Нордтеха: что увидели Яндекс и Google и почему сайт стал лучше.",
  alternates: { canonical: "/keysy" },
  openGraph: {
    title: "Кейсы INNSONT",
    description:
      "Реальные компании среднего размера. Что сделали на сайте и как это сказалось на поиске и ответах нейросетей.",
    url: "/keysy",
    locale: "ru_RU",
  },
};

export default function Page() {
  return (
    <div className="rays">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Кейсы INNSONT",
          url: `${SITE.url}/keysy`,
          description:
            "Кейсы белого SEO и видимости в нейросетях для российских компаний.",
        }}
      />
      <article className="mx-auto max-w-[1100px] px-5 py-14">
        <Breadcrumbs path="/keysy" lastName="Кейсы" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Кейсы
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl md:text-5xl">
          Что сделали на сайте и что изменилось
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Компании среднего размера, не гиганты. Без покупки ссылок и без
          обещания топа за неделю. Пять разборов написаны как разговор после
          проекта, не как слайд. Цифры — за 8–14 недель белой работы.
        </p>
        <ul className="mt-10 max-w-[720px] border-t border-line">
          {CASES.map((c) => (
            <li key={c.slug} className="border-b border-line py-6">
              <Link href={`/keysy/${c.slug}`} className="group block">
                <div className="text-sm text-muted">
                  {c.industry} · {c.city} · {c.period}
                </div>
                <h2 className="mt-1 text-xl leading-snug group-hover:underline">{c.company}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.description}</p>
                <p className="mt-2 text-sm">
                  {c.result
                    .slice(0, 2)
                    .map((r) => `${r.k}: ${r.v}`)
                    .join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-sm text-muted">
          Как это связано с цифрами по рынку — в{" "}
          <Link href="/blog/issledovanie-ii-vidimosti-rf" className="font-semibold text-orange">
            исследовании ИИ-видимости по России
          </Link>
          . Если ведёте таких клиентов сами, посмотрите{" "}
          <Link href="/resursy/partnerskaya" className="font-semibold text-orange">
            партнёрскую программу
          </Link>
          .
        </p>
        <PageAdvantages path="/keysy" />
      </article>
      <CtaBand />
    </div>
  );
}
