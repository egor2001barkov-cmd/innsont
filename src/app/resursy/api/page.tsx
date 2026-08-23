import { ResourceShell, resourceMeta } from "@/lib/resources";

export const metadata = resourceMeta(
  "Документация API INNSONT — видимость и статьи",
  "API INNSONT: видимость в поиске и нейросетях, статьи, очередь задач. Чтобы встроить в свой кабинет.",
  "/resursy/api"
);

export default function Page() {
  return (
    <ResourceShell
      eyebrow="Разрабатывать"
      h1="Документация API"
      lead="Стройте свои продукты поверх тех же данных, что видит кабинет."
      path="/resursy/api"
    >
      <pre className="card overflow-auto p-4 text-sm">{`GET /v1/visibility?project=brand-ru
Authorization: Bearer <token>

{
  "platform": "gigachat",
  "prompt": "какой вклад выбрать",
  "mentioned": true,
  "share": 0.21
}`}</pre>
      <p className="mt-4">
        Ключи выдаём на Базовом тарифе и выше. MCP-сервер — для агентов внутри
        вашей инфраструктуры.
      </p>
    </ResourceShell>
  );
}
