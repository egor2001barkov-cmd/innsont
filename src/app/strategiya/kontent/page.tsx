import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Контент-стратегия роста сайта — что писать и чего не писать",
  description:
    "Какие страницы нужны для Яндекса, Google и ответов нейросетей. Сначала карточка и FAQ, потом гид. Без простыней и календаря «статей ради статей».",
  alternates: { canonical: "/strategiya/kontent" },
};

export default function Page() {
  return (
    <div className="rays">
      <article className="mx-auto max-w-[800px] px-5 py-14">
        <Breadcrumbs path="/strategiya/kontent" lastName="Контент-стратегия" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Стратегия
        </p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
          Контент-стратегия: писать меньше, но туда, где спрашивают
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#3a3632]">
          Стратегия отвечает на три вопроса. Что человеку нужно увидеть, чтобы
          записаться или купить. Что может взять модель в ответ. Чего на сайте
          уже слишком много. Всё остальное — календарь ради отчёта.
        </p>

        <h2 className="mt-12 text-2xl">Сначала карточка, не гид</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Услуга, товар, вклад, курс — на странице должны быть цена или вилка,
          срок, кто делает, как начать. Это тот же смысл, что в{" "}
          <Link href="/seo/kommercheskie-faktory" className="font-semibold text-orange">
            коммерческих факторах
          </Link>
          . Пока этого нет, статья «как выбрать» кормит чужую витрину. Так
          было у{" "}
          <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
            клиники
          </Link>{" "}
          и у{" "}
          <Link href="/keysy/nordteh" className="font-semibold text-orange">
            Нордтеха
          </Link>
          : заявки пошли с карточки, не с блога.
        </p>

        <h2 className="mt-10 text-2xl">Тема из спроса, не из «надо что-то выложить»</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Берём кластер{" "}
          <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
            Wordstat
          </Link>{" "}
          и соседние формулировки из{" "}
          <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
            объёма ИИ-поиска
          </Link>
          . Если темы нет ни в поиске, ни у моделей — не пишем. Если есть, а
          вас нет в ответе — это очередь, не повод нанять ещё копирайтера на
          «пользу».
        </p>

        <h2 className="mt-10 text-2xl">Один голос на всех носителях</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Длинную страницу пишет{" "}
          <Link href="/platforma/avtor-statey" className="font-semibold text-orange">
            Автор
          </Link>
          . Карточку, FAQ, пост в Дзен, черновик на VC —{" "}
          <Link href="/platforma/kontent-agent" className="font-semibold text-orange">
            контент-агент
          </Link>
          . Брендбук один. Иначе сайт звучит как три подрядчика, и модель
          берёт самый гладкий чужой абзац.
        </p>

        <h2 className="mt-10 text-2xl">Снимать дубли важнее, чем писать десятое</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Три старых простыни на одну тему путают и человека, и поиск. У{" "}
          <Link href="/keysy/foxford" className="font-semibold text-orange">
            Фоксфорда
          </Link>{" "}
          как раз сняли дубли — небрендовые запросы подтянулись. Это тоже
          контент-стратегия: что убрать.
        </p>

        <h2 className="mt-10 text-2xl">Текст, который можно процитировать</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Первый абзац отвечает. Есть таблица и дата. Есть вопросы, которые
          люди уже задают. Нет воды. Так устроены страницы, которые берут и{" "}
          <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
            Google
          </Link>
          , и GigaChat. Правила тона — в{" "}
          <Link href="/seo/kontent" className="font-semibold text-orange">
            полезных текстах
          </Link>
          .
        </p>

        <p className="mt-10 leading-relaxed text-[#3a3632]">
          Каркас поиска — в{" "}
          <Link href="/strategiya/seo" className="font-semibold text-orange">
            SEO-стратегии
          </Link>
          . Куда падает задача «написать» или «снять» — в{" "}
          <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
            Центре действий
          </Link>
          .
        </p>

        <PageAdvantages path="/strategiya/kontent" />
        <SeeAlso
          links={[
            { href: "/strategiya/seo", title: "SEO-стратегия" },
            { href: "/platforma/avtor-statey", title: "Автор статей" },
            { href: "/platforma/kontent-agent", title: "Контент-агент" },
            { href: "/keysy/moysklad", title: "Кейс МойСклад" },
          ]}
        />
      </article>
      <CtaBand
        title="Не календарь на год. Список страниц на месяц."
        text="Разберём, какие тексты вам нужны — и какие лучше снять."
      />
    </div>
  );
}
