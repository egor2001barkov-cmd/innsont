import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ActTrio, StepBadge } from "@/components/Showcase";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Что делать на сайте: тексты, упоминания, роботы",
  description:
    "Переписываем страницы, готовим ответы на VC и Дзен, открываем сайт роботам Яндекса, Google и GPTBot. Без покупки ссылок.",
  alternates: { canonical: "/deystvovat" },
};

export default function Page() {
  return (
    <div className="rays mx-auto max-w-[1160px] px-5 py-12">
      <Breadcrumbs path="/deystvovat" lastName="Действовать" />
      <StepBadge n="03" label="Действовать" />
      <h1 className="mt-4 text-center text-4xl md:text-6xl">Действуйте по очереди</h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
        Три рычага, которые двигают и Яндекс, и ответы GigaChat: страница,
        внешнее упоминание, доступ краулеров.
      </p>
      <div className="mt-12">
        <ActTrio />
      </div>
      <PageAdvantages path="/deystvovat" />
      <SeeAlso
        links={[
          { href: "/priorizirovat", title: "Сначала очередь задач" },
          { href: "/platforma/avtor-statey", title: "Автор статей" },
          { href: "/seo/kontent", title: "Полезные тексты" },
          { href: "/seo/tekhnicheskiy-audit", title: "Технический аудит" },
        ]}
      />
    </div>
  );
}
