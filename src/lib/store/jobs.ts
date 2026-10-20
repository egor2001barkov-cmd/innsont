import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import {
  findById,
  getArticle,
  limitsFor,
  putArticle,
  trySpend,
  type Account,
  type Article,
} from "@/lib/store/accounts";
import { activeProvider, demoPlan, generateDraft, generatePlan, type ArticlePlan } from "@/lib/article";
import type { ArticleContext } from "@/lib/article";

export type BulkRow = {
  key: string;
  h1?: string;
  city?: string;
  url?: string;
  state: "в очереди" | "работает" | "готово" | "ошибка";
  articleId?: string;
  error?: string;
};

export type BulkJob = {
  id: string;
  accountId: string;
  projectId: string;
  createdAt: string;
  provider: "deepseek" | "yandex" | "demo";
  status: "работает" | "готово" | "прерван" | "ошибка";
  rows: BulkRow[];
  error?: string;
};

// Задачи живут в памяти процесса (контейнер один) и дублируются на диск для аудита.
const registry = new Map<string, BulkJob>();

function jobsDir(accountId: string) {
  return join(process.cwd(), "data", "accounts", accountId, "jobs");
}

function persist(job: BulkJob) {
  try {
    mkdirSync(jobsDir(job.accountId), { recursive: true });
    writeFileSync(join(jobsDir(job.accountId), `${job.id}.json`), JSON.stringify(job, null, 2), "utf8");
  } catch {
    /* запись файла не критична для работы */
  }
}

export function lastJob(accountId: string): BulkJob | null {
  return registry.get(accountId + ":last") || null;
}

export function createJob(acc: Account, projectId: string, rows: BulkRow[]): BulkJob | { error: string } {
  const clean = rows
    .filter((r) => r.key && r.key.trim())
    .slice(0, 200)
    .map((r) => ({
      key: r.key.trim().slice(0, 120),
      h1: r.h1?.slice(0, 140),
      city: r.city?.slice(0, 60),
      url: r.url?.slice(0, 200),
      state: "в очереди" as const,
    }));
  if (!clean.length) return { error: "Нет строк с ключами" };

  // проверяем остаток статей тарифа
  const remaining = remainingArticles(acc);
  if (clean.length > remaining) {
    return {
      error: `Тариф позволяет ещё ${remaining} статей в этом месяце, в файле ${clean.length}. Уменьшите список или обновите план.`,
    };
  }

  const job: BulkJob = {
    id: randomUUID().slice(0, 12),
    accountId: acc.id,
    projectId,
    createdAt: new Date().toISOString(),
    provider: activeProvider(),
    status: "работает",
    rows: clean,
  };
  registry.set(job.id, job);
  registry.set(acc.id + ":last", job);
  persist(job);
  void runJob(job);
  return job;
}

export function getJob(jobId: string): BulkJob | null {
  return registry.get(jobId) || null;
}

function remainingArticles(acc: Account) {
  const { articles } = limitsFor(acc);
  const free = !acc.paid ? 5 - acc.counters.freeQueriesUsed : Infinity;
  return Math.max(0, Math.min(articles - acc.counters.articlesUsed, free));
}

async function runJob(job: BulkJob) {
  const concurrency = 2;
  let cursor = 0;

  async function worker() {
    while (cursor < job.rows.length && job.status === "работает") {
      const row = job.rows[cursor++];
      row.state = "работает";
      const acc = findAccount(job.accountId);
      if (!acc) {
        row.state = "ошибка";
        row.error = "Аккаунт не найден";
        continue;
      }
      const ctx: ArticleContext = {
        key: row.key,
        brand: row.h1 || row.key,
        region: row.city || "",
        site: row.url || "",
      };
      try {
        // план: быстро — по одной строке без отдельного LLM-вызова на структуру
        let plan: ArticlePlan;
        if (activeProvider() !== "demo") {
          const p = await generatePlan(ctx);
          plan = p.plan;
          const spendPlan = trySpend(acc, "prompt");
          if (!spendPlan.ok) throw new Error("Лимит промптов тарифа исчерпан");
        } else {
          plan = demoPlan(row.key);
        }
        const spend = trySpend(acc, "article");
        if (!spend.ok) throw new Error(`Лимит статей тарифа: ${spend.limit}`);
        const d = await generateDraft(plan, ctx);
        const article = putArticle(acc.id, {
          projectId: job.projectId,
          title: plan.title || row.key,
          type: "статья",
          status: "черновик",
          body: d.markdown,
          meta: { key: row.key, seoTitle: plan.title, provider: d.provider, source: "bulk" },
        });
        row.state = "готово";
        row.articleId = article.id;
      } catch (e) {
        row.state = "ошибка";
        row.error = e instanceof Error ? e.message : "ошибка генерации";
      }
      persist(job);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const failed = job.rows.filter((r) => r.state === "ошибка").length;
  job.status = failed === job.rows.length ? "ошибка" : "готово";
  persist(job);
}

// актуальный аккаунт (пере-чтение файла, чтобы видеть свежие лимиты)
function findAccount(id: string) {
  return findById(id);
}

export function jobBundleMd(job: BulkJob): string {
  const parts: string[] = [];
  for (const row of job.rows) {
    if (!row.articleId) continue;
    const a = getArticle(job.accountId, row.articleId);
    if (a) parts.push(`<!-- ===== ${a.title} ===== -->\n\n${a.body}\n`);
  }
  return parts.join("\n");
}

export function countJobsOnDisk(accountId: string) {
  try {
    return readdirSync(jobsDir(accountId)).length;
  } catch {
    return 0;
  }
}

export function allJobIds(accountId: string): string[] {
  try {
    return readdirSync(jobsDir(accountId))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.slice(0, -5));
  } catch {
    return [];
  }
}

export function readJobFile(accountId: string, jobId: string): BulkJob | null {
  try {
    return JSON.parse(readFileSync(join(jobsDir(accountId), `${jobId}.json`), "utf8")) as BulkJob;
  } catch {
    return null;
  }
}

export function articlesOfJob(job: BulkJob): Article[] {
  return job.rows
    .map((r) => (r.articleId ? getArticle(job.accountId, r.articleId) : null))
    .filter((a): a is Article => Boolean(a));
}
