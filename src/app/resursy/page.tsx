import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { SITE_SECTIONS } from "@/lib/site-map";

export const metadata: Metadata = {
  title: "Ресурсы INSONT — блог, гайды и помощь",
  description:
    "Блог про Яндекс, Google и нейросети, руководство AEO/GEO, API, партнёрка и интеграции.",
  alternates: { canonical: "/resursy" },
};

export default function Page() {
  return (
    <HubPage
      section={SITE_SECTIONS.find((s) => s.href === "/resursy")!}
      lead="Материалы, документация и доказательства, чтобы команда запустилась быстрее."
    />
  );
}
