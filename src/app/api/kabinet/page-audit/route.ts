import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { auditPage } from "@/lib/page-audit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { url?: string; key?: string };
  const url = String(body.url || "").trim();
  if (!url) return badRequest("Нужен адрес страницы");
  const key = String(body.key || "").slice(0, 120);
  const result = await auditPage(url, key || undefined);
  if ("error" in result) return badRequest(result.error);
  return NextResponse.json({ audit: result });
}
