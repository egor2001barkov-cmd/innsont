import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import {
  CompareTable,
  MockAudience,
  MockCities,
  MockFrequency,
  MockRelated,
  MockTrend,
} from "@/components/ExploreMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";
import type { ReactNode } from "react";

function Block({
  title,
  children,
  aside,
  flip,
}: {
  title: string;
  children: ReactNode;
  aside: ReactNode;
  flip?: boolean;
}) {
  return (
    <section className="mt-16 grid min-w-0 items-start gap-8 border-t border-line pt-10 lg:grid-cols-2 lg:gap-14">
      <div className={flip ? "lg:order-2" : ""}>
        <h2 className="text-2xl leading-snug md:text-[28px]">{title}</h2>
        <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-[#3a3632]">{children}</div>
      </div>
      <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>{aside}</div>
    </section>
  );
}

const page = FEATURES.find((p) => p.slug === "obem-ii-poiska")!;

export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Это то же самое, что Wordstat?",
    a: "Нет. Wordstat считает, что люди вбивают в Яндекс. Мы смотрим, как часто похожую мысль задают нейросетям. Часто это разные формулировки: в поиске «вклад калькулятор», у модели — «какой вклад открыть, если боюсь курса». Смотрим оба числа, не подменяем одно другим.",
  },
  {
    q: "Почему цифры такие небольшие?",
    a: "Потому что это не показы рекламы и не весь интернет. Это оценка по русскоязычным ответам на пяти площадках. 80 вопросов в месяц по узкой теме — уже повод писать страницу. Тысячи «как в Wordstat» тут почти не бывают.",
  },
  {
    q: "Почему только Россия?",
    a: "Потому что наш рынок здесь. Таблица «Индия 1 600, США 1 400» маркетологу в Казани не нужна. Режем спрос по городам России, не по странам мира.",
  },
  {
    q: "Какие площадки вы смотрите?",
    a: "GigaChat, YandexGPT, Алиса, ChatGPT и Gemini. На тарифе Старт — ChatGPT и GigaChat. Остальные открываются на Базовом и выше.",
  },
  {
    q: "Насколько точна аудитория по возрасту?",
    a: "Грубо. Модель не знает паспорт. Мы кладём формулировку в корзину по тому, о чём спрашивают. Для «с чего начать контент» хватает. Для точного медиаплана — нет. Так и пишем в кабинете.",
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
        ]}
      />
      <article className="mx-auto max-w-[1100px] px-5 py-12">
        <Breadcrumbs path={page.path} lastName="Объём ИИ-поиска" />
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
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
          Пять площадок, только Россия, срез по городам. Обновляем раз в неделю.
        </p>

        <p className="mt-10 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Семантику для поиска вы и так снимаете в{" "}
          <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
            Wordstat
          </Link>
          . Другое дело — когда человек уже не ищет список сайтов, а спрашивает
          «кому отдать деньги» у GigaChat или Алисы. Эти формулировки почти не
          попадают в классическое ядро. Мы их собираем и кладём рядом с частотой
          поиска, чтобы не писать статью «про вклады», если модели спрашивают
          совсем иначе.
        </p>

        <Block
          title="Высокая, средняя или низкая. Чтобы не трекать всё подряд."
          aside={<MockFrequency />}
        >
          <p>
            Это не «5 600 показов». Это оценка: формулировку часто, средне или
            редко встречаем в русскоязычных ответах. Нужна, чтобы отсечь шум.
            На{" "}
            <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
              ежедневный трекинг
            </Link>{" "}
            имеет смысл ставить то, что хотя бы средне живёт. Редкое — в бэклог,
            не в дашборд.
          </p>
          <p>
            Высокая частота по узкой теме в одном городе — уже повод. Низкая по
            всей России — обычно нет. Фильтр грубый, и это нормально: сначала
            отсекаем, потом смотрим тренд.
          </p>
        </Block>

        <Block
          title="Видно сезон, рост и выгорание. Не один столбец «за месяц»."
          aside={<MockTrend />}
          flip
        >
          <p>
            «Какой вклад открыть» в ноябре растёт почти у всех банков — люди
            думают, куда деть премию. Летом проседает. Если снимать только
            текущий месяц, легко принять сезон за «нам надо срочно десять
            статей».
          </p>
          <p>
            Смотрим 12 точек, не обещаем предсказание курса. Если кривая ползёт
            вверх, а бренда в ответах нет — это очередь в{" "}
            <Link href="/priorizirovat" className="font-semibold text-orange">
              Центр действий
            </Link>
            , не повод покупать ссылки.
          </p>
        </Block>

        <Block
          title="Не Индия и не США. Москва, Казань, тот город, где вы вообще работаете."
          aside={<MockCities />}
        >
          <p>
            Страна у нас одна. Режем спрос по городам, потому что коммерция в
            Яндексе живёт регионом. «Клиника УЗИ» в Москве и в Новосибирске —
            разный объём и разные конкуренты. Таблица на 40 стран тут была бы
            красивой и бесполезной.
          </p>
          <p>
            Если 70% вопросов из Москвы, а посадочная написана «для всей
            России», сначала чиним регион в{" "}
            <Link href="/seo/vebmaster" className="font-semibold text-orange">
              Вебмастере
            </Link>{" "}
            и карточку в{" "}
            <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
              Google Профиле
            </Link>
            . Потом уже думаем про нейросети.
          </p>
        </Block>

        <Block
          title="Возраст — оценка, не паспорт. Для плана хватает, для точности — нет."
          aside={<MockAudience />}
          flip
        >
          <p>
            Модели плохо знают, сколько человеку лет. Мы смотрим, о чём
            спрашивают и какими словами. «Какой вклад открыть, если зарплата
            серая» и «куда положить три миллиона» — разные люди, даже если
            интент один.
          </p>
          <p>
            Для клиники это обычно 25–44. Для окон — чуть старше. Не строим на
            этом медиаплан на миллион. Строим тон статьи и FAQ. Если нужны
            точные аудитории поиска — они по-прежнему в Метрике и в выдаче{" "}
            <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
              Яндекса
            </Link>
            .
          </p>
        </Block>

        <Block
          title="От одной фразы — карта темы. Длинный хвост, который складывается."
          aside={<MockRelated />}
        >
          <p>
            Люди редко повторяют один и тот же вопрос. Рядом с «какой вклад
            открыть» живут «ИИС или вклад», «накопительный счёт», «в рублях на
            год». По отдельности цифры скромные. Вместе — тема, на которую уже
            можно собрать кластер страниц.
          </p>
          <p>
            Отсюда кормим{" "}
            <Link href="/platforma/avtor-statey" className="font-semibold text-orange">
              Автора статей
            </Link>
            : не «напиши про вклады», а конкретные соседние вопросы, которые уже
            задают. И сверяем с ядром поиска, чтобы не плодить тексты, которых
            нет ни в Wordstat, ни у моделей.
          </p>
        </Block>

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="max-w-3xl text-2xl leading-snug md:text-[28px]">
            От частоты — к очереди работ. Три спокойных сценария.
          </h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Сами цифры никого не двигают. Двигают, когда из них понятно, что
            трекать, какую страницу писать и в каком городе не врать про
            присутствие.
          </p>
          <ol className="mt-8 max-w-3xl space-y-8">
            <li>
              <h3 className="text-lg font-semibold">1. Что ставить на трекинг</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#3a3632]">
                Все формулировки не уследить. Берём те, что хотя бы средне
                живут, и отправляем в{" "}
                <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
                  мониторинг видимости
                </Link>
                . Редкие оставляем в исследовании — без ежедневного шума.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-semibold">2. Где в контенте не хватает страницы</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#3a3632]">
                Часто спрашивают, а бренда в ответе нет — это не «надо больше
                SEO». Это конкретная страница или таблица, которой нет. У{" "}
                <Link href="/keysy/centr-invest" className="font-semibold text-orange">
                  «Центр-инвеста»
                </Link>{" "}
                сработало, когда ставки на сайте совпали с тем, что модели уже
                пытались ответить.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-semibold">3. В какой город расти</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#3a3632]">
                Не «выйти на Германию». Посмотреть, что Казань уже спрашивает, а
                посадочной нет. Для окон и клиник это обычная история: см.{" "}
                <Link href="/seo/kazan" className="font-semibold text-orange">
                  продвижение в Казани
                </Link>{" "}
                и{" "}
                <Link href="/seo/regionalnoe-prodvizhenie" className="font-semibold text-orange">
                  региональный поиск
                </Link>
                .
              </p>
            </li>
          </ol>
        </section>

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Рядом с Wordstat, не вместо него</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Классический поиск никуда не делся. В коммерции РФ заявки по-прежнему
            чаще приходят из{" "}
            <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
              Яндекса
            </Link>{" "}
            и{" "}
            <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
              Google
            </Link>
            . Объём ИИ-поиска нужен, чтобы не слепнуть во втором канале, а не
            чтобы выключить первый.
          </p>
          <CompareTable
            leftTitle="Wordstat и поиск"
            rightTitle="Объём ИИ-поиска"
            rows={[
              [
                "Что считает",
                "Запросы в Яндексе, плюс смотрим Google",
                "Как часто мысль задают нейросетям",
              ],
              ["Страна", "Россия, регион выдачи", "Только Россия, срез по городам"],
              ["Цифра", "Часто сотни и тысячи", "Обычно десятки, редко сотни"],
              [
                "Зачем",
                "Ядро, кластеры, посадочные",
                "Что трекать в ответах и какие FAQ писать",
              ],
              [
                "Куда кладём",
                "Аудит, семантика, Вебмастер",
                "Мониторинг, Автор статей, очередь работ",
              ],
            ]}
          />
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/platforma/issledovatel-brendov",
              title: "Исследователь брендов",
              desc: "Разовая сводка: кого модели называют вместо вас",
            },
            {
              href: "/platforma/monitoring-vidimosti",
              title: "Мониторинг видимости",
              desc: "Ежедневный трекинг тех формулировок, что отобрали здесь",
            },
            {
              href: "/seo/semantika-wordstat",
              title: "Семантика и Wordstat",
              desc: "Спрос в поиске — вторая колонка той же таблицы",
            },
            {
              href: "/keysy/centr-invest",
              title: "Кейс «Центр-инвест»",
              desc: "Когда ставки на сайте и ответы моделей наконец совпали",
            },
            { href: "/priorizirovat", title: "Центр действий", desc: "Куда падает растущий запрос без вашей цитаты" },
            { href: "/tseny", title: "Тарифы", desc: "На Старте — 3 прогона объёма, этого хватает пощупать" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала частота, потом статьи."
        text="Покажем, какие формулировки в России вообще живут — и чего нет в Wordstat. Без покупки ссылок и без сказки про миллиарды диалогов."
      />
    </div>
  );
}
