import { NextResponse } from "next/server";
import { currentAccount, unauthorized } from "@/lib/api";
import { getArticle, listArticles, putArticle, type Article } from "@/lib/store/accounts";

export const runtime = "nodejs";

/**
 * Разовая миграция: клиент при входе заливает статьи из localStorage.
 * Идемпотентно: существующие id пропускаются, лимит тарифа не списывается.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { items?: Partial<Article>[] };
  const items = Array.isArray(body.items) ? body.items.slice(0, 500) : [];
  let imported = 0;
  let skipped = 0;
  for (const item of items) {
    if (!item.id || !item.title) {
      skipped++;
      continue;
    }
    if (getArticle(acc.id, item.id)) {
      skipped++;
      continue;
    }
    putArticle(acc.id, {
      ...item,
      meta: { ...(item.meta || {}), source: item.meta?.source || "manual", provider: "manual" },
    } as Article);
    imported++;
  }
  return NextResponse.json({ imported, skipped, total: listArticles(acc.id).length });
}
