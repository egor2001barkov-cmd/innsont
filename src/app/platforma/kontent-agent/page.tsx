import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { CompareTable, FeatureSplit, StatStrip } from "@/components/ExploreMocks";
import { FormatTiles, OrangeBullets, StackedMentions } from "@/components/HeroMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "kontent-agent")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Чем это не Автор статей?",
    a: "Автор пишет длинные страницы под поиск и цитату. Контент-агент — всё остальное тем же голосом: карточка, FAQ, пост в Дзен, письмо, сравнение на лендинг. Одинаковый брендбук, разный носитель.",
  },
  {
    q: "Откуда задачи?",
    a: "Из Центра действий или списком из кабинета. Не «сделай 40 постов про окна». Конкретный URL или формулировка, которую уже спрашивают.",
  },
  {
    q: "Это для соцсетей?",
    a: "В том числе Дзен и Telegram — модели их читают чаще, чем ваш «о компании». Instagram ради охватов сюда не тащим.",
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
        <Breadcrumbs path={page.path} lastName="Контент-агент" />
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
            { k: "Голос", v: "Тот же, что у автора" },
            { k: "Откуда", v: "Очередь или список" },
            { k: "Публикация", v: "После вас" },
            { k: "Тариф", v: "С Базового" },
          ]}
        />

        <section className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">
              Не универсальный текст. Формат под канал.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Карточке товара нужен первый экран: цена, наличие, срок до города.
              Дзену — абзац, который модель может утащить. Письму — одна мысль.
              Один «универсальный пост» не закрывает ни то, ни другое.
            </p>
            <OrangeBullets
              items={[
                {
                  title: "Витрина.",
                  text: (
                    <>
                      Карточки и сравнения. То, что просит{" "}
                      <Link href="/seo/kommercheskie-faktory" className="font-semibold text-orange">
                        коммерция в поиске
                      </Link>{" "}
                      и полка в{" "}
                      <Link href="/platforma/treker-pokupok" className="font-semibold text-orange">
                        ответах про товар
                      </Link>
                      .
                    </>
                  ),
                },
                {
                  title: "Короткие ответы.",
                  text: "FAQ, база знаний, абзац «чем отличаемся». Именно их выдёргивают GigaChat и ChatGPT.",
                },
                {
                  title: "Площадки, которые модели уже читают.",
                  text: "Дзен, Telegram, VC. Не биржа ссылок. Черновик — вам.",
                },
              ]}
            />
          </div>
          <FormatTiles />
        </section>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <StackedMentions />
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">Черновик туда, откуда уже берут текст</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Если модель цитирует чужую подборку, нет смысла писать десятый пост
              «у себя в блоге». Агент готовит ответ в ту ветку. Отправляете вы.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-[#3a3632]">
              Список площадок приходит из{" "}
              <Link href="/platforma/issledovatel-brendov" className="font-semibold text-orange">
                исследователя
              </Link>{" "}
              и{" "}
              <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
                очереди
              </Link>
              .
            </p>
          </div>
        </section>

        <FeatureSplit
          kicker="Голос"
          title="Тот же брендбук, что у длинных статей. Иначе сайт звучит как три подрядчика."
          mock={<FormatTiles />}
        >
          <p>
            Автор и контент-агент делят запретные слова, тон и прайс. Разница —
            длина и канал. Если нужен лонгрид под{" "}
            <Link href="/seo/kontent" className="font-semibold text-orange">
              поиск
            </Link>
            , это не сюда.
          </p>
        </FeatureSplit>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Кто что пишет</h2>
          <CompareTable
            leftTitle="Автор статей"
            rightTitle="Контент-агент"
            rows={[
              ["Длина", "Посадочная, гид, сравнение", "Карточка, FAQ, пост, письмо"],
              ["Зачем", "Топ в Яндексе и Google + цитата", "Витрина и короткие ответы"],
              ["Откуда тема", "Кластер Wordstat и спрос к моделям", "Очередь: чего не хватает на конкретной странице"],
              ["Тариф", "Есть с Старта", "Полноценно с Базового"],
            ]}
          />
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            { href: "/platforma/avtor-statey", title: "Автор статей", desc: "Когда нужен длинный текст, не карточка" },
            { href: "/platforma/ii-agenty", title: "Все агенты", desc: "Контент, упоминания, техника" },
            { href: "/platforma/tsentr-deystviy", title: "Центр действий", desc: "Откуда падает задача" },
            { href: "/seo/kontent", title: "Тексты для поиска", desc: "Что должно быть на самой странице" },
            { href: "/keysy/fabrika-okon", title: "Кейс «Фабрика Окон»", desc: "Цены и районы вместо простыни" },
            { href: "/tseny", title: "Тарифы", desc: "Контент-агент — с Базового" },
          ]}
        />
      </article>
      <CtaBand
        title="Карточка, FAQ, пост — одним голосом."
        text="Соберём три коротких формата по вашей очереди. Длинную статью, если она нужна, отдадим Автору."
      />
    </div>
  );
}
