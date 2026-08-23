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
import { MockMerchants, MockShelf, MockSkuTable } from "@/components/TrackMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "treker-pokupok")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Это про Amazon и Walmart?",
    a: "Нет. В России модели чаще отправляют на Ozon, Wildberries, Яндекс Маркет или на ваш сайт. Америку в таблицу не кладём.",
  },
  {
    q: "На каком тарифе есть?",
    a: "На Старте и Базовом трекера покупок нет. Он появляется на Росте, вместе с очередью работ. До этого хватает мониторинга: видно, называют ли бренд, даже без артикула.",
  },
  {
    q: "Нужен фид?",
    a: "Желательно. Свой YML или фид маркетплейса помогает не путать «K5 Pro» и «пылесос K5». Без фида тоже смотрим, но путаницы больше.",
  },
  {
    q: "Это замена карточке на Ozon?",
    a: "Нет. Маркетплейс остаётся витриной. Свой сайт нужен, чтобы цена, срок до города и схема Product были под вами — иначе модель всегда уведёт на чужую карточку.",
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
        <Breadcrumbs path={page.path} lastName="Трекер покупок" />
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
            { k: "Витрины", v: "Свой сайт, Ozon, WB, Маркет" },
            { k: "Рынок", v: "Только Россия" },
            { k: "Срез", v: "По артикулу" },
            { k: "Тариф", v: "С Роста" },
          ]}
        />

        <p className="mx-auto mt-12 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Люди уже спрашивают «какой пылесос до 30 000» не только в поиске. В
          ответе — три карточки, цена и куда нажать. Если вашей нет, заявка
          уходит на Ozon. Это не «новый Amazon». Это та же полка, только вопрос
          задали модели. Для магазина смысл тот же, что у{" "}
          <Link href="/resheniya/internet-magaziny" className="font-semibold text-orange">
            обычной витрины в поиске
          </Link>
          : цена, наличие, срок до города.
        </p>

        <FeatureSplit
          kicker="Полка в ответе"
          title="Ваш товар в подборке или чужой. Без 84% видимости из чужого демо."
          mock={<MockShelf />}
        >
          <p>
            На узкой теме 12% упоминаний по своим артикулам — уже жизнь. 40%
            «как у наушников Sony» в России почти не бывает. Смотрим, попали ли
            вы в ответ и на каком месте. Рядом — позиция той же модели в{" "}
            <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
              Яндексе
            </Link>{" "}
            и{" "}
            <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
              Google
            </Link>
            : часто товар живёт в поиске и молчит в ИИ, или наоборот.
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Куда отправляют"
          title="Свой сайт, Ozon, WB, Маркет. Не Amazon и не Walmart."
          mock={<MockMerchants />}
          flip
        >
          <p>
            Если модель ставит ваш K5, но ссылку даёт на Ozon — это не
            «победа бренда». Это чужая комиссия. Смотрим долю переходов на свой
            домен. Чтобы она выросла, на карточке должны быть цена, наличие и
            нормальная схема — то, что модель может процитировать без
            маркетплейса.
          </p>
          <p>
            У{" "}
            <Link href="/keysy/sibir-mebel" className="font-semibold text-orange">
              «Сибирь Мебель»
            </Link>{" "}
            часть запросов «купить + Новосибирск» ожила, когда срок и цену
            вернули на свои карточки. Не вместо WB — рядом.
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Артикул"
          title="Не бренд целиком. Каждая модель, каждое имя, под которым её зовут."
          mock={<MockSkuTable />}
        >
          <p>
            Модели редко повторяют ваше маркетинговое имя. «K5 Pro», «пылесос
            К5», «как тот красный». Фиксируем алиасы, чтобы не потерять строку
            в отчёте. Конкурентов — двух-трёх, не витрину всего Ozon.
          </p>
        </FeatureSplit>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Кому это
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl">Свой магазин, селлер, агентство</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card p-6">
              <h3 className="text-xl">Свой сайт</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">
                Следить, не уводит ли ответ сразу на маркетплейс. Чинить
                карточку, не плодить десятую статью «как выбрать пылесос».
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl">Селлер</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">
                Видеть, чей оффер в подборке: ваш на Ozon или сосед. Это не
                замена кабинету маркетплейса. Это второе окно, откуда уже
                приходят «а почему у вас дороже».
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl">Агентство</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">
                В отчёте клиенту — не «нейросети растут», а «ваш SKU на третьем
                месте, ссылка на WB». Для потока клиентов есть{" "}
                <Link href="/resheniya/agentstva" className="font-semibold text-orange">
                  контур под агентства
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          <UseCase title="Полка целиком" mock={<MockShelf />}>
            <p>
              Один вопрос — три-четыре товара. Смотрим, кто занял первое место
              и какой магазин в ссылке. Отсюда задача: обновить карточку или
              завести её, если модели нечего взять.
            </p>
          </UseCase>
          <UseCase title="Свои и чужие артикулы" mock={<MockSkuTable />}>
            <p>
              Рядом с мониторингом бренда. Бренд могут называть, а конкретную
              модель — нет. Для ecom это важнее слогана.
            </p>
          </UseCase>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Поиск, полка в ИИ и реклама — разные окна</h2>
          <CompareTable
            leftTitle="Трекер покупок"
            rightTitle="Обычный поиск и реклама"
            rows={[
              ["Что видно", "Товар в ответе модели и ссылка «куда купить»", "Позиция в Яндексе, Google, карточка Маркета"],
              ["Витрины", "Свой сайт, Ozon, WB, Яндекс Маркет", "Те же, плюс Директ и Ads"],
              [
                "Когда включать",
                "Когда ассортимент уже на сайте, не «завтра заведём»",
                "Всегда, если продаёте в России",
              ],
            ]}
          />
          <p className="mt-4 text-sm text-[#3a3632]">
            Рекламные блоки в ответах — отдельно, в{" "}
            <Link href="/platforma/treker-reklamy" className="font-semibold text-orange">
              трекере рекламы
            </Link>
            . Органическую полку ими не заменяем.
          </p>
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/resheniya/internet-magaziny",
              title: "Для интернет-магазинов",
              desc: "Цена, наличие, срок — сначала на своей карточке",
            },
            {
              href: "/keysy/sibir-mebel",
              title: "Кейс «Сибирь Мебель»",
              desc: "Когда «купить + город» уходил только на маркетплейс",
            },
            {
              href: "/keysy/nordteh",
              title: "Кейс Нордтех",
              desc: "Артикул и карточка вместо двух зеркал",
            },
            {
              href: "/platforma/treker-reklamy",
              title: "Трекер рекламы",
              desc: "Если в ответе уже не полка, а объявление",
            },
            {
              href: "/seo/kommercheskie-faktory",
              title: "Коммерческие факторы",
              desc: "То же, что модели хотят увидеть на карточке",
            },
            { href: "/tseny", title: "Тарифы", desc: "Трекер покупок — на Росте" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала своя карточка. Потом полка в ответе."
        text="Покажем, какие ваши артикулы называют в России и куда модель отправляет купить — на сайт или на Ozon."
      />
    </div>
  );
}
