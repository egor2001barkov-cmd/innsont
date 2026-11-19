import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { publicProfile, trySpend } from "@/lib/store/accounts";
import { auditInternalLinks, buildLinkCampaign } from "@/lib/internal-links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 240;

/**
 * Перелинковка в кабинете (скилл internal-linking).
 * mode=audit  → граф, сироты, скор /100, топ-цели, анкоры.
 * mode=campaign → план ссылок: донор → анкор (дословная подстрока текста
 *                 донора) → цель, с гейтом валидации скилла.
 * Тело: { siteUrl, mode, maxPages?, focusTargets?: string[] }.
 */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    siteUrl?: unknown;
    mode?: unknown;
    maxPages?: unknown;
    focusTargets?: unknown;
  };

  const siteUrl = String(body.siteUrl || "").trim();
  if (!siteUrl) return badRequest("Нужен siteUrl проекта");
  const mode = String(body.mode || "audit") === "campaign" ? "campaign" : "audit";

  const spend = trySpend(acc, "audit");
  if (!spend.ok) {
    return NextResponse.json(
      { error: `Лимит проверок тарифа: ${spend.limit}. Дождитесь следующего месяца или смените план.` },
      { status: 402 },
    );
  }

  const opts = {
    maxPages: Number(body.maxPages) || 40,
    focusTargets: Array.isArray(body.focusTargets)
      ? body.focusTargets.map(String).filter(Boolean).slice(0, 10)
      : undefined,
  };

  const result =
    mode === "campaign"
      ? await buildLinkCampaign(siteUrl, opts)
      : await auditInternalLinks(siteUrl, opts);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ mode, ...result, profile: publicProfile(spend.acc) });
}
