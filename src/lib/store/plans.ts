import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";
import {
  PLAN_STATUSES,
  detectIntent,
  emptyStats,
  normalizeKey,
  type PlanItem,
  type PlanStatus,
} from "@/lib/plan";

/** Контент-план проекта: data/accounts/{id}/plans/{projectId}.json */

function plansDir(accountId: string) {
  return join(process.cwd(), "data", "accounts", accountId, "plans");
}

function planPath(accountId: string, projectId: string) {
  return join(plansDir(accountId), `${projectId.replace(/[^a-z0-9-]/gi, "_")}.json`);
}

type PlanFile = { items: PlanItem[] };

function read(accountId: string, projectId: string): PlanFile {
  try {
    const data = JSON.parse(readFileSync(planPath(accountId, projectId), "utf8")) as PlanFile;
    return { items: Array.isArray(data.items) ? data.items : [] };
  } catch {
    return { items: [] };
  }
}

function write(accountId: string, projectId: string, file: PlanFile) {
  mkdirSync(plansDir(accountId), { recursive: true });
  writeFileSync(planPath(accountId, projectId), JSON.stringify(file, null, 2), "utf8");
}

export function listPlan(accountId: string, projectId: string) {
  const items = read(accountId, projectId).items
    .slice()
    .sort((a, b) => a.priority - b.priority || a.createdAt.localeCompare(b.createdAt));

  const stats = emptyStats();
  for (const item of items) stats[item.status] += 1;

  return { items, stats };
}

export function addPlanItems(
  accountId: string,
  projectId: string,
  input: { key: string; intent?: PlanItem["intent"]; targetUrl?: string; source?: PlanItem["source"] }[],
) {
  const file = read(accountId, projectId);
  const existing = new Set(file.items.map((i) => i.key.toLowerCase()));
  const now = new Date().toISOString();
  let priority = file.items.reduce((max, i) => Math.max(max, i.priority), 0);

  const added: PlanItem[] = [];
  for (const raw of input) {
    const key = normalizeKey(raw.key || "");
    if (!key || existing.has(key.toLowerCase())) continue;
    existing.add(key.toLowerCase());
    const item: PlanItem = {
      id: "pl_" + randomBytes(5).toString("hex"),
      key,
      intent: raw.intent || detectIntent(key),
      targetUrl: (raw.targetUrl || "").trim().slice(0, 300),
      status: "идея",
      priority: ++priority,
      source: raw.source || "вручную",
      createdAt: now,
      updatedAt: now,
    };
    file.items.push(item);
    added.push(item);
  }

  write(accountId, projectId, file);
  return added;
}

export function updatePlanItem(
  accountId: string,
  projectId: string,
  id: string,
  patch: Partial<Pick<PlanItem, "key" | "intent" | "targetUrl" | "status" | "priority">>,
): PlanItem | null {
  const file = read(accountId, projectId);
  const item = file.items.find((i) => i.id === id);
  if (!item) return null;

  if (typeof patch.key === "string" && normalizeKey(patch.key)) item.key = normalizeKey(patch.key);
  if (patch.intent) item.intent = patch.intent;
  if (typeof patch.targetUrl === "string") item.targetUrl = patch.targetUrl.trim().slice(0, 300);
  if (patch.status && PLAN_STATUSES.includes(patch.status as PlanStatus)) item.status = patch.status as PlanStatus;
  if (typeof patch.priority === "number" && Number.isFinite(patch.priority)) item.priority = patch.priority;
  item.updatedAt = new Date().toISOString();

  write(accountId, projectId, file);
  return item;
}

export function removePlanItem(accountId: string, projectId: string, id: string) {
  const file = read(accountId, projectId);
  const next = file.items.filter((i) => i.id !== id);
  if (next.length === file.items.length) return false;
  write(accountId, projectId, { items: next });
  return true;
}

/** Следующее действие для дашборда: что брать в работу прямо сейчас. */
export function nextPlanAction(accountId: string, projectId: string) {
  const { items } = listPlan(accountId, projectId);
  const order: PlanStatus[] = ["бриф", "идея", "черновик", "ревью", "опубликовано", "измерено"];
  for (const status of order) {
    const item = items.find((i) => i.status === status);
    if (item) return item;
  }
  return null;
}
