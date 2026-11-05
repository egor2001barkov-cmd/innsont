"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Hit = { fragment: string; index: number };
type PatternResult = { id: string; section: string; name: string; severity: "высокая" | "средняя" | "низкая"; hits: Hit[] };
type Report = { score: number; totalPatterns: number; totalHits: number; patterns: PatternResult[]; cleanedText: string; autoRemoved: number };

type SitePageResult = {
  url: string; title: string; score: number; totalPatterns: number; totalHits: number;
  patterns: { name: string; severity: string; count: number }[];
};
type SiteReport = { pages: SitePageResult[]; totalPages: number; avgScore: number; scannedUrls: number };

const SEV: Record<string, string> = { высокая: "bg-[#fef2f2] text-[#b91c1c]", средняя: "bg-[#fff7ed] text-[#b45309]", низкая: "bg-[#f0fdf4] text-[#15803d]" };

type Tab = "text" | "site";

function HumanizerInner() {
  const params = useSearchParams();
  const { project, ready } = useWorkspace();
  const [tab, setTab] = useState<Tab>(params.get("text") ? "text" : "text");
  const [text, setText] = useState(params.get("text") || "");
  const [report, setReport] = useState<Report | null>(null);
  const [cleaned, setCleaned] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"scan" | "clean">("scan");
  const [minSeverity, setMinSeverity] = useState<"все" | "высокая" | "средняя">("все");
  const [showLow, setShowLow] = useState(true);
  const [excludeQuoted, setExcludeQuoted] = useState(true);

  // Режим сканирования сайта
  const [siteReport, setSiteReport] = useState<SiteReport | null>(null);
  const [siteBusy, setSiteBusy] = useState(false);
  const [siteErr, setSiteErr] = useState("");
  const [scanPages, setScanPages] = useState(5);

  if (!ready) return null;

  async function run() {
    setBusy(true); setErr(""); setReport(null); setCleaned("");
    const res = await fetch("/api/kabinet/humanizer", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, autoFix: mode === "clean", minSeverity, includeLow: showLow, excludeQuoted }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) { setErr(data.error || "Ошибка"); return; }
    setReport(data.report);
    if (mode === "clean" && data.report.cleanedText) setCleaned(data.report.cleanedText);
  }

  async function scanSite() {
    if (!project) return;
    setSiteBusy(true); setSiteErr(""); setSiteReport(null);
    const res = await fetch("/api/kabinet/humanizer/site", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, siteUrl: project.url, maxPages: scanPages }),
    });
    const data = (await res.json().catch(() => ({}))) as { pages?: SitePageResult[]; totalPages?: number; avgScore?: number; scannedUrls?: number; error?: string };
    setSiteBusy(false);
    if (!res.ok || !data.pages) { setSiteErr(data.error || "Не удалось просканировать сайт"); return; }
    setSiteReport({
      pages: data.pages,
      totalPages: data.totalPages ?? data.pages.length,
      avgScore: data.avgScore ?? 0,
      scannedUrls: data.scannedUrls ?? data.pages.length,
    });
  }

  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const filtered = report?.patterns.filter((p) => {
    if (minSeverity === "высокая" && p.severity !== "высокая") return false;
    if (minSeverity === "средняя" && p.severity === "низкая") return false;
    if (!showLow && p.severity === "низкая") return false;
    return true;
  }) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Табы: Текст / Сайт */}
      <div className="inline-flex rounded-xl bg-[#f3f4f6] p-1 text-[14px] font-medium">
        <button
          className={`rounded-lg px-4 py-2 transition-all ${tab === "text" ? "bg-white shadow-sm text-[#111827]" : "text-[#6b7280]"}`}
          onClick={() => setTab("text")}
        >
          ✍️ Текст
        </button>
        <button
          className={`rounded-lg px-4 py-2 transition-all ${tab === "site" ? "bg-white shadow-sm text-[#111827]" : "text-[#6b7280]"}`}
          onClick={() => setTab("site")}
        >
          🌐 Сканировать сайт
        </button>
      </div>

      {/* === РЕЖИМ: ТЕКСТ === */}
      {tab === "text" && (
        <>
          <p className="mt-4 max-w-xl text-sm text-[#6b7280]">
            Вставьте текст — найдём ИИ-паттерны (18 правил). Настройте фильтры ниже.
          </p>

          <div className="ws-card mt-3 flex flex-wrap items-center gap-3 p-3 text-[13px]">
            <label className="flex items-center gap-1.5">
              Порог:
              <select className="ws-input w-auto py-1" value={minSeverity} onChange={(e) => setMinSeverity(e.target.value as typeof minSeverity)}>
                <option value="все">все</option>
                <option value="средняя">средняя+</option>
                <option value="высокая">высокая</option>
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" checked={showLow} onChange={(e) => setShowLow(e.target.checked)} className="accent-[#ea580c]" />
              низкие
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" checked={excludeQuoted} onChange={(e) => setExcludeQuoted(e.target.checked)} className="accent-[#ea580c]" />
              кавычки
            </label>
          </div>

          <div className="ws-card mt-3 space-y-3 p-5">
            <textarea
              className="ws-input min-h-[180px] font-mono text-[13px]"
              placeholder="Вставьте текст статьи…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] text-[#6b7280]">{words} слов</span>
              {err && <span className="text-[13px] text-[#b91c1c]">{err}</span>}
              <button
                className="ws-btn ws-btn-primary ml-auto"
                onClick={() => void run()}
                disabled={busy || !text.trim()}
              >
                {busy ? "Проверяем…" : mode === "scan" ? "Проверить" : "Проверить и очистить"}
              </button>
              <button
                className={`rounded-lg border px-3 py-1 text-[12px] ${mode === "clean" ? "border-[#ea580c] bg-[#fff7ed] text-[#ea580c]" : "border-[#e5e7eb] text-[#6b7280]"}`}
                onClick={() => setMode(mode === "scan" ? "clean" : "scan")}
              >
                {mode === "clean" ? "✓ Автоочистка" : "Автоочистка"}
              </button>
            </div>
          </div>

          {report && (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {[
                  { k: "Скор", v: report.score },
                  { k: "Типов", v: report.totalPatterns },
                  { k: "Вхождений", v: report.totalHits },
                  { k: "Правок", v: report.autoRemoved },
                ].map((x) => (
                  <div key={x.k} className="ws-card p-4 text-center">
                    <div className="text-[32px] font-bold">{x.v}</div>
                    <div className="text-[12px] text-[#6b7280]">{x.k}</div>
                  </div>
                ))}
              </div>

              {filtered.length > 0 && (
                <div className="ws-card mt-4 overflow-hidden">
                  <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">Паттерны ({filtered.length})</div>
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
                          {p.hits.slice(0, 2).map((h, i) => (
                            <li key={i} className="rounded-lg bg-[#fafafa] px-3 py-1 font-mono text-[12px] text-[#6b7280]">…{h.fragment}…</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mode === "clean" && cleaned && (
                <div className="ws-card mt-4 p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Очищенный текст</h2>
                    <button className="ws-btn ws-btn-outline py-1 text-[12px]" onClick={() => navigator.clipboard.writeText(cleaned)}>Копировать</button>
                  </div>
                  <textarea className="ws-input min-h-[150px] font-mono text-[13px]" value={cleaned} onChange={(e) => setCleaned(e.target.value)} />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* === РЕЖИМ: САЙТ === */}
      {tab === "site" && (
        <>
          <p className="mt-4 max-w-xl text-sm text-[#6b7280]">
            Сканирует страницы сайта <b>{project?.url}</b> из sitemap и проверяет текст каждой
            на ИИ-паттерны. Покажет худшие страницы и что в них исправить.
          </p>

          <div className="ws-card mt-3 flex flex-wrap items-center gap-3 p-4">
            <label className="flex items-center gap-2 text-[13px] font-medium">
              Страниц:
              <select className="ws-input w-auto py-1" value={scanPages} onChange={(e) => setScanPages(Number(e.target.value))}>
                <option value={5}>5 (быстро)</option>
                <option value={10}>10 (подробно)</option>
              </select>
            </label>
            {siteErr && <span className="text-[13px] text-[#b91c1c]">{siteErr}</span>}
            <button className="ws-btn ws-btn-primary ml-auto" onClick={() => void scanSite()} disabled={siteBusy || !project}>
              {siteBusy ? "Сканируем…" : "Сканировать сайт"}
            </button>
          </div>

          {siteReport && (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="ws-card p-4 text-center">
                  <div className={`text-[36px] font-bold ${siteReport.avgScore >= 80 ? "text-[#16a34a]" : siteReport.avgScore >= 50 ? "text-[#ea580c]" : "text-[#b91c1c]"}`}>
                    {siteReport.avgScore}
                  </div>
                  <div className="text-[12px] text-[#6b7280]">средний скор сайта</div>
                </div>
                <div className="ws-card p-4 text-center">
                  <div className="text-[36px] font-bold">{siteReport.totalPages}</div>
                  <div className="text-[12px] text-[#6b7280]">страниц просканировано</div>
                </div>
                <div className="ws-card p-4 text-center">
                  <div className="text-[36px] font-bold text-[#b91c1c]">
                    {siteReport.pages.filter((p) => p.score < 50).length}
                  </div>
                  <div className="text-[12px] text-[#6b7280]">страниц «сильно ИИ» (скор &lt; 50)</div>
                </div>
              </div>

              <div className="ws-card mt-4 overflow-hidden">
                <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">Результаты по страницам</div>
                <ul className="divide-y divide-[#f3f4f6]">
                  {siteReport.pages.sort((a, b) => a.score - b.score).map((p) => (
                    <li key={p.url} className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13.5px] font-medium">{p.title || p.url}</div>
                          <div className="truncate text-[11px] text-[#9ca3af]">{p.url.replace(/^https?:\/\/[^/]+/, "")}</div>
                        </div>
                        <div className={`shrink-0 rounded-lg px-3 py-1 text-[16px] font-bold ${
                          p.score >= 80 ? "bg-[#f0fdf4] text-[#15803d]" : p.score >= 50 ? "bg-[#fff7ed] text-[#b45309]" : "bg-[#fef2f2] text-[#b91c1c]"
                        }`}>
                          {p.score}
                        </div>
                      </div>
                      {p.patterns.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.patterns.slice(0, 4).map((pat, i) => (
                            <span key={i} className={`rounded px-1.5 py-0.5 text-[10px] ${SEV[pat.severity] || ""}`}>
                              {pat.name} ×{pat.count}
                            </span>
                          ))}
                          {p.patterns.length > 4 && <span className="text-[10px] text-[#9ca3af]">+{p.patterns.length - 4}</span>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}

      {/* Перелинковка */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/kabinet/statyi" className="text-[13px] text-[#6b7280] hover:text-[#ea580c]">← Создать статью</a>
        <span className="text-[#e5e7eb]">·</span>
        <a href="/kabinet/kontent" className="text-[13px] text-[#6b7280] hover:text-[#ea580c]">Мой контент</a>
        <span className="text-[#e5e7eb]">·</span>
        <a href="/instrumenty/ochelovechivatel" className="text-[13px] text-[#6b7280] hover:text-[#ea580c]" target="_blank">Публичная версия ↗</a>
      </div>
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
