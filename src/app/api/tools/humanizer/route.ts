import { NextResponse } from "next/server";
import { clientIp, rateLimitOk } from "@/lib/auth";
import { analyze } from "@/lib/humanizer";

export const runtime = "nodejs";

/** Публичный очеловечиватель: без авторизации, IP-лимит 10/10мин. */
export async function POST(req: Request) {
  if (!rateLimitOk(clientIp(req), "pub-humanizer", 10)) {
    return NextResponse.json({ error: "Слишком часто. Подождите 10 минут." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { text?: string; autoFix?: boolean };
  const text = String(body.text || "");
  if (!text.trim()) return NextResponse.json({ error: "Вставьте текст" }, { status: 400 });
  if (text.length > 100_000) return NextResponse.json({ error: "Лимит 100 000 символов" }, { status: 400 });

  const report = analyze(text, Boolean(body.autoFix));
  return NextResponse.json({ report });
}
