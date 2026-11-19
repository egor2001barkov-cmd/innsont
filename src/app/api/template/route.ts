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

type StylePayload = {
  name?: unknown;
  tone?: unknown;
  audience?: unknown;
  rules?: unknown;
  pov?: unknown;
  goal?: unknown;
  readingLevel?: unknown;
  bannedWords?: unknown;
  preferredPhrases?: unknown;
  exampleText?: unknown;
};

/** Стиль бренда (Brand Voice): собирается в системный блок. */
function brandVoiceBlock(style: StylePayload): string {
  const parts: string[] = [];
  const tone = String(style.tone || "").trim();
  const audience = String(style.audience || "").trim();
  const rules = String(style.rules || "").trim();
  const pov = String(style.pov || "").trim();
  const goal = String(style.goal || "").trim();
  const readingLevel = String(style.readingLevel || "").trim();
  const banned = Array.isArray(style.bannedWords) ? style.bannedWords.map(String).filter(Boolean) : [];
  const preferred = Array.isArray(style.preferredPhrases) ? style.preferredPhrases.map(String).filter(Boolean) : [];
  const example = String(style.exampleText || "").trim();

  if (tone) parts.push(`Тональность: ${tone}.`);
  if (audience) parts.push(`Писать для аудитории: ${audience}.`);
  if (pov) parts.push(`Лицо повествования: ${pov}.`);
  if (goal) parts.push(`Цель текста: ${goal}.`);
  if (readingLevel) parts.push(`Уровень читателя: ${readingLevel}.`);
  if (rules) parts.push(`Правила стиля: ${rules}`);
  if (banned.length) parts.push(`Запрещённые слова и обороты: ${banned.join(", ")}.`);
  if (preferred.length) parts.push(`Желаемые формулировки: ${preferred.join(", ")}.`);
  if (example) {
    parts.push(`Образец живого голоса бренда (калибруй интонацию по нему, не копируй дословно):\n<<<\n${example.slice(0, 1500)}\n>>>`);
  }
  return parts.length ? "\n\nСТИЛЬ БРЕНДА:\n" + parts.join("\n") : "";
}

/**
 * POST /api/template — генерация по шаблону из библиотеки (Writesonic-подход).
 * Тело: { templateId, fields: {...}, projectName?, projectUrl?, style?: {...} }
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    templateId?: unknown;
    fields?: unknown;
    projectName?: unknown;
    projectUrl?: unknown;
    style?: unknown;
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
  const style = (body.style && typeof body.style === "object" ? body.style : {}) as StylePayload;
  const context = [brand && `Компания: ${brand}`, site && `Сайт: ${site}`].filter(Boolean).join("\n");

  const prompt = `${context ? context + "\n\n" : ""}${tpl.buildPrompt(values)}`;

  const result = await deepseekComplete(
    [
      { role: "system", text: SYSTEM + brandVoiceBlock(style) },
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
