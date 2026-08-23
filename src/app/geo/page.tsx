import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { SITE } from "@/lib/site";

const faqs = [
  {
    q: "GEO это вместо SEO?",
    a: "Нет. В коммерции России заявки чаще идут из Яндекса и Google. GEO закрывает второй вход: назвали ли вас, когда спросили «кого выбрать» у модели. Без витрины в поиске модели всё равно тянут агрегатор.",
  },
  {
    q: "Какие нейросети вы смотрите?",
    a: "GigaChat, YandexGPT, Алису, ChatGPT и Gemini. Десять западных площадок, которых у вас почти не спрашивают, в отчёт не кладём.",
  },
  {
    q: "Можно ли накрутить упоминания?",
    a: "Мы этого не делаем. Накрутка промптов и купленные цитаты потом всплывают. Чиним сайт и источники, с которых модели берут факты.",
  },
];

export const metadata: Metadata = {
  title: "Продвижение в нейросетях — GigaChat, ChatGPT, Алиса",
  description:
    "GEO и AEO для России: видимость в GigaChat, ChatGPT, Алисе и YandexGPT. Рядом ведём Яндекс и Google. Без накрутки и без покупки ссылок.",
  keywords: [
    "GEO оптимизация",
    "AEO",
    "продвижение в нейросетях",
    "видимость в ChatGPT",
    "продвижение в GigaChat",
    "Алиса продвижение",
    "YandexGPT",
  ],
  alternates: { canonical: "/geo" },
  openGraph: {
    title: "Продвижение в GigaChat, ChatGPT и Алисе — INNSONT",
    description:
      "Как попасть в ответы моделей на русском. Вместе с обычным поиском, не вместо него.",
    url: "/geo",
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
            "@type": "Service",
            name: "Продвижение в нейросетях",
            provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
            areaServed: "RU",
            serviceType: "GEO, AEO",
            description:
              "Видимость бренда в ответах GigaChat, ChatGPT, Алисы и YandexGPT. Рядом с продвижением в Яндексе и Google.",
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
      <article className="mx-auto max-w-[900px] px-5 py-12">
        <Breadcrumbs path="/geo" lastName="Продвижение в нейросетях" />
        <p className="text-sm text-muted">GEO и AEO · Россия</p>
        <h1 className="mt-3 text-4xl leading-[1.12] md:text-5xl">
          Продвижение в нейросетях: GigaChat, ChatGPT и Алиса
        </h1>
        <p className="mt-5 text-lg leading-relaxed">
          Часть людей уже не ищет список сайтов, а спрашивает модель, кого
          выбрать. Если на вашей странице нет цены, даты и прямого ответа, модель
          берёт агрегатор. Мы смотрим, называют ли вас, откуда берут факты, и
          чиним сайт. Рядом остаётся обычный{" "}
          <Link href="/seo" className="font-semibold hover:underline">
            поиск в Яндексе и Google
          </Link>
          , без него в коммерции заявок почти нет.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Посмотреть ваши формулировки
          </Link>
          <Link href="/resursy/rukovodstvo-geo" className="btn-outline">
            Руководство
          </Link>
        </div>

        <p className="mt-10 text-[17px] leading-[1.75]">
          GEO и AEO рынок называет по-разному, спорить про буквы бесполезно. Имеется
          в виду одно: видимость в ответах моделей плюс работа с сайтом, чтобы
          было что цитировать. Это не отдельная магия и не замена SEO. Без
          открытого доступа роботу и без факта на странице никакой llms.txt не
          поможет.
        </p>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Площадки, которые смотрим</h2>
          <ul className="mt-6 border-t border-line">
            {[
              {
                href: "/geo/gigachat",
                name: "GigaChat",
                desc: "Русскоязычные ответы Сбера, часто опирается на открытые карточки",
              },
              {
                href: "/geo/chatgpt",
                name: "ChatGPT",
                desc: "Сравнения и справка, цитаты домена",
              },
              {
                href: "/geo/alisa",
                name: "Алиса и YandexGPT",
                desc: "Голос и карточка организации, очень локально",
              },
              {
                href: "/geo/vs-seo",
                name: "GEO и SEO вместе",
                desc: "Почему нельзя закрыть только один слой",
              },
              {
                href: "/geo/agentstvo",
                name: "Агентство GEO",
                desc: "Чем кабинет отличается от подрядчика «под нейросети»",
              },
              {
                href: "/geo/reklama-ii",
                name: "Реклама ИИ",
                desc: "Видимость в ответах, не баннер в чате",
              },
            ].map((it) => (
              <li key={it.href} className="border-b border-line">
                <Link
                  href={it.href}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                >
                  <span className="font-semibold group-hover:underline">{it.name}</span>
                  <span className="text-sm text-muted sm:max-w-[22rem] sm:text-right">{it.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Что чинить раньше статей «для нейросетей»</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-[1.75]">
            <p>
              Робот должен видеть страницу. Потом на ней должен быть абзац, который
              не стыдно процитировать: цена, срок, отличие, дата обновления. Потом
              уже кластер соседних вопросов. Если начать с генерации текстов, модели
              продолжат брать чужой домен, где факты уже лежат кучей.
            </p>
            <p>
              Формулировки в моделях часто не совпадают с Wordstat. «Узи москва цена»
              и «какую клинику выбрать, если боюсь очереди» это разные ядра. Оба
              смотрим, не подменяем одно другим. Частоту в нейросетях снимает{" "}
              <Link href="/platforma/obem-ii-poiska" className="font-semibold hover:underline">
                объём ИИ-поиска
              </Link>
              , ежедневный трекинг живёт в{" "}
              <Link href="/platforma/monitoring-vidimosti" className="font-semibold hover:underline">
                мониторинге видимости
              </Link>
              .
            </p>
          </div>
        </section>

        <PageAdvantages path="/geo" />
        <FaqList items={faqs} />
        <SeeAlso
          title="Рядом"
          links={[
            { href: "/seo", title: "Продвижение в поиске", desc: "Яндекс, Google, витрина" },
            { href: "/platforma/issledovatel-brendov", title: "Исследователь брендов", desc: "Разовый прогон, кого называют вместо вас" },
            { href: "/instrumenty/llms-txt", title: "Генератор llms.txt", desc: "Файл в корень, без регистрации" },
            { href: "/resursy/rukovodstvo-geo", title: "Руководство AEO и GEO", desc: "Длинный разбор метода" },
          ]}
        />
      </article>
      <CtaBand
        title="Покажем, называют ли вас модели"
        text="Несколько формулировок по вашему рынку в GigaChat и ChatGPT. Без обещания вывести за месяц."
      />
    </div>
  );
}
