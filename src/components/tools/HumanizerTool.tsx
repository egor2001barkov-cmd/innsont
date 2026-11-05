"use client";

import { useState } from "react";

type Hit = { fragment: string; index: number };
type PatternResult = { id: string; section: string; name: string; severity: string; hits: Hit[] };
type Report = { score: number; totalPatterns: number; totalHits: number; patterns: PatternResult[]; cleanedText: string; autoRemoved: number };

const SEV: Record<string, string> = { высокая: "bg-red-50 text-red-700", средняя: "bg-amber-50 text-amber-700", низкая: "bg-green-50 text-green-700" };

export function HumanizerTool() {
  const [text, setText] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [cleaned, setCleaned] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [auto, setAuto] = useState(false);

  async function run() {
    setBusy(true); setErr(""); setReport(null); setCleaned("");
    const res = await fetch("/api/tools/humanizer", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, autoFix: auto }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) { setErr(data.error || "Ошибка"); return; }
    setReport(data.report);
    if (auto && data.report.cleanedText) setCleaned(data.report.cleanedText);
  }

  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">Вставьте текст — найдём 18 ИИ-паттернов и покажем скор.</p>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="accent-orange" />
          Автоочистка
        </label>
      </div>
      <textarea
        className="input min-h-[160px] font-mono text-sm"
        placeholder="Вставьте текст статьи, мета-теги или описание товара…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">{words} слов · {text.length} символов</span>
        {err && <span className="text-sm text-red-600">{err}</span>}
        <button className="btn-primary" onClick={() => void run()} disabled={busy || !text.trim()}>
          {busy ? "Проверяем…" : "Проверить текст"}
        </button>
      </div>

      {report && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-bg p-4 text-center">
              <div className={`text-3xl font-bold ${report.score >= 80 ? "text-green-600" : report.score >= 50 ? "text-orange-500" : "text-red-600"}`}>
                {report.score}
              </div>
              <div className="text-xs text-muted">скор</div>
            </div>
            <div className="rounded-xl bg-bg p-4 text-center">
              <div className="text-3xl font-bold">{report.totalPatterns}</div>
              <div className="text-xs text-muted">типов</div>
            </div>
            <div className="rounded-xl bg-bg p-4 text-center">
              <div className="text-3xl font-bold">{report.totalHits}</div>
              <div className="text-xs text-muted">вхождений</div>
            </div>
          </div>

          {report.patterns.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-line">
              {report.patterns.map((p) => (
                <div key={p.id} className="border-b border-line p-3 last:border-b-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${SEV[p.severity] || ""}`}>{p.severity}</span>
                    <span className="text-[11px] text-muted">{p.section}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-xs text-muted">×{p.hits.length}</span>
                  </div>
                  {p.hits.slice(0, 2).map((h, i) => (
                    <div key={i} className="mt-1 rounded bg-bg px-2 py-1 font-mono text-xs text-muted">…{h.fragment}…</div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {auto && cleaned && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">Очищенный текст</span>
                <button className="text-sm font-semibold text-orange" onClick={() => navigator.clipboard.writeText(cleaned)}>
                  Копировать
                </button>
              </div>
              <textarea
                className="input min-h-[120px] font-mono text-sm"
                value={cleaned}
                onChange={(e) => setCleaned(e.target.value)}
              />
            </div>
          )}

          {report.patterns.length === 0 && (
            <div className="rounded-xl bg-green-50 p-4 text-center text-sm text-green-700">
              Паттернов не найдено — текст звучит по-человечески.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
