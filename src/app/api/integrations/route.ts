import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import {
  bindCounter,
  bindHost,
  connectMetrika,
  connectWebmaster,
  disconnectMetrika,
  disconnectWebmaster,
  integrationsStatus,
  loadIntegrations,
} from "@/lib/store/integrations";
import { webmasterHosts } from "@/lib/yandex-api";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const status = integrationsStatus(acc.id);
  const raw = loadIntegrations(acc.id);
  let hosts: { host_id: string; host: string; verified: boolean }[] = [];
  if (raw.webmaster?.token && raw.webmaster.uid) {
    hosts = await webmasterHosts(raw.webmaster.token, raw.webmaster.uid);
  }
  return NextResponse.json({
    ...status,
    webmasterHosts: hosts,
    bindings: {
      counterByProject: raw.metrika?.counterByProject || {},
      hostByProject: raw.webmaster?.hostByProject || {},
    },
  });
}

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as {
    service?: "metrika" | "webmaster";
    token?: string;
    projectId?: string;
    counterId?: number;
    hostId?: string;
  };

  if (body.service === "metrika" && body.token) {
    const res = await connectMetrika(acc.id, body.token.trim());
    if (!res.ok) return badRequest(res.error);
    if (body.projectId && body.counterId) bindCounter(acc.id, body.projectId, body.counterId);
    return NextResponse.json({ ok: true, counters: res.counters });
  }

  if (body.service === "webmaster" && body.token) {
    const res = await connectWebmaster(acc.id, body.token.trim());
    if (!res.ok) return badRequest(res.error);
    if (body.projectId && body.hostId) bindHost(acc.id, body.projectId, body.hostId);
    return NextResponse.json({ ok: true, uid: res.uid, hosts: res.hosts });
  }

  // привязка без переподключения
  if (body.projectId && body.counterId) {
    bindCounter(acc.id, body.projectId, body.counterId);
    return NextResponse.json({ ok: true });
  }
  if (body.projectId && body.hostId) {
    bindHost(acc.id, body.projectId, body.hostId);
    return NextResponse.json({ ok: true });
  }
  return badRequest("Нужны service+token или projectId с counterId/hostId");
}

export async function DELETE(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const service = new URL(req.url).searchParams.get("service");
  if (service === "metrika") disconnectMetrika(acc.id);
  else if (service === "webmaster") disconnectWebmaster(acc.id);
  else return badRequest("Нужен service=metrika|webmaster");
  return NextResponse.json({ ok: true });
}
