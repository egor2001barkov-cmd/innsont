import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Индекс рекламы в ответах ChatGPT — срез по России",
  description:
    "Ежедневный срез: как часто в русских ответах ChatGPT виден рекламный блок. Рядом — Директ и Google Ads. Выборка, не весь рынок.",
  alternates: { canonical: "/resursy/indeks-reklamy" },
  openGraph: {
    title: "Индекс рекламы в ответах — INSONT",
    description:
      "Смотрим спонсорские блоки в ChatGPT на русском каждый день. Цифры скромные: в России это пока редко.",
    url: "/resursy/indeks-reklamy",
    locale: "ru_RU",
  },
};

function Spark() {
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-36" aria-hidden>
      <path
        d="M2 40 C14 38 18 34 28 36 C40 38 46 22 58 24 C70 26 76 18 88 20 C102 22 108 14 120 16 C132 18 140 28 158 12"
        fill="none"
        stroke="#ff6a2b"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Page() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Индекс рекламы INSONT",
          description:
            "Ежедневная выборка русских ответов ChatGPT: доля с рекламным блоком.",
          creator: { "@type": "Organization", name: SITE.name },
          temporalCoverage: "2026-05/2026-08",
        }}
      />

      <section className="rays overflow-hidden">
        <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-12">
          <Breadcrumbs path="/resursy/indeks-reklamy" lastName="Индекс рекламы" />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-orange">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                Обновляем каждый день
              </p>
              <h1 className="mt-5 text-4xl leading-[1.08] md:text-6xl">
                ChatGPT уже вставляет рекламу в ответы.
                <br />
                Смотрим это каждый день.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3a3632]">
                Живой срез спонсорских блоков в русских ответах. В США полка уже
                плотная. У нас — редко. Рядом по-прежнему{" "}
                <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
                  Директ
                </Link>{" "}
                и{" "}
                <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
                  Google Ads
                </Link>
                .
              </p>
            </div>

            <div className="card p-6 shadow-[0_24px_60px_rgba(40,24,8,0.08)] md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#eaf6ee] px-2.5 py-0.5 text-[11px] font-semibold text-good">
                  Обновлено 15 августа 2026
                </span>
                <span className="rounded-full bg-[#fdecea] px-2.5 py-0.5 text-[11px] font-semibold text-bad">
                  ↓ 2 п.п. к прошлой неделе
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <div className="font-display text-6xl font-extrabold tracking-tight md:text-7xl">
                    7,4%
                  </div>
                  <p className="mt-2 max-w-[16rem] text-sm text-muted">
                    ответов ChatGPT на русском вчера были с рекламным блоком
                  </p>
                </div>
                <Spark />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                {[
                  ["64 из 860", "ответов в выборке"],
                  ["19", "рекламодателей"],
                  ["11,2%", "пик за 90 дней"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <div className="text-lg font-bold">{v}</div>
                    <div className="text-[12px] leading-snug text-muted">{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-8 md:grid-cols-[1fr_1fr_1.4fr] md:items-center">
          <div>
            <div className="text-3xl font-bold">~860</div>
            <p className="mt-1 text-sm text-muted">русских ответов смотрим за день</p>
          </div>
          <div>
            <div className="text-3xl font-bold">90 дней</div>
            <p className="mt-1 text-sm text-muted">ежедневной истории</p>
          </div>
          <p className="text-sm leading-relaxed text-[#3a3632]">
            Это выборка, не перепись рынка. Цифры ориентир: достаточно, чтобы
            видеть тренд, мало, чтобы говорить «половина запросов России». В
            США чужие индексы рисуют десятки процентов — у нас так не выглядит.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-[1100px] px-5 py-16">
        <h2 className="text-3xl md:text-4xl">Что именно считаем</h2>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Берём фиксированный набор формулировок на русском — вклады, клиники,
          окна, учёт — и смотрим, был ли в ответе ChatGPT спонсорский блок.
          GigaChat и Алиса рекламу внутри ответа почти не показывают. Директ и
          Ads рядом с выдачей считаем отдельно: там реклама есть каждый день.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["ChatGPT", "Редко, но уже бывает. Вчера 64 блока на 860 ответов."],
            ["Google AI", "Иногда. Смотрим те же формулировки."],
            ["Директ и Ads", "Основной платный слой в РФ. Не путаем с блоком внутри чата."],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <h3 className="text-lg">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-3xl">Срез по темам, не по «всему интернету»</h2>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          За последнюю неделю в нашей выборке блоки чаще всплывали на финансах и
          электронике. На «окна Казань» — почти никогда. Это не медиарейтинг
          страны. Это то, что попало в 80–100 формулировок на тему.
        </p>
        <div className="card mt-6 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="px-5 py-3 font-medium">Тема</th>
                <th className="px-5 py-3 font-medium">Блоков за неделю</th>
                <th className="px-5 py-3 font-medium">Из ответов</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Вклады и счета", "11", "140"],
                ["Электроника", "8", "120"],
                ["Клиники", "4", "90"],
                ["Окна и ремонт", "1", "80"],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-line/70">
                  <td className="px-5 py-3">{a}</td>
                  <td className="px-5 py-3 tabular-nums">{b}</td>
                  <td className="px-5 py-3 tabular-nums text-muted">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
          Свой набор формулировок и чужие креативы — в{" "}
          <Link href="/platforma/treker-reklamy" className="font-semibold text-orange">
            трекере рекламы
          </Link>
          . Индекс отвечает на «есть ли полка вообще». Трекер — «купил ли сосед
          вашу фразу».
        </p>

        <PageAdvantages path="/resursy/indeks-reklamy" />
        <SeeAlso
          links={[
            {
              href: "/platforma/treker-reklamy",
              title: "Трекер рекламы",
              desc: "Директ, Ads и редкие блоки в вашем ядре",
            },
            {
              href: "/platforma/monitoring-vidimosti",
              title: "Мониторинг видимости",
              desc: "Органика в той же строке",
            },
            { href: "/keysy/centr-invest", title: "Кейс «Центр-инвест»", desc: "Платный слот отдельно от ставки на сайте" },
            { href: "/tseny", title: "Тарифы", desc: "Обзор рекламы — с Базового" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала увидеть чужой блок. Потом решать, покупать ли свой."
        text="Покажем срез по вашим формулировкам: Директ, Ads и то, что уже мелькает в ChatGPT. Без цифр американского рынка."
      />
    </div>
  );
}
