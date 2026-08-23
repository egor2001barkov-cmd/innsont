import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { SITE_SECTIONS } from "@/lib/site-map";

export const metadata: Metadata = {
  title: "Решения — для бизнеса, агентств и магазинов",
  description:
    "Решения INNSONT: клиники, рестораны, автосервисы, юристы, туризм, SaaS, банки. Продвижение в Яндексе, Google и нейросетях.",
  alternates: { canonical: "/resheniya" },
};

export default function Page() {
  return (
    <HubPage
      section={SITE_SECTIONS.find((s) => s.href === "/resheniya")!}
      lead="Клиники, рестораны, автосервисы, юристы, туризм, SaaS, банки. Один кабинет, разная витрина."
    />
  );
}
