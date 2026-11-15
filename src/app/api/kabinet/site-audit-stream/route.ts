import { NextResponse } from "next/server";
import { badRequest, currentAccount, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { auditSite } from "@/lib/site-audit";
import { deepAudit } from "@/lib/deep-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** SSE-аудит: этапы и живые страницы вместо «Обходим…». */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { site?: string; maxPages?: number };
  const site = String(body.site || "").trim();
  if (!site) return badRequest("Нужен адрес сайта");

  const spend = trySpend(acc, "audit");
  if (!spend.ok) {
    return NextResponse.json({ error: `Лимит аудитов тарифа: ${spend.limit}` }, { status: 402 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      try {
        send({ type: "status", label: "Читаем robots.txt, sitemap и редиректы", progress: 6 });
        const audit = await auditSite(site);
        if ("error" in audit) {
          send({ type: "error", message: audit.error });
          return;
        }
        send({ type: "audit", audit });
        send({ type: "status", label: "Обходим страницы и считаем контент", progress: 35 });

        const total = Math.min(Math.max(Number(body.maxPages) || 60, 3), 200);
        const deep = await deepAudit(site, {
          maxPages: total,
          onPage: (page, index, all) => {
            send({
              type: "page",
              url: page.url,
              status: page.status,
              words: page.words,
              humanHits: page.humanHits,
              schema: page.schema.length,
              index,
              total: all,
              progress: 35 + Math.round((index / all) * 55),
            });
          },
        });
        send({ type: "status", label: "Собираем план действий", progress: 94 });
        send({ type: "done", audit, deep, profile: publicProfile(acc) });
      } catch (e) {
        send({ type: "error", message: e instanceof Error ? e.message : "Аудит прервался" });
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
