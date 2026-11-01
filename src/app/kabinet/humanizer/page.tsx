"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Hit = { fragment: string; index: number };
type PatternResult = { id: string; section: string; name: string; severity: "высокая" | "средняя" | "низкая"; hits: Hit[] };
type Report = { score: number; totalPatterns: number; totalHits: number; patterns: PatternResult[]; cleanedText: string; autoRemoved: number };

const SEV: Record<string, string> = { высокая: "bg-[#fef2f2] text-[#b91c1c]", средняя: "bg-[#fff7ed] text-[#b45309]", низкая: "bg-[#f0fdf4] text-[#15803d]" };

export default function HumanizerPage() {
  const { ready } = useWorkspace();
  const [text, setText] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [cleaned, setCleaned] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"scan" | "clean">("scan");

  if (!ready) return null;

  async function run() {
    setBusy(true);
    setErr("");
    setReport(null);
    setCleaned("");
    const res = await fetch("/api/kabinet/humanizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, autoFix: mode === "clean" }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) {
      setErr(data.error || "Ошибка");
      return;
    }
    setReport(data.report);
    if (mode === "clean" && data.report.cleanedText) {
      setCleaned(data.report.cleanedText);
    }
  }

  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-[#6b7280]">
          Вставьте текст статьи — найдём ИИ-паттерны (по методике humanizer): «не X, а Y»,
          «Мораль:», «Давайте разберём», «стоит отметить», триады, чат-хвосты. Скан — без правок,
          очистка — удаляет безопасные паттерны автоматически.
        </p>
        <div className="inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px] font-medium">
          <button
            className={`rounded-md px-3 py-1.5 ${mode === "scan" ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setMode("scan")}
          >
            Только скан
          </button>
          <button
            className={`rounded-md px-3 py-1.5 ${mode === "clean" ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setMode("clean")}
          >
            Скан + очистка
          </button>
        </div>
      </div>

      <div className="ws-card mt-4 space-y-3 p-5">
        <textarea
          className="ws-input min-h-[200px] font-mono text-[13px]"
          placeholder="Вставьте текст статьи или абзаца…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-[#6b7280]">{words} слов · {text.length} символов</span>
          {err && <span className="text-[13px] text-[#b91c1c]">{err}</span>}
          <button
            className="ws-btn ws-btn-primary ml-auto"
            onClick={() => void run()}
            disabled={busy || !text.trim()}
          >
            {busy ? "Проверяем…" : mode === "scan" ? "Проверить текст" : "Проверить и очистить"}
          </button>
        </div>
      </div>

      {report && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="ws-card p-4 text-center">
              <div className={`text-[36px] font-bold ${report.score >= 80 ? "text-[#16a34a]" : report.score >= 50 ? "text-[#ea580c]" : "text-[#b91c1c]"}`}>
                {report.score}
              </div>
              <div className="text-[12px] text-[#6b7280]">Скор «человечности» (100 = чисто)</div>
            </div>
            <div className="ws-card p-4 text-center">
              <div className="text-[36px] font-bold">{report.totalPatterns}</div>
              <div className="text-[12px] text-[#6b7280]">типов паттернов</div>
            </div>
            <div className="ws-card p-4 text-center">
              <div className="text-[36px] font-bold">{report.totalHits}</div>
              <div className="text-[12px] text-[#6b7280]">вхождений найдено</div>
            </div>
          </div>

          {report.patterns.length > 0 ? (
            <div className="ws-card mt-4 overflow-hidden">
              <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">Найденные паттерны</div>
              <ul className="divide-y divide-[#f3f4f6]">
                {report.patterns.map((p) => (
                  <li key={p.id} className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${SEV[p.severity]}`}>
                        {p.severity}
                      </span>
                      <span className="text-[11px] text-[#9ca3af]">{p.section}</span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-[12px] text-[#9ca3af]">×{p.hits.length}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {p.hits.slice(0, 3).map((h, i) => (
                        <li key={i} className="rounded-lg bg-[#fafafa] px-3 py-1.5 font-mono text-[12px] text-[#6b7280]">
                          …{h.fragment}…
                        </li>
                      ))}
                      {p.hits.length > 3 && (
                        <li className="text-[12px] text-[#9ca3af]">и ещё {p.hits.length - 3} вхождений</li>
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="ws-card mt-4 border-[#bbf7d0] bg-[#f0fdf4] p-6 text-center text-[14px] text-[#15803d]">
              Паттернов не найдено — текст звучит по-человечески.
            </div>
          )}

          {mode === "clean" && cleaned && (
            <div className="ws-card mt-4 p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Очищенный текст ({report.autoRemoved} правил применено)</h2>
                <div className="flex gap-2">
                  <button
                    className="ws-btn ws-btn-outline py-1.5 text-[13px]"
                    onClick={() => navigator.clipboard.writeText(cleaned)}
                  >
                    Копировать
                  </button>
                  <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => setText(cleaned)}>
                    Заменить исходный
                  </button>
                </div>
              </div>
              <textarea
                className="ws-input min-h-[200px] font-mono text-[13px]"
                value={cleaned}
                onChange={(e) => setCleaned(e.target.value)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
