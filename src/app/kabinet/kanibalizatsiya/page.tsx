"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type PageEntry = { url: string; title: string; source: string };
type Conflict = {
  keywords: string[];
  pages: PageEntry[];
  severity: "высокая" | "средняя" | "низкая";
  recommendation: string;
};
type Report = {
  totalPages: number;
  totalConflicts: number;
  conflicts: Conflict[];
  message?: string;
};

const SEV: Record<string, string> = { высокая: "bg-[#fef2f2] text-[#b91c1c]", средняя: "bg-[#fff7ed] text-[#b45309]", низкая: "bg-[#f0fdf4] text-[#15803d]" };

export default function CannibalizationPage() {
  const { project, ready } = useWorkspace();
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!ready || !project) return null;

  async function run() {
    setBusy(true);
    setErr("");
    setReport(null);
    const res = await fetch("/api/kabinet/cannibalization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project!.id }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) {
      setErr(data.error || "Ошибка");
      return;
    }
    setReport(data.report);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-[#6b7280]">
          Сравнивает заголовки статей проекта и находит пары с пересекающимся интентом —
          когда две страницы конкурируют за один запрос в выдаче. Чем больше общих значимых
          слов в заголовках, тем острее конфликт.
        </p>
        <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy}>
          {busy ? "Сравниваем…" : "Проверить каннибализацию"}
        </button>
      </div>
      {err && <p className="mt-3 text-[13px] text-[#b91c1c]">{err}</p>}

      {report && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="ws-card p-4 text-center">
              <div className="text-[36px] font-bold">{report.totalPages}</div>
              <div className="text-[12px] text-[#6b7280]">страниц сравнено</div>
            </div>
            <div className="ws-card p-4 text-center">
              <div className={`text-[36px] font-bold ${report.totalConflicts > 0 ? "text-[#b91c1c]" : "text-[#16a34a]"}`}>
                {report.totalConflicts}
              </div>
              <div className="text-[12px] text-[#6b7280]">конфликтов интента</div>
            </div>
          </div>

          {report.message && (
            <div className="ws-card mt-4 border-dashed p-6 text-center text-[13px] text-[#6b7280]">
              {report.message}
            </div>
          )}

          {report.conflicts.length > 0 && (
            <div className="ws-card mt-4 overflow-hidden">
              <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">
                Конфликты (по убыванию серьёзности)
              </div>
              <ul className="divide-y divide-[#f3f4f6]">
                {report.conflicts.map((c, i) => (
                  <li key={i} className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${SEV[c.severity]}`}>
                        {c.severity}
                      </span>
                      <span className="text-[12px] text-[#6b7280]">
                        Общие слова: {c.keywords.join(", ")}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {c.pages.map((p, j) => (
                        <div key={j} className="flex items-center gap-2 rounded-lg bg-[#fafafa] px-3 py-1.5 text-[13px]">
                          <span className="shrink-0 rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[10px] font-medium text-[#6b7280]">
                            {p.source}
                          </span>
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-[13px]">
                      <b>Что делать:</b> {c.recommendation}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.conflicts.length === 0 && !report.message && (
            <div className="ws-card mt-4 border-[#bbf7d0] bg-[#f0fdf4] p-6 text-center text-[14px] text-[#15803d]">
              Конфликтов не найдено — заголовки статей не пересекаются по интенту.
            </div>
          )}
        </>
      )}
    </div>
  );
}
