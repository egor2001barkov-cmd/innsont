import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { getArticle, putArticle } from "@/lib/store/accounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/content/share — публичная ссылка только-для-чтения на материал.
 * Тело: { id } → { shareId, url }. Повторный вызов с revoke:true убирает доступ.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { id?: unknown; revoke?: unknown };
  const id = String(body.id || "");
  if (!id) return badRequest("Нужен id материала");

  const article = getArticle(acc.id, id);
  if (!article) return badRequest("Материал не найден");

  if (body.revoke) {
    const meta = { ...article.meta };
    delete meta.shareId;
    const updated = putArticle(acc.id, { ...article, meta });
    return NextResponse.json({ shareId: null, revoked: true, article: updated });
  }

  const shareId = article.meta?.shareId || randomUUID().slice(0, 16);
  const updated = putArticle(acc.id, { ...article, meta: { ...article.meta, shareId } });
  return NextResponse.json({ shareId, url: `/s/${shareId}`, article: updated });
}
