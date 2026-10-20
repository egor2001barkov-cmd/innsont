import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { polishArticle } from "@/lib/article";
import { contextFromRequest } from "@/lib/article-request";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ctx = contextFromRequest(body);
  const markdown = String(body.markdown || "");
  if (!markdown || !ctx.key) return badRequest("Нужны markdown и key");

  const spend = trySpend(acc, "prompt");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 }
    );
  }

  const meta = await polishArticle(markdown, ctx);
  return NextResponse.json({ ...meta, profile: publicProfile(spend.acc) });
}
