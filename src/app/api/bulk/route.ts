import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { createJob, getJob, readJobFile, type BulkRow } from "@/lib/store/jobs";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    rows?: Partial<BulkRow>[];
  };
  if (!body.projectId) return badRequest("Нужен projectId");
  const projectId: string = body.projectId;
  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 200) : [];
  const job = createJob(acc, projectId, rows as BulkRow[]);
  if ("error" in job) return badRequest(job.error || "Не удалось создать задачу");
  return NextResponse.json({ job });
}

export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return badRequest("Нужен id");
  const job = getJob(id) || readJobFile(acc.id, id);
  if (!job || job.accountId !== acc.id) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }
  // после перезапуска процесса задача в памяти отсутствует — честно помечаем
  if (!getJob(id) && job.status === "работает") {
    job.status = "прерван";
  }
  return NextResponse.json({ job });
}
