import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { SITE, OG_IMAGE } from "@/lib/site";

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
  {
    q: "Сколько ждать результата?",
    a: "Замер имеет смысл через две-четыре недели после правок: индексы моделей обновляются медленнее поискового обхода. Заметное движение — на горизонте месяца-двух, и только по тем вопросам, под которые на сайте появились ответы.",
  },
  {
    q: "Можно ли всё сделать самому?",
    a: "Да. Методика в руководстве: список вопросов, таблица, аудит доступа, правки страниц, повторный замер. Кабинет нужен, когда вопросов больше нескольких десятков и замеры идут регулярно.",
  },
  {
    q: "Нужен ли llms.txt?",
    a: "Не обязателен: Яндекс и Google его не требуют. Полезен как короткая карта сайта для роботов GigaChat, GPTBot и YandexGPT — при условии, что на страницах есть что цитировать. Собрать его можно бесплатным генератором.",
  },
];

export const metadata: Metadata = {
  title: "Продвижение в нейросетях (GEO): цены и что входит",
  description:
    "GEO-продвижение для России: сайт попадает в ответы GigaChat, ChatGPT, Алисы и YandexGPT. Что делаем, сроки и тарифы от 4 490 ₽ при годе.",
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
    images: OG_IMAGE,
    title: "Продвижение в нейросетях (GEO): цены и что входит — INSONT",
    description:
      "GEO-продвижение для России: сайт попадает в ответы GigaChat, ChatGPT, Алисы и YandexGPT. Что делаем, сроки и тарифы.",
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
                href: "/blog/kak-popast-v-otvety-gigachat",
                name: "Как попасть в GigaChat",
                desc: "Порядок работ: робот, факт, замер. Без накрутки промптов",
              },
              {
                href: "/geo/chatgpt",
                name: "ChatGPT",
                desc: "Сравнения и справка, цитаты домена",
              },
              {
                href: "/geo/perplexity",
                name: "Perplexity и Claude",
                desc: "Источники в ответе. Для SaaS и B2B, не вместо Яндекса",
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

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Что такое GEO и AEO простыми словами</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-[1.75]">
            <p>
              GEO — генеративная оптимизация: работа над тем, чтобы сайт оказывался в
              источниках, на которые опирается модель, формулируя ответ. AEO — близкий
              термин с акцентом на ответ, а не на список ссылок. На практике это одно и то
              же: страница с проверяемым фактом, открытая роботу, на которую ведут ссылки
              с других страниц и площадок.
            </p>
            <p>
              Поисковая выдача показывает десять ссылок, и человек выбирает. Модель
              отвечает одним абзацем и называет нескольких исполнителей. Если вас нет в
              этом абзаце, вы не проиграли конкурс позиций — вас просто не было в списке,
              из которого модель выбирала.
            </p>
            <p>
              В Яндексе это видно в Вебмастере: раздел AI-аналитика показывает, как сайт
              представлен в быстрых ответах Алисы. Если показов в поиске мало, данных там
              не будет. Отсюда порядок: сначала обычный поиск, рядом с ним нейросети.
            </p>
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Как проходит работа</h2>
          <ol className="mt-6 space-y-5 text-[17px] leading-[1.75]">
            <li>
              <b>Замер.</b> Список из 20–30 вопросов, которые клиенты задают модели: город,
              задача, срок, бюджет. По каждому фиксируется, назвали ли вас, на каком месте
              и откуда взята ссылка. Это стартовая таблица, с которой сравнивают всё
              дальнейшее.
            </li>
            <li>
              <b>Доступ.</b> Робот должен прочитать страницу: открыты ли ИИ-боты в
              robots.txt, лежит ли текст в HTML, отвечает ли страница кодом 200.
              Проверяется за пару минут{" "}
              <Link href="/instrumenty/proverka-krawlerov" className="font-semibold hover:underline">
                бесплатной проверкой обхода
              </Link>
              .
            </li>
            <li>
              <b>Факты на страницах.</b> Цена, срок, кто принимает, дата обновления — в
              первых абзацах раздела. Под каждый тип вопроса своя страница: «сколько
              стоит», «как выбрать», «можно ли». Модель берёт абзац, который можно
              процитировать целиком.
            </li>
            <li>
              <b>Внешние источники.</b> Карточка организации, отраслевые каталоги,
              публикации на площадках, которые модель уже цитирует. Без покупки ссылок
              пачкой и без накрутки упоминаний.
            </li>
            <li>
              <b>Повторный замер.</b> Через две-четыре недели после правок — по тому же
              списку вопросов. Разница между таблицами и есть результат.
            </li>
          </ol>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Сколько стоит</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-[1.75]">
            <p>
              Ручной вариант по методике из{" "}
              <Link href="/resursy/rukovodstvo-geo" className="font-semibold hover:underline">
                руководства
              </Link>{" "}
              бесплатен: два-три часа на первый замер и дальше по часу на каждый. Кабинет
              нужен, когда вопросов больше нескольких десятков и замеры идут регулярно.
            </p>
          </div>
          <div className="table-wrap mt-6">
            <table className="sheet">
              <thead>
                <tr>
                  <th>Тариф</th>
                  <th>Цена</th>
                  <th>Кому подходит</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Старт", "4 490 ₽/мес при годе (4 990 ₽ помесячно)", "Проверить, называют ли вас модели, и сделать первые правки"],
                  ["Базовый", "10 790 ₽/мес при годе (11 990 ₽ помесячно)", "Команде, которая регулярно пишет и правит страницы"],
                  ["Рост", "22 490 ₽/мес при годе (24 990 ₽ помесячно)", "Агентству или компании с несколькими проектами"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[17px] leading-[1.75]">
            Что входит в каждый тариф — на странице{" "}
            <Link href="/tseny" className="font-semibold hover:underline">
              тарифов
            </Link>
            . Посмотреть, как это выглядит на вашем рынке, можно{" "}
            <Link href="/demo" className="font-semibold hover:underline">
              на демо
            </Link>
            .
          </p>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Чего мы не делаем</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-[17px] leading-[1.75]">
            <li>Не накручиваем промпты и не покупаем упоминания: это всплывает так же, как накрутка поведения в поиске.</li>
            <li>Не обещаем «выведем за неделю»: модели пересматривают источники неделями.</li>
            <li>Не пишем тексты «для нейросетей» поверх пустой витрины: сначала цена и доступ роботу, потом цитата.</li>
            <li>Не предлагаем десять западных площадок, которых у ваших клиентов нет: смотрим GigaChat, Алису, ChatGPT и Перплексити.</li>
          </ul>
        </section>

        <PageAdvantages path="/geo" />
        <FaqList items={faqs} />
        <SeeAlso
          title="Рядом"
          links={[
            { href: "/seo", title: "Продвижение в поиске", desc: "Яндекс, Google, витрина" },
            { href: "/blog/geo-protiv-seo-chto-meniaetsia-v-2026", title: "GEO против SEO: что меняется в 2026", desc: "Как генеративные движки выбирают источники" },
            { href: "/blog/kak-popast-v-otvety-gigachat", title: "Как попасть в ответы GigaChat", desc: "Факторы цитирования на живых примерах" },
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
