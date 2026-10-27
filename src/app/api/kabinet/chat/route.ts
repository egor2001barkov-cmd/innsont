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
  const system = [
    "Ты — консультант INSONT по SEO, GEO и AEO для российского рынка. Отвечай по-русски, кратко и предметно.",
    project.name ? `Проект пользователя: ${project.name}${project.url ? ` (${project.url})` : ""}.` : "",
    "Важно: реальных замеров этого сайта у тебя нет. Не выдумывай проценты видимости, позиции, скоры, наличие ошибок и любые цифры «по результатам проверки». Если вопрос требует измерения — скажи, какой раздел кабинета его делает: «Аудит» (живой обход сайта), «Ключи» (подсказки Яндекса и Wordstat), «Видимость» (Метрика и Вебмастер), «Конкуренты» (живые замеры).",
    "Можешь объяснять методики, разбирать семантику, советовать структуру страниц и писать черновики текстов.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await llmComplete([{ role: "system", text: system }, ...history], {
    temperature: 0.4,
    maxTokens: 700,
    timeoutMs: 90_000,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ reply: result.text, profile: publicProfile(spend.acc) });
}
