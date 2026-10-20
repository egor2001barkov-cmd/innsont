import { NextResponse } from "next/server";
import { attachmentHeader, currentAccount, badRequest, unauthorized } from "@/lib/api";
import { getJob, jobBundleMd, readJobFile } from "@/lib/store/jobs";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return badRequest("Нужен id");
  const job = getJob(id) || readJobFile(acc.id, id);
  if (!job || job.accountId !== acc.id) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }
  const bundle = jobBundleMd(job);
  if (!bundle) return badRequest("В задаче нет готовых статей");
  return new NextResponse(bundle, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": attachmentHeader(`insont-bulk-${job.id}.md`),
    },
  });
}
