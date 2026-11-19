"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { saveSession, type Session } from "@/lib/session";

type Audit = {
  mode: "audit";
  site: string;
  score: number;
  pagesScanned: number;
  pagesFoundInSitemap: number;
  contextualLinks: number;
  navigationLinks: number;
  orphans: string[];
  lowIncoming: { url: string; incoming: number }[];
  topTargets: { url: string; incoming: number }[];
  anchors: { anchor: string; count: number }[];
  suggestions: { target: string; donor: string; reason: string }[];
  notes: string[];
};

type Campaign = {
  mode: "campaign";
  site: string;
  targetsConsidered: number;
  links: { donor: string; anchor: string; target: string; targetTitle: string; reason: string }[];
  rejected: { target: string; reason: string }[];
  anchorsUsed: { anchor: string; count: number }[];
};

type Report = Audit | Campaign;

export default function PerelinkovkaPage() {
  const { session, setSession, project, ready } = useWorkspace();
  const [maxPages, setMaxPages] = useState(40);
  const [busy, setBusy] = useState<"audit" | "campaign" | "">("");
  const [err, setErr] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  if (!ready || !project) return null;

  async function run(mode: "audit" | "campaign") {
    if (busy) return;
    setBusy(mode);
    setErr("");
    setReport(null);
    const res = await fetch("/api/kabinet/perelinkovka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteUrl: project!.url, mode, maxPages }),
    });
    const data = (await res.json().catch(() => ({}))) as { profile?: Partial<Session>; error?: string } & Partial<Report>;
    setBusy("");
    if (data.profile && session) {
      const next = { ...session, ...data.profile };
      saveSession(next);
      setSession(next);
    }
    if (!res.ok || !data.mode) {
      setErr(data.error || "Не удалось проанализировать сайт");
      return;
    }
    setReport(data as Report);
  }

  function exportPlan() {
    if (!report || report.mode !== "campaign") return;
    const lines = [
      `# План перелинковки — ${report.site} (${new Date().toISOString().slice(0, 10)})`,
      `Целей рассмотрено: ${report.targetsConsidered} · ссылок в плане: ${report.links.length}`,
      "",
      "| Донор | Анкор (дословный) | Цель | Почему |",
      "| --- | --- | --- | --- |",
      ...report.links.map(
        (l) => `| ${l.donor} | ${l.anchor} | ${l.target} | ${l.reason} |`
      ),
      "",
      ...(report.rejected.length
        ? ["## Отклонено гейтом", "", ...report.rejected.map((r) => `- ${r.target}: ${r.reason}`)]
        : []),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `perelinkovka-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  }

  const short = (u: string) => u.replace(/^https?:\/\/[^/]+/, "") || "/";

  return (
    <div className="mx-auto max-w-5xl">
      <p className="max-w-xl text-sm text-[#6b7280]">
        Анализ внутренней перелинковки по методике скилла: контекстные ссылки отдельно от навигации,
        сироты, оценка структуры и план ссылок с анкорами из текста донора.
      </p>

      <div className="ws-card mt-3 flex flex-wrap items-center gap-3 p-4 text-[13px]">
        <label className="flex items-center gap-2 font-medium">
          Страниц:
          <select className="ws-input w-auto py-1" value={maxPages} onChange={(e) => setMaxPages(Number(e.target.value))}>
            <option value={20}>20 (быстро)</option>
            <option value={40}>40</option>
            <option value={80}>80 (подробно)</option>
            <option value={100}>100</option>
          </select>
        </label>
        <span className="truncate text-[12px] text-[#9ca3af]">{project.url}</span>
        {err && <span className="text-[13px] text-[#b91c1c]">{err}</span>}
        <div className="ml-auto flex gap-2">
          <button className="ws-btn ws-btn-outline" onClick={() => void run("audit")} disabled={Boolean(busy)}>
            {busy === "audit" ? (
              <span className="flex items-center gap-2"><span className="ws-spinner ws-spinner-dark" /> Обходим…</span>
            ) : (
              "Анализ"
            )}
          </button>
          <button className="ws-btn ws-btn-primary" onClick={() => void run("campaign")} disabled={Boolean(busy)}>
            {busy === "campaign" ? (
              <span className="flex items-center gap-2"><span className="ws-spinner" /> Составляем план…</span>
            ) : (
              "Предложить ссылки"
            )}
          </button>
        </div>
      </div>

      {report?.mode === "audit" && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { k: "Скор структуры", v: `${report.score}/100` },
              { k: "Страниц проверено", v: report.pagesScanned },
              { k: "Контекстных ссылок", v: report.contextualLinks },
              { k: "Сирот", v: report.orphans.length },
            ].map((x) => (
              <div key={x.k} className="ws-card p-4 text-center">
                <div className={`text-[30px] font-bold ${x.k.includes("Скор") ? (report.score >= 80 ? "text-[#15803d]" : report.score >= 50 ? "text-[#b45309]" : "text-[#b91c1c]") : ""}`}>{x.v}</div>
                <div className="text-[12px] text-[#6b7280]">{x.k}</div>
              </div>
            ))}
          </div>

          {report.notes.length > 0 && (
            <p className="mt-3 text-[12.5px] text-[#9ca3af]">{report.notes.join(" · ")}</p>
          )}

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {report.orphans.length > 0 && (
              <div className="ws-card overflow-hidden">
                <div className="border-b border-[#f3f4f6] p-3 text-sm font-semibold">Сироты ({report.orphans.length})</div>
                <ul className="max-h-64 divide-y divide-[#f3f4f6] overflow-y-auto">
                  {report.orphans.map((u) => (
                    <li key={u} className="flex items-center gap-2 px-3 py-2 text-[13px]">
                      <a href={u} target="_blank" rel="noreferrer" className="truncate text-[#ea580c] hover:underline">{short(u)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {report.topTargets.length > 0 && (
              <div className="ws-card overflow-hidden">
                <div className="border-b border-[#f3f4f6] p-3 text-sm font-semibold">Топ входящих ссылок</div>
                <ul className="max-h-64 divide-y divide-[#f3f4f6] overflow-y-auto">
                  {report.topTargets.map((t) => (
                    <li key={t.url} className="flex items-center gap-2 px-3 py-2 text-[13px]">
                      <span className="truncate">{short(t.url)}</span>
                      <span className="ml-auto shrink-0 rounded bg-[#f0fdf4] px-1.5 py-0.5 text-[11px] text-[#15803d]">{t.incoming}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {report?.mode === "campaign" && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-[13px] text-[#6b7280]">
              Целей: {report.targetsConsidered} · ссылок в плане: <b>{report.links.length}</b> · отклонено гейтом: {report.rejected.length}
            </span>
            <button className="ws-btn ws-btn-outline py-1 text-[12px] ml-auto" onClick={exportPlan}>Экспорт .md</button>
          </div>

          {report.links.length > 0 && (
            <div className="ws-card mt-3 overflow-x-auto">
              <table className="ws-table">
                <thead>
                  <tr>
                    <th>Донор</th>
                    <th>Анкор (дословный из текста)</th>
                    <th>Цель</th>
                    <th>Почему</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {report.links.map((l, i) => (
                    <tr key={i}>
                      <td className="max-w-[180px] truncate" title={l.donor}>{short(l.donor)}</td>
                      <td>
                        <button
                          className="rounded bg-[#f3f0ff] px-1.5 py-0.5 font-mono text-[12px] text-[#7c3aed] hover:bg-[#ece5ff]"
                          title="Скопировать анкор"
                          onClick={() => void navigator.clipboard.writeText(l.anchor)}
                        >
                          {l.anchor} ⧉
                        </button>
                      </td>
                      <td className="max-w-[180px] truncate" title={l.targetTitle}>
                        <a href={l.target} target="_blank" rel="noreferrer" className="text-[#ea580c] hover:underline">{short(l.target)}</a>
                      </td>
                      <td className="text-[12.5px] text-[#6b7280]">{l.reason}</td>
                      <td>
                        <button
                          className="text-[12px] text-[#6b7280] underline hover:text-[#ea580c]"
                          title="Скопировать готовую markdown-ссылку"
                          onClick={() => void navigator.clipboard.writeText(`[${l.anchor}](${l.target})`)}
                        >
                          md-ссылку
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.rejected.length > 0 && (
            <div className="ws-card mt-3 p-4 text-[12.5px] text-[#6b7280]">
              <b>Отклонено гейтом валидации:</b>
              <ul className="mt-1 list-disc pl-5">
                {report.rejected.slice(0, 8).map((r, i) => (
                  <li key={i}>{short(r.target)} — {r.reason}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-3 text-[12.5px] text-[#9ca3af]">
            Внедряйте по правилам скилла: обёртка существующего текста в ссылку (вёрстку не менять),
            после вставки — повторный анализ для сверки. Кнопка «md-ссылку» копирует готовый фрагмент для CMS.
          </p>
        </>
      )}
    </div>
  );
}
