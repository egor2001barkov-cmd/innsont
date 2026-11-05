"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Hit = { fragment: string; index: number };
type PatternResult = { id: string; section: string; name: string; severity: "высокая" | "средняя" | "низкая"; hits: Hit[] };
type Report = { score: number; totalPatterns: number; totalHits: number; patterns: PatternResult[]; cleanedText: string; autoRemoved: number };

const SEV: Record<string, string> = { высокая: "bg-[#fef2f2] text-[#b91c1c]", средняя: "bg-[#fff7ed] text-[#b45309]", низкая: "bg-[#f0fdf4] text-[#15803d]" };

const CUSTOM_PRESETS = [
  { label: "Проверить статью", desc: "Полный текст статьи" },
  { label: "Проверить мета", desc: "Title + description" },
  { label: "Проверить карточку", desc: "Описание товара/услуги" },
  { label: "Проверить письмо", desc: "Email-рассылка" },
];

function HumanizerInner() {
  const params = useSearchParams();
  const { ready } = useWorkspace();
  const [text, setText] = useState(params.get("text") || "");
  const [report, setReport] = useState<Report | null>(null);
  const [cleaned, setCleaned] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"scan" | "clean">("scan");
  const [minSeverity, setMinSeverity] = useState<"все" | "высокая" | "средняя">("все");
  const [showLow, setShowLow] = useState(true);
  const [excludeQuoted, setExcludeQuoted] = useState(true);

  if (!ready) return null;

  async function run() {
    setBusy(true);
    setErr("");
    setReport(null);
    setCleaned("");
    const res = await fetch("/api/kabinet/humanizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, autoFix: mode === "clean", minSeverity, includeLow: showLow, excludeQuoted }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) {
      setErr(data.error || "Ошибка");
      return;
    }
    setReport(data.report);
    if (mode === "clean" && data.report.cleanedText) setCleaned(data.report.cleanedText);
  }

  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const filtered = report?.patterns.filter((p) => {
    if (minSeverity === "высокая" && p.severity !== "высокая") return false;
    if (minSeverity === "средняя" && p.severity === "низкая") return false;
    if (!showLow && p.severity === "низкая") return false;
    return true;
  }) ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-[#6b7280]">
          Вставьте текст — найдём ИИ-паттерны (18 правил): «не X, а Y», «Мораль:», «Давайте»,
          «стоит отметить», триады, чат-хвосты, «инновационный». Настройте фильтры ниже.
        </p>
        <div className="inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px] font-medium">
          <button className={`rounded-md px-3 py-1.5 ${mode === "scan" ? "bg-white shadow-sm" : "text-[#6b7280]"}`} onClick={() => setMode("scan")}>
            Только скан
          </button>
          <button className={`rounded-md px-3 py-1.5 ${mode === "clean" ? "bg-white shadow-sm" : "text-[#6b7280]"}`} onClick={() => setMode("clean")}>
            Скан + очистка
          </button>
        </div>
      </div>

      {/* Параметры */}
      <div className="ws-card mt-3 flex flex-wrap items-center gap-3 p-3 text-[13px]">
        <label className="flex items-center gap-1.5">
          Порог:
          <select className="ws-input w-auto py-1" value={minSeverity} onChange={(e) => setMinSeverity(e.target.value as typeof minSeverity)}>
            <option value="все">все уровни</option>
            <option value="средняя">средняя+</option>
            <option value="высокая">только высокая</option>
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" checked={showLow} onChange={(e) => setShowLow(e.target.checked)} className="accent-[#ea580c]" />
          показывать низкие
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" checked={excludeQuoted} onChange={(e) => setExcludeQuoted(e.target.checked)} className="accent-[#ea580c]" />
          пропускать фразы в кавычках
        </label>
        <span className="ml-auto text-[12px] text-[#9ca3af]">{words} слов · {text.length} симв.</span>
      </div>

      {/* Быстрые пресеты */}
      <div className="mt-2 flex flex-wrap gap-2">
        {CUSTOM_PRESETS.map((p) => (
          <button
            key={p.label}
            className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[12px] text-[#6b7280] transition-all hover:border-[#ea580c] hover:text-[#ea580c]"
            title={p.desc}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="ws-card mt-3 space-y-3 p-5">
        <textarea
          className="ws-input min-h-[200px] font-mono text-[13px]"
          placeholder="Вставьте текст статьи или абзаца…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
        <button
          className="ws-btn ws-btn-primary"
          onClick={() => void run()}
          disabled={busy || !text.trim()}
        >
          {busy ? "Проверяем…" : mode === "scan" ? "Проверить текст" : "Проверить и очистить"}
        </button>
      </div>

      {report && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { k: "Скор", v: report.score, c: report.score >= 80 ? "text-[#16a34a]" : report.score >= 50 ? "text-[#ea580c]" : "text-[#b91c1c]" },
              { k: "Типов", v: report.totalPatterns },
              { k: "Вхождений", v: report.totalHits },
              { k: "Авто-правок", v: report.autoRemoved },
            ].map((x) => (
              <div key={x.k} className="ws-card p-4 text-center">
                <div className={`text-[32px] font-bold ${x.c || ""}`}>{x.v}</div>
                <div className="text-[12px] text-[#6b7280]">{x.k}</div>
              </div>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="ws-card mt-4 overflow-hidden">
              <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">Найденные паттерны ({filtered.length})</div>
              <ul className="divide-y divide-[#f3f4f6]">
                {filtered.map((p) => (
                  <li key={p.id} className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${SEV[p.severity]}`}>{p.severity}</span>
                      <span className="text-[11px] text-[#9ca3af]">{p.section}</span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-[12px] text-[#9ca3af]">×{p.hits.length}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {p.hits.slice(0, 3).map((h, i) => (
                        <li key={i} className="rounded-lg bg-[#fafafa] px-3 py-1.5 font-mono text-[12px] text-[#6b7280]">…{h.fragment}…</li>
                      ))}
                      {p.hits.length > 3 && <li className="text-[12px] text-[#9ca3af]">и ещё {p.hits.length - 3}</li>}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="ws-card mt-4 border-[#bbf7d0] bg-[#f0fdf4] p-6 text-center text-[14px] text-[#15803d]">
              {report.totalHits === 0 ? "Текст чистый!" : "С текущими фильтрами ничего не найдено."}
            </div>
          )}

          {/* Перелинковка */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/kabinet/statyi" className="ws-btn ws-btn-outline py-1.5 text-[13px]">
              ← Создать статью
            </a>
            <a href="/kabinet/kontent" className="ws-btn ws-btn-outline py-1.5 text-[13px]">
              Мой контент →
            </a>
            <a href="/instrumenty/ochelovechivatel" className="ws-btn ws-btn-outline py-1.5 text-[13px]" target="_blank" rel="noreferrer">
              Публичная версия ↗
            </a>
          </div>

          {mode === "clean" && cleaned && (
            <div className="ws-card mt-4 p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Очищенный текст</h2>
                <div className="flex gap-2">
                  <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => navigator.clipboard.writeText(cleaned)}>Копировать</button>
                  <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => setText(cleaned)}>Заменить исходный</button>
                  <button
                    className="ws-btn ws-btn-outline py-1.5 text-[13px]"
                    onClick={() => {
                      const blob = new Blob([cleaned], { type: "text/plain" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = "cleaned-text.txt";
                      a.click();
                    }}
                  >
                    Скачать .txt
                  </button>
                </div>
              </div>
              <textarea className="ws-input min-h-[200px] font-mono text-[13px]" value={cleaned} onChange={(e) => setCleaned(e.target.value)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function HumanizerPage() {
  return (
    <Suspense>
      <HumanizerInner />
    </Suspense>
  );
}
