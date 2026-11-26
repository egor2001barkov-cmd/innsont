import { llmsFullText } from "@/lib/llms-site";

export const runtime = "nodejs";
/** Пересборка раз в сутки; содержимое собирается из локальных данных, без сетевых запросов. */
export const revalidate = 86400;

/**
 * llms-full.txt — полная карта сайта для ИИ-краулеров и ответных движков
 * (GigaChat, ChatGPT, Perplexity). Собирается из локальных источников
 * (те же, что питают sitemap), поэтому быстрая и без self-fetch.
 * Сборка — в src/lib/llms-site.ts (там же короткая версия для public/llms.txt).
 */
export async function GET() {
  return new Response(llmsFullText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
