import { NextResponse } from "next/server";
import { badRequest, currentAccount, unauthorized } from "@/lib/api";
import { listPlan, updatePlanItem } from "@/lib/store/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** POST /api/plan/measure { projectId, id } — снимок опубликованной страницы. */
export async function POST(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { projectId?: string; id?: string };
  const projectId = String(body.projectId || "").trim().slice(0, 100);
  const id = String(body.id || "");
  if (!projectId || !id) return badRequest("Нужны projectId и id");

  const item = listPlan(account.id, projectId).items.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "Строка не найдена" }, { status: 404 });
  if (!item.targetUrl) return badRequest("У строки не указан целевой URL");

  const url = item.targetUrl.startsWith("http") ? item.targetUrl : `https://${item.targetUrl}`;
  let html = "";
  let status = 0;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "InsontCheck/1.0 (+https://insont.ru)", Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    status = res.status;
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Страница не отвечает" }, { status: 422 });
  }

  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1]?.replace(/\s+/g, " ").trim() || "";
  const indexable = !/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;

  const lastCheck = { at: new Date().toISOString(), status, title, words, indexable };
  const nextStatus = item.status === "опубликовано" ? "измерено" : item.status;
  const updated = updatePlanItem(account.id, projectId, id, { lastCheck, status: nextStatus });

  return NextResponse.json({ lastCheck, item: updated });
}
