import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import {
  CompareTable,
  FeatureSplit,
  StatStrip,
  UseCase,
} from "@/components/ExploreMocks";
import {
  MockCiteSources,
  MockDailyVis,
  MockPageFix,
  MockSentiment,
} from "@/components/TrackMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "monitoring-vidimosti")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Как часто обновляется?",
    a: "Каждый день на платных тарифах. Не раз в секунду. Для коммерции в России суток хватает: выдача и ответы так быстро не прыгают.",
  },
  {
    q: "Смотрите только нейросети?",
    a: "Нет. На одном экране позиция в Яндексе, в Google и упоминание в ответе модели. Иначе команда чинит одно и пропускает заявки из другого.",
  },
  {
    q: "Какие площадки?",
    a: "На Старте — ChatGPT и GigaChat плюс поиск. На Базовом добавляются YandexGPT, Gemini и Google AI. Алиса, Claude и Perplexity — на Росте. Страна везде Россия, регион выдачи — ваш.",
  },
  {
    q: "Это то же, что исследователь брендов?",
    a: "Нет. Исследователь — разовый взгляд на любой бренд, без настройки. Мониторинг — ваши формулировки каждый день, с алертами. Сначала разведка, потом трекер.",
  },
];

export default function Page() {
  return (
    <div className="rays">
      <JsonLd
        data={[
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
          {
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "SoftwareApplication",
              name: `${SITE.name} — мониторинг видимости`,
            },
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            author: { "@type": "Person", name: "Марина Соколова" },
            reviewBody:
              "Думали, будет ещё один дашборд. По факту получили список: регион в Вебмастере, цены на карточках, три title. За месяц коммерция по Москве стала ровнее.",
          },
        ]}
      />
      <article className="mx-auto max-w-[1100px] px-5 py-12">
        <Breadcrumbs path={page.path} lastName="Мониторинг видимости" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.08] md:text-6xl">{page.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3a3632]">{page.lead}</p>
        <div className="cta-row mt-8">
          <Link href="/demo" className="btn-primary">
            Заказать демо
          </Link>
          <Link href="/registratsiya" className="btn-outline">
            5 запросов бесплатно
          </Link>
        </div>
        <StatStrip
          items={[
            { k: "Площадки", v: "Поиск + 5 моделей" },
            { k: "Рынок", v: "Россия, ваш регион" },
            { k: "Прогон", v: "Раз в сутки" },
            { k: "Старт", v: "25 формулировок" },
          ]}
        />

        <p className="mx-auto mt-12 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Человек в Яндексе смотрит список сайтов. В GigaChat спрашивает, кого
          выбрать. Обычный сервис видит только одно из двух. Мы кладём позицию в{" "}
          <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
            Яндексе
          </Link>
          , в{" "}
          <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
            Google
          </Link>{" "}
          и фразу из ответа модели в одну строку. Регион выдачи — ваш: Москва,
          Казань, тот город, где вы вообще работаете.
        </p>

        <FeatureSplit
          kicker="Видимость"
          title="Есть вы в ответе или нет. И на каком месте в поиске."
          mock={<MockDailyVis />}
        >
          <p>
            Не «доля голоса 50% по миру». Строка: формулировка, место в Яндексе,
            место в Google, назвали ли в ИИ. Если в поиске восьмое, а модель вас
            не знает — сначала витрина, потом тексты. Если наоборот — смотрим,
            что цитируют и чего нет на сайте.
          </p>
          <p>
            Ядро берём из{" "}
            <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
              Wordstat
            </Link>{" "}
            и из{" "}
            <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
              объёма ИИ-поиска
            </Link>
            . Все подряд не трекаем: на Старте 25 формулировок, на Базовом 80.
            Этого хватает, если не тащить в дашборд редкий хвост.
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Что говорят"
          title="Не только «упомянули». Какими словами описывают."
          mock={<MockSentiment />}
          flip
        >
          <p>
            Тональность на Старте не считаем — там и так два движка. На Росте
            видно, пишут ли «понятные ставки» или подставляют вчерашнюю цифру.
            Это не психологический портрет бренда. Это повод сверить карточку с
            тем, что модель уже успела запомнить.
          </p>
          <p>
            У{" "}
            <Link href="/keysy/centr-invest" className="font-semibold text-orange">
              «Центр-инвеста»
            </Link>{" "}
            как раз разошлись ставка на сайте и в ответе. Починили витрину —
            GigaChat начал брать цифру оттуда.
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Цитаты"
          title="Откуда модель взяла факт. Часто не с вашего домена."
          mock={<MockCiteSources />}
        >
          <p>
            Банки.ру, Сравни, Дзен, агрегатор клиник. Свой сайт внизу списка —
            обычная картина, не катастрофа. Список нужен, чтобы понять, куда
            нести свежие цифры. И чтобы не кормить модель закрытой справкой: это
            уже{" "}
            <Link href="/platforma/analitika-agentov" className="font-semibold text-orange">
              логи роботов
            </Link>
            .
          </p>
        </FeatureSplit>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Что с этим делать
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl md:text-4xl">
            Цифра без задачи быстро становится слайдом.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <UseCase title="Падение — в очередь" mock={<MockPageFix />}>
              <p>
                Вылетели из топ-10 или пропали из ответа — задача в{" "}
                <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
                  Центре действий
                </Link>
                . На Старте очереди нет: смотрите строку и чините сами. Этого
                хватает, чтобы понять, нужен ли Рост.
              </p>
            </UseCase>
            <UseCase title="Сравнить конкурента" mock={<MockCiteSources />}>
              <p>
                Двух-трёх, не двадцать. Разовый взгляд — в{" "}
                <Link href="/platforma/issledovatel-brendov" className="font-semibold text-orange">
                  исследователе
                </Link>
                . Ежедневно сторожим только тех, с кем реально делите запросы в
                вашем городе.
              </p>
            </UseCase>
            <UseCase title="Не забыть поиск" mock={<MockDailyVis />}>
              <p>
                В коммерции РФ заявки чаще идут из Яндекса и Google, не из
                ChatGPT. Мониторинг нарочно держит оба столбца. Иначе неделя
                уходит в «нас не цитирует ИИ», пока в Вебмастере висит регион.
              </p>
            </UseCase>
          </div>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Не американский радар на десять площадок</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Мы не обещаем «как живой пользователь по всему миру». Смотрим то, что
            видит человек в России: выдачу в вашем регионе и ответы моделей на
            русском. Остальное красиво смотрится в чужом лендинге.
          </p>
          <CompareTable
            leftTitle="Обычный SEO-сервис"
            rightTitle="Мониторинг INSONT"
            rows={[
              ["Поиск", "Яндекс или Google, редко оба", "Яндекс, Google, регион проекта"],
              ["Нейросети", "Нет или отдельный сервис", "GigaChat, ChatGPT и дальше по тарифу"],
              ["Ядро", "Ключи из Wordstat", "Wordstat + живые формулировки к моделям"],
              ["Что дальше", "Отчёт", "Строка → задача в очереди (с Роста)"],
            ]}
          />
        </section>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Преимущества
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl md:text-4xl">
            Почему с видимостью в России нам проще, чем «ещё одному трекеру»
          </h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Не потому что у нас десять площадок мира. Потому что смотрим то же,
            что видит ваш клиент: выдачу в городе и ответ на русском. И не
            бросаем на отчёте.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                t: "Поиск и модель в одной строке",
                d: "Яндекс, Google и GigaChat рядом. Обычный SEO-сервис не видит ответ модели. Чисто «ИИ-радар» не видит регион в Вебмастере. Из-за этого чинят не то.",
              },
              {
                t: "Ваш город, не Индия в одной таблице",
                d: "Регион выдачи — Москва, Казань, тот, где работаете. Формулировки на русском. Чужие рынки в отчёт не кладём.",
              },
              {
                t: "Ядро из спроса, не из головы",
                d: "Wordstat плюс то, как люди спрашивают у моделей. Не тащим в трекер редкий хвост «на всякий». На Старте 25 фраз — этого хватает, чтобы понять картину.",
              },
              {
                t: "Цифра падает в работу",
                d: "Провал — задача в Центре действий, не слайд. На Старте очередь смотрите сами. На Росте её собирает кабинет. Публикация — после вашего «ок».",
              },
              {
                t: "Ссылки не докупаем, цифры не раздуваем",
                d: "Не обещаем «видимость +400%» и не рисуем миллиарды диалогов. Смотрим узкий список. Если не выросло — переписываем смысл.",
              },
              {
                t: "Тот же кабинет, что чинит витрину",
                d: "Мониторинг не живёт отдельно от Автора статей и лога роботов. Иначе снова два подрядчика и два отчёта.",
              },
            ].map((x) => (
              <article key={x.t} className="card p-6">
                <h3 className="text-xl">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">{x.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Отзыв
          </p>
          <h2 className="mt-2 text-3xl">Как это выглядит через пару месяцев</h2>
          <figure className="card mt-6 p-6 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/reviews/marina.jpg"
                alt="Марина Соколова, SEO сети клиник «Северный свет», Москва"
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <blockquote className="min-w-0">
                <p className="text-lg leading-relaxed text-[#3a3632]">
                  «Думали, будет ещё один дашборд. По факту получили список:
                  регион в Вебмастере, цены на карточках, три title. За месяц
                  коммерция по Москве стала ровнее. Про GigaChat пока скромно —
                  нас начали упоминать в двух ответах из десяти. Для старта
                  хватило. Главное — больше не спорим, с чего начать неделю:
                  смотрим строку и чиним то, где нас нет.»
                </p>
                <figcaption className="mt-4 text-sm text-muted">
                  <span className="font-semibold text-ink">Марина Соколова</span>
                  {" · "}
                  SEO, сеть клиник «Северный свет», Москва
                </figcaption>
                <p className="mt-3 text-sm">
                  Похожий ход работ — в{" "}
                  <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
                    разборе СМ-Клиники
                  </Link>
                  : сначала витрина, потом упоминания.
                </p>
              </blockquote>
            </div>
          </figure>
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/platforma/issledovatel-brendov",
              title: "Исследователь брендов",
              desc: "Разовая сводка, пока проект ещё не заведён",
            },
            {
              href: "/platforma/obem-ii-poiska",
              title: "Объём ИИ-поиска",
              desc: "Какие формулировки вообще стоит трекать",
            },
            {
              href: "/platforma/tsentr-deystviy",
              title: "Центр действий",
              desc: "Куда падает провал видимости",
            },
            {
              href: "/pochemu-insont",
              title: "Почему один кабинет",
              desc: "Поиск и модели в одной очереди",
            },
            { href: "/keysy/nordteh", title: "Кейс Нордтех", desc: "Когда карточка с артикулом обошла агрегатор" },
            { href: "/tseny", title: "Тарифы", desc: "Старт хватает, чтобы посмотреть свои 25 фраз" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала увидеть, где вас нет."
        text="Покажем позиции в Яндексе и Google и где бренд стоит в GigaChat. Без покупки ссылок и без радара на весь мир."
      />
    </div>
  );
}
