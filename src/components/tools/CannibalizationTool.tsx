"use client";

import { useState } from "react";

type PageEntry = { url: string; title: string; source: string };
type Conflict = { keywords: string[]; pages: PageEntry[]; severity: string; recommendation: string };
type Report = { totalPages: number; totalConflicts: number; conflicts: Conflict[]; message?: string };

const SEV: Record<string, string> = { высокая: "bg-red-50 text-red-700", средняя: "bg-amber-50 text-amber-700", низкая: "bg-green-50 text-green-700" };

export function CannibalizationTool() {
  const [titles, setTitles] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setBusy(true); setErr(""); setReport(null);
    const res = await fetch("/api/tools/cannibalization", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titles }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) { setErr(data.error || "Ошибка"); return; }
    setReport(data.report);
  }

  const lines = titles.split(/\n+/).filter((l) => l.trim().length > 3);

  return (
    <div className="card p-6 md:p-8">
      <p className="mb-4 text-sm text-muted">
        Вставьте заголовки (title или H1) ваших страниц — по одному на строку, до 50.
        Найдём пары с пересекающимся интентом.
      </p>
      <textarea
        className="input min-h-[140px] font-mono text-sm"
        placeholder={"Как выбрать матрас: 7 критериев\nМатрасы для сна: цены и отзывы\nКакой матрас лучше — пружинный или беспружинный\nМатрасы оптом для отелей"}
        value={titles}
        onChange={(e) => setTitles(e.target.value)}
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">{lines.length} заголовков</span>
        {err && <span className="text-sm text-red-600">{err}</span>}
        <button className="btn-primary" onClick={() => void run()} disabled={busy || lines.length < 2}>
          {busy ? "Сравниваем…" : "Найти конфликты"}
        </button>
      </div>

      {report && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-bg p-4 text-center">
              <div className="text-3xl font-bold">{report.totalPages}</div>
              <div className="text-xs text-muted">страниц</div>
            </div>
            <div className="rounded-xl bg-bg p-4 text-center">
              <div className={`text-3xl font-bold ${report.totalConflicts > 0 ? "text-red-600" : "text-green-600"}`}>
                {report.totalConflicts}
              </div>
              <div className="text-xs text-muted">конфликтов</div>
            </div>
          </div>

          {report.message && (
            <div className="rounded-xl bg-bg p-4 text-center text-sm text-muted">{report.message}</div>
          )}

          {report.conflicts.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-line">
              {report.conflicts.map((c, i) => (
                <div key={i} className="border-b border-line p-3 last:border-b-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${SEV[c.severity] || ""}`}>{c.severity}</span>
                    <span className="text-xs text-muted">слова: {c.keywords.join(", ") || "—"}</span>
                  </div>
                  {c.pages.map((p, j) => (
                    <div key={j} className="mt-1 rounded bg-bg px-2 py-1 text-sm">{p.title}</div>
                  ))}
                  <p className="mt-1 text-xs text-muted">{c.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {report.conflicts.length === 0 && !report.message && (
            <div className="rounded-xl bg-green-50 p-4 text-center text-sm text-green-700">
              Конфликтов нет — заголовки не пересекаются.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
