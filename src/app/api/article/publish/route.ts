import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { getArticle, getWp, putArticle } from "@/lib/store/accounts";
import { mdToHtmlBody } from "@/lib/markdown";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Публикация статьи в WordPress как черновика через WP REST API. */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { articleId?: string; projectId?: string };
  if (!body.articleId || !body.projectId) return badRequest("Нужны articleId и projectId");

  const article = getArticle(acc.id, body.articleId);
  if (!article) return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  const wp = getWp(acc.id, body.projectId);
  if (!wp) return NextResponse.json({ error: "Сначала задайте реквизиты WordPress" }, { status: 400 });

  const auth = Buffer.from(`${wp.user}:${wp.appPassword}`).toString("base64");
  try {
    const res = await fetch(`${wp.url}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        title: article.meta?.seoTitle || article.title,
        status: "draft", // всегда черновик: финальное решение за автором в WP
        content: mdToHtmlBody(article.body),
        excerpt: article.meta?.seoDescription || undefined,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const hint = res.status === 401 ? " Проверьте логин и application password (Пользователи → Профиль → Пароли приложений)." : "";
      return NextResponse.json({ error: `WordPress: HTTP ${res.status}.${hint} ${detail.slice(0, 180)}` }, { status: 400 });
    }
    const post = (await res.json()) as { id?: number; link?: string };
    const updated = putArticle(acc.id, {
      ...article,
      status: "опубликовано",
      meta: { ...article.meta, wpPostId: post.id, wpUrl: post.link },
    });
    return NextResponse.json({ ok: true, link: post.link || `${wp.url}/wp-admin/edit.php`, article: updated });
  } catch (e) {
    return NextResponse.json(
      { error: `Сайт недоступен: ${e instanceof Error ? e.message : "ошибка сети"}` },
      { status: 400 }
    );
  }
}
