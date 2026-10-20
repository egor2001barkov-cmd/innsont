import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { generateDraft, type ArticlePlan } from "@/lib/article";
import { contextFromRequest } from "@/lib/article-request";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ctx = contextFromRequest(body);
  const plan = body.plan as ArticlePlan | undefined;
  if (!ctx.key || !plan || !Array.isArray(plan.sections)) return badRequest("Нужны key и plan");

  // черновик — самая дорогая операция: списываем 2 промпта
  for (let i = 0; i < 2; i++) {
    const spend = trySpend(acc, "prompt");
    if (!spend.ok) {
      return NextResponse.json(
        { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
        { status: 402 }
      );
    }
  }

  const { markdown, provider } = await generateDraft(plan, ctx);
  return NextResponse.json({ markdown, provider, profile: publicProfile(acc) });
}
