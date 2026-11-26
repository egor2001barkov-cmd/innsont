import { ResourceShell, resourceMeta } from "@/lib/resources";

export const metadata = resourceMeta(
  "Интеграции INSONT — Метрика, Вебмастер, WordPress, API",
  "Подключите к кабинету INSONT счётчик Метрики и Яндекс.Вебмастер: визиты, источники и индексация появятся в разделе «Видимость» и в отчёте.",
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
