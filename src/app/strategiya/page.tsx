import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Стратегия роста сайта: SEO и контент",
  description:
    "Две стратегии в одном кабинете: как расти в Яндексе и Google и какие тексты писать. Без покупки ссылок и без календаря «статей ради статей».",
  alternates: { canonical: "/strategiya" },
};

export default function Page() {
  return (
    <div className="rays">
      <article className="mx-auto max-w-[1000px] px-5 py-14">
        <Breadcrumbs path="/strategiya" lastName="Стратегии" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Рост сайта
        </p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
          Стратегия поиска и стратегия текстов. Одна очередь на неделю.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3a3632]">
          Поиск без витрины не кормит. Тексты без спроса не читают. Мы не
          держим два отдела, которые спорят. Есть два плана и общий список
          работ.
        </p>
        <ul className="mt-10 max-w-[720px] border-t border-line">
          <li className="border-b border-line py-6">
            <Link href="/strategiya/seo" className="group block">
              <div className="text-sm text-muted">Поиск</div>
              <h2 className="mt-1 text-xl group-hover:underline">SEO-стратегия</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Wordstat, витрина, регион, Яндекс и Google, техника, замер на 14
                и 28 день.
              </p>
            </Link>
          </li>
          <li className="border-b border-line py-6">
            <Link href="/strategiya/kontent" className="group block">
              <div className="text-sm text-muted">Тексты</div>
              <h2 className="mt-1 text-xl group-hover:underline">Контент-стратегия</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Что писать, что снять, каким голосом. Чтобы человек записался, а
                модель могла взять абзац.
              </p>
            </Link>
          </li>
        </ul>
        <PageAdvantages path="/strategiya" />
        <SeeAlso
          links={[
            { href: "/seo", title: "Продвижение в поиске", desc: "Яндекс, Google, Вебмастер" },
            { href: "/platforma/avtor-statey", title: "Автор статей", desc: "Кто пишет длинные страницы" },
            { href: "/keysy", title: "Кейсы", desc: "Как это выглядело на живых сайтах" },
            { href: "/tseny", title: "Тарифы" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала план, потом статьи."
        text="Разберём ваш сайт: что чинить в поиске и какие тексты вообще нужны."
      />
    </div>
  );
}
