/**
 * Проверка сайта в Bing Webmaster Tools файлом BingSiteAuth.xml.
 *
 * Токен берётся из переменной окружения BING_SITE_AUTH, чтобы не пересобирать
 * сайт при каждой попытке верификации. Без переменной отдаём 404 — как будто
 * файла нет, ровно какого поведения Bing и ждёт до добавления токена.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.BING_SITE_AUTH?.trim();

  if (!token) {
    return new Response("Bing verification token is not configured\n", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(
    `<?xml version="1.0"?>\n<users>\n  <user>${token}</user>\n</users>\n`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
}
