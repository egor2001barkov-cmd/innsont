import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { deepseekComplete, deepseekConfigured } from "@/lib/llm/deepseek";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const SYSTEM =
  "Ты SEO-специалист, работающий с семантикой. Возвращаешь ТОЛЬКО валидный JSON без пояснений и без markdown-обёрток.";

/**
 * POST /api/seo/terms — NLP/LSI-термины к ключу (аналог Surfer NLP-анализа).
 * Тело: { key }. Возвращает { terms: [{ term, group, use }] }.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { key?: unknown };
  const key = String(body.key || "").trim().slice(0, 120);
  if (key.length < 3) return badRequest("Введите ключ от 3 символов");

  if (!deepseekConfigured()) {
    return NextResponse.json({ error: "Функция доступна только с подключённой моделью" }, { status: 503 });
  }

  const spend = trySpend(acc, "prompt");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 },
    );
  }

  const result = await deepseekComplete(
    [
      { role: "system", text: SYSTEM },
      {
        role: "user",
        text: `Ключевой запрос: «${key}».\nСоставь 18-22 семантических термина (NLP/LSI), которые должны встретиться в хорошей статье по этому запросу.\nГруппы: "суть" (что это, ключевые понятия), "практика" (как, этапы, инструменты), "цифры" (что измерить/сравнить), "смежные" (соседние темы для полноты).\nКаждый термин: { "term": 1-3 слова, "group": группа, "use": как употребить в статье (до 60 знаков) }.\nФормат ответа строго: { "terms": [ ... ] }`,
      },
    ],
    { temperature: 0.5, maxTokens: 1800, timeoutMs: 110_000 },
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  // из ответа модели достаём JSON (терпим обёртки/запятые-хвосты)
  let terms: { term: string; group: string; use?: string }[] = [];
  try {
    const raw = result.text.trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    terms = (JSON.parse(raw.slice(start, end + 1)).terms || []).filter(
      (t: { term?: unknown }) => typeof t.term === "string" && t.term.trim(),
    );
  } catch {
    terms = [];
  }
  if (!terms.length) {
    return NextResponse.json({ error: "Модель вернула нечитаемый список, попробуйте ещё раз" }, { status: 502 });
  }

  return NextResponse.json({ terms: terms.slice(0, 24), provider: "deepseek", profile: publicProfile(spend.acc) });
}
