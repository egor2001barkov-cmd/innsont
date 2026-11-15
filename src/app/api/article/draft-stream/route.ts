import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, saveAccount, trySpend } from "@/lib/store/accounts";
import { draftPromptSet, type ArticlePlan } from "@/lib/article";
import { contextFromRequest } from "@/lib/article-request";
import { deepseekConfigured, deepseekStream } from "@/lib/llm/deepseek";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/article/draft-stream — черновик статьи через SSE.
 *
 * Зачем: обычный /draft отдаёт ответ только целиком, и 60–90 секунд пользователь
 * смотрит в пустой экран. Здесь по мере генерации уходят события:
 *   status    — этап и прогресс (вступление → разделы → FAQ)
 *   reasoning — фрагмент размышлений модели (для панели «модель думает»)
 *   content   — кусок текста статьи
 *   done      — готовый markdown целиком
 *   error     — ошибка, списанные промпты возвращаются
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ctx = contextFromRequest(body);
  const plan = body.plan as ArticlePlan | undefined;
  if (!ctx.key || !plan || !Array.isArray(plan.sections)) return badRequest("Нужны key и plan");

  if (!deepseekConfigured()) {
    return NextResponse.json({ error: "Потоковая генерация доступна только с DeepSeek" }, { status: 503 });
  }

  // Черновик стоит 2 промпта — как и в обычном /draft.
  for (let i = 0; i < 2; i++) {
    const spend = trySpend(acc, "prompt");
    if (!spend.ok) {
      return NextResponse.json(
        { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
        { status: 402 },
      );
    }
  }

  const prompts = draftPromptSet(plan, ctx);
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
        // Белый лейбл: в интерфейсе не должно быть имени модели-провайдера.
        const clean = reasoning.replace(/deepseek/gi, "INSONT AI");
        send({ type: "reasoning", text: clean.slice(-700) });
      };

      const parts: string[] = [];

      try {
        send({ type: "status", stage: "lead", label: "Пишем вступление", progress: 5 });
        let lead = "";
        for await (const chunk of deepseekStream(prompts.lead, { temperature: 0.5, maxTokens: 700 })) {
          if (chunk.type === "reasoning") pushReasoning(chunk.text);
          else {
            lead += chunk.text;
            send({ type: "content", stage: "lead", text: chunk.text });
          }
        }
        pushReasoning("", true);
        parts.push(`# ${plan.title}\n\n${lead.trim()}\n`);

        for (let i = 0; i < prompts.sections.length; i++) {
          const section = prompts.sections[i];
          const progress = 12 + Math.round((i / prompts.sections.length) * 76);
          send({
            type: "status",
            stage: "section",
            index: i + 1,
            total: prompts.sections.length,
            label: `Раздел ${i + 1} из ${prompts.sections.length}: ${section.h2}`,
            progress,
          });

          let text = "";
          for await (const chunk of deepseekStream(section.messages, { temperature: 0.55, maxTokens: 1600 })) {
            if (chunk.type === "reasoning") pushReasoning(chunk.text);
            else {
              text += chunk.text;
              send({ type: "content", stage: "section", text: chunk.text });
            }
          }
          pushReasoning("", true);
          if (text.trim()) parts.push(text.trim() + "\n");
        }

        if (prompts.faq) {
          send({ type: "status", stage: "faq", label: "Собираем FAQ", progress: 92 });
          let text = "";
          for await (const chunk of deepseekStream(prompts.faq, { temperature: 0.4, maxTokens: 1100 })) {
            if (chunk.type === "reasoning") pushReasoning(chunk.text);
            else {
              text += chunk.text;
              send({ type: "content", stage: "faq", text: chunk.text });
            }
          }
          pushReasoning("", true);
          if (text.trim()) parts.push(text.trim() + "\n");
        }

        const markdown = parts.join("\n");
        const words = markdown.split(/\s+/).filter(Boolean).length;

        if (words < 250) {
          acc.counters.promptsUsed = Math.max(0, acc.counters.promptsUsed - 2);
          saveAccount(acc);
          send({ type: "error", message: `Модель вернула слишком короткий текст (${words} слов). Промпты не списаны.` });
        } else {
          send({ type: "done", markdown, words, provider: "deepseek", profile: publicProfile(acc) });
        }
      } catch (error) {
        acc.counters.promptsUsed = Math.max(0, acc.counters.promptsUsed - 2);
        saveAccount(acc);
        send({ type: "error", message: error instanceof Error ? error.message : "Генерация прервалась" });
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
