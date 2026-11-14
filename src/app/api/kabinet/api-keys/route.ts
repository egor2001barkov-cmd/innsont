import { NextResponse } from "next/server";
import { currentAccount, unauthorized, badRequest } from "@/lib/api";
import { isDevEmail, limitsFor } from "@/lib/store/accounts";
import { createApiKey, listApiKeys, revokeApiKey } from "@/lib/store/api-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Управление ключами из кабинета: только cookie-сессия, ключи наружу не отдаём. */
export async function GET(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const limits = limitsFor(account);
  return NextResponse.json({
    keys: listApiKeys(account.id),
    plan: account.plan,
    planName: limits.name,
    apiEnabled: isDevEmail(account.email) || account.plan === "growth",
    quota: {
      limit: limits.apiCalls,
      used: account.counters.apiCallsUsed || 0,
      period: account.counters.period,
    },
  });
}

export async function POST(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  if (!isDevEmail(account.email) && account.plan !== "growth") {
    return NextResponse.json(
      { error: "API входит в тариф «Рост». На «Старте» и «Базовом» ключи недоступны." },
      { status: 403 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { name?: unknown };
  const name = typeof body.name === "string" ? body.name : "";

  try {
    const { key, record } = createApiKey(account.id, name);
    // Полный ключ показывается один раз — в базе только хэш.
    return NextResponse.json({ key, record });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не удалось создать ключ" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const id = new URL(req.url).searchParams.get("id") || "";
  if (!id) return badRequest("Не передан id ключа");

  return revokeApiKey(account.id, id)
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Ключ не найден" }, { status: 404 });
}
