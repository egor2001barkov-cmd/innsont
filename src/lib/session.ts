import { PLANS } from "@/lib/site";
import { makeRefCode, scaleLimit } from "@/lib/referral";

export const FREE_QUERIES = 5;

export const DEV_EMAILS = ["egor.freeman@yandex.ru"];

export function isDevAccount(email?: string | null) {
  return Boolean(email && DEV_EMAILS.includes(email.trim().toLowerCase()));
}

export type PlanId = "starter" | "basic" | "growth";

export type Session = {
  email: string;
  name: string;
  company: string;
  plan: PlanId;
  billing: "monthly" | "annual";
  articlesUsed: number;
  freeQueriesUsed: number;
  promptsUsed: number;
  paid: boolean;
  paymentFailed: boolean;
  failedAmount: number;
  createdAt: string;
  phone: string;
  inn: string;
  city: string;
  site: string;
  job: string;
  region: string;
  timezone: string;
  notifyEmail: boolean;
  notifyWeekly: boolean;
  notifyTelegram: boolean;
  refCode: string;
  referredBy: string;
  referralCount: number;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "владелец" | "редактор" | "просмотр";
};

export type Invoice = {
  id: string;
  date: string;
  title: string;
  amount: number;
  status: "оплачен" | "ожидает" | "черновик";
};

const KEY = "innsont.session";
const TEAM = "innsont.team";
const BILLS = "innsont.invoices";

export function emptySession(partial: Partial<Session> & Pick<Session, "email">): Session {
  const dev = isDevAccount(partial.email);
  return {
    name: partial.name || (dev ? "Егор" : partial.email.split("@")[0]),
    company: partial.company || "",
    plan: dev ? "growth" : partial.plan || "starter",
    billing: partial.billing || "monthly",
    articlesUsed: dev ? 0 : partial.articlesUsed ?? 0,
    freeQueriesUsed: 0,
    promptsUsed: dev ? 0 : partial.promptsUsed ?? 0,
    paid: dev ? true : partial.paid ?? false,
    paymentFailed: dev ? false : (partial.paymentFailed ?? !partial.paid),
    failedAmount: partial.failedAmount ?? 3990,
    createdAt: partial.createdAt || new Date().toISOString(),
    phone: partial.phone || "",
    inn: partial.inn || "",
    city: partial.city || "Москва",
    site: partial.site || "",
    job: partial.job || "",
    region: partial.region || "Москва",
    timezone: partial.timezone || "Europe/Moscow",
    notifyEmail: partial.notifyEmail ?? true,
    notifyWeekly: partial.notifyWeekly ?? true,
    notifyTelegram: partial.notifyTelegram ?? false,
    refCode: partial.refCode || makeRefCode(partial.email),
    referredBy: partial.referredBy || "",
    referralCount: partial.referralCount ?? 0,
    email: partial.email,
  };
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return emptySession(JSON.parse(raw) as Session);
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(emptySession(s)));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("innsont-session"));
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function loadTeam(ownerEmail: string): TeamMember[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TEAM);
  if (raw) {
    try {
      return JSON.parse(raw) as TeamMember[];
    } catch {
      /* fallthrough */
    }
  }
  return [
    {
      id: "owner",
      name: "Вы",
      email: ownerEmail,
      role: "владелец",
    },
  ];
}

export function saveTeam(members: TeamMember[]) {
  localStorage.setItem(TEAM, JSON.stringify(members));
}

export function loadInvoices(planName: string, amount: number): Invoice[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(BILLS);
  if (raw) {
    try {
      return JSON.parse(raw) as Invoice[];
    } catch {
      /* fallthrough */
    }
  }
  const now = new Date();
  const prev = new Date(now);
  prev.setMonth(now.getMonth() - 1);
  const seed: Invoice[] = [
    {
      id: "INV-1003",
      date: now.toISOString().slice(0, 10),
      title: `Тариф «${planName}»`,
      amount,
      status: "ожидает",
    },
    {
      id: "INV-1002",
      date: prev.toISOString().slice(0, 10),
      title: `Тариф «${planName}»`,
      amount,
      status: "оплачен",
    },
  ];
  localStorage.setItem(BILLS, JSON.stringify(seed));
  return seed;
}

export function saveInvoices(items: Invoice[]) {
  localStorage.setItem(BILLS, JSON.stringify(items));
}

export function queriesLeft(s: Session) {
  if (s.paid) return Infinity;
  return Math.max(0, FREE_QUERIES - s.freeQueriesUsed);
}

export function consumeQuery(s: Session): { ok: true; session: Session } | { ok: false; session: Session } {
  if (isDevAccount(s.email) || s.paid) return { ok: true, session: s };
  if (s.freeQueriesUsed >= FREE_QUERIES) return { ok: false, session: s };
  const next = emptySession({ ...s, freeQueriesUsed: s.freeQueriesUsed + 1 });
  saveSession(next);
  return { ok: true, session: next };
}

export function seedDemoSession(partial: Partial<Session> & Pick<Session, "email">): Session {
  return emptySession({
    name: partial.name || "IN",
    company: partial.company || "",
    plan: partial.plan || "growth",
    billing: partial.billing || "monthly",
    paid: partial.paid ?? true,
    paymentFailed: partial.paymentFailed ?? false,
    failedAmount: 3990,
    articlesUsed: partial.articlesUsed ?? 8,
    promptsUsed: partial.promptsUsed ?? 34,
    site: partial.site || "",
    city: "Москва",
    job: partial.job || "Маркетинг",
    email: partial.email,
  });
}

export function consumePrompt(s: Session, limit: number): { ok: true; session: Session } | { ok: false; session: Session } {
  if (isDevAccount(s.email)) return { ok: true, session: s };
  if (!s.paid) {
    return consumeQuery(s);
  }
  if (s.promptsUsed >= limit) return { ok: false, session: s };
  const next = emptySession({ ...s, promptsUsed: s.promptsUsed + 1 });
  saveSession(next);
  return { ok: true, session: next };
}

export function planOf(s: Session | null) {
  return s?.plan || "starter";
}

const DEV_LIMITS = {
  users: 9999,
  projects: 9999,
  articles: 9999,
  audits: 9999,
  prompts: 999999,
  answers: 999999,
  agentRuns: 9999,
  actionItems: true,
  styles: 9999,
};

export function planForSession(session: Session | null) {
  const plan = PLANS.find((p) => p.id === (session?.plan || "starter")) ?? PLANS[2];
  if (session && isDevAccount(session.email)) {
    return { ...plan, name: "Разработчик", audience: "Доступ разработчика", limits: DEV_LIMITS };
  }
  const n = session?.referralCount || 0;
  if (!n) return plan;
  const limits = plan.limits;
  return {
    ...plan,
    audience: plan.audience + ` · рефералы +${n * 20}%`,
    limits: {
      ...limits,
      users: scaleLimit(limits.users, n),
      projects: scaleLimit(limits.projects, n),
      articles: scaleLimit(limits.articles, n),
      audits: scaleLimit(limits.audits, n),
      prompts: scaleLimit(limits.prompts, n),
      answers: scaleLimit(limits.answers, n),
      agentRuns: scaleLimit(limits.agentRuns, n),
      styles: scaleLimit(limits.styles, n),
      actionItems: limits.actionItems,
    },
  };
}
