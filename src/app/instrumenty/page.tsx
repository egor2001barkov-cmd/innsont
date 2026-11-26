import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/SiteChrome";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { SITE } from "@/lib/site";
import { SITE_TOOLS } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "Бесплатные инструменты вебмастера: SEO и GEO-проверки",
  description:
    "Бесплатные проверки без регистрации: очеловечиватель текста, генератор llms.txt, каннибализация, что видит робот. Результат за полминуты.",
  alternates: { canonical: "/instrumenty" },
  openGraph: {
    images: [{ url: "/og/og-default.png", width: 1200, height: 630 }],
    title: "Бесплатные инструменты вебмастера — INSONT",
    description:
      "Четыре проверки без регистрации: очеловечиватель текста, генератор llms.txt, каннибализация и то, что видит в странице робот.",
    url: "/instrumenty",
    locale: "ru_RU",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Нужна ли регистрация?",
    a: "Нет. Все четыре инструмента работают без кабинета и без почты. Есть только защита от перегрузки: несколько проверок за 10 минут с одного адреса.",
  },
  {
    q: "Что из этого относится к SEO, а что — к GEO?",
    a: "Каннибализация и проверка обхода — про классический поиск: какие страницы за какие запросы отвечают и видит ли их робот. Генератор llms.txt и очеловечиватель помогают тем, кто читает сайт моделями: роботам GPTBot, GigaChat и YandexGPT нужен ориентир по сайту и текст без машинных оборотов.",
  },
  {
    q: "Куда положить готовый llms.txt?",
    a: "В корень сайта по адресу /llms.txt — так же, как robots.txt. Файл дополняет карту сайта и не заменяет её: поисковики sitemap читают по-своему.",
  },
  {
    q: "Что делать с текстом после автоочистки?",
    a: "Перечитать. Автоочистка убирает только шаблонные связки и хвосты, но не решает, всё ли в тексте верно. Факты, цифры и ссылки остаются вашими.",
  },
];

export default function ToolsPage() {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Бесплатные инструменты вебмастера",
    description: metadata.description,
    url: `${SITE.url}/instrumenty`,
    inLanguage: "ru-RU",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    hasPart: SITE_TOOLS.map((t) => ({
      "@type": "WebApplication",
      name: t.title,
      url: `${SITE.url}${t.path}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
    })),
  };
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14">
      <JsonLd data={json} />
      <Breadcrumbs path="/instrumenty" />
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">Бесплатно</p>
      <h1 className="mt-3 text-4xl md:text-5xl">Инструменты вебмастера без регистрации</h1>
      <p className="mt-4 text-lg text-muted">
        Четыре проверки для тех, кто сам ведёт сайт: найти страницы-двойники, убедиться, что
        робот видит текст, собрать llms.txt и убрать машинные обороты из статьи.
      </p>
      <div className="mt-8 space-y-6">
        {SITE_TOOLS.map((t) => (
          <section key={t.path} className="card p-6">
            <h2 className="text-2xl">
              <Link href={t.path} className="hover:text-orange">
                {t.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted">{t.short}</p>
            {t.about.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-[15px] leading-relaxed">
                {p}
              </p>
            ))}
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              {t.points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
            <Link href={t.path} className="btn-outline mt-4 inline-flex">
              Открыть инструмент
            </Link>
          </section>
        ))}
      </div>
      <PageAdvantages path="/instrumenty" />
      <FaqList items={FAQ} />
      <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-muted">
        Аудит всего сайта, каннибализация по sitemap и перелинковка с планом ссылок — в{" "}
        <Link href="/platforma" className="font-semibold text-orange">
          кабинете INSONT
        </Link>
        . Условия — на странице{" "}
        <Link href="/tseny" className="font-semibold text-orange">
          тарифов
        </Link>
        .
      </p>
    </div>
  );
}
