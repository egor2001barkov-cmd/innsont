import { NextResponse } from "next/server";
import { findById, isDevEmail, limitsFor, saveAccount, type Account } from "@/lib/store/accounts";
import { resolveApiKey, touchApiKey } from "@/lib/store/api-keys";

/** Ошибка в одном формате для всех /api/v1: { error: { code, message } }. */
export function jsonError(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json({ error: { code, message, ...extra } }, { status });
}

export type ApiContext = { account: Account; keyId: string };

export function authenticateApi(req: Request): ApiContext | null {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const hit = resolveApiKey(match[1].trim());
  if (!hit) return null;

  const account = findById(hit.accountId);
  if (!account) return null;
  return { account, keyId: hit.keyId };
}

type Guard = { ok: true; ctx: ApiContext } | { ok: false; response: NextResponse };

/**
 * API — функция тарифа «Рост» (у Старта и Базового в оферте написано «без API»).
 * Разработчический аккаунт проходит всегда.
 */
export function apiGuard(req: Request): Guard {
  const ctx = authenticateApi(req);
  if (!ctx) {
    return {
      ok: false,
      response: jsonError(401, "unauthorized", "Нужен заголовок Authorization: Bearer <ключ>"),
    };
  }

  if (!isDevEmail(ctx.account.email) && ctx.account.plan !== "growth") {
    return {
      ok: false,
      response: jsonError(
        403,
        "plan_required",
        "API доступен на тарифе «Рост» и в корпоративном. Ключи создаются на /kabinet/api",
        { upgrade: "https://insont.ru/tseny" },
      ),
    };
  }

  if (ctx.account.paymentFailed) {
    return {
      ok: false,
      response: jsonError(402, "payment_failed", "Платёж не прошёл, API приостановлен до оплаты"),
    };
  }

  return { ok: true, ctx };
}

export type QuotaState = { ok: true; used: number; limit: number } | { ok: false; used: number; limit: number };

/** Проверка квоты без списания — чтобы не тратить вызов на битый запрос. */
export function quotaCheck(ctx: ApiContext): QuotaState {
  const limit = limitsFor(ctx.account).apiCalls;
  const used = ctx.account.counters.apiCallsUsed || 0;
  return used < limit ? { ok: true, used, limit } : { ok: false, used, limit };
}

/** Списание после успешной работы. */
export function spendApi(ctx: ApiContext, cost = 1) {
  const limit = limitsFor(ctx.account).apiCalls;
  const used = (ctx.account.counters.apiCallsUsed || 0) + cost;
  ctx.account.counters.apiCallsUsed = used;
  saveAccount(ctx.account);
  touchApiKey(ctx.account.id, ctx.keyId);
  return { used, limit, remaining: Math.max(0, limit - used) };
}

export function jsonOk(data: unknown, charge?: { used: number; limit: number; remaining: number }) {
  return NextResponse.json(data, {
    headers: charge
      ? {
          "X-Api-Quota-Limit": String(charge.limit),
          "X-Api-Quota-Used": String(charge.used),
          "X-Api-Quota-Remaining": String(charge.remaining),
        }
      : undefined,
  });
}
