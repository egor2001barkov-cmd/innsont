import { apiGuard, jsonOk } from "@/lib/api-auth";
import { limitsFor } from "@/lib/store/accounts";
import { listApiKeys } from "@/lib/store/api-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = apiGuard(req);
  if (!guard.ok) return guard.response;

  const { account } = guard.ctx;
  const limits = limitsFor(account);

  return jsonOk({
    account: { email: account.email, plan: account.plan, planName: limits.name, paid: account.paid },
    quota: {
      limit: limits.apiCalls,
      used: account.counters.apiCallsUsed || 0,
      remaining: Math.max(0, limits.apiCalls - (account.counters.apiCallsUsed || 0)),
      period: account.counters.period,
    },
    limits: {
      articles: limits.articles,
      prompts: limits.prompts,
      audits: limits.audits,
      projects: limits.projects,
    },
    keys: listApiKeys(account.id)
      .filter((k) => !k.revokedAt)
      .map((k) => ({ id: k.id, name: k.name, prefix: k.prefix, lastUsedAt: k.lastUsedAt })),
  });
}
