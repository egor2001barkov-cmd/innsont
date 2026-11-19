import { NextResponse } from "next/server";
import { currentAccount, unauthorized } from "@/lib/api";
import { trySpend } from "@/lib/store/accounts";
import { deepseekComplete, deepseekConfigured } from "@/lib/llm/deepseek";
import { templateById } from "@/lib/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const SYSTEM =
  "Ты российский копирайтер и SEO-редактор. Выполняешь задание точно по формату из запроса. " +
  "Пишешь живым русским языком без штампов («не просто X, а Y», «идеальное решение», «широкий спектр», " +
  "«по доступным ценам»). Факты и цифры — только те, что даны в задании; чего не дано — формулируешь " +
  "как «уточняется» или честную неопределённость. Текущий год — 2026. В ответе — только результат, без вступлений.";

/**
 * POST /api/template — генерация по шаблону из библиотеки (Writesonic-подход).
 * Тело: { templateId, fields: {...}, projectName?, projectUrl? }
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    templateId?: unknown;
    fields?: unknown;
    projectName?: unknown;
    projectUrl?: unknown;
  };

  const tpl = templateById(String(body.templateId || ""));
  if (!tpl) return NextResponse.json({ error: "Неизвестный шаблон" }, { status: 400 });

  const raw = (body.fields && typeof body.fields === "object" ? body.fields : {}) as Record<string, unknown>;
  const values: Record<string, string> = {};
  for (const f of tpl.fields) {
    values[f.id] = String(raw[f.id] || "").trim().slice(0, f.type === "textarea" ? 12000 : 500);
  }
  const missing = tpl.fields.filter((f) => f.required && !values[f.id]).map((f) => f.label);
  if (missing.length) {
    return NextResponse.json({ error: `Заполните: ${missing.join(", ")}` }, { status: 400 });
  }

  if (!deepseekConfigured()) {
    return NextResponse.json({ error: "Генерация доступна только с подключённой моделью" }, { status: 503 });
  }

  const spend = trySpend(acc, "prompt");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 },
    );
  }

  const brand = String(body.projectName || "").trim();
  const site = String(body.projectUrl || "").trim();
  const context = [brand && `Компания: ${brand}`, site && `Сайт: ${site}`].filter(Boolean).join("\n");

  const prompt = `${context ? context + "\n\n" : ""}${tpl.buildPrompt(values)}`;

  const result = await deepseekComplete(
    [
      { role: "system", text: SYSTEM },
      { role: "user", text: prompt },
    ],
    { temperature: 0.7, maxTokens: 4000, timeoutMs: 170_000 },
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  const title = `${tpl.outputName}: ${values.key || values.topic || values.product || values.goal || tpl.name}`.slice(0, 120);

  return NextResponse.json({
    text: result.text,
    title,
    contentType: tpl.contentType,
    provider: "deepseek",
  });
}
