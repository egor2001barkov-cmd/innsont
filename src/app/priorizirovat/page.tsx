import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ActionCenterShowcase, StepBadge } from "@/components/Showcase";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Центр действий — что чинить первым",
  description:
    "Центр действий INSONT: 5–10 задач недели по влиянию на видимость в Яндексе, Google и нейросетях. Сначала то, что реально двигает заявки.",
  alternates: { canonical: "/priorizirovat" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[1160px] px-5 py-12">
      <Breadcrumbs path="/priorizirovat" lastName="Приоритизировать" />
      <StepBadge n="02" label="Приоритизировать" />
      <h1 className="mt-4 text-center text-4xl md:text-6xl">Знайте, что чинить первым</h1>
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl">Центр действий</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Ранжирует каждую возможность по влиянию на видимость и цитаты:
            пробелы в ответах, внешние упоминания, правки страниц и технику.
            На неделю оставляем пять–десять задач, а не простыню из трёхсот пунктов.
          </p>
          <Link href="/kabinet/deystviya" className="btn-primary mt-8 inline-flex bg-[#2b2118]">
            Открыть Центр действий
          </Link>
        </div>
        <ActionCenterShowcase />
      </div>
      <PageAdvantages path="/priorizirovat" />
      <SeeAlso
        links={[
          { href: "/deystvovat", title: "Дальше — действовать", desc: "Контент, цитаты, краулеры" },
          { href: "/platforma/tsentr-deystviy", title: "Как устроен Центр действий" },
          { href: "/seo/pochemu-net-v-tope", title: "Почему сайта нет в топе" },
          { href: "/tseny", title: "Тарифы" },
        ]}
      />
    </div>
  );
}
