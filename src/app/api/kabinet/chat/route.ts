import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { activeProvider, llmComplete } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Чат кабинета: реальный LLM (DeepSeek → YandexGPT). Без ключей отвечаем
 * честной ошибкой, а не заготовленными фразами «про ваш сайт».
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    messages?: { role: "user" | "assistant"; text: string }[];
    project?: { name?: string; url?: string };
  };
  const history = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, text: m.text.slice(0, 4000) }));
  if (!history.length || !history.some((m) => m.role === "user")) {
    return badRequest("Пустой запрос");
  }

  if (activeProvider() === "demo") {
    return NextResponse.json(
      { error: "LLM не настроен на сервере (DEEPSEEK_API_KEY / YANDEXGPT_API_KEY). Чат заработает после подключения ключа." },
      { status: 503 }
    );
  }

  const spend = trySpend(acc, "prompt");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 }
    );
  }

  const project = body.project || {};

  // Chatsonic-режим: URL в сообщении — читаем страницу (только http/https,
  // публичные хосты) и добавляем её текст как контекст ответа.
  let pageContext = "";
  const lastUser = [...history].reverse().find((m) => m.role === "user")?.text || "";
  const urls = [...lastUser.matchAll(/https?:\/\/[^\s)>"']+/g)].map((m) => m[0]).slice(0, 2);
  for (const raw of urls) {
    try {
      const u = new URL(raw);
      if (u.protocol !== "http:" && u.protocol !== "https:") continue;
      const host = u.hostname.toLowerCase();
      if (
        host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" ||
        host === "metadata.google.internal" ||
        /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
        /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)
      ) continue;
      const res = await fetch(u.toString(), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; InsontChat/1.0)" },
        signal: AbortSignal.timeout(12_000),
        redirect: "follow",
      });
      if (!res.ok) continue;
      const html = await res.text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 6000);
      if (text.length > 200) pageContext += `\n\nКОНТЕКСТ СТРАНИЦЫ ${u.toString()}:\n<<<\n${text}\n>>>`;
    } catch {
      // страница недоступна — отвечаем без контекста
    }
  }

  const system = [
    "Ты — консультант INSONT по SEO, GEO и AEO для российского рынка. Отвечай по-русски, кратко и предметно.",
    project.name ? `Проект пользователя: ${project.name}${project.url ? ` (${project.url})` : ""}.` : "",
    pageContext
      ? "К сообщению приложен текст страницы (КОНТЕКСТ СТРАНИЦЫ). Отвечай по нему: анализируй структуру, заголовки, цены, полноту ответа на вопрос. Не выдумывай того, чего нет в контексте; если данных мало — так и скажи."
      : "Важно: реальных замеров этого сайта у тебя нет. Не выдумывай проценты видимости, позиции, скоры, наличие ошибок и любые цифры «по результатам проверки». Если вопрос требует измерения — скажи, какой раздел кабинета его делает: «Аудит» (живой обход сайта), «Ключи» (подсказки Яндекса и Wordstat), «Видимость» (Метрика и Вебмастер), «Конкуренты» (живые замеры).",
    "Можешь объяснять методики, разбирать семантику, советовать структуру страниц и писать черновики текстов.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await llmComplete([{ role: "system", text: system + pageContext }, ...history], {
    temperature: 0.4,
    maxTokens: 900,
    timeoutMs: 100_000,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ reply: result.text, profile: publicProfile(spend.acc) });
}
