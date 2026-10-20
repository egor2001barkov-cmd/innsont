import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { deleteWp, getWp, saveWp } from "@/lib/store/accounts";

export const runtime = "nodejs";

/** Реквизиты WordPress проекта. Application password хранится только на сервере. */
export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return badRequest("Нужен projectId");
  const wp = getWp(acc.id, projectId);
  if (!wp) return NextResponse.json({ configured: false });
  // пароль не отдаём — только факт, что он задан
  return NextResponse.json({ configured: true, url: wp.url, user: wp.user, hasPassword: Boolean(wp.appPassword) });
}

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    url?: string;
    user?: string;
    appPassword?: string;
  };
  if (!body.projectId || !body.url || !body.user || !body.appPassword) {
    return badRequest("Нужны projectId, url, user, appPassword");
  }
  let url: URL;
  try {
    url = new URL(body.url.trim());
  } catch {
    return badRequest("Некорректный адрес сайта");
  }
  if (url.protocol !== "https:") return badRequest("Адрес должен начинаться с https://");
  saveWp(acc.id, body.projectId, {
    url: url.origin,
    user: body.user.slice(0, 100),
    appPassword: body.appPassword.slice(0, 100),
  });
  return NextResponse.json({ ok: true, url: url.origin, user: body.user });
}

export async function DELETE(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return badRequest("Нужен projectId");
  deleteWp(acc.id, projectId);
  return NextResponse.json({ ok: true });
}
