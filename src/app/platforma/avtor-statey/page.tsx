import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { CompareTable, FeatureSplit, StatStrip } from "@/components/ExploreMocks";
import { ArticleDraft, OrangeBullets } from "@/components/HeroMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "avtor-statey")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "Это генератор абзацев?",
    a: "Нет. Сначала спрос в Wordstat и формулировки к моделям, потом выдача Яндекса и Google, потом бриф, черновик, факты, вопросы и ответы, внутренние ссылки. На выходе текст, который ещё надо прочитать глазами.",
  },
  {
    q: "Сколько статей в месяц?",
    a: "5 на Старте, 20 на Базовом, 40 на Росте. Пакет +15 — 2 490 ₽. Этого хватает команде, которая не печатает «миллион слов».",
  },
  {
    q: "На каком языке?",
    a: "Русский — основной. Для России смотрим Wordstat и Яндекс, не только Google. Английский есть. «50 языков» на корпоративном, если реально нужно.",
  },
  {
    q: "Можно загрузить брендбук и прайс?",
    a: "Да. Запрещённые слова, тон, экспертные материалы. Иначе получится тот самый гладкий текст, который не цитируют.",
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
        <Breadcrumbs path={page.path} lastName="Автор статей" />
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
            { k: "Старт / Базовый / Рост", v: "5 / 20 / 40" },
            { k: "Поиск", v: "Яндекс и Google" },
            { k: "Модели", v: "GigaChat, ChatGPT" },
            { k: "Выгрузка", v: "WordPress, HTML" },
          ]}
        />

        <section className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">
              Один текст. Чтобы нашли в поиске и могли процитировать в ответе.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#3a3632]">
              Обычный генератор пишет гладко и не попадает никуда: нет даты, нет
              таблицы, нет прямого ответа. Мы собираем страницу так, чтобы её
              можно было открыть с телефона и выдернуть абзац целиком.
            </p>
            <OrangeBullets
              items={[
                {
                  title: "Сначала спрос, не заголовок.",
                  text: (
                    <>
                      <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
                        Wordstat
                      </Link>{" "}
                      и{" "}
                      <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
                        формулировки к нейросетям
                      </Link>
                      . Если темы нет ни там, ни там — статью не пишем.
                    </>
                  ),
                },
                {
                  title: "Потом выдача.",
                  text: (
                    <>
                      Что уже стоит в{" "}
                      <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
                        Яндексе
                      </Link>{" "}
                      и{" "}
                      <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
                        Google
                      </Link>
                      . Не копируем. Смотрим, чего не хватает: цены, сравнения,
                      региона.
                    </>
                  ),
                },
                {
                  title: "Голос ваш.",
                  text: "Брендбук, запретные слова, прайс. Иначе получится «комплексный подход», который никто не цитирует.",
                },
              ]}
            />
          </div>
          <ArticleDraft />
        </section>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Как идёт текст
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl">Не один промпт. Несколько понятных шагов.</h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-2">
            {[
              ["1. Тема", "Есть ли спрос в поиске и у моделей. Если нет — стоп."],
              ["2. Выдача", "Что уже отвечает Яндекс и Google. Чего не хватает на вашей странице."],
              ["3. Бриф", "Кому страница, какой первый абзац, какие блоки."],
              ["4. Черновик", "По блокам, не «простыня на 8 000 знаков ради объёма»."],
              ["5. Факты", "Цифры с ваших материалов. Чужие блоги не тащим."],
              ["6. Схема и FAQ", "Вопросы, которые люди уже задают. Разметка."],
              ["7. Ссылки внутрь", "На свои услуги и тарифы, не на агрегатор."],
              ["8. Редактор", "Вы читаете. Потом WordPress или HTML."],
            ].map(([t, d]) => (
              <li key={t} className="card p-5">
                <h3 className="text-lg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <FeatureSplit
          kicker="Зачем два канала"
          title="Текст «только под нейросеть» в поиске часто проседает. И наоборот."
          mock={<ArticleDraft />}
        >
          <p>
            Яндекс смотрит витрину и пользу. Google — структуру и ясность.
            Модель берёт короткий абзац с фактом. Если писать только «для
            цитаты», страница становится тонкой для выдачи. Если только «для
            топа» — простынёй, которую не из чего выдернуть.
          </p>
          <p>
            У{" "}
            <Link href="/keysy/moysklad" className="font-semibold text-orange">
              МойСклада
            </Link>{" "}
            сработали сравнения и таблица тарифов. Не десятая «польза» в блог.
          </p>
        </FeatureSplit>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Генератор и автор — разные вещи</h2>
          <CompareTable
            leftTitle="Обычный чат"
            rightTitle="Автор INSONT"
            rows={[
              ["Старт", "«Напиши статью»", "Спрос + выдача + ваш прайс"],
              ["Поиск", "Не видит Вебмастер", "Яндекс и Google в том же кабинете"],
              ["Модели", "Пишет, как само", "Ответ в первом абзаце, таблица, FAQ"],
              ["Объём", "Сколько попросите", "5 / 20 / 40 в месяц по тарифу"],
              ["Публикация", "Копипаст", "Черновик вам, потом CMS"],
            ]}
          />
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            { href: "/seo/kontent", title: "Какие тексты работают", desc: "Не простыня и не слоган" },
            { href: "/platforma/kontent-agent", title: "Контент-агент", desc: "Карточки, Дзен, письма — тот же голос" },
            { href: "/platforma/obem-ii-poiska", title: "Объём ИИ-поиска", desc: "Откуда брать темы, которых нет в Wordstat" },
            { href: "/keysy/moysklad", title: "Кейс МойСклад", desc: "Сравнения, которые модели реально берут" },
            { href: "/kabinet/statyi", title: "Кабинет автора", desc: "Если уже вошли" },
            { href: "/tseny", title: "Тарифы", desc: "5 статей на Старте, чтобы пощупать" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала тема, в которой есть спрос."
        text="Соберём одну страницу по вашему ядру: поиск и ответ модели. Без простыни «на 8 000 знаков ради объёма»."
      />
    </div>
  );
}
