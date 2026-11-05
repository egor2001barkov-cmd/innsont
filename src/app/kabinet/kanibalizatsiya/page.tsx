"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type PageEntry = { url: string; title: string; source: string };
type Conflict = { keywords: string[]; pages: PageEntry[]; severity: "высокая" | "средняя" | "низкая"; recommendation: string };
type Report = { totalPages: number; totalConflicts: number; conflicts: Conflict[]; message?: string };

const SEV: Record<string, string> = { высокая: "bg-[#fef2f2] text-[#b91c1c]", средняя: "bg-[#fff7ed] text-[#b45309]", низкая: "bg-[#f0fdf4] text-[#15803d]" };

export default function CannibalizationPage() {
  const { project, ready } = useWorkspace();
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [minSeverity, setMinSeverity] = useState<"все" | "высокая" | "средняя">("все");
  const [sevFilter, setSevFilter] = useState("все");

  if (!ready || !project) return null;

  async function run() {
    setBusy(true); setErr(""); setReport(null);
    const res = await fetch("/api/kabinet/cannibalization", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project!.id }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) { setErr(data.error || "Ошибка"); return; }
    setReport(data.report);
  }

  const filtered = report?.conflicts.filter((c) => {
    if (sevFilter === "все") return true;
    if (sevFilter === "высокая") return c.severity === "высокая";
    if (sevFilter === "средняя") return c.severity !== "низкая";
    return true;
  }) ?? [];

  function exportReport() {
    if (!report) return;
    const lines = [
      `# Каннибализация — ${new Date().toISOString().slice(0, 10)}`,
      `Страниц: ${report.totalPages} | Конфликтов: ${report.totalConflicts}`,
      "",
      ...filtered.map((c, i) =>
        `## ${i + 1}. [${c.severity}] ${c.keywords.join(", ")}\n${c.pages.map((p) => `- ${p.title} (${p.source})`).join("\n")}\n**Рекомендация:** ${c.recommendation}\n`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cannibalization-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-[#6b7280]">
          Находит пары страниц с пересекающимся интентом — когда две статьи конкурируют
          за один запрос. Работает на заголовках статей вашего проекта.
        </p>
        <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy}>
          {busy ? "Сравниваем…" : "Проверить"}
        </button>
      </div>

      {/* Параметры */}
      <div className="ws-card mt-3 flex flex-wrap items-center gap-3 p-3 text-[13px]">
        <label className="flex items-center gap-1.5">
          Показывать:
          <select className="ws-input w-auto py-1" value={sevFilter} onChange={(e) => setSevFilter(e.target.value)}>
            <option value="все">все конфликты</option>
            <option value="средняя">средние + высокие</option>
            <option value="высокая">только высокие</option>
          </select>
        </label>
        {report && (
          <>
            <span className="text-[12px] text-[#9ca3af]">
              {report.totalPages} стр. · {report.totalConflicts} конфликтов
            </span>
            <button className="ws-btn ws-btn-outline py-1 text-[12px]" onClick={exportReport}>
              Экспорт .md
            </button>
          </>
        )}
      </div>

      {/* Перелинковка */}
      <div className="mt-2 flex flex-wrap gap-2">
        <a href="/kabinet/audit" className="text-[13px] text-[#6b7280] hover:text-[#ea580c]">
          ← Аудит сайта
        </a>
        <span className="text-[#e5e7eb]">·</span>
        <a href="/kabinet/statyi" className="text-[13px] text-[#6b7280] hover:text-[#ea580c]">
          Создать статью →
        </a>
        <span className="text-[#e5e7eb]">·</span>
        <a href="/instrumenty/kanibalizatsiya" className="text-[13px] text-[#6b7280] hover:text-[#ea580c]" target="_blank" rel="noreferrer">
          Публичная версия ↗
        </a>
      </div>

      {err && <p className="mt-3 text-[13px] text-[#b91c1c]">{err}</p>}

      {report && (
        <>
          {report.message && (
            <div className="ws-card mt-4 border-dashed p-6 text-center text-[13px] text-[#6b7280]">{report.message}</div>
          )}

          {filtered.length > 0 ? (
            <div className="ws-card mt-4 overflow-hidden">
              <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">Конфликты ({filtered.length})</div>
              <ul className="divide-y divide-[#f3f4f6]">
                {filtered.map((c, i) => (
                  <li key={i} className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${SEV[c.severity]}`}>{c.severity}</span>
                      <span className="text-[12px] text-[#6b7280]">Общие слова: {c.keywords.join(", ") || "—"}</span>
                      <span className="ml-auto text-[12px] text-[#9ca3af]">{c.pages.length} стр.</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {c.pages.map((p, j) => (
                        <div key={j} className="flex items-center gap-2 rounded-lg bg-[#fafafa] px-3 py-1.5 text-[13px]">
                          <span className="shrink-0 rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[10px] font-medium text-[#6b7280]">{p.source}</span>
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-[13px]"><b>Что делать:</b> {c.recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="ws-card mt-4 border-[#bbf7d0] bg-[#f0fdf4] p-6 text-center text-[14px] text-[#15803d]">
              {report.totalConflicts === 0 ? "Конфликтов нет." : "С текущим фильтром ничего не найдено."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
