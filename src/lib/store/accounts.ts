import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import { join } from "path";
import { accountIdFor, type PasswordRecord } from "@/lib/auth";
import { makeRefCode, scaleLimit } from "@/lib/referral";
import { PLANS } from "@/lib/site";
import type { PlanId } from "@/lib/session";

const ACCOUNTS_DIR = join(process.cwd(), "data", "accounts");

export const DEV_EMAILS = ["egor.freeman@yandex.ru"];

export function isDevEmail(email: string) {
  return DEV_EMAILS.includes(email.trim().toLowerCase());
}

export type AccountProfile = {
  email: string;
  name: string;
  company: string;
  plan: PlanId;
  billing: "monthly" | "annual";
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

export type Counters = {
  period: string; // YYYY-MM; при смене месяца счётчики обнуляются
  promptsUsed: number;
  articlesUsed: number;
  auditsUsed: number;
  freeQueriesUsed: number;
};

export type Account = AccountProfile & {
  id: string;
  password: PasswordRecord;
  counters: Counters;
};

/** Статья на сервере: надмножество клиентского ContentItem. */
export type Article = {
  id: string;
  projectId: string;
  title: string;
  type: "статья" | "FAQ" | "пост" | "письмо" | "бриф";
  status: "черновик" | "готово" | "опубликовано";
  words: number;
  updated: string;
  body: string;
  meta?: {
    key?: string;
    seoTitle?: string;
    seoDescription?: string;
    provider?: "deepseek" | "yandex" | "demo" | "manual";
    source?: "writer" | "bulk" | "manual";
    wpPostId?: number;
    wpUrl?: string;
  };
};

export type WpCredentials = {
  url: string; // адрес сайта, например https://example.com
  user: string; // логин WP
  appPassword: string; // application password, хранится только на сервере
};

function currentPeriod() {
  return new Date().toISOString().slice(0, 7);
}

function accountDir(id: string) {
  return join(ACCOUNTS_DIR, id);
}

function accountPath(id: string) {
  return join(accountDir(id), "account.json");
}

function articlesDir(id: string) {
  return join(accountDir(id), "articles");
}

function articlePath(id: string, articleId: string) {
  return join(articlesDir(id), `${articleId.replace(/[^a-z0-9-]/gi, "_")}.json`);
}

function wpPath(id: string, projectId: string) {
  return join(accountDir(id), "wp", `${projectId.replace(/[^a-z0-9-]/gi, "_")}.json`);
}

function normalizeAccount(raw: Account): Account {
  if (raw.counters.period !== currentPeriod()) {
    raw.counters = { period: currentPeriod(), promptsUsed: 0, articlesUsed: 0, auditsUsed: 0, freeQueriesUsed: 0 };
  }
  return raw;
}

export function createAccount(input: {
  email: string;
  password: PasswordRecord;
  name?: string;
  company?: string;
  referredBy?: string;
}): Account | { error: string } {
  const email = input.email.trim().toLowerCase();
  if (findByEmail(email)) return { error: "Такая почта уже зарегистрирована" };
  const id = accountIdFor(email);
  const dev = isDevEmail(email);
  const acc: Account = {
    id,
    email,
    password: input.password,
    counters: { period: currentPeriod(), promptsUsed: 0, articlesUsed: 0, auditsUsed: 0, freeQueriesUsed: 0 },
    name: (input.name || email.split("@")[0]).slice(0, 100),
    company: (input.company || "").slice(0, 150),
    plan: dev ? "growth" : "starter",
    billing: "monthly",
    paid: dev,
    paymentFailed: false,
    failedAmount: 0,
    createdAt: new Date().toISOString(),
    phone: "",
    inn: "",
    city: "Москва",
    site: "",
    job: "",
    region: "Москва",
    timezone: "Europe/Moscow",
    notifyEmail: true,
    notifyWeekly: true,
    notifyTelegram: false,
    refCode: makeRefCode(email),
    referredBy: (input.referredBy || "").slice(0, 32),
    referralCount: 0,
  };
  mkdirSync(accountDir(id), { recursive: true });
  writeFileSync(accountPath(id), JSON.stringify(acc, null, 2), "utf8");
  return acc;
}

export function findByEmail(email: string): Account | null {
  const id = accountIdFor(email.trim().toLowerCase());
  return findById(id);
}

export function findById(id: string): Account | null {
  try {
    const raw = JSON.parse(readFileSync(accountPath(id), "utf8")) as Account;
    if (raw.id !== id) return null;
    const normalized = normalizeAccount(raw);
    if (normalized !== raw) saveAccount(normalized);
    return normalized;
  } catch {
    return null;
  }
}

export function saveAccount(acc: Account) {
  mkdirSync(accountDir(acc.id), { recursive: true });
  writeFileSync(accountPath(acc.id), JSON.stringify(acc, null, 2), "utf8");
}

/** Лимиты тарифа с учётом dev-режима и рефералов — серверный аналог planForSession. */
export function limitsFor(acc: Account) {
  const plan = PLANS.find((p) => p.id === acc.plan) ?? PLANS[0];
  if (isDevEmail(acc.email)) {
    return { articles: 9999, prompts: 999_999, audits: 9999, projects: 9999, styles: 9999, name: "Разработчик" };
  }
  const n = acc.referralCount || 0;
  return {
    articles: scaleLimit(plan.limits.articles, n),
    prompts: scaleLimit(plan.limits.prompts, n),
    audits: scaleLimit(plan.limits.audits, n),
    projects: scaleLimit(plan.limits.projects, n),
    styles: scaleLimit(plan.limits.styles, n),
    name: plan.name,
  };
}

export type SpendKind = "prompt" | "article" | "audit";

export function trySpend(
  acc: Account,
  kind: SpendKind,
  amount = 1
): { ok: true; acc: Account } | { ok: false; limit: number; used: number } {
  const limits = limitsFor(acc);
  const used =
    kind === "prompt"
      ? acc.counters.promptsUsed
      : kind === "article"
        ? acc.counters.articlesUsed
        : acc.counters.auditsUsed;
  const limit = kind === "prompt" ? limits.prompts : kind === "article" ? limits.articles : limits.audits;
  if (!acc.paid && !isDevEmail(acc.email)) {
    // неоплаченные: 5 бесплатных запросов (единый счётчик, как в клиенте)
    if (acc.counters.freeQueriesUsed >= 5) return { ok: false, limit: 5, used: acc.counters.freeQueriesUsed };
    acc.counters.freeQueriesUsed += amount;
    saveAccount(acc);
    return { ok: true, acc };
  }
  if (used >= limit) return { ok: false, limit, used };
  if (kind === "prompt") acc.counters.promptsUsed += amount;
  else if (kind === "article") acc.counters.articlesUsed += amount;
  else acc.counters.auditsUsed += amount;
  saveAccount(acc);
  return { ok: true, acc };
}

/** Публичный профиль для клиента — без хэша пароля. */
export function publicProfile(acc: Account) {
  const { password: _pw, id: _id, counters, ...rest } = acc;
  return {
    ...rest,
    articlesUsed: counters.articlesUsed,
    auditsUsed: counters.auditsUsed,
    promptsUsed: counters.promptsUsed,
    freeQueriesUsed: counters.freeQueriesUsed,
  };
}

// --- Статьи -------------------------------------------------------------------

export function listArticles(accountId: string): Article[] {
  try {
    const names = readdirSync(articlesDir(accountId));
    const items: Article[] = [];
    for (const name of names) {
      if (!name.endsWith(".json")) continue;
      try {
        items.push(JSON.parse(readFileSync(join(articlesDir(accountId), name), "utf8")) as Article);
      } catch {
        /* битый файл пропускаем */
      }
    }
    return items.sort((a, b) => (a.updated < b.updated ? 1 : -1));
  } catch {
    return [];
  }
}

export function getArticle(accountId: string, articleId: string): Article | null {
  try {
    return JSON.parse(readFileSync(articlePath(accountId, articleId), "utf8")) as Article;
  } catch {
    return null;
  }
}

export type ArticleInput = Partial<Article> & Pick<Article, "projectId" | "title">;

export function putArticle(accountId: string, article: ArticleInput): Article {
  const base: Article = {
    id: "",
    projectId: article.projectId,
    title: article.title,
    type: article.type || "статья",
    status: article.status || "черновик",
    words: 0,
    updated: "",
    body: "",
    ...(article as Partial<Article>),
  };
  const clean: Article = {
    ...base,
    id: base.id || "a-" + randomUUID().slice(0, 12),
    title: String(base.title || "Без названия").slice(0, 300),
    body: String(base.body || "").slice(0, 512 * 1024),
    updated: new Date().toISOString().slice(0, 10),
  };
  clean.words = clean.body ? clean.body.split(/\s+/).filter(Boolean).length : 0;
  mkdirSync(articlesDir(accountId), { recursive: true });
  writeFileSync(articlePath(accountId, clean.id), JSON.stringify(clean, null, 2), "utf8");
  return clean;
}

export function deleteArticle(accountId: string, articleId: string) {
  rmSync(articlePath(accountId, articleId), { force: true });
}

// --- WordPress-реквизиты проекта ----------------------------------------------

export function saveWp(accountId: string, projectId: string, wp: WpCredentials) {
  const dir = join(accountDir(accountId), "wp");
  mkdirSync(dir, { recursive: true });
  writeFileSync(wpPath(accountId, projectId), JSON.stringify(wp), "utf8");
}

export function getWp(accountId: string, projectId: string): WpCredentials | null {
  try {
    return JSON.parse(readFileSync(wpPath(accountId, projectId), "utf8")) as WpCredentials;
  } catch {
    return null;
  }
}

export function deleteWp(accountId: string, projectId: string) {
  rmSync(wpPath(accountId, projectId), { force: true });
}
