import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScaleCards } from "@/components/Showcase";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "INSONT для команд: холдинг, агентство, магазин",
  description:
    "Один кабинет для крупного бизнеса, агентств, команд роста и интернет-магазинов. Яндекс, Google и нейросети — без покупки ссылок.",
  alternates: { canonical: "/dlya-komand" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[1160px] px-5 py-14">
      <Breadcrumbs path="/dlya-komand" lastName="Для команд" />
      <h1 className="text-center text-4xl md:text-6xl">
        Одна система.
        <br />
        Разный масштаб.
      </h1>
      <div className="mt-12">
        <ScaleCards />
      </div>
      <PageAdvantages path="/dlya-komand" />
      <SeeAlso
        links={[
          { href: "/resheniya/kliniki", title: "Клиники" },
          { href: "/seo/moskva", title: "SEO в Москве" },
          { href: "/pochemu-insont", title: "Зачем один кабинет" },
          { href: "/registratsiya", title: "5 запросов бесплатно" },
        ]}
      />
    </div>
  );
}
