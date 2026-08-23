import { AgencyPlans, CompareTable, PricingCards } from "@/components/Pricing";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { PageAdvantages } from "@/components/Advantages";
import { PLANS, SITE } from "@/lib/site";
import type { Metadata } from "next";
import { FaqList } from "@/components/FaqList";

export const metadata: Metadata = {
  title: "Тарифы INSONT — Старт, Базовый, Рост и контур для агентств",
  description:
    "Старт от 4 490 ₽ при годе, Базовый 10 790 ₽, Рост 22 490 ₽. Для агентств — питч 8 910 ₽ и корпоративный от 59 900 ₽ по счёту. Рубли, 152-ФЗ.",
  alternates: { canonical: "/tseny" },
  openGraph: {
    title: "Тарифы INSONT | Старт, Базовый, Рост",
    description:
      "Месяц или год (−10%): Старт 4 490 ₽, Базовый 10 790 ₽, Рост 22 490 ₽ /мес при оплате года.",
    url: "/tseny",
    locale: "ru_RU",
  },
};

const faqs = [
  {
    q: "Какой тариф выбрать?",
    a: "Старт — если вы один и хотите понять видимость в Яндексе, Google и Bing. Базовый — если пишете контент постоянно. Рост — если агентство или команда отрабатывает очередь: Центр действий, агенты, API.",
  },
  {
    q: "Нужна ли карта, чтобы начать?",
    a: "Нет. Регистрация даёт 5 бесплатных запросов. Карта или счёт — когда лимит кончился и берёте тариф.",
  },
  {
    q: "Чем год отличается от месяца?",
    a: "Годовая оплата даёт скидку 10% относительно месяца. Платите 12 месяцев сразу. Сменить тариф можно в любой момент.",
  },
  {
    q: "Какие системы на каком тарифе?",
    a: "На всех тарифах — Яндекс, Google и Bing. Разница в лимитах промптов, проектов и задачах.",
  },
  {
    q: "Что такое Центр действий и почему он только в Росте?",
    a: "Это очередь работ по влиянию на видимость: контент, цитаты, техника. На Старте и Базовом вы видите разрыв и пишете сами. Рост закрывает разрыв агентами — поэтому он дороже.",
  },
  {
    q: "Можно добавить пользователей?",
    a: "На Старте — нет, один кабинет. Базовый и Рост: дополнительные места по 1 490 ₽/мес.",
  },
  {
    q: "Если не хватает статей?",
    a: "На Росте пакет +15 статей за 2 490 ₽. Либо перейдите с Старта на Базовый — там 20 статей вместо 5.",
  },
  {
    q: "Есть ли тариф для холдинга и агентства?",
    a: "Да. Питч для агентства — 8 910 ₽/мес при годе, до 20 коротких проектов. Корпоративный — от 59 900 ₽ по счёту: кабинеты клиентов, отчёты под вашим брендом, стратег, 152-ФЗ. Это не самообслуживание.",
  },
  {
    q: "Можно сменить тариф или отменить?",
    a: "Да. Апгрейд сразу. Понижение и отмена — со следующего цикла. Возврат 7 дней без вопросов.",
  },
  {
    q: "Как платить из России?",
    a: "Счёт юрлица, карта МИР, СБП. НДС в счёте. Договор и закрывающие — в ЭДО.",
  },
];

export default function PricingPage() {
  return (
    <div className="rays">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: "INSONT",
            brand: SITE.name,
            description: "Платформа GEO и AEO. Три тарифа: Старт, Базовый, Рост.",
            offers: PLANS.map((p) => ({
              "@type": "Offer",
              name: p.name,
              price: String(p.priceAnnual),
              priceCurrency: "RUB",
              url: `${SITE.url}/tseny`,
            })),
          },
        ]}
      />
      <section className="mx-auto max-w-[1200px] px-5 pt-10">
        <Breadcrumbs path="/tseny" />
      </section>
      <section className="mx-auto max-w-[1200px] px-5 py-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Тарифы
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl">Цены в рублях. Счёт, если нужно.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Старт, Базовый и Рост — сами в кабинете. Агентству — питч по клиентам
          и корпоративный контур по договору.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-4 px-5 pb-10 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.id} className="card p-5 text-left">
            <div className="text-xs font-extrabold uppercase tracking-wide text-orange">
              {p.name} · {p.audience}
            </div>
            <h2 className="mt-2 text-xl font-extrabold">{p.job}</h2>
            <p className="mt-2 text-sm font-semibold text-[#3a3632]">{p.forWho}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-8">
        <PricingCards />
        <CompareTable />
      </section>

      <section className="mx-auto max-w-[1100px] px-5 pb-8">
        <AgencyPlans />
      </section>

      <section className="mx-auto max-w-[1100px] px-5">
        <PageAdvantages path="/tseny" />
        <FaqList items={faqs} />
      </section>
      <CtaBand />
    </div>
  );
}
