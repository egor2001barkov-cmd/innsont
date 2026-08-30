import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, JsonLd } from "@/components/SiteChrome";
import {
  ActionCenterShowcase,
  ActTrio,
  HomeCabinet,
  HomeAppShots,
  HeroPlanStrip,
  HomeHeroSuite,
  HomeMidBanner,
  HomePlansTeaser,
  HomeWhatWeDo,
  HomeWho,
  ProofCta,
  ScaleCards,
  SeoBridge,
  StepBadge,
} from "@/components/Showcase";
import { IndustryIcon } from "@/components/Icons";
import {
  HomeCompare,
  HomeLandings,
  HomeRobots,
  HomeScanner,
  HomeStrategies,
  HomeValues,
} from "@/components/HomeExtra";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Продвижение сайта в Яндексе и Google — INSONT",
  },
  description: SITE.description,
  keywords: [
    "белое SEO",
    "белое продвижение сайта",
    "SEO Яндекс",
    "продвижение в Яндексе",
    "Яндекс Вебмастер",
    "Wordstat семантика",
    "коммерческие факторы Яндекс",
    "региональное SEO",
    "продвижение сайта в Google",
    "вывод сайта в топ",
    "SEO оптимизация сайта Россия",
    "видимость в GigaChat",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Продвижение сайта в Яндексе и Google — INSONT",
    description: SITE.description,
    url: "/",
    locale: "ru_RU",
    type: "website",
  },
};

const platforms = ["Яндекс", "Google", "Bing"];

const brands = [
  "Нордтех",
  "Азбука Вкуса",
  "Банк «Центр-инвест»",
  "СМ-Клиника",
  "Теремок",
  "МойСклад",
  "Фоксфорд",
  "Фабрика Окон",
  "Орматек",
  "Coffee Like",
];

