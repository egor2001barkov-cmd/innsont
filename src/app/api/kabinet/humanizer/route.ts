import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { analyze } from "@/lib/humanizer";

export const runtime = "nodejs";

/** Очеловечиватель текста: скан ИИ-паттернов + автоочистка. */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { text?: string; autoFix?: boolean };
  const text = String(body.text || "");
  if (!text.trim()) return badRequest("Вставьте текст для проверки");
  if (text.length > 200_000) return badRequest("Текст слишком длинный (лимит 200 000 символов)");

  const report = analyze(text, Boolean(body.autoFix));
  return NextResponse.json({ report });
}
