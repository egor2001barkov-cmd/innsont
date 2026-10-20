"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart } from "@/components/kabinet/WsChart";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Report = {
  generatedAt: string;
  hasMetrika: boolean;
  metrikaErrors: string[];
  snapshot: { metric: string; prev: string; last: string; deltaPct: number | null; good: boolean | null }[];
  byDay: { date: string; visits: number }[];
  sources: { name: string; prev: number; last: number; deltaPct: number | null }[];
  topPages: { path: string; prev: number; last: number; deltaPct: number | null }[];
  alerts: { severity: "тревога" | "внимание"; title: string; detail: string; recommendation: string }[];
  wins: string[];
  contentActivity: { articlesLast28: number; articlesPrev28: number; lastAuditAt: string | null };
  note: string;
};

export default function WeeklyReportPage() {
  const { project, ready } = useWorkspace();
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [lastAudit, setLastAudit] = useState<{ at: string; scores: { google: number; yandex: number } } | null>(null);

  useEffect(() => {
    if (!project) return;
    try {
      const raw = localStorage.getItem(`insont.lastAudit.${project.id}`);
      if (raw) setLastAudit(JSON.parse(raw));
    } catch {
      /* */
    }
  }, [project?.id]);

  if (!ready || !project) return null;

  async function run() {
    setBusy(true);
    setErr("");
    setReport(null);
    const res = await fetch("/api/kabinet/weekly-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project!.id,
        lastAuditAt: lastAudit?.at ?? null,
        lastAuditScores: lastAudit?.scores ?? null,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: Report; error?: string };
    setBusy(false);
    if (!res.ok || !data.report) {
      setErr(data.error || "Не удалось собрать отчёт");
      return;
    }
    setReport(data.report);
  }

  const sevStyle = { тревога: "bg-[#fef2f2] text-[#b91c1c]", внимание: "bg-[#fff7ed] text-[#b45309]" } as const;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-[#6b7280]">
          Недельный отчёт: 28 дней против предыдущих 28. Динамика трафика, тревоги при падении
          больше 20% и активность контента. Дополняет «Аудит сайта»: аудит ищет причины, отчёт
          следит за эффектом.
        </p>
        <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy}>
          {busy ? "Собираем…" : "Собрать отчёт"}
        </button>
      </div>
      {err && <p className="mt-3 text-[13px] text-[#b91c1c]">{err}</p>}

      {report && (
        <>
          {!report.hasMetrika && (
            <div className="ws-card mt-4 border-dashed p-6 text-center">
              <p className="text-[14px] font-medium">Трафик не подключён</p>
              <p className="mt-1 text-[13px] text-[#6b7280]">{report.note}</p>
              <Link href="/kabinet/integratsii" className="ws-btn ws-btn-primary mt-3">
                Подключить Метрику
              </Link>
            </div>
          )}

          {report.snapshot.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {report.snapshot.map((s) => (
                <div key={s.metric} className="ws-card p-4">
                  <div className="text-[12px] font-medium text-[#6b7280]">{s.metric}</div>
                  <div className="mt-1 text-[26px] font-bold">{s.last}</div>
                  <div className="text-[12px] text-[#9ca3af]">было {s.prev}</div>
                  {s.deltaPct !== null && (
                    <div className={`text-[13px] font-medium ${s.good ? "text-[#16a34a]" : "text-[#b91c1c]"}`}>
                      {s.deltaPct >= 0 ? "+" : ""}
                      {s.deltaPct}% за 28 дней
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {report.byDay.length > 0 && (
            <div className="ws-card mt-4 p-5">
              <h2 className="text-[15px] font-semibold">Визиты по дням (последние 28)</h2>
              <div className="mt-2">
                <LineChart points={report.byDay.map((d) => ({ label: d.date.slice(5), value: d.visits }))} color="#ea580c" />
              </div>
            </div>
          )}

          <div className="ws-card mt-4 overflow-hidden">
            <div className="border-b border-[#f3f4f6] p-4 text-sm font-semibold">
              Тревоги и внимания: {report.alerts.length}
            </div>
            {report.alerts.length === 0 ? (
              <p className="p-4 text-[13px] text-[#15803d]">Падений больше 20% не найдено — месяц спокойный.</p>
            ) : (
              <ul className="divide-y divide-[#f3f4f6]">
                {report.alerts.map((a, i) => (
                  <li key={i} className="p-4">
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${sevStyle[a.severity]}`}>
                      {a.severity}
                    </span>
                    <div className="mt-1 font-medium">{a.title}</div>
                    <div className="text-[13px] text-[#6b7280]">{a.detail}</div>
                    <div className="text-[13px]">
                      <b>Что делать:</b> {a.recommendation}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {report.wins.length > 0 && (
            <div className="ws-card mt-4 p-5">
              <h2 className="text-sm font-semibold">Что сработало</h2>
              <ul className="mt-2 space-y-1 text-[13.5px] text-[#15803d]">
                {report.wins.map((w, i) => (
                  <li key={i}>✓ {w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {report.sources.length > 0 && (
              <div className="ws-card p-5">
                <h2 className="text-[15px] font-semibold">Источники</h2>
                <table className="ws-table mt-2">
                  <thead>
                    <tr>
                      <th>Источник</th>
                      <th>Было</th>
                      <th>Стало</th>
                      <th>Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.sources.slice(0, 7).map((s) => (
                      <tr key={s.name}>
                        <td>{s.name}</td>
                        <td className="tabular-nums text-[#6b7280]">{s.prev}</td>
                        <td className="tabular-nums">{s.last}</td>
                        <td className={s.deltaPct === null ? "" : s.deltaPct >= 0 ? "text-[#16a34a]" : "text-[#b91c1c]"}>
                          {s.deltaPct === null ? "—" : `${s.deltaPct >= 0 ? "+" : ""}${s.deltaPct}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {report.topPages.length > 0 && (
              <div className="ws-card p-5">
                <h2 className="text-[15px] font-semibold">Топ страниц</h2>
                <table className="ws-table mt-2">
                  <thead>
                    <tr>
                      <th>Страница</th>
                      <th>Было</th>
                      <th>Стало</th>
                      <th>Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topPages.slice(0, 8).map((p) => (
                      <tr key={p.path}>
                        <td className="max-w-[200px] truncate font-mono text-[12px]">{p.path}</td>
                        <td className="tabular-nums text-[#6b7280]">{p.prev}</td>
                        <td className="tabular-nums">{p.last}</td>
                        <td className={p.deltaPct === null ? "" : p.deltaPct >= 0 ? "text-[#16a34a]" : "text-[#b91c1c]"}>
                          {p.deltaPct === null ? "—" : `${p.deltaPct >= 0 ? "+" : ""}${p.deltaPct}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="ws-card mt-4 p-5 text-[13.5px]">
            <h2 className="text-sm font-semibold">Активность контента</h2>
            <p className="mt-1 text-[#6b7280]">
              Статей за 28 дней: <b>{report.contentActivity.articlesLast28}</b> (предыдущие 28:{" "}
              {report.contentActivity.articlesPrev28}). Последний аудит:{" "}
              {report.contentActivity.lastAuditAt || "не запускался"}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/kabinet/audit" className="ws-btn ws-btn-outline py-1.5 text-[13px]">
                Запустить аудит (причины)
              </Link>
              <Link href="/kabinet/statyi" className="ws-btn ws-btn-outline py-1.5 text-[13px]">
                Написать статью
              </Link>
              <Link href="/kabinet/kluchi" className="ws-btn ws-btn-outline py-1.5 text-[13px]">
                Собрать ключи
              </Link>
            </div>
          </div>

          {report.metrikaErrors.length > 0 && (
            <p className="mt-3 text-[12px] text-[#b45309]">
              Часть данных Метрики не получена: {report.metrikaErrors.join("; ")}
            </p>
          )}
          <p className="mt-3 text-[12px] text-[#9ca3af]">{report.note}</p>
        </>
      )}
    </div>
  );
}
