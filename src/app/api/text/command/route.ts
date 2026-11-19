import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { deepseekComplete, deepseekConfigured } from "@/lib/llm/deepseek";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ACTIONS: Record<string, string> = {
  rewrite: "Перепиши фрагмент другими словами, сохранив смысл, тон и примерную длину.",
  shorten: "Сократи фрагмент примерно вдвое, сохранив все факты и главный вывод.",
  expand: "Расширь фрагмент: добавь детали и пример по смыслу, не более чем в полтора раза.",
  improve: "Улучши фрагмент: убери канцелярит и штампы, сделай живее, смысл сохрани.",
};

const SYSTEM =
  "Ты редактор текстов. Получаешь фрагмент и задачу, возвращаешь ТОЛЬКО исправленный фрагмент " +
  "без пояснений, кавычек и вступлений. Формат (markdown/plain) сохраняешь. Текущий год — 2026.";

/**
 * POST /api/text/command — правка выделенного фрагмента в редакторе
 * (Writesonic-инлайн: выбирается кусок текста, модель правит только его).
 * Тело: { text, action: "rewrite"|"shorten"|"expand"|"improve" }.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { text?: unknown; action?: unknown };
  const text = String(body.text || "").trim();
  const action = String(body.action || "");

  if (text.length < 20) return badRequest("Фрагмент слишком короткий (минимум 20 символов)");
  if (text.length > 6000) return badRequest("Фрагмент слишком длинный (до 6000 символов)");
  if (!ACTIONS[action]) return badRequest("Неизвестное действие");

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
      { role: "user", text: `${ACTIONS[action]}\n\nФрагмент:\n<<<\n${text}\n>>>` },
    ],
    { temperature: 0.5, maxTokens: 2500, timeoutMs: 110_000 },
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  const out = result.text.trim();
  if (!out || out.length < 10) {
    return NextResponse.json({ error: "Модель вернула пустой фрагмент, промпт не списан" }, { status: 502 });
  }

  return NextResponse.json({ text: out, profile: publicProfile(spend.acc) });
}
