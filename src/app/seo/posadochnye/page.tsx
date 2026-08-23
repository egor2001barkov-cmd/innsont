import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { LandingsLinksMock, LandingsListMock } from "@/components/TechMocks";
import { SITE } from "@/lib/site";

const faqs = [
  {
    q: "Нужна страница на каждый район?",
    a: "Нет. Только там, где вы принимаете или выезжаете. Клон «услуга + метро» без точки Яндекс со временем подчищает, а человек злится, когда не может приехать.",
  },
  {
    q: "Главной недостаточно?",
    a: "Главная не отвечает на «узи цена москва» и «окна в ЗАО сроки». Под кластер из Wordstat нужна своя посадочная: услуга, город, факт на виду.",
  },
  {
    q: "Статью можно считать посадочной?",
    a: "Если в топе гиды — да, это информационный кластер. Коммерческий запрос на статье без цены обычно проигрывает витрине. Связываем: гид ведёт на услугу.",
  },
  {
    q: "Кто публикует страницу?",
    a: "Черновик заголовка, блоки и внутренние ссылки смотрите вы. Кабинет сам на сайт не заливает.",
  },
];

export const metadata: Metadata = {
  title: "Посадочные страницы: кластер, город, перелинковка",
  description:
    "Как INNSONT собирает посадочные: одно намерение — один URL, город где вы работаете, перелинковка от справки к услуге. Без клонов на всю страну.",
  keywords: [
    "посадочные страницы",
    "посадочная страница SEO",
    "кластеризация посадочных",
    "перелинковка сайта",
    "городские посадочные",
  ],
  alternates: { canonical: "/seo/posadochnye" },
  openGraph: {
    title: "Посадочные страницы — INNSONT",
    description:
      "Кластер из Wordstat, город как есть, перелинковка без «купить купить». Клонов районов нет.",
    url: "/seo/posadochnye",
    locale: "ru_RU",
    type: "website",
  },
};

export default function Page() {
  return (
    <div>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Посадочные страницы",
            description: metadata.description,
            url: `${SITE.url}/seo/posadochnye`,
            inLanguage: "ru-RU",
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
        ]}
      />
      <article className="mx-auto max-w-[800px] px-5 py-14">
        <Breadcrumbs path="/seo/posadochnye" lastName="Посадочные страницы" />
        <p className="text-sm text-muted">SEO · страницы</p>
        <h1 className="mt-3 text-4xl leading-[1.12] md:text-5xl">
          Посадочная — это ответ на один вопрос, а не копия главной
        </h1>
        <p className="mt-5 text-lg leading-relaxed">
          Человек ищет услугу, город, цену, «рядом». Главная это не закрывает.
          Под кластер из{" "}
          <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
            Wordstat
          </Link>{" "}
          нужна своя страница: что это, сколько стоит, как записаться, где вы
          сидите. Если в топе витрины — на URL должна быть{" "}
          <Link href="/seo/kommercheskie-faktory" className="font-semibold text-orange">
            коммерция
          </Link>
          , не гид «что такое УЗИ».
        </p>
        <p className="mt-4 leading-relaxed">
          Мы не плодим посадочные на все станции метро и не пишем «город-клон»
          с одной водой. Страница появляется там, где вы правда работаете: филиал,
          выезд, зона доставки. Город в Вебмастере, в карточке и на сайте один и
          тот же. Иначе Яндекс отдаёт запрос соседу, у которого адрес совпадает.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Разобрать ваши URL
          </Link>
          <Link href="/seo/regionalnoe-prodvizhenie" className="btn-outline">
            Региональное SEO
          </Link>
        </div>

        <LandingsListMock />

        <h2 className="mt-14 text-2xl md:text-[28px]">Как собираем список</h2>
        <p className="mt-4 leading-relaxed">
          Сначала ядро: частота, хвосты, регион, сезон. Потом смотрим выдачу. Если
          в топ-10 карточки с ценой — кластер коммерческий, ему нужна услуга или
          филиал. Если гиды — информационный URL, который потом ссылкой тянет
          коммерцию. Каша «купить / что это / отзывы» на одном адресе не ранжируется
          ни в Яндексе, ни в Google.
        </p>
        <p className="mt-4 leading-relaxed">
          Прежде чем заводить страницу, проверяем,{" "}
          <Link href="/seo/robots-txt" className="font-semibold text-orange">
            пускает ли robots
          </Link>{" "}
          робота на этот путь. Писать текст в закрытый раздел бессмысленно:
          человек в браузере его увидит, поиск — нет.
        </p>

        <LandingsLinksMock />

        <h2 className="mt-14 text-2xl md:text-[28px]">Перелинковка без искусственных анкоров</h2>
        <p className="mt-4 leading-relaxed">
          Статья «как готовиться» ведёт на запись и цену. Карточка услуги ведёт
          на филиал, если филиал есть. Филиал не ссылается на двадцать чужих
          районов. Вес не сливаем в архив, теги и «ещё по теме» из генератора.
        </p>
        <p className="mt-4 leading-relaxed">
          Анкор — фраза, которую можно сказать вслух: «запись на УЗИ», «срок
          замера в ЗАО», не ключ три раза подряд. Title и description честные:
          запрос, оффер, город. Если по строке перестали кликать —{" "}
          <Link href="/seo/metategi" className="font-semibold text-orange">
            обновляем сниппет
          </Link>
          , а не плодим ещё один URL.
        </p>
        <p className="mt-4 leading-relaxed">
          Черновик страницы, внутренние ссылки и файл{" "}
          <Link href="/seo/robots-txt" className="font-semibold text-orange">
            robots.txt
          </Link>{" "}
          смотрите вы. Можно отклонить. Кабинет не публикует сам.
        </p>

        <PageAdvantages path="/seo/posadochnye" />
        <FaqList items={faqs} />
        <SeeAlso
          links={[
            { href: "/seo/semantika-wordstat", title: "Семантика Wordstat" },
            { href: "/seo/robots-txt", title: "robots.txt" },
            { href: "/seo/kommercheskie-faktory", title: "Коммерческие факторы" },
            { href: "/seo/regionalnoe-prodvizhenie", title: "Региональное SEO" },
            { href: "/seo/teksty", title: "SEO тексты" },
            { href: "/seo/metategi", title: "Title и description" },
          ]}
        />
      </article>
      <CtaBand
        title="Покажем, каких посадочных не хватает"
        text="Кластеры из Wordstat, где спрос есть, а URL нет — или страница есть, а цены и города на ней нет."
      />
    </div>
  );
}
