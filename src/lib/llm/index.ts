/**
 * Роутер LLM-провайдеров. Приоритет: DeepSeek → YandexGPT → demo.
 * Ключ платформенный, живёт в .env на сервере (пополняет админ);
 * пользователи платят за подписку и тратят тарифные лимиты, а не токены.
 */

import { yandexComplete, yandexConfigured } from "./yandex";
import { deepseekComplete, deepseekConfigured } from "./deepseek";

export type LlmProvider = "deepseek" | "yandex" | "demo";
export type ChatMessage = { role: "system" | "user" | "assistant"; text: string };

export function activeProvider(): LlmProvider {
  if (deepseekConfigured()) return "deepseek";
  if (yandexConfigured()) return "yandex";
  return "demo";
}

export async function llmComplete(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const provider = activeProvider();
  if (provider === "deepseek") return deepseekComplete(messages, opts);
  if (provider === "yandex") return yandexComplete(messages, opts);
  return { ok: false, error: "LLM-ключи не настроены (demo-режим)" };
}
