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
import { MockBotErrors, MockBotLog, MockBotVisits, MockRobots } from "@/components/TrackMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "analitika-agentov")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Зачем, если есть Метрика?",
    a: "Метрика считает людей в браузере. Роботы JavaScript не выполняют — их там нет. Человек, который пришёл из ответа Алисы, часто садится в «прямые». Мы смотрим сервер: кто стучался, что получил, откуда потом кликнули.",
  },
  {
    q: "Нужен ли счётчик на сайт?",
    a: "Для полной картины — доступ к логам хостинга или лёгкий сборщик. Базовые заходы Яндекса и Google видны и без него. WordPress, Битрикс, Тильда, Nginx на Selectel или Timeweb — подключаем то, что у вас есть, не только Cloudflare.",
  },
  {
    q: "Вы что-то меняете в robots сами?",
    a: "Нет. Кладём черновик правки в Центр действий. На сайт уйдёт после вашего «ок».",
  },
  {
    q: "Это 152-ФЗ и персональные данные?",
    a: "В логе роботов персональных данных почти нет: user-agent, путь, код ответа, время. Людей из ответа модели считаем без имён. Данные остаются в контуре проекта.",
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
        <Breadcrumbs path={page.path} lastName="Аналитика роботов" />
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
            { k: "Где считаем", v: "Сервер, не JS" },
            { k: "Кого видим", v: "Яндекс, Google, GPT, GigaChat" },
            { k: "Счётчик", v: "Не обязателен" },
            { k: "Цифры", v: "Десятки заходов, не сотни тысяч" },
          ]}
        />

        <p className="mx-auto mt-12 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Если модели вас не цитируют, сначала проверьте, доходят ли они до
          страницы. Половина историй — закрытый раздел, 403 на справке, 404 на
          старом URL, который всё ещё торчит в индексе. Это не видно в Метрике и
          почти не видно в GA4. Видно в логе.
        </p>

        <FeatureSplit
          kicker="Кто ходит"
          title="Яндекс, Google, GPTBot, робот GigaChat. Не «191 тысяча визитов»."
          mock={<MockBotVisits />}
        >
          <p>
            На обычном коммерческом сайте за месяц — десятки и сотни заходов
            ботов, не сотни тысяч. Яндекс и Google ходят чаще: они ищут. GPTBot
            и GigaChat — реже, и каждый промах больнее: один 403, и цитаты нет.
          </p>
          <p>
            Смотрим, кого пускаете. Иногда blog закрыт «на всякий случай», а
            именно оттуда модели берут FAQ. Проверить руками можно в{" "}
            <Link href="/instrumenty/proverka-krawlerov" className="font-semibold text-orange">
              проверке обхода
            </Link>
            .
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Люди из ответов"
          title="Клик из Алисы или ChatGPT Метрика часто кладёт в «прямые»."
          mock={<MockBotLog />}
          flip
        >
          <p>
            Человек переходит из ответа — реферер кривой или пустой. Мы пытаемся
            связать цитату в{" "}
            <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
              мониторинге
            </Link>{" "}
            и заход на ту же страницу в ближайшие часы. Это оценка, не идеальная
            атрибуция. Для «нас хоть кто-то открывает после ответа» хватает.
          </p>
          <p>
            У{" "}
            <Link href="/keysy/moysklad" className="font-semibold text-orange">
              МойСклада
            </Link>{" "}
            справка была за логином. Робот не заходил. После открытия
            документация попала и в индекс, и в ответы «как настроить».
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Ошибки"
          title="404 и 500, которые видит бот. Страница для человека при этом живая."
          mock={<MockBotErrors />}
        >
          <p>
            Фильтры каталога отдают 500 роботу и 200 человеку. Справка закрыта
            авторизацией. Старый URL из блога 2024-го отдаёт 404, а модель всё
            ещё помнит его. Такие вещи чинятся точечно, без «технического
            аудита на 80 страниц».
          </p>
          <p>
            Задача падает в{" "}
            <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
              Центр действий
            </Link>{" "}
            или в{" "}
            <Link href="/seo/tekhnicheskiy-audit" className="font-semibold text-orange">
              технический аудит
            </Link>
            , если дыр много.
          </p>
        </FeatureSplit>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Как подключаем
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl md:text-4xl">
            Не только Cloudflare. То, на чём сайт уже стоит.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="card p-6">
              <h3 className="text-xl">1. Смотрим стек</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Nginx, WordPress, Битрикс, Тильда, Selectel, Timeweb, Beget,
                иногда Cloudflare. Не тащим вас на чужой хостинг ради лога.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl">2. Открываем доступ</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Кусок access-лога или лёгкий сборщик. Без тяжёлого тега на
                каждую страницу. На скорость сайта не садимся.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl">3. Связываем с цитатой</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Если бот не ходит — чиним доступ. Если ходит, а цитаты нет —
                дело уже в тексте и витрине, не в robots.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          <UseCase title="Закрытый раздел" mock={<MockRobots />}>
            <p>
              Типичный Disallow на /blog или /spravka. Для Яндекса ещё
              пролезает. Для GPTBot — нет. Дифф кладём в очередь, не применяем
              молча.
            </p>
          </UseCase>
          <UseCase title="Живой лог" mock={<MockBotLog />}>
            <p>
              Не «реальное время для галочки». Достаточно видеть сегодняшний
              утренний обход: кто пришёл после вчерашней правки title.
            </p>
          </UseCase>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Метрика считает людей. Мы — ещё и роботов.</h2>
          <CompareTable
            leftTitle="Метрика / GA4"
            rightTitle="Аналитика роботов"
            rows={[
              ["Как считает", "Скрипт в браузере", "Лог сервера"],
              ["Яндекс, Google", "Частично, как «боты»", "Каждый заход, путь, код"],
              ["GPTBot, GigaChat", "Не видно", "Видно"],
              ["Человек из ответа ИИ", "Часто «прямые»", "Пытаемся связать с цитатой"],
              ["404 роботу", "Нет", "Список URL"],
            ]}
          />
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/instrumenty/proverka-krawlerov",
              title: "Проверка обхода",
              desc: "Быстро глянуть, пускаете ли вы роботов",
            },
            {
              href: "/seo/tekhnicheskiy-audit",
              title: "Технический аудит",
              desc: "Если 404 не один, а система",
            },
            {
              href: "/platforma/tsentr-deystviy",
              title: "Центр действий",
              desc: "Куда падает закрытый blog",
            },
            {
              href: "/instrumenty/llms-txt",
              title: "llms.txt",
              desc: "Короткий файл, который модели иногда читают",
            },
            { href: "/keysy/moysklad", title: "Кейс МойСклад", desc: "Справка за логином не цитируется" },
            { href: "/tseny", title: "Тарифы", desc: "Базовые заходы видны уже на Старте" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала пустить робота. Потом ждать цитату."
        text="Посмотрим лог: кто ходит, где 403, что закрыто «на всякий случай». Без тега, который тормозит сайт."
      />
    </div>
  );
}
