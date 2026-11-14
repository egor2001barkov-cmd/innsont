import { SITE } from "./site";

/**
 * IndexNow: один POST — и Bing, Yandex, Seznam, Naver узнают об изменённых URL
 * без ожидания переобхода. Ключ по спецификации НЕ секрет: он лежит открытым
 * файлом /{key}.txt, иначе поисковик отклонит отправку (400 invalid key).
 *
 * Менять ключ только вместе с файлом public/{key}.txt: имя файла и поле key
 * в запросе должны совпадать, иначе IndexNow ответит 400.
 */
export const INDEXNOW_KEY = "97b8285b4f079f10dfe0f9e8801a4217";

/** Общий эндпоинт: сам раздаёт URL в Bing, Yandex, Seznam и Naver. */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Лимит протокола на один запрос. */
export const INDEXNOW_MAX_URLS = 10_000;

export function indexNowKeyLocation(): string {
  return `${SITE.url}/${INDEXNOW_KEY}.txt`;
}

export type IndexNowResult = { ok: boolean; status: number; body: string };

export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (urls.length === 0) throw new Error("IndexNow: пустой список URL");
  if (urls.length > INDEXNOW_MAX_URLS) {
    throw new Error(`IndexNow: максимум ${INDEXNOW_MAX_URLS} URL за запрос, получено ${urls.length}`);
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE.url).host,
      key: INDEXNOW_KEY,
      keyLocation: indexNowKeyLocation(),
      urlList: urls,
    }),
    cache: "no-store",
  });

  const body = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body };
}
