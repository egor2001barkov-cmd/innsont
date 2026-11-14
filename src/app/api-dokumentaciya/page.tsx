import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API INSONT: документация",
  description:
    "Программный интерфейс INSONT: аудит внутренней перелинковки, Яндекс-аудит, Вордстат, Вебмастер, анализ конкурентов. Доступ по ключу на тарифе «Рост».",
  alternates: { canonical: "/api-dokumentaciya" },
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/internal-links",
    what: "Граф внутренних ссылок, сироты, распределение анкоров, кандидаты на усиление",
    body: '{ "url": "https://example.ru", "maxPages": 40 }',
  },
  {
    method: "POST",
    path: "/api/v1/yandex-seo",
    what: "Технический аудит сайта + коммерческие факторы Яндекса (телефон, реквизиты, цены, мессенджеры)",
    body: '{ "url": "https://example.ru" }',
  },
  {
    method: "POST",
    path: "/api/v1/wordstat",
    what: "Частотность, динамика и регионы Вордстата; без токена — подсказки Яндекса без выдуманных цифр",
    body: '{ "phrase": "продвижение сайта", "region": 213 }',
  },
  {
    method: "POST",
    path: "/api/v1/webmaster",
    what: "Индексация из Яндекс.Вебмастера по токену, подключённому в кабинете",
    body: '{ "host": "example.ru" }',
  },
  {
    method: "POST",
    path: "/api/v1/competitors",
    what: "Профили конкурентов: витрина, блог, цены, скорость — до 6 сайтов",
    body: '{ "sites": ["insont.ru", "competitor.ru"] }',
  },
  {
    method: "POST",
    path: "/api/v1/competitors/local",
    what: "Анализ локального рынка по выгрузке карточек: рейтинги, отзывы, разрывы",
    body: '{ "businesses": [{ "name": "Клиника", "rating": 4.8, "reviews": 120, "website": "https://..." }] }',
  },
  { method: "GET", path: "/api/v1/me", what: "Тариф, квота, лимиты и список активных ключей", body: "—" },
];

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">API INSONT</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#374151]">
        Программный интерфейс для подписчиков: те же проверки, что в кабинете, но из вашего кода, CRM или
        CI. Ключ создаётся в <a className="underline" href="/kabinet/api">кабинете</a> и показывается один раз.
      </p>

      <div className="mt-6 rounded-xl border border-[#f3f4f6] bg-[#fafafa] p-4 text-sm leading-relaxed">
        <div className="font-semibold">Доступ</div>
        <p className="mt-1 text-[#374151]">
          API входит в тариф «Рост» и корпоративный. Запросы авторизуются заголовком{" "}
          <code className="rounded bg-white px-1">Authorization: Bearer ins_live_…</code>. Квота —{" "}
          <b>2 000 вызовов в месяц</b>, счётчик виден в ответах в заголовках{" "}
          <code className="rounded bg-white px-1">X-Api-Quota-*</code> и в <code>/api/v1/me</code>.
        </p>
      </div>

      <h2 className="mt-8 text-xl font-bold">Эндпоинты</h2>
      <div className="mt-3 space-y-3">
        {ENDPOINTS.map((e) => (
          <div key={e.path} className="rounded-xl border border-[#f3f4f6] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#111827] px-2 py-0.5 font-mono text-[11px] text-white">{e.method}</span>
              <code className="font-mono text-[13px]">{e.path}</code>
            </div>
            <div className="mt-1 text-sm text-[#374151]">{e.what}</div>
            <pre className="mt-2 overflow-x-auto rounded bg-[#fafafa] p-2 text-[12px]">{e.body}</pre>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-bold">Пример</h2>
      <pre className="mt-2 overflow-x-auto rounded-xl bg-[#111827] p-4 text-[12px] leading-relaxed text-[#e5e7eb]">
{`curl -X POST https://insont.ru/api/v1/internal-links \\
  -H "Authorization: Bearer $INSONT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://insont.ru"}'`}
      </pre>

      <h2 className="mt-8 text-xl font-bold">Ошибки</h2>
      <div className="mt-2 text-sm text-[#374151]">
        <p>
          Формат: <code className="rounded bg-[#fafafa] px-1">{`{ "error": { "code": "...", "message": "..." } }`}</code>
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <code>401 unauthorized</code> — нет или неверный ключ;
          </li>
          <li>
            <code>403 plan_required</code> — тариф без API;
          </li>
          <li>
            <code>429 quota_exceeded</code> — месячная квота исчерпана;
          </li>
          <li>
            <code>409 integration_required</code> — для Вебмастера не подключён токен в кабинете;
          </li>
          <li>
            <code>422 audit_failed</code> — сайт не отвечает или отдал ошибку.
          </li>
        </ul>
      </div>

      <p className="mt-8 text-[13px] text-[#6b7280]">
        Ключи хранятся как sha256-хэш. Утечка ключа = отзыв в кабинете и создание нового: старый перестаёт
        работать сразу.
      </p>
    </div>
  );
}
