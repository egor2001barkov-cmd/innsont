import { NextResponse } from "next/server";
import { attachmentHeader, currentAccount, badRequest, unauthorized } from "@/lib/api";
import { getArticle } from "@/lib/store/accounts";
import { mdToHtml } from "@/lib/markdown";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const format = url.searchParams.get("format") === "html" ? "html" : "md";
  if (!id) return badRequest("Нужен id");
  const article = getArticle(acc.id, id);
  if (!article) return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });

  const slug =
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s-]/gi, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "statya";

  if (format === "html") {
    return new NextResponse(mdToHtml(article.body, article.meta?.seoTitle || article.title), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": attachmentHeader(`${slug}.html`),
      },
    });
  }
  const front = [
    `# ${article.meta?.seoTitle || article.title}`,
    article.meta?.seoDescription ? `> ${article.meta.seoDescription}` : "",
    article.meta?.key ? `Ключ: ${article.meta.key}` : "",
    "",
  ].join("\n");
  return new NextResponse(front + article.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": attachmentHeader(`${slug}.md`),
    },
  });
}
