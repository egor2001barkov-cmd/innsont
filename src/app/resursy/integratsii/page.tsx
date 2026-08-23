import { ResourceShell, resourceMeta } from "@/lib/resources";

export const metadata = resourceMeta(
  "Интеграции INSONT — Метрика, Вебмастер, Search Console",
  "Подключите Яндекс Метрику, Вебмастер, Google Search Console, WordPress, Битрикс, Tilda и API.",
  "/resursy/integratsii"
);

export default function Page() {
  return (
    <ResourceShell
      eyebrow="Подключать"
      h1="Интеграции"
      lead="INSONT встаёт в стек, который уже есть, а не заменяет его."
      path="/resursy/integratsii"
    >
      <p>
        Аналитика: Яндекс Метрика, GA4, Looker Studio. Поиск: Webmaster, Search
        Console. CMS: WordPress, Битрикс, Tilda. Агенты: API и MCP.
      </p>
    </ResourceShell>
  );
}
