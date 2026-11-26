import Link from "next/link";
import { ResourceShell, resourceMeta } from "@/lib/resources";

export const metadata = resourceMeta(
  "Документация API INSONT: проверки по ключу",
  "API INSONT по ключу из кабинета: аудит страниц, внутренние ссылки, сравнение с конкурентами, Вордстат и Вебмастер. Для своих сервисов.",
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
      <ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
        <li>Аудит внутренней перелинковки: <code>POST /api/v1/internal-links</code></li>
        <li>Аудит по Яндексу и частоты Вордстата: <code>/api/v1/yandex-seo</code>, <code>/api/v1/wordstat</code></li>
        <li>Данные Вебмастера по своему сайту: <code>/api/v1/webmaster</code></li>
        <li>Сравнение с конкурентами: <code>/api/v1/competitors</code>, <code>/api/v1/competitors/local</code></li>
        <li>Тариф, квота и ключи: <code>GET /api/v1/me</code></li>
      </ul>
      <pre className="card mt-4 overflow-auto p-4 text-sm">{`curl -X POST https://insont.ru/api/v1/internal-links \\
  -H "Authorization: Bearer <ключ>" -H "Content-Type: application/json" \\
  -d '{"site": "https://example.ru"}'`}</pre>
      <p className="mt-4">
        API входит в тариф «Рост» и корпоративный. Ключ создаётся в кабинете, полный список
        методов, лимиты и коды ошибок — в{" "}
        <Link href="/api-dokumentaciya" className="font-semibold text-orange">
          документации API
        </Link>
        .
      </p>
    </ResourceShell>
  );
}
