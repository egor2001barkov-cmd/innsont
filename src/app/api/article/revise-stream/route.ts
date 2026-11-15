import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, saveAccount, trySpend } from "@/lib/store/accounts";
import { deepseekComplete, deepseekConfigured, deepseekStream } from "@/lib/llm/deepseek";
import type { ChatMessage } from "@/lib/llm";
import { humanizeArticle } from "@/lib/humanizer-llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const SYSTEM =
  "Ты старший редактор российского онлайн-издания. По правкам пользователя возвращаешь ТОЛЬКО полный отредактированный текст статьи в markdown: без пояснений, без «вот исправленная версия», без вступлений. Сохраняй H1 и структуру H2, факты и таблицы, если в правках не сказано иначе. Текущий год — 2026.";

/**
 * POST /api/article/revise-stream — перегенерация статьи по правкам пользователя.
 * Тело: { markdown, instruction }. Отдаёт SSE так же, как draft-stream.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { markdown?: unknown; instruction?: unknown };
  const markdown = typeof body.markdown === "string" ? body.markdown : "";
  const instruction = typeof body.instruction === "string" ? body.instruction.trim() : "";

  if (markdown.length < 100) return badRequest("Нет текста статьи для правки");
  if (instruction.length < 3) return badRequest("Опишите, что исправить");
  if (instruction.length > 600) return badRequest("Слишком длинная инструкция (максимум 600 символов)");
  if (markdown.length > 60_000) return badRequest("Статья слишком длинная для правки");

  if (!deepseekConfigured()) {
    return NextResponse.json({ error: "Правки доступны только с DeepSeek" }, { status: 503 });
  }

  const spend = trySpend(acc, "prompt");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 },
    );
  }

  const words = markdown.split(/\s+/).filter(Boolean).length;
  const maxTokens = Math.min(8000, Math.max(1200, Math.round(words * 2.2)));

  const messages: ChatMessage[] = [
    { role: "system", text: SYSTEM },
    {
      role: "user",
      text: `Правки: ${instruction}\n\nСтатья:\n<<<\n${markdown}\n>>>\n\nВерни полный текст статьи после правок.`,
    },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let reasoning = "";
      let lastReasoningAt = 0;
      const pushReasoning = (text: string, force = false) => {
        reasoning += text;
        const now = Date.now();
        if (!force && now - lastReasoningAt < 200) return;
        lastReasoningAt = now;
        send({ type: "reasoning", text: reasoning.replace(/deepseek/gi, "INSONT AI").slice(-700) });
      };

      let text = "";
      try {
        send({ type: "status", stage: "revise", label: "Применяем правки", progress: 8 });

        for await (const chunk of deepseekStream(messages, { temperature: 0.4, maxTokens })) {
          if (chunk.type === "reasoning") pushReasoning(chunk.text);
          else {
            text += chunk.text;
            send({ type: "content", stage: "revise", text: chunk.text });
          }
        }
        pushReasoning("", true);

        send({ type: "status", stage: "humanize", label: "Прогоняем через humanizer", progress: 92 });
        const humanized = await humanizeArticle(text.trim());
        const result = humanized.markdown;
        const resultWords = result.split(/\s+/).filter(Boolean).length;
        if (resultWords < 250) {
          acc.counters.promptsUsed = Math.max(0, acc.counters.promptsUsed - 1);
          saveAccount(acc);
          send({ type: "error", message: "Модель вернула слишком короткий текст, промпт не списан. Попробуйте ещё раз." });
        } else {
          send({ type: "done", markdown: result, words: resultWords, provider: "deepseek", humanizer: { before: humanized.before, after: humanized.after, applied: humanized.applied }, profile: publicProfile(acc) });
        }
      } catch (error) {
        const cause = (error as { cause?: unknown })?.cause;
        console.error("[revise-stream] stream failed, fallback:", error, "cause:", cause);
        // Фолбэк: та же правка обычным запросом, чтобы не терять результат.
        const res = await deepseekComplete(messages, { temperature: 0.4, maxTokens });
        if (res.ok && res.text.trim().split(/\s+/).length >= 250) {
          send({ type: "done", markdown: res.text.trim(), words: res.text.trim().split(/\s+/).length, provider: "deepseek", profile: publicProfile(acc) });
        } else {
          acc.counters.promptsUsed = Math.max(0, acc.counters.promptsUsed - 1);
          saveAccount(acc);
          send({ type: "error", message: "Не удалось применить правки, промпт не списан. Попробуйте ещё раз." });
        }
      } finally {
        closed = true;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
