import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { CompanyPoints } from "@/components/CompanyPlay";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "О компании INSONT — кто делает продвижение в поиске и нейросетях",
  description:
    "INSONT, Москва, ИНН 773104369017. Продвигаем сайты в Яндексе, Google и ответах GigaChat. Рубли, 152-ФЗ, Wordstat. Без покупки ссылок.",
  alternates: { canonical: "/kompaniya" },
  openGraph: {
    title: "О компании INSONT",
    description: "Московское юрлицо. Поиск и ответы нейросетей в одном кабинете.",
    url: "/kompaniya",
    locale: "ru_RU",
  },
};

export default function Page() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          legalName: SITE.legalName,
          url: SITE.url,
          email: SITE.email,
          taxID: SITE.inn,
          address: {
            "@type": "PostalAddress",
            streetAddress: "ул. Академика Королёва, 5",
            addressLocality: "Москва",
            addressCountry: "RU",
          },
        }}
      />
      <article className="mx-auto max-w-[800px] px-5 py-14">
        <Breadcrumbs path="/kompaniya" lastName="О компании" />
        <p className="text-sm text-muted">ИНН {SITE.inn}</p>
        <h1 className="mt-3 text-4xl leading-[1.1] md:text-5xl">
          Мы из Москвы. Сайт должен находиться в поиске и в ответах.
        </h1>
        <p className="mt-5 text-lg leading-relaxed">
          Делаем так, чтобы компанию находили в Яндексе и Google и называли в
          GigaChat, когда спрашивают «кого выбрать». Не переводим западный
          сервис. Не продаём пакет ссылок.
        </p>
        <dl className="mt-10 border-y border-line">
          {[
            ["ИНН", SITE.inn],
            ["Адрес", SITE.address],
            ["Почта", SITE.email],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 border-b border-line py-3 last:border-b-0 sm:flex-row sm:gap-8">
              <dt className="w-28 shrink-0 text-sm text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 space-y-4 text-[17px] leading-[1.7]">
          <p>
            Оплата в рублях, счёт, ЭДО. Персональные данные — по 152-ФЗ,
            серверы в РФ. В том же трекере, что ChatGPT, стоят GigaChat,
            YandexGPT и Алиса. Рядом — Wordstat и Вебмастер, не «регион:
            Worldwide».
          </p>
          <p>
            Кабинет предлагает, что чинить. Публикацию подтверждаете вы. Если
            картинка грустная, сначала{" "}
            <Link href="/seo" className="font-semibold hover:underline">
              витрина и поиск
            </Link>
            , не десятая статья «для нейросетей».
          </p>
        </div>
        <h2 className="mt-14 text-2xl md:text-[28px]">Чем мы не похожи на переводной SaaS</h2>
        <CompanyPoints />
        <SeeAlso
          links={[
            { href: "/pochemu-insont", title: "Зачем один кабинет", desc: "Поиск и модели в одной очереди" },
            { href: "/tseny", title: "Тарифы", desc: "Рубли, год −10%, агентствам — свой контур" },
            { href: "/oferta", title: "Оферта", desc: "Те же правила, что на сайте" },
            { href: "/demo", title: "Демо", desc: "Разберём ваш сайт" },
          ]}
        />
      </article>
      <CtaBand
        title="Можно приехать. Можно запросить счёт."
        text="Покажем, как вас сейчас видят Яндекс, Google и GigaChat. Без пакета ссылок."
      />
    </div>
  );
}
