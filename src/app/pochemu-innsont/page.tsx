import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SeoBridge } from "@/components/Showcase";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Зачем INNSONT, если уже есть SEO-сервис",
  description:
    "Обычный SEO-сервис не видит GigaChat. Трекер нейросетей не поднимает сайт в Яндексе и Google. INNSONT делает и поиск, и ответы моделей в одном кабинете.",
  alternates: { canonical: "/pochemu-innsont" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-16 text-center">
      <Breadcrumbs path="/pochemu-innsont" lastName="Почему INNSONT" />
      <p className="mx-auto inline-block rounded-full border border-orange/40 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange">
        Зачем один кабинет
      </p>
      <h1 className="mt-6 text-4xl leading-tight md:text-6xl">
        В Яндексе смотрят список сайтов.
        <br />
        В нейросети спрашивают, кого выбрать.
        <br />
        <span className="text-orange">Обычный сервис видит только одно из двух.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
        SEO-сервис покажет, на каком вы месте в поиске. Но не скажет, советует
        ли вас GigaChat. Трекер нейросетей покажет упоминания — и всё: сайт в
        топ сам не выйдет, карточку на витрине никто не поправит. INNSONT
        смотрит и поиск, и ответы моделей. На неделю остаётся одна очередь работ.
      </p>
      <SeoBridge />
      <p className="mx-auto mt-4 max-w-xl text-muted">
        Иначе команда чинит то, что видно в одном отчёте, и пропускает второе
        место, откуда уже приходят заявки.
      </p>
      <div className="mt-6 text-left">
        <PageAdvantages path="/pochemu-innsont" />
      </div>
      <SeeAlso
        links={[
          { href: "/seo", title: "Как устроено белое SEO" },
          { href: "/platforma/monitoring-vidimosti", title: "Мониторинг видимости" },
          { href: "/dlya-komand", title: "Для кого это" },
          { href: "/tseny", title: "Тарифы" },
        ]}
      />
    </div>
  );
}
