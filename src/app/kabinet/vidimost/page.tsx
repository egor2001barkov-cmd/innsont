"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LineChart } from "@/components/kabinet/WsChart";
import { HBars } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Stats = {
  metrikaConfigured: boolean;
  webmasterConfigured: boolean;
  metrika?: {
    totals?: { visits: number; users: number; bounceRate: number; avgDurationSec: number };
    byDay?: { date: string; visits: number }[];
    sources?: { name: string; visits: number }[];
    topPages?: { path: string; visits: number }[];
    errors: string[];
  };
  webmaster?: { indexStats?: { date: string; indexed: number; crawled: number }[]; errors: string[] };
};

export default function VisibilityPage() {
  const { project, ready } = useWorkspace();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!project) return;
    void fetch(`/api/integrations/stats?projectId=${encodeURIComponent(project.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, [project?.id]);

  if (!ready || !project) return null;

  const m = stats?.metrika;
  const wm = stats?.webmaster;
  const hasM = stats?.metrikaConfigured && m?.totals;
  const hasW = stats?.webmasterConfigured && wm?.indexStats?.length;
  const noData = !hasM && !hasW;

  const cards = hasM
    ? [
        { k: "Визиты · 30 дней", v: m!.totals!.visits.toLocaleString("ru-RU"), d: "Яндекс.Метрика" },
        { k: "Посетители", v: m!.totals!.users.toLocaleString("ru-RU"), d: `${m!.totals!.bounceRate}% отказов` },
        {
          k: "Время на сайте",
          v: `${Math.round(m!.totals!.avgDurationSec / 60)} мин`,
          d: "в среднем за визит",
        },
        {
          k: "В индексе",
          v: hasW ? wm!.indexStats![wm!.indexStats!.length - 1].indexed.toLocaleString("ru-RU") : "—",
          d: hasW ? "Вебмастер" : "Вебмастер не подключён",
        },
      ]
    : [
        { k: "Визиты · 30 дней", v: "—", d: "Метрика не подключена" },
        { k: "Посетители", v: "—", d: "" },
        { k: "Время на сайте", v: "—", d: "" },
        { k: "В индексе", v: "—", d: hasW ? "" : "Вебмастер не подключён" },
      ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#6b7280]">
        {project.name}: реальные данные о трафике и индексации из ваших подключённых сервисов.
        Выдуманных процентов здесь больше нет.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.k} className="ws-card p-4">
            <div className="text-[12px] font-medium text-[#6b7280]">{c.k}</div>
            <div className="mt-1 text-[26px] font-bold tracking-tight">{c.v}</div>
            <div className="text-[12px] text-[#9ca3af]">{c.d}</div>
          </div>
        ))}
      </div>

      {noData && (
        <div className="ws-card mt-4 border-dashed p-8 text-center">
          <p className="text-[14px] font-medium">Данных пока нет</p>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Подключите Яндекс.Метрику (трафик, источники, поведенческие) и Яндекс.Вебмастер
            (индексация) в разделе «Интеграции» — эта страница заполнится реальными цифрами.
          </p>
          <Link href="/kabinet/integratsii" className="ws-btn ws-btn-primary mt-4">
            Подключить интеграции
          </Link>
        </div>
      )}

      {hasM && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="ws-card p-5">
            <h2 className="text-[15px] font-semibold">Визиты по дням</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">Метрика, 30 дней</p>
            <div className="mt-2">
              <LineChart
                points={(m!.byDay || []).map((d) => ({ label: d.date.slice(5), value: d.visits }))}
                color="#ea580c"
              />
            </div>
          </div>
          <div className="ws-card p-5">
            <h2 className="text-[15px] font-semibold">Источники</h2>
            <p className="mb-3 text-[13px] text-[#6b7280]">Визиты за 30 дней</p>
            <HBars
              items={(m!.sources || []).slice(0, 7).map((s) => ({ label: s.name, value: s.visits, color: "#0f766e" }))}
            />
          </div>
        </div>
      )}

      {hasM && m!.topPages?.length ? (
        <div className="ws-card mt-4 p-5">
          <h2 className="text-[15px] font-semibold">Топ страниц по трафику</h2>
          <ul className="mt-3 divide-y divide-[#f3f4f6] text-[13.5px]">
            {m!.topPages.slice(0, 8).map((p) => (
              <li key={p.path} className="flex items-center justify-between py-2">
                <span className="truncate pr-3 font-mono text-[12.5px]">{p.path}</span>
                <span className="shrink-0 tabular-nums text-[#6b7280]">{p.visits} визитов</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasW && (
        <div className="ws-card mt-4 p-5">
          <h2 className="text-[15px] font-semibold">Индексация (Вебмастер)</h2>
          <p className="mt-1 text-[13px] text-[#6b7280]">Страниц в поиске по дням</p>
          <div className="mt-2">
            <LineChart
              points={wm!.indexStats!.map((s) => ({ label: s.date.slice(5), value: s.indexed }))}
              color="#1d4ed8"
            />
          </div>
        </div>
      )}

      {m?.errors?.length ? (
        <p className="mt-3 text-[12px] text-[#b45309]">Часть данных Метрики не получена: {m.errors.join("; ")}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/kabinet/konkurenty" className="ws-btn ws-btn-outline">
          Сравнить с конкурентами →
        </Link>
        <Link href="/kabinet/audit" className="ws-btn ws-btn-outline">
          Полный аудит сайта →
        </Link>
      </div>
    </div>
  );
}