export default function HomePage() {
  return (
    <div>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "ул. Академика Королёва, 5",
              addressLocality: "Москва",
              postalCode: "127427",
              addressCountry: "RU",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: SITE.name,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: SITE.description,
            featureList: [
              "Продвижение в Яндексе, Google и других поисковиках",
              "Семантика Wordstat, коммерческие факторы, Вебмастер и Search Console",
              "Видимость в Яндексе, Google и Bing",
              "Видимость в ответах GigaChat",
            ],
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "RUB",
              lowPrice: "4490",
              highPrice: "24990",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "612",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Автоматическое SEO и GEO продвижение",
            provider: { "@type": "Organization", name: SITE.name },
            areaServed: "RU",
            serviceType: "SEO, GEO, AEO",
            description:
              "Продвигаем сайт в Яндексе, Google и ответах нейросетей. Чтобы вас находили, когда человек ищет услугу или спрашивает, кого выбрать.",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Как вы продвигаете сайт?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "В рамках рекомендаций Яндекса для вебмастеров и правил Google для сайтов: спрос, витрина, регион, техника, полезные страницы. Публикация только после вашего согласия.",
                },
              },
              {
                "@type": "Question",
                name: "Чем SEO в INSONT заточено под Россию?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ядро из Wordstat и подсказок Google, регион, витрина, Вебмастер и Search Console, сниппеты, карточки организаций. Тексты без воды. Яндекс и Google ведём вместе, не вместо друг друга.",
                },
              },
              {
                "@type": "Question",
                name: "Как платформа выводит сайт в топ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Агенты собирают семантику, усиливают коммерческие страницы, ставят честные title и description, чинят техничку и пишут полезный контент. Позиции в Яндексе и Google и ИИ-видимость меряются в одном цикле.",
                },
              },
            ],
          },
        ]}
      />

      <section className="rays min-w-0">
        <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-14 text-center">
          <p className="wordmark text-[12px] text-orange sm:text-[13px]">INSONT</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-muted">
            Поиск и нейросети
          </p>
          <h1 className="mx-auto mt-4 max-w-5xl text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
            Продвигаем сайт в{" "}
            <span className="text-orange">Яндексе, Google</span>
            {" "}и других поисковиках
          </h1>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {platforms.map((p) => (
              <span
                key={p}
                className="rounded-full border border-line bg-paper px-3 py-1 text-sm"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Когда человек ищет услугу или спрашивает нейросеть, кого выбрать,
            он должен попасть к вам, а не к соседу. INSONT находит, где вас
            нет, готовит страницы и правки, публикует после вашего «ок». Один
            кабинет на Яндекс, Google и ответы GigaChat с ChatGPT.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo" className="btn-primary">
              Заказать демо
            </Link>
            <Link href="/registratsiya" className="btn-outline">
              5 запросов бесплатно
            </Link>
          </div>
          <HeroPlanStrip />
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium text-ink/70">
            Следуем рекомендациям Яндекса для вебмастеров и правилам Google
            для сайтов. Bing подхватывает те же страницы.
          </p>
          <HomeHeroSuite />
        </div>

        <HomeAppShots />

        <div className="mx-auto grid max-w-[1100px] gap-4 px-5 pb-16 md:grid-cols-2">
          <CompareCard
            label="До"
            brand="Волна"
            score="12%"
            note="Волну почти не упоминают. 284 промпта называют конкурентов."
            rows={[
              ["Большинству", "Яндекс Музыка", "Уже в приложении, бесплатно"],
              ["Продвинутым", "Звук", "Очередь, скорость, офлайн"],
            ]}
            featured={false}
          />
          <CompareCard
            label="После"
            brand="Волна"
            score="+71%"
            note="Волна в ответах. Упоминается в 71 из 100 отслеживаемых промптов."
            rows={[
              ["Большинству", "Волна", "Каталог, свои шоу, без подписки"],
              ["Продвинутым", "Звук", "Очередь, скорость, офлайн"],
            ]}
            featured
          />
        </div>
      </section>

      <HomeWhatWeDo />
      <HomeValues />
      <HomeCompare />
      <HomeRobots />
      <HomeLandings />
      <div className="mx-auto max-w-[1200px] px-5">
        <PageAdvantages path="/" />
      </div>
      <HomeScanner />
      <HomeStrategies />
      <HomeWho />
      <HomeMidBanner />

      <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Что умеет сервис
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
          Поиск в России: Яндекс, Google и не только
        </h2>
        <p className="mt-4 max-w-3xl text-muted">
          В коммерции часто сильнее Яндекс: регион, витрина, сниппет, Вебмастер.
          В B2B, IT и брендовых запросах сильнее Google и Search Console. Bing
          обычно подтягивается сам. Параллельно смотрим, называет ли вас
          GigaChat и ChatGPT.
        </p>
        <div className="reveal-stagger mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "wordstat",
              href: "/seo/semantika-wordstat",
              t: "Семантика Wordstat",
              d: "Ядро из Яндекс.Вордстат: частота, «хвосты», регион, сезон. Кластеры под интент: информационный отдельно от коммерческого, без каши на одной URL.",
            },
            {
              icon: "shop",
              href: "/seo/kommercheskie-faktory",
              t: "Коммерческие факторы",
              d: "Цены, наличие, контакты, способы оплаты и доставки, ассортимент, отзывы, регион на странице. То, без чего Яндекс почти не пускает витрину в топ. Google смотрит то же.",
            },
            {
              icon: "turizm",
              href: "/seo/regionalnoe-prodvizhenie",
              t: "Регион и локальность",
              d: "Привязка к региону в Вебмастере, Яндекс Бизнес и Картах, уникальные посадочные под города. Без дорвеев и шаблонных «городов-клонов».",
            },
            {
              icon: "pages",
              href: "/seo/metategi",
              t: "Метатеги и сниппеты",
              d: "Честный title и description под Яндекс, Google и Bing: запрос, оффер, город. Без переспама и капслока. Обновляем, если по строке перестали кликать.",
            },
            {
              icon: "diagnose",
              href: "/seo/vebmaster",
              t: "Вебмастер и Search Console",
              d: "Индексация, ошибки, зеркало, товары. Смотрим оба кабинета: Вебмастер для Яндекса, Search Console для Google.",
            },
            {
              icon: "edu",
              href: "/seo/teksty",
              t: "Полезные тексты",
              d: "Страницы для людей: смысл, факты, структура, вопросы и ответы. Не простыня с ключами. Поисковики такое снижают — мы так не пишем.",
            },
            {
              icon: "saas",
              href: "/seo/tekhnicheskiy-audit",
              t: "Техника",
              d: "robots, карта сайта, скорость, мобильная версия, разметка. Страница должна открываться роботам, а не только в браузере. Битрикс, Tilda, WordPress.",
            },
            {
              icon: "growth",
              href: "/seo/prodvizhenie-sayta",
              t: "Внутренняя перелинковка",
              d: "Кластеры тянут коммерцию. Анкоры естественные, без «купить купить купить». Вес не утекает в технические разделы.",
            },
            {
              icon: "agency",
              href: "/seo/pravila-poiska",
              t: "Честные упоминания",
              d: "Обзоры, СМИ, VC, Дзен, отраслевые площадки — только там, где материал уместен. Не биржи ссылок и не сетки сайтов.",
            },
          ].map((item) => (
            <Link key={item.t} href={item.href} className="tile block p-6">
              <span className="tile-icon icon-sheen flex h-11 w-11 items-center justify-center rounded-lg text-[#b4531e]">
                <IndustryIcon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <HomeCabinet />

      <section className="mx-auto max-w-[1200px] px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Как продвигаем сайт
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">Четыре шага, без покупки ссылок</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Подключаете домен и Вебмастер. Дальше очередь понятная: сначала
          смотрим, потом чиним, потом меряем. Не «сто ссылок на неделю».
        </p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              n: "01",
              icon: "diagnose",
              t: "Диагностика",
              d: "Позиции в Яндексе по региону и в Google, индекс Вебмастера и Search Console, витрина, упоминания в нейросетях. Становится ясно, почему сайта нет в топе.",
            },
            {
              n: "02",
              icon: "wordstat",
              t: "Спрос по Wordstat",
              d: "Частотность, регион, сезон, кто сейчас в топ-10. Сначала кластеры, где спрос есть, а посадочная слабая.",
            },
            {
              n: "03",
              icon: "pages",
              t: "Усиливаем страницы",
              d: "Заголовки, цены и контакты, структура, вопросы и ответы, новые материалы. В систему сайта или черновик вам на согласование. Скрытого текста нет.",
            },
            {
              n: "04",
              icon: "measure",
              t: "Замер в выдаче",
              d: "Позиции и клики из Метрики и Вебмастера на 14 и 28 день. Что не выросло — переписываем смысл. Накрутку не подключаем.",
            },
          ].map((s) => (
            <li key={s.n} className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e8] text-orange">
                  <IndustryIcon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="text-sm font-bold tabular-nums text-orange">{s.n}</span>
              </div>
              <h3 className="mt-5 text-xl">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="card mt-4 p-6">
          <div className="text-sm font-semibold">Позиции · Яндекс, регион Москва</div>
          <p className="mt-1 text-xs text-muted">Пример после 8 недель белого контура</p>
          <div className="table-wrap mt-4">
            <table className="data">
              <thead>
                <tr>
                  <th>Запрос</th>
                  <th>Было</th>
                  <th>Стало</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["вклад в рублях 2026", "—", "3"],
                  ["открыть ИИС онлайн", "27", "6"],
                  ["лучший накопительный счёт", "14", "2"],
                  ["брокер для дивидендов", "41", "8"],
                  ["рефинансирование ипотеки", "19", "5"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td className="font-medium">{r[0]}</td>
                    <td className="text-muted">{r[1]}</td>
                    <td className="font-semibold text-good">топ-{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Рядом в том же кабинете — доля упоминаний в GigaChat и ChatGPT по
            тем же темам. Один отчёт для поиска и нейросетей.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Белые методы
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
          Никогда не нарушаем правила поисковиков
        </h2>
        <p className="mt-4 max-w-3xl text-muted">
          Продвижение только теми приёмами, которые Яндекс и Google прямо
          рекомендуют вебмастерам. Быстрый «топ любой ценой» нам не нужен:
          потом сайт проседает вместе с бизнесом.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl">Что делаем</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              <li>Полезные страницы под реальный спрос Wordstat</li>
              <li>Честные title, description и заголовки</li>
              <li>Коммерческие факторы и понятная витрина</li>
              <li>Регион, Яндекс Бизнес, Карты, Вебмастер</li>
              <li>Техническая чистота и нормальная скорость</li>
              <li>Редакционные упоминания, где тема уместна</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-xl">Как держим работу</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              <li>Рекомендации Яндекса для вебмастеров и правила Google для сайтов</li>
              <li>Один и тот же сайт человеку и роботу</li>
              <li>Городские страницы только там, где вы правда работаете</li>
              <li>Тексты, которые можно прочитать вслух, без простыни ключей</li>
              <li>Публикация только после вашего согласия</li>
              <li>Замер через две и четыре недели, без обещания топа за семь дней</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[800px] px-5 pb-8">
        <FaqList
          title="Коротко о правилах"
          items={[
            {
              q: "Вы правда не покупаете ссылки?",
              a: "Да. Работаем в рамках рекомендаций Яндекса для вебмастеров и правил Google. Биржи и накрутка в продукт не заложены.",
            },
            {
              q: "Почему не только Яндекс?",
              a: "В коммерции РФ Яндекс часто даёт основной трафик. Но часть людей ищет только в Google, а B2B и справка там растут лучше. Bing подхватывает те же страницы. Ведём оба кабинета.",
            },
            {
              q: "Можно ли вывести сайт в топ за неделю?",
              a: "Нет. Смотрим позиции на 14 и 28 день. Если страница не выросла, переписываем смысл, а не обещаем чудо.",
            },
          ]}
        />
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Больше, чем дашборд
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
          Инсайт — лёгкая часть. Мы живём в работе.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Большинство SEO-сервисов и ИИ-трекеров показывают разрыв и
          останавливаются. INSONT закрывает его: пишет, оптимизирует, публикует
          и доказывает прирост позиций и цитат.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            ["01", "Отследить", "Позиции в Яндексе и Google + промпты в 10 ИИ-системах."],
            ["02", "Приоритизировать", "Центр действий ранжирует 5–10 задач недели по трафику."],
            ["03", "Сделать", "Агенты пишут страницы, ставят метатеги, чинят схему."],
            ["04", "Доказать", "Топ выдачи, цитаты, трафик и заявки на 14 и 28 день."],
          ].map(([n, t, d]) => (
            <div key={n} className="card p-5">
              <div className="text-sm font-bold text-orange">{n}</div>
              <div className="mt-2 text-xl font-semibold">{t}</div>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-5 py-16">
        <StepBadge n="02" label="Приоритизировать" />
        <h2 className="mt-4 text-center text-4xl md:text-5xl">Знайте, что чинить первым</h2>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl">Центр действий</h3>
            <p className="mt-4 text-lg text-muted">
              Ранжирует пробелы по влиянию на видимость и цитаты. Упоминания,
              новый контент, обновление страниц, техника. На неделю — 5–10 задач.
            </p>
            <Link href="/priorizirovat" className="btn-primary mt-6 inline-flex bg-[#2b2118]">
              Смотреть Центр действий
            </Link>
          </div>
          <ActionCenterShowcase />
        </div>
      </section>

      <section className="rays px-5 py-16">
        <div className="mx-auto max-w-[1160px]">
          <StepBadge n="03" label="Действовать" />
          <h2 className="mt-4 text-center text-4xl md:text-5xl">Действуйте по очереди</h2>
          <div className="mt-10">
            <ActTrio />
          </div>
          <div className="mt-8 text-center">
            <Link href="/deystvovat" className="text-sm font-semibold text-orange">
              Как устроены три рычага →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#111] text-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 md:grid-cols-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
              Цикл ИИ-поиска
            </p>
            <h2 className="mt-3 text-[clamp(1.55rem,6.6vw,2.25rem)] leading-[1.15] [text-wrap:pretty] [overflow-wrap:anywhere]">
              Отследить.
              <br />
              Приоритизировать.
              <br />
              Сделать.
              <br />
              Измерить.
              <br />
              Повторить.
            </h2>
            <blockquote className="mt-8 text-lg leading-relaxed text-white/80">
              «Раньше смотрели позиции в одном сервисе, а «нас нет в GigaChat»
              ловили руками. Сейчас очередь одна: сначала витрина, потом цитаты.
              Так проще объяснить директору, на что ушла неделя.»
            </blockquote>
            <p className="mt-4 text-sm text-white/60">
              Нина Ковалёва, руководитель маркетинга, агентство «Север»
            </p>
          </div>
          <div className="card bg-white p-6 text-ink">
            <div className="text-sm font-semibold">ИИ-видимость · 7 дней</div>
            <div className="mt-4 space-y-3">
              {[
                ["Яндекс", "49.8%", "+5%"],
                ["Google", "44.2%", "−2%"],
                ["Bing", "41.5%", "+1%"],
              ].map(([n, v, d]) => (
                <div key={n} className="flex items-center justify-between rounded-xl bg-[#f6f1e8] px-4 py-3">
                  <span className="font-medium">{n}</span>
                  <span className="font-semibold">{v}</span>
                  <span className={d.startsWith("+") ? "text-good" : "text-bad"}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 py-16 text-center">
        <p className="inline-block rounded-full border border-orange/40 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange">
          Зачем один кабинет
        </p>
        <h2 className="mt-6 text-4xl leading-tight md:text-5xl">
          В Яндексе смотрят список сайтов.
          <br />
          В нейросети спрашивают, кого выбрать.
          <br />
          <span className="text-orange">Обычный сервис видит только одно из двух.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          SEO-сервис покажет, на каком вы месте в поиске. Но не скажет, советует
          ли вас GigaChat. Трекер нейросетей покажет упоминания — и всё: сайт в
          топ сам не выйдет, карточку на витрине никто не поправит. INSONT
          смотрит и поиск, и ответы моделей. На неделю одна очередь работ.
        </p>
        <SeoBridge />
        <Link href="/pochemu-insont" className="text-sm font-semibold text-orange">
          Почему это один кабинет →
        </Link>
      </section>

      <section className="mx-auto max-w-[1160px] px-5 py-8">
        <h2 className="text-center text-4xl md:text-5xl">
          Одна система.
          <br />
          Разный масштаб.
        </h2>
        <div className="mt-10">
          <ScaleCards />
        </div>
        <div className="mt-6 text-center">
          <Link href="/dlya-komand" className="text-sm font-semibold text-orange">
            Все сегменты →
          </Link>
        </div>
      </section>

      <ProofCta />

      <section className="mx-auto max-w-[1200px] px-5 py-16">
        <h2 className="text-3xl">Безопасность и соответствие</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {["152-ФЗ", "Размещение в РФ", "Единый вход", "Резерв в Yandex Cloud"].map(
            (x) => (
              <div key={x} className="card px-4 py-5 text-center font-semibold">
                {x}
              </div>
            )
          )}
        </div>
        <div className="mt-8">
          <div className="text-sm font-semibold">Интеграции</div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
            {[
              "Яндекс Метрика",
              "Google Analytics",
              "Webmaster",
              "Search Console",
              "WordPress",
              "Битрикс",
              "Tilda",
              "Looker Studio",
              "API",
              "MCP",
            ].map((x) => (
              <span key={x} className="rounded-full border border-line bg-paper px-3 py-1">
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      <HomePlansTeaser />

      <section className="mx-auto max-w-[1100px] px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Партнёрам
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl">Партнёрская программа</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Привели компанию — получаете процент с её оплаты. Подходит агентствам,
          фрилансерам и тем, кто уже ведёт SEO-клиентов.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="card p-5">
            <div className="text-3xl font-semibold">20%</div>
            <p className="mt-2 text-sm text-muted">
              с каждого платежа приведённого аккаунта 12 месяцев с первой оплаты
            </p>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-semibold">от 1 000 ₽</div>
            <p className="mt-2 text-sm text-muted">
              минимум к переводу. 20% с оплаты приведённого. Раз в месяц на
              расчётный счёт
            </p>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-semibold">90 дней</div>
            <p className="mt-2 text-sm text-muted">
              окно атрибуции по ссылке. Зарегистрировался за это время — ваш
            </p>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-semibold">Свой бренд</div>
            <p className="mt-2 text-sm text-muted">
              клиент платит вам, вы — нам. Кабинет без нашего логотипа. Старт,
              Базовый и Рост. Корпоративный — отдельно
            </p>
          </div>
        </div>
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold">Условия участия</h3>
          <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-[#3a3632] md:grid-cols-2">
            <li>Самому себе, своему ИП и аффилированным юрлицам привести аккаунт нельзя.</li>
            <li>Накрутка регистраций и купленный трафик на лендинг — кабинет отключаем.</li>
            <li>Выплата за тарифы Старт, Базовый и Рост. Enterprise — по договорённости.</li>
            <li>Cookie и ссылка живут 90 дней. Потом лид уже не ваш.</li>
          </ul>
          <Link href="/resursy/partnerskaya" className="btn-primary mt-6 inline-flex">
            Полные условия партнёрки
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-10 pt-4">
        <p className="text-center text-sm text-muted">
          Нам доверяют маркетинговые команды брендов и агентств
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] font-semibold text-ink/50">
          {brands.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}

function CompareCard({
  label,
  brand,
  score,
  note,
  rows,
  featured,
}: {
  label: string;
  brand: string;
  score: string;
  note: string;
  rows: string[][];
  featured: boolean;
}) {
  return (
    <div className={`card min-w-0 overflow-x-auto p-5 text-left ${featured ? "ring-1 ring-orange/40" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#f1ebe1] px-3 py-1 text-xs font-semibold">
          {label}
        </span>
        <span className={`text-lg font-bold ${featured ? "text-good" : "text-muted"}`}>
          {score} видимость
        </span>
      </div>
      <div className="mt-4 text-sm text-muted">
        {brand} · ChatGPT · «какой лучший сервис для подкастов?»
      </div>
      <div className="table-wrap mt-4">
        <table className="data">
          <thead>
            <tr>
              <th>Лучше для</th>
              <th>Сервис</th>
              <th>Почему</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td className={r[1] === "Волна" ? "font-semibold text-orange" : ""}>
                  {r[1]}
                </td>
                <td>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">{note}</p>
    </div>
  );
}
