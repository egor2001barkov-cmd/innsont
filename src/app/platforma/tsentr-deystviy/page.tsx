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
import { MockActionQueue, MockPageFix, MockRobots } from "@/components/TrackMocks";
import { OrangeBullets, PageIssuesCard, StackedMentions } from "@/components/HeroMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "tsentr-deystviy")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "На каких тарифах это есть?",
    a: "На Старте и Базовом очереди нет: вы видите разрыв в мониторинге и чините сами. В тарифе Рост — 10 внешних и 10 внутренних задач в месяц. Этого хватает команде из нескольких человек. Без лимита — в корпоративном.",
  },
  {
    q: "Это замена SEO-аудиту?",
    a: "Нет. Аудит смотрит сайт целиком. Центр действий каждый день спрашивает: что из вчерашнего прогона чинить первым. Технический разбор по-прежнему лежит в аудите и в Вебмастере.",
  },
  {
    q: "Агенты правят сайт сами?",
    a: "Нет. Черновик, правка robots, текст FAQ — всё уходит вам на «ок». На корпоративном тарифе можно открыть публикацию в WordPress. По умолчанию ничего не выезжает без человека.",
  },
  {
    q: "Почему задач так мало?",
    a: "Потому что 300 пунктов никто не закрывает. На неделю оставляем 5–10. Сначала то, что двигает видимость и недорого чинить: регион, цена на карточке, открытый blog для робота.",
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
            offers: { "@type": "Offer", priceCurrency: "RUB", price: "22490" },
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
        <Breadcrumbs path={page.path} lastName="Центр действий" />
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
            { k: "На неделю", v: "5–10 задач" },
            { k: "Откуда", v: "Вчерашний прогон" },
            { k: "Тариф", v: "С Роста" },
            { k: "Публикация", v: "После вашего «ок»" },
          ]}
        />

        <p className="mx-auto mt-12 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Трекер без очереди — дорогое любопытство. Вы и так видите, что сайта нет в
          ответе. Вопрос: что сделать в понедельник. Центр действий складывает
          разрывы из{" "}
          <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
            мониторинга
          </Link>
          , поиска и логов в короткий список. Не «ещё двадцать статей в блог», а
          «верните цену на карточку» и «откройте /blog роботу GigaChat».
        </p>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">Поднять страницу, которую уже читают</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Обычно дело не в «мало текста». Ответ спрятан в середине, FAQ из
              трёх общих фраз, цены нет. Это чинится на той же URL.
            </p>
            <OrangeBullets
              items={[
                {
                  title: "Новые темы по спросу.",
                  text: (
                    <>
                      Берём формулировки, которые уже заняли конкуренты, из{" "}
                      <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
                        объёма ИИ-поиска
                      </Link>{" "}
                      и Wordstat. Пишет{" "}
                      <Link href="/platforma/avtor-statey" className="font-semibold text-orange">
                        Автор статей
                      </Link>
                      , не «ещё лонгрид про вклады».
                    </>
                  ),
                },
                {
                  title: "Освежить то, что уже висит.",
                  text: (
                    <>
                      Первый абзац, таблица с датой, вопросы и ответы, схема.
                      У{" "}
                      <Link href="/keysy/foxford" className="font-semibold text-orange">
                        Фоксфорда
                      </Link>{" "}
                      сработало, когда вместо десятой «пользы» починили карточки
                      курсов. Небрендовые в топ-10: 16 → 34.
                    </>
                  ),
                },
              ]}
            />
          </div>
          <PageIssuesCard />
        </section>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <StackedMentions />
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">Внешние упоминания, которые модели уже читают</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Если в ответе два конкурента и ссылка на подборку, а вас нет — это
              не повод покупать ссылку. Это повод дать факт туда, откуда текст
              уже берут.
            </p>
            <OrangeBullets
              items={[
                {
                  title: "VC, Дзен, отраслевые СМИ.",
                  text: (
                    <>
                      Список площадок — из{" "}
                      <Link href="/platforma/issledovatel-brendov" className="font-semibold text-orange">
                        исследователя брендов
                      </Link>
                      , не из американского шаблона с Reddit. Черновик готовим
                      мы. Отправляете вы, своим именем.
                    </>
                  ),
                },
                {
                  title: "Telegram и комментарии.",
                  text: "Там, где модель уже вытаскивает абзац. Без накрутки реакций и без бирж.",
                },
                {
                  title: "Как вас описывают.",
                  text: "Если ставка на сайте и в ответе разошлись — сначала витрина, потом аутрич.",
                },
              ]}
            />
          </div>
        </section>

        <FeatureSplit
          kicker="Техника"
          title="Половина «нас не цитируют» — закрытый blog и 404, который видит только бот."
          mock={<MockRobots />}
        >
          <p>
            Яндекс и Google ещё как-то пролезают. GPTBot и робот GigaChat часто
            упираются в Disallow «на всякий случай». Мы не правим robots сами.
            Кладём точный дифф в очередь. Связка с{" "}
            <Link href="/platforma/analitika-agentov" className="font-semibold text-orange">
              аналитикой роботов
            </Link>{" "}
            и{" "}
            <Link href="/instrumenty/proverka-krawlerov" className="font-semibold text-orange">
              проверкой обхода
            </Link>
            : если бот не заходит, цитировать нечего.
          </p>
          <p>
            Регион в{" "}
            <Link href="/seo/vebmaster" className="font-semibold text-orange">
              Вебмастере
            </Link>{" "}
            и карточка в{" "}
            <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
              Google Профиле
            </Link>{" "}
            тоже попадают в очередь. Это не «нейросети», это поиск. Заявки чаще
            идут оттуда.
          </p>
        </FeatureSplit>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Как устроена неделя
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl leading-tight md:text-4xl">
            Сначала очередь. Потом руки или агент. Потом замер.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <UseCase title="Что лежит сверху" mock={<MockActionQueue />}>
              <p>
                После ночного прогона список пересобирается. Высокий приоритет —
                то, что уже спрашивают и где вас нет. Средний — освежить дату и
                FAQ. Низкий не показываем, чтобы не размазывать неделю.
              </p>
            </UseCase>
            <UseCase title="Кто закрывает" mock={<MockPageFix />}>
              <p>
                Можно закрыть руками. Можно отдать{" "}
                <Link href="/platforma/ii-agenty" className="font-semibold text-orange">
                  агенту
                </Link>{" "}
                или автору. Статус возвращается сюда же. На 14-й и 28-й день
                смотрим, сдвинулась ли формулировка в мониторинге — не «трафик
                вырос на 400%».
              </p>
            </UseCase>
          </div>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Трекер без очереди и очередь без трекера</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Одно без другого быстро превращается в отчёт для слайда. Сначала
            смотрим, потом чиним то, что всплыло вчера.
          </p>
          <CompareTable
            leftTitle="Только мониторинг"
            rightTitle="Центр действий"
            rows={[
              ["Что видите", "Есть бренд в ответе или нет", "Что сделать на этой неделе"],
              ["Объём", "Все ваши формулировки", "5–10 задач, не триста"],
              ["Тариф", "Со Старта", "С Роста"],
              [
                "Куда уходит работа",
                "В чат, в Trello, в никуда",
                "Автору, агенту или вам — статус на месте",
              ],
            ]}
          />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Что из этого выходило</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <blockquote className="card p-6">
              <p className="text-[15px] leading-relaxed">
                Вместо «надо ещё статью» починили карточки курсов. Небрендовые в
                топ-10: 16 → 34.
              </p>
              <footer className="mt-4 text-sm text-muted">
                Фоксфорд ·{" "}
                <Link href="/keysy/foxford" className="font-semibold text-orange">
                  разбор
                </Link>
              </footer>
            </blockquote>
            <blockquote className="card p-6">
              <p className="text-[15px] leading-relaxed">
                «Не размазываем бюджет на двадцатую статью, пока на витрине нет
                доставки.»
              </p>
              <footer className="mt-4 text-sm text-muted">Анна Белова, агентство, Екатеринбург</footer>
            </blockquote>
            <blockquote className="card p-6">
              <p className="text-[15px] leading-relaxed">
                На 38 услугах появились цена и врач. Часть запросов перестала
                уходить только на агрегатор.
              </p>
              <footer className="mt-4 text-sm text-muted">
                СМ-Клиника ·{" "}
                <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
                  разбор
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
              href: "/platforma/monitoring-vidimosti",
              title: "Мониторинг видимости",
              desc: "Откуда очередь вообще берётся",
            },
            {
              href: "/priorizirovat",
              title: "Как выглядит кабинет",
              desc: "Короткий экран с той же очередью",
            },
            {
              href: "/platforma/ii-agenty",
              title: "ИИ-агенты",
              desc: "Кто закрывает задачу, если не руками",
            },
            {
              href: "/seo/pochemu-net-v-tope",
              title: "Почему сайта нет в топе",
              desc: "Чаще витрина и регион, не «мало статей»",
            },
            { href: "/deystvovat", title: "Действовать", desc: "Контент, цитаты, роботы — три рычага" },
            { href: "/tseny", title: "Тарифы", desc: "Очередь появляется на Росте" },
          ]}
        />
      </article>
      <CtaBand
        title="Трекер без очереди — просто отчёт."
        text="Покажем 5–10 задач по вашему сайту: что чинить на этой неделе в поиске и в ответах. Без покупки ссылок."
      />
    </div>
  );
}
