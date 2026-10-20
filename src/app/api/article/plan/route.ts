import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { generatePlan } from "@/lib/article";
import { contextFromRequest } from "@/lib/article-request";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ctx = contextFromRequest(body);
  if (!ctx.key) return badRequest("Нужен ключевой запрос");

  const spend = trySpend(acc, "prompt");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит промптов тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 }
    );
  }

  const { plan, provider } = await generatePlan(ctx);
  return NextResponse.json({ plan, provider, profile: publicProfile(spend.acc) });
}
