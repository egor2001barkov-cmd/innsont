import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { SITE_SECTIONS } from "@/lib/site-map";

export const metadata: Metadata = {
  title: "Платформа INNSONT — поиск, нейросети, очередь работ",
  description:
    "Мониторинг видимости в Яндексе, Google, ChatGPT и GigaChat. Автор статей, центр действий, трекеры и агенты в одном кабинете.",
  alternates: { canonical: "/platforma" },
};

export default function Page() {
  return (
    <HubPage
      section={SITE_SECTIONS.find((s) => s.href === "/platforma")!}
      lead="Инструменты, которыми продвигаем сайт в Яндексе, Google и ответах ИИ."
    />
  );
}
