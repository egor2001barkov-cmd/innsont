/**
 * DeepSeek — OpenAI-совместимый API. Ключ платформенный (баланс пополняет админ),
 * пользователи его не видят: они платят за подписку и тратят тарифные лимиты.
 *
 * .env:
 *   DEEPSEEK_API_KEY — ключ платформы (обязателен для включения)
 *   DEEPSEEK_MODEL   — по умолчанию deepseek-4.1-flash
 */

/** Эндпоинт зафиксирован: адрес из env не принимается (SSRF), реселлеров добавим по мере надобности. */
const API_URL = "https://api.deepseek.com/chat/completions";

export type ChatMessage = { role: "system" | "user" | "assistant"; text: string };

export function deepseekConfigured() {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

export async function deepseekComplete(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return { ok: false, error: "DeepSeek не настроен" };
  const model = process.env.DEEPSEEK_MODEL || "deepseek-4.1-flash";

  let lastError = "DeepSeek недоступен";
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000 * attempt));
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 120_000);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.text })),
          temperature: opts.temperature ?? 0.4,
          max_tokens: opts.maxTokens ?? 2000,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        lastError = `DeepSeek: HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        return { ok: false, error: `DeepSeek: HTTP ${res.status} ${detail.slice(0, 200)}` };
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = data.choices?.[0]?.message?.content;
      if (!text) return { ok: false, error: "DeepSeek: пустой ответ" };
      return { ok: true, text };
    } catch (e) {
      lastError = e instanceof Error ? e.message : "сетевая ошибка";
    }
  }
  return { ok: false, error: lastError };
}
