/**
 * YandexGPT (Yandex Cloud Foundation Models). Ключи в .env:
 *   YANDEXGPT_API_KEY, YANDEXGPT_FOLDER_ID
 * Без ключей пайплайн статей работает в demo-режиме (шаблоны).
 */

const API_URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

export type ChatMessage = { role: "system" | "user" | "assistant"; text: string };

export function yandexConfigured() {
  return Boolean(process.env.YANDEXGPT_API_KEY && process.env.YANDEXGPT_FOLDER_ID);
}

export async function yandexComplete(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = process.env.YANDEXGPT_API_KEY;
  const folder = process.env.YANDEXGPT_FOLDER_ID;
  if (!apiKey || !folder) return { ok: false, error: "YandexGPT не настроен" };

  const body = {
    modelUri: `gpt://${folder}/yandexgpt/latest`,
    completionOptions: {
      temperature: opts.temperature ?? 0.4,
      maxTokens: String(opts.maxTokens ?? 2000),
    },
    messages,
  };

  let lastError = "YandexGPT недоступен";
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000 * attempt));
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 120_000);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${apiKey}`,
          "x-folder-id": folder,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        lastError = `YandexGPT: HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        return { ok: false, error: `YandexGPT: HTTP ${res.status} ${detail.slice(0, 200)}` };
      }
      const data = (await res.json()) as {
        result?: { alternatives?: { message?: { text?: string } }[] };
      };
      const text = data.result?.alternatives?.[0]?.message?.text;
      if (!text) return { ok: false, error: "YandexGPT: пустой ответ" };
      return { ok: true, text };
    } catch (e) {
      lastError = e instanceof Error ? e.message : "сетевая ошибка";
    }
  }
  return { ok: false, error: lastError };
}
