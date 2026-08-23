import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { CompareTable, FeatureSplit, StatStrip } from "@/components/ExploreMocks";
import { AgentBoard, OrangeBullets, PageIssuesCard } from "@/components/HeroMocks";
import { MockRobots } from "@/components/TrackMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "ii-agenty")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Это замена маркетологу?",
    a: "Нет. Агент готовит черновик и список правок. Регион в Вебмастере, тон письма клиенту и «ок» на публикацию остаются за человеком.",
  },
  {
    q: "Чем это не ChatGPT в соседней вкладке?",
    a: "ChatGPT не видит ваш вчерашний прогон и Wordstat. Агент берёт задачу из Центра действий: конкретный URL, формулировка, чего не хватает. Не «напиши статью про окна».",
  },
  {
    q: "Они сами публикуют?",
    a: "По умолчанию нет. На корпоративном тарифе можно открыть выгрузку в WordPress. На Росте всё уходит вам на утверждение.",
  },
  {
    q: "Сколько запусков?",
    a: "На Старте три пробных. На Базовом 20, на Росте 60. Очередь Центра действий — только с Роста.",
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
            offers: { "@type": "Offer", priceCurrency: "RUB", price: "10790" },
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
        <Breadcrumbs path={page.path} lastName="ИИ-агенты" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.08] md:text-6xl">{page.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3a3632]">{page.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Заказать демо
          </Link>
          <Link href="/registratsiya" className="btn-outline">
            5 запросов бесплатно
          </Link>
        </div>
        <StatStrip
          items={[
            { k: "Откуда задача", v: "Из очереди" },
            { k: "Публикация", v: "После вашего «ок»" },
            { k: "На Росте", v: "60 запусков" },
            { k: "Замер", v: "На 14 и 28 день" },
          ]}
        />

        <p className="mx-auto mt-12 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Большинство сервисов показывают разрыв и останавливаются. Агенты
          закрывают то, что уже лежит в{" "}
          <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
            Центре действий
          </Link>
          : карточку, черновик на VC, дифф robots. Не «команда SEO за 99 долларов».
          Три узких роли и человек, который нажимает «ок».
        </p>

        <section className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">Страница, которую можно процитировать</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Не новый роман в блог. FAQ, таблица, ответ в первом абзаце, дата.
              То, что забирают и{" "}
              <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
                Яндекс
              </Link>
              , и{" "}
              <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
                Google
              </Link>
              , и GigaChat.
            </p>
            <OrangeBullets
              items={[
                {
                  title: "Длинный текст — Автору.",
                  text: (
                    <>
                      Кластер, бриф, источники. Это{" "}
                      <Link href="/platforma/avtor-statey" className="font-semibold text-orange">
                        отдельный конвейер
                      </Link>
                      .
                    </>
                  ),
                },
                {
                  title: "Короткий формат — контент-агенту.",
                  text: (
                    <>
                      Карточка, пост, письмо. Тот же голос, другой носитель.{" "}
                      <Link href="/platforma/kontent-agent" className="font-semibold text-orange">
                        Как устроен
                      </Link>
                      .
                    </>
                  ),
                },
              ]}
            />
          </div>
          <PageIssuesCard />
        </section>

        <FeatureSplit
          kicker="Техника"
          title="Дифф robots и 404. Без «агент сам пошёл на хостинг»."
          mock={<MockRobots />}
          flip
        >
          <p>
            Закрытый blog, 403 на справке, битая схема. Агент готовит правку.
            На сайт она попадает после вас. Связка с{" "}
            <Link href="/platforma/analitika-agentov" className="font-semibold text-orange">
              логом роботов
            </Link>
            : если бот не ходит, цитировать нечего.
          </p>
        </FeatureSplit>

        <section className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <AgentBoard />
          <div>
            <h2 className="text-3xl">Не чат. Очередь.</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Задача приходит с URL и формулировкой. Статус возвращается в тот
              же инбокс. На 14-й и 28-й день смотрим{" "}
              <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
                мониторинг
              </Link>
              : сдвинулась строка или нет. Не «трафик вырос в четыре раза».
            </p>
          </div>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Чат в соседней вкладке и агент из очереди</h2>
          <CompareTable
            leftTitle="Просто модель"
            rightTitle="Агент INNSONT"
            rows={[
              ["Откуда задача", "Вы придумали промпт", "Вчерашний прогон и очередь"],
              ["Данные", "Память модели", "Wordstat, выдача, ваш сайт"],
              ["Поиск", "Иногда «погуглит»", "Яндекс и Google в том же кабинете"],
              ["Публикация", "Копипаст", "Черновик, вы нажимаете «ок»"],
            ]}
          />
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            { href: "/platforma/tsentr-deystviy", title: "Центр действий", desc: "Откуда агент берёт работу" },
            { href: "/platforma/avtor-statey", title: "Автор статей", desc: "Длинные тексты под поиск и модели" },
            { href: "/platforma/kontent-agent", title: "Контент-агент", desc: "Карточки, Дзен, письма" },
            { href: "/deystvovat", title: "Три рычага", desc: "Страница, упоминание, роботы" },
            { href: "/keysy/foxford", title: "Кейс Фоксфорд", desc: "Карточки курсов вместо десятой статьи" },
            { href: "/tseny", title: "Тарифы", desc: "Пробные запуски есть уже на Старте" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала очередь. Потом черновик. Потом «ок»."
        text="Покажем, какие три задачи агент закрыл бы на вашем сайте на этой неделе. Без публикации без вас."
      />
    </div>
  );
}
