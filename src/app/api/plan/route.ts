import { NextResponse } from "next/server";
import { badRequest, currentAccount, unauthorized } from "@/lib/api";
import {
  addPlanItems,
  listPlan,
  nextPlanAction,
  removePlanItem,
  updatePlanItem,
} from "@/lib/store/plans";
import type { PlanItem } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function projectFrom(req: Request): string {
  return (new URL(req.url).searchParams.get("projectId") || "").trim().slice(0, 100);
}

export async function GET(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const projectId = projectFrom(req);
  if (!projectId) return badRequest("Нужен projectId");

  const { items, stats } = listPlan(account.id, projectId);
  return NextResponse.json({ items, stats, next: nextPlanAction(account.id, projectId) });
}

export async function POST(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    items?: { key?: string; intent?: PlanItem["intent"]; targetUrl?: string; source?: PlanItem["source"] }[];
  };
  const projectId = String(body.projectId || "").trim().slice(0, 100);
  if (!projectId) return badRequest("Нужен projectId");

  const input = Array.isArray(body.items) ? body.items : [];
  if (input.length === 0) return badRequest("Передайте items: [{ key }]");
  if (input.length > 50) return badRequest("Максимум 50 строк за раз");

  const items = input.map((i) => ({
    key: String(i.key || ""),
    intent: i.intent,
    targetUrl: i.targetUrl,
    source: i.source ?? "список",
  }));
  const added = addPlanItems(account.id, projectId, items);
  return NextResponse.json({ added: added.length, items: added });
}

export async function PATCH(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    id?: string;
    patch?: Record<string, unknown>;
  };
  const projectId = String(body.projectId || "").trim().slice(0, 100);
  const id = String(body.id || "");
  if (!projectId || !id) return badRequest("Нужны projectId и id");

  const item = updatePlanItem(account.id, projectId, id, (body.patch || {}) as never);
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Строка не найдена" }, { status: 404 });
}

export async function DELETE(req: Request) {
  const account = currentAccount(req);
  if (!account) return unauthorized();

  const url = new URL(req.url);
  const projectId = projectFrom(req);
  const id = url.searchParams.get("id") || "";
  if (!projectId || !id) return badRequest("Нужны projectId и id");

  return removePlanItem(account.id, projectId, id)
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Строка не найдена" }, { status: 404 });
}
