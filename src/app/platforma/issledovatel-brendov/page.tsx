import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import {
  CompareTable,
  FeatureSplit,
  MockCitations,
  MockHeat,
  MockPromptRanks,
  MockShare,
  StatStrip,
  UseCase,
} from "@/components/ExploreMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";
import { Icon } from "@/components/Icons";

const page = FEATURES.find((p) => p.slug === "issledovatel-brendov")!;

export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Можно прогнать чужой бренд?",
    a: "Да. Это открытые ответы моделей, не кабинет конкурента. На Старте три прогона, на Базовом — двадцать. Хватает на питч или на совет директоров, не на ежедневный контроль.",
  },
  {
    q: "Почему не десять площадок и не миллиарды диалогов?",
    a: "Потому что в России людям отвечают в основном GigaChat, Алиса, YandexGPT, ChatGPT и Gemini. Остальное красиво смотрится в американском лендинге. Мы не покупаем чужой кликстрим и не рисуем «2 млрд».",
  },
  {
    q: "Чем это отличается от мониторинга видимости?",
    a: "Исследователь — разовый взгляд на любой бренд, без настройки проекта. Мониторинг — ваши формулировки каждый день, с алертами и очередью работ. Сначала смотрим здесь, потом трекаем то, что реально всплыло.",
  },
  {
    q: "Это белый метод?",
    a: "Да. Читаем публичные ответы и выдачу. Ничего не накручиваем и ссылки не покупаем. Если модели вас не называют, чиним сайт и источники, а не «сигналы».",
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
        <Breadcrumbs path={page.path} lastName="Исследователь брендов" />
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
            { k: "Площадки", v: "5 на русском" },
            { k: "Рынок", v: "Только Россия" },
            { k: "Настройка", v: "Не нужна" },
            { k: "Отчёт", v: "За несколько минут" },
          ]}
        />

        <p className="mx-auto mt-12 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Прежде чем заводить проект и список промптов, полезно понять, говорит
          ли модель о бренде вообще. Вводите имя или домен — получаете долю
          упоминаний, источники и формулировки, на которых вас называют.
          Конкурентов можно прогнать тех же. Без «доверия 40 мировых холдингов»
          и без настройки на полдня.
        </p>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Что смотрим
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl leading-tight md:text-4xl">
            Разведка до трекинга. Не вместо него.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <UseCase title="Сравнить, кого советуют вместо вас" mock={<MockShare />}>
              <p>
                Доля упоминаний по узкой теме, не «по всему интернету». У клиник
                часто лидирует агрегатор, не сеть. Это видно сразу — как в{" "}
                <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
                  разборе СМ-Клиники
                </Link>
                : модели читали ПроДокторов, пока на своих страницах не было цены
                и врача.
              </p>
            </UseCase>
            <UseCase title="На каких вопросах бренд вообще всплывает" mock={<MockPromptRanks />}>
              <p>
                Не все формулировки стоит трекать. Исследователь показывает те,
                где имя уже мелькает — пусть на четвёртом месте. Отсюда ядро для{" "}
                <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
                  объёма ИИ-поиска
                </Link>{" "}
                и для ежедневного мониторинга. Остальное можно не сторожить.
              </p>
            </UseCase>
            <UseCase title="Откуда модели берут факты" mock={<MockCitations />}>
              <p>
                Обычно это не ваш домен. ПроДокторов, VC, Дзен, чужой обзор.
                Список — бэклог честного аутрича: дать цифры, не купить ссылку.
                Тех, кого робот не читает, чиним в{" "}
                <Link href="/instrumenty/proverka-krawlerov" className="font-semibold text-orange">
                  проверке обхода
                </Link>
                .
              </p>
            </UseCase>
            <UseCase title="Где выигрываете тему, где нет" mock={<MockHeat />}>
              <p>
                УЗИ может быть живым, стоматология — пустой. Не надо «быть везде».
                Смотрим три-четыре темы, в которых вы реально работаете. Для
                клиник это{" "}
                <Link href="/resheniya/kliniki" className="font-semibold text-orange">
                  отдельный разбор
                </Link>
                , для учёта —{" "}
                <Link href="/keysy/moysklad" className="font-semibold text-orange">
                  сравнения МойСклада
                </Link>
                .
              </p>
            </UseCase>
          </div>
        </section>

        <FeatureSplit
          kicker="Откуда цифры"
          title="Русскоязычные ответы. Не синтетический список промптов из головы."
          mock={<MockCitations />}
        >
          <p>
            Американские сервисы любят писать «два миллиарда диалогов». У нас
            рынок меньше, и мы это не прячем. Берём живые ответы GigaChat,
            Алисы, YandexGPT, ChatGPT и Gemini на русском. Плюс ядро из{" "}
            <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
              Wordstat
            </Link>
            : иначе легко принять редкий вопрос за спрос.
          </p>
          <p>
            Новые срезы — раз в несколько дней, не в реальном времени. Для
            разведки хватает. Для «упали сегодня в 11:00» нужен{" "}
            <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
              мониторинг
            </Link>
            .
          </p>
        </FeatureSplit>

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Кому это нужно в команде</h2>
          <ul className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            <li className="flex gap-4 py-6">
              <Icon name="chart" className="mt-0.5 h-6 w-6 shrink-0 text-orange" />
              <div>
                <h3 className="text-lg font-semibold">Маркетологу</h3>
                <p className="mt-2 text-[16px] leading-relaxed">
                  Сравнить себя с двумя-тремя конкурентами по теме, не по «всему
                  бренду». Понять, какие страницы писать, а какие сначала починить
                  на витрине. Дальше очередь в{" "}
                  <Link href="/priorizirovat" className="font-semibold hover:underline">
                    Центре действий
                  </Link>
                  .
                </p>
              </div>
            </li>
            <li className="flex gap-4 py-6">
              <Icon name="chat" className="mt-0.5 h-6 w-6 shrink-0 text-orange" />
              <div>
                <h3 className="text-lg font-semibold">Продажам</h3>
                <p className="mt-2 text-[16px] leading-relaxed">
                  Перед звонком глянуть, советуют ли клиента модели. Не чтобы
                  стыдить. Чтобы не обещать «мы вас выведем в ChatGPT за месяц»,
                  если его уже называют — просто без цены на сайте.
                </p>
              </div>
            </li>
            <li className="flex gap-4 py-6">
              <Icon name="users" className="mt-0.5 h-6 w-6 shrink-0 text-orange" />
              <div>
                <h3 className="text-lg font-semibold">Агентству</h3>
                <p className="mt-2 text-[16px] leading-relaxed">
                  Питч без отдельного бюджета на проект. Три прогона на Старте
                  хватает, чтобы прийти к клиенту не с «нейросети — это будущее»,
                  а с «вас нет в четырёх ответах из десяти, вот чего не хватает».
                  Для потока клиентов есть{" "}
                  <Link href="/tseny#agentstva" className="font-semibold hover:underline">
                    тариф для агентств
                  </Link>
                  .
                </p>
              </div>
            </li>
            <li className="flex gap-4 py-6">
              <Icon name="building" className="mt-0.5 h-6 w-6 shrink-0 text-orange" />
              <div>
                <h3 className="text-lg font-semibold">Собственнику</h3>
                <p className="mt-2 text-[16px] leading-relaxed">
                  Разовая картинка «нас вообще знают или нет». Без дашборда на
                  каждый день. Если картинка грустная — сначала витрина и{" "}
                  <Link href="/seo" className="font-semibold hover:underline">
                    поиск
                  </Link>
                  , не десятая статья в блог.
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Сначала посмотреть. Потом сторожить.</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Исследователь не заменяет трекер. Он отвечает на «стоит ли вообще
            заводить проект». Когда список формулировок понятен — переносим его
            в мониторинг и смотрим неделю за неделей.
          </p>
          <CompareTable
            leftTitle="Исследователь брендов"
            rightTitle="Мониторинг видимости"
            rows={[
              ["Настройка", "Не нужна. Ввели бренд — сводка", "Свои формулировки, конкуренты, регион"],
              ["Зачем", "Разведка, питч, найти дыры", "Следить и чинить по ходу"],
              ["Откуда данные", "Срез по живым ответам на русском", "Ежедневный прогон вашего ядра"],
              ["Свои промпты", "Не задаёте. Берём то, что всплыло", "Да. Добавляете сами"],
              ["История", "Снимок, плюс грубый тренд", "Кривая по дням"],
              [
                "Кому",
                "Перед сделкой, раз в квартал, новый рынок-город",
                "Маркетологу, который ведёт тему каждую неделю",
              ],
            ]}
          />
          <p className="mt-5 text-sm">
            <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
              Как устроен ежедневный трекинг →
            </Link>
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Что из этого выходило на живых сайтах</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Не шестизначные сделки из американских отзывов. Обычные российские
            цифры: кто-то начал попадать в ответы, у кого-то выросли заявки с
            поиска, потому что витрину наконец починили.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <blockquote className="card flex flex-col p-6">
              <p className="text-[15px] leading-relaxed">
                «Не „нас теперь все знают“. Просто с поиска стали записываться на
                УЗИ и терапию, а не только с Директа.»
              </p>
              <footer className="mt-4 text-sm text-muted">
                СМ-Клиника, Москва ·{" "}
                <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
                  полный разбор
                </Link>
              </footer>
            </blockquote>
            <blockquote className="card flex flex-col p-6">
              <p className="text-[15px] leading-relaxed">
                «Стало ясно, какие страницы вообще читают модели. Перестали
                писать десятую „пользу“ в блог, пока нет таблицы тарифов.»
              </p>
              <footer className="mt-4 text-sm text-muted">
                МойСклад ·{" "}
                <Link href="/keysy/moysklad" className="font-semibold text-orange">
                  полный разбор
                </Link>
              </footer>
            </blockquote>
            <blockquote className="card flex flex-col p-6">
              <p className="text-[15px] leading-relaxed">
                Ставки сверили с витриной, регион вернули. GigaChat начал брать
                цифры с сайта. «Вклад в рублях» вошёл в топ-10 региона.
              </p>
              <footer className="mt-4 text-sm text-muted">
                Банк «Центр-инвест» ·{" "}
                <Link href="/keysy/centr-invest" className="font-semibold text-orange">
                  полный разбор
                </Link>
              </footer>
            </blockquote>
          </div>
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/platforma/obem-ii-poiska",
              title: "Объём ИИ-поиска",
              desc: "Насколько жива формулировка, прежде чем её сторожить",
            },
            {
              href: "/platforma/monitoring-vidimosti",
              title: "Мониторинг видимости",
              desc: "Когда разовая сводка уже не нужна — нужен график",
            },
            {
              href: "/blog/issledovanie-ii-vidimosti-rf",
              title: "Исследование видимости по РФ",
              desc: "Как модели отвечают на русском, без импорта чужих рынков",
            },
            {
              href: "/keysy/sm-klinika",
              title: "Кейс СМ-Клиника",
              desc: "Почему агрегатор забирал ответы, а своя страница — нет",
            },
            {
              href: "/resheniya/agentstva",
              title: "Для агентств",
              desc: "Питч и ведение нескольких брендов без отдельного театра",
            },
            { href: "/tseny", title: "Тарифы", desc: "На Старте три прогона исследователя" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала посмотреть, кого советуют."
        text="Прогоним ваш бренд и двух конкурентов по России. Без настройки проекта и без сказки про миллиарды диалогов."
      />
    </div>
  );
}
