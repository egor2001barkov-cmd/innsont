/**
 * DeepSeek — OpenAI-совместимый API. Ключ платформенный (баланс пополняет админ),
 * пользователи его не видят: они платят за подписку и тратят тарифные лимиты.
 *
 * .env:
 *   DEEPSEEK_API_KEY — ключ платформы (обязателен для включения)
 *   DEEPSEEK_MODEL   — по умолчанию deepseek-4.1-flash
 *
 * Эндпоинт зафиксирован (SSRF-защита: адрес из env в fetch не подставляется).
 * Шлюз-реселлеров (например, Рег.облако) добавляем вторым литералом + переключателем env.
 */

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
  if (!apiKey) return { ok: false, error: "LLM-провайдер не настроен" };
  const model = process.env.DEEPSEEK_MODEL || "deepseek-4.1-flash";

  // deepseek-flash — reasoning-модель: max_tokens считает и размышление, и ответ.
  // Поэтому к запрошенному бюджету ответа добавляем запас на reasoning, иначе
  // раздел приходит обрезанным (finish_reason=length) или пустым.
  let budget = (opts.maxTokens ?? 2000) + 2500;
  let lastError = "LLM-провайдер недоступен";
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
          max_tokens: budget,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        lastError = `LLM: HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        return { ok: false, error: `LLM: HTTP ${res.status} ${detail.slice(0, 200)}` };
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string }; finish_reason?: string }[];
      };
      const choice = data.choices?.[0];
      const text = choice?.message?.content;
      if (choice?.finish_reason === "length") {
        lastError = "LLM: ответ обрезан по лимиту токенов";
        budget = Math.min(budget * 2, 16_000);
        continue;
      }
      if (!text) return { ok: false, error: "LLM: пустой ответ" };
      return { ok: true, text };
    } catch (e) {
      lastError = e instanceof Error ? e.message : "сетевая ошибка";
    }
  }
  return { ok: false, error: lastError };
}


export type LlmStreamChunk = { type: "reasoning" | "content"; text: string };

/**
 * Потоковый вызов: отдаёт reasoning (размышление модели) и content по мере генерации.
 * Нужен для экрана «пишем статью»: пользователь видит, что происходит, а не пустой экран.
 */
export async function* deepseekStream(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
): AsyncGenerator<LlmStreamChunk> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("LLM-провайдер не настроен");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-flash";
  const budget = (opts.maxTokens ?? 2000) + 2500;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 240_000);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.text })),
        temperature: opts.temperature ?? 0.5,
        max_tokens: budget,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      throw new Error(`LLM: HTTP ${res.status} ${detail.slice(0, 160)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith("data:")) continue;

          const payload = line.slice(5).trim();
          if (payload === "[DONE]") return;

          try {
            const json = JSON.parse(payload) as {
              choices?: { delta?: { content?: string; reasoning_content?: string } }[];
            };
            const delta = json.choices?.[0]?.delta;
            if (delta?.reasoning_content) yield { type: "reasoning", text: delta.reasoning_content };
            if (delta?.content) yield { type: "content", text: delta.content };
          } catch {
            // неполный JSON в потоке — пропускаем строку
          }
        }
      }
    } finally {
      // Закрываем соединение сразу: иначе после [DONE] сокет остаётся висеть,
      // и на 3–4-м разделе провайдер рвёт следующий стрим (fetch failed).
      await reader.cancel().catch(() => {});
      controller.abort();
    }
  } finally {
    clearTimeout(timer);
  }
}
