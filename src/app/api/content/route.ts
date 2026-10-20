import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import {
  deleteArticle,
  getArticle,
  listArticles,
  limitsFor,
  publicProfile,
  putArticle,
  trySpend,
  type Article,
} from "@/lib/store/accounts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const items = listArticles(acc.id).filter((a) => !projectId || a.projectId === projectId);
  return NextResponse.json({ items, limits: limitsFor(acc) });
}

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Partial<Article> & {
    spend?: boolean; // списывать статью из тарифа (генерация) или нет (ручное создание)
  };
  if (!body.projectId || !body.title) return badRequest("Нужны projectId и title");
  const spend = body.spend !== false;
  let accRef = acc;
  if (spend) {
    const res = trySpend(acc, "article");
    if (!res.ok) {
      return NextResponse.json(
        { error: `Лимит статей тарифа: ${res.limit}. Смените план или дождитесь следующего месяца.` },
        { status: 402 }
      );
    }
    accRef = res.acc;
  }
  const { spend: _s, ...payload } = body as Partial<Article> & { spend?: boolean };
  const article = putArticle(acc.id, {
    ...payload,
    type: body.type || "статья",
    status: body.status || "черновик",
  } as Article);
  return NextResponse.json({ article, profile: publicProfile(accRef) });
}

export async function PUT(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Partial<Article>;
  if (!body.id) return badRequest("Нужен id");
  const existing = getArticle(acc.id, body.id);
  if (!existing) return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  const updated = putArticle(acc.id, { ...existing, ...body, id: existing.id });
  return NextResponse.json({ article: updated });
}

export async function DELETE(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return badRequest("Нужен id");
  deleteArticle(acc.id, id);
  return NextResponse.json({ ok: true });
}
