"use client";

import { useState } from "react";
import { Donut, HBars } from "@/components/kabinet/Charts";
import { ColumnChart, LineChart } from "@/components/kabinet/WsChart";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { geoFor } from "@/lib/workspace";
import { PERIODS, statsForPeriod, type Period } from "@/lib/project-metrics";

export default function VisibilityPage() {
  const { project, ready } = useWorkspace();
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<Period>("month");
  if (!ready || !project) return null;
  const geo = geoFor(project);
  const stats = statsForPeriod(project, period);
  const rows = geo.prompts.filter((p) => p.q.includes(q.toLowerCase()));
  const platforms = ["Яндекс", "Google", "Bing"];
  const periodLabel = PERIODS.find((p) => p.id === period)!.label.toLowerCase();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#6b7280]">
            {project.name}: доля ответов, где модели называют бренд. Сравнение с конкурентами по промптам.
          </p>
        </div>
        <div className="inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px] font-medium">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              className={`rounded-md px-2.5 py-1.5 ${period === p.id ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat k="Видимость" v={`${stats.visibilityNow}%`} d={`${stats.visibilityDelta >= 0 ? "+" : ""}${stats.visibilityDelta} п.п. · ${periodLabel}`} />
        <Stat k="Ответов с брендом" v={stats.answersNow.toLocaleString("ru-RU")} d={`+${stats.answersDelta} · ${periodLabel}`} />
        <Stat k="Страниц-цитат" v={String(geo.pagesCited)} d={`своих ${geo.ownPages}`} />
        <Stat
          k="Тональность"
          v={`${geo.sentiment.pos}%`}
          d={`${geo.sentiment.neu}% нейтр. · ${geo.sentiment.neg}% нег.`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="ws-card p-5">
          <h2 className="text-[15px] font-semibold">Как часто бренд в ответах</h2>
          <p className="mb-2 text-[13px] text-[#6b7280]">Доля ответов с брендом за {periodLabel}. Наведите курсор на точку.</p>
          <LineChart
            points={stats.labels.map((label, i) => ({ label, value: stats.visibility[i] }))}
            color="#ea580c"
            unit="%"
          />
        </div>
        <div className="ws-card p-5">
          <h2 className="text-sm font-semibold">Платформы</h2>
          <p className="mb-3 text-[12px] text-[#9ca3af]">Откуда приходят упоминания</p>
          <Donut items={geo.platforms} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="ws-card p-5">
          <h2 className="text-sm font-semibold">Доля голоса</h2>
          <p className="mb-4 text-[12px] text-[#9ca3af]">Вы и конкуренты в одних промптах</p>
          <ColumnChart
            points={geo.rivals.map((r) => ({ label: r.name, value: r.score }))}
            color="#ea580c"
            height={180}
          />
          <div className="mt-3">
            <HBars items={geo.rivals.map((r) => ({ label: r.name, value: r.score, you: r.you }))} />
          </div>
        </div>
        <div className="ws-card p-5">
          <h2 className="text-sm font-semibold">Тональность упоминаний</h2>
          <div className="mt-6 flex h-3 overflow-hidden rounded-full">
            <div className="bg-[#16a34a]" style={{ width: `${geo.sentiment.pos}%` }} />
            <div className="bg-[#d1d5db]" style={{ width: `${geo.sentiment.neu}%` }} />
            <div className="bg-[#ef4444]" style={{ width: `${geo.sentiment.neg}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-[12px] text-[#6b7280]">
            <span>Позитив {geo.sentiment.pos}%</span>
            <span>Нейтрал {geo.sentiment.neu}%</span>
            <span>Негатив {geo.sentiment.neg}%</span>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#4b5563]">
            На {project.name} позитив держится за счёт сравнений с цифрами. Негатив — жалобы на сроки доставки,
            их модели подхватывают с отзывов, не с вашего домена.
          </p>
        </div>
      </div>

      <div className="ws-card mt-4 min-w-0 overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] p-4">
          <h2 className="text-sm font-semibold">Промпты в трекинге</h2>
          <input
            className="ws-input max-w-xs"
            placeholder="Фильтр по промпту"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="ws-table">
            <thead>
              <tr>
                <th>Промпт</th>
                <th>Частота</th>
                <th>Ваша доля</th>
                <th>Лидер</th>
                {platforms.map((p) => (
                  <th key={p}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.q}>
                  <td className="max-w-[260px] font-medium">{r.q}</td>
                  <td>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
                        r.vol === "Высокая"
                          ? "bg-[#fff7ed] text-[#c2410c]"
                          : r.vol === "Средняя"
                            ? "bg-[#f3f4f6] text-[#4b5563]"
                            : "bg-[#f9fafb] text-[#9ca3af]"
                      }`}
                    >
                      {r.vol}
                    </span>
                  </td>
                  <td className="tabular-nums">{r.you}%</td>
                  <td>{r.leader}</td>
                  {platforms.map((p) => (
                    <td key={p} className="text-center">
                      {r.platforms[p] ? (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
                      ) : (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, d }: { k: string; v: string; d: string }) {
  return (
    <div className="ws-card p-4">
      <div className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">{k}</div>
      <div className="mt-1 text-[26px] font-bold tracking-tight">{v}</div>
      <div className="text-[12px] text-[#6b7280]">{d}</div>
    </div>
  );
}
