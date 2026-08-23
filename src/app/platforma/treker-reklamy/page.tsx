import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { CompareTable, FeatureSplit, UseCase } from "@/components/ExploreMocks";
import { MockAdChat, MockAdPlatforms, MockAdShare } from "@/components/TrackMocks";
import { BigStatGrid, ChatGptAdFrame } from "@/components/HeroMocks";
import { pageMetadata } from "@/components/FeatureView";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

const page = FEATURES.find((p) => p.slug === "treker-reklamy")!;
export const metadata: Metadata = pageMetadata(page);

const faqs = [
  {
    q: "В России уже полно рекламы внутри ChatGPT?",
    a: "Нет. В США это уже плотная полка. У нас блоки в ответах встречаются реже. За неделю по ядру из 80 формулировок можем увидеть несколько объявлений, не половину. Рядом по-прежнему Директ и Google Ads в обычной выдаче — их тоже смотрим.",
  },
  {
    q: "Вы крутите чужие объявления?",
    a: "Нет. Только наблюдаем, что уже показано в ответе или рядом с выдачей. Клики не накручиваем, ставки не ставим за вас.",
  },
  {
    q: "На каком тарифе?",
    a: "Обзор — на Базовом. Нормальный трекер вместе с покупками — на Росте. На Старте его нет: сначала разберитесь с витриной и позициями.",
  },
  {
    q: "Это замена Директу?",
    a: "Нет. Директ и Google Ads остаются основным платным каналом в России. Мы добавляем слой: появился ли спонсорский блок ещё и внутри ответа модели.",
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
        <Breadcrumbs path={page.path} lastName="Трекер рекламы" />
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
        <p className="mt-10 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          В США плотность рекламы внутри ChatGPT скакнула за месяцы. У нас полка
          так не выглядит. Спонсорский блок в ответе на русском — редкость. Директ
          и Google Ads рядом с{" "}
          <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
            Яндексом
          </Link>{" "}
          и{" "}
          <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
            Google
          </Link>{" "}
          никуда не делись. Смотрим оба слоя, не подменяем одно другим.
        </p>

        <section className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ChatGptAdFrame />
          <BigStatGrid
            items={[
              { v: "6/80", k: "формулировок за неделю с блоком внутри ответа — не половина рынка" },
              { v: "каждый день", k: "Директ и Google Ads рядом с обычной выдачей" },
              { v: "0", k: "рекламы внутри GigaChat и Алисы. Канала ещё нет — не строим под него отдел" },
              { v: "2–3", k: "конкурента в платном слоте по узкой теме. Этого хватает, чтобы не удивляться" },
            ]}
          />
        </section>

        <FeatureSplit
          kicker="Что поймали"
          title="Формулировка, ответ, и если повезло — чужой блок «реклама»."
          mock={<MockAdChat />}
        >
          <p>
            Не обещаем полный архив креативов мира. Фиксируем ваши формулировки:
            был ли спонсорский блок, чей бренд, куда ведёт. Если блока нет —
            строка пустая, и это нормально. Паниковать из-за «мы не в рекламе
            ChatGPT» рано: сначала органика.
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="По ядру"
          title="Какие из ваших 80 фраз уже продают соседям."
          mock={<MockAdShare />}
          flip
        >
          <p>
            Ядро то же, что в{" "}
            <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
              мониторинге
            </Link>
            . На одной строке: органика, упоминание в ИИ, реклама. Иначе медиаплан
            и SEO живут в разных таблицах и спорят каждую неделю.
          </p>
          <p>
            У{" "}
            <Link href="/keysy/centr-invest" className="font-semibold text-orange">
              «Центр-инвеста»
            </Link>{" "}
            конкурент сидел в платном слоте по вкладам. Органику вели своими
            страницами со свежей ставкой. Рекламу не мешали в один котёл.
          </p>
        </FeatureSplit>

        <FeatureSplit
          kicker="Где смотрим"
          title="Не десять зарубежных площадок. Те, что видит человек в России."
          mock={<MockAdPlatforms />}
        >
          <p>
            ChatGPT и Google AI — когда блок вообще есть. GigaChat и Алиса
            рекламу внутри ответа почти не показывают. Яндекс.Директ и Google
            Ads — каждый день, рядом с выдачей. Сводный{" "}
            <Link href="/resursy/indeks-reklamy" className="font-semibold text-orange">
              индекс рекламы
            </Link>{" "}
            — для тех, кто хочет рынок целиком, не только своё ядро.
          </p>
        </FeatureSplit>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Кому смотреть
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl">Защита бренда, медиаплан, отчёт клиенту</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card p-6">
              <h3 className="text-xl">Маркетологу бренда</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">
                Увидеть, что конкурент уже купил вашу формулировку в Директе или
                мелькнул в ответе ChatGPT. Не чтобы срочно слить бюджет — чтобы
                не удивляться.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl">Тем, кто крутит рекламу</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">
                Понять, где ещё пусто. Часто пусто почти везде, кроме классики.
                Тогда деньги остаются в Директе и Ads, а не «в нейросети, потому
                что так написано в рассылке».
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl">Агентству</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">
                В отчёте честно: «за месяц поймали два блока в ChatGPT, в
                Директе конкурент сидит на четырёх фразах». Без чужого логотипа
                на слайде и без обещания полки как в США.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          <UseCase title="Органика и оплаченное рядом" mock={<MockAdChat />}>
            <p>
              Одна формулировка — два слоя. Кто в ответе сам, кто заплатил за
              блок. Иначе легко принять чужую рекламу за «нас вытеснили из ИИ».
            </p>
          </UseCase>
          <UseCase title="Где канала ещё нет" mock={<MockAdPlatforms />}>
            <p>
              Если в GigaChat рекламы нет, не строим под неё отдел. Смотрим
              Директ. Когда блок появится — строка в том же отчёте загорится.
            </p>
          </UseCase>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Не путаем три полки</h2>
          <CompareTable
            leftTitle="Трекер рекламы"
            rightTitle="Мониторинг и покупки"
            rows={[
              ["Что ищем", "Спонсорский блок в ответе или рядом с выдачей", "Упоминание бренда / товар в подборке"],
              ["Главный канал в РФ", "Директ и Google Ads", "Органика и карточка"],
              ["ChatGPT / Google AI", "Редко, фиксируем когда есть", "Смотрим каждый день"],
              ["Зачем", "Не проспать, что сосед уже купил фразу", "Чинить витрину и тексты"],
            ]}
          />
        </section>

        <PageAdvantages path={page.path} />
        <FaqList items={faqs} />

        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/resursy/indeks-reklamy",
              title: "Индекс рекламы",
              desc: "Срез рынка, не только ваше ядро",
            },
            {
              href: "/platforma/monitoring-vidimosti",
              title: "Мониторинг видимости",
              desc: "Органика в той же строке",
            },
            {
              href: "/platforma/treker-pokupok",
              title: "Трекер покупок",
              desc: "Когда в ответе карточка товара, не объявление",
            },
            {
              href: "/keysy/centr-invest",
              title: "Кейс «Центр-инвест»",
              desc: "Платный слот отдельно, ставки на сайте — отдельно",
            },
            { href: "/seo/prodvizhenie-v-yandekse", title: "Продвижение в Яндексе", desc: "Там, откуда заявки идут каждый день" },
            { href: "/tseny", title: "Тарифы", desc: "Обзор рекламы — с Базового" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала увидеть чужой блок. Потом решать, покупать ли свой."
        text="Покажем, где по вашим формулировкам уже висит Директ, Ads или редкая вставка в ответе. Без сказки про половину рынка США."
      />
    </div>
  );
}
