"use client";

import Link from "next/link";
import { useState } from "react";
import { PricingCards } from "@/components/kabinet/PricingCards";
import { ColumnChart, LineChart, SparkLine } from "@/components/kabinet/WsChart";
import { Ico } from "@/components/kabinet/icons";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { geoFor, loadContent, loadActions } from "@/lib/workspace";
import { PERIODS, statsForPeriod, type Period } from "@/lib/project-metrics";

export default function KabinetHome() {
  const { session, setSession, project, projects, plan, ready } = useWorkspace();
  const [period, setPeriod] = useState<Period>("month");
  if (!ready || !session || !project) return null;

  if (!session.paid) {
    return <PricingCards session={session} onChange={setSession} expired />;
  }

  const geo = geoFor(project);
  const stats = statsForPeriod(project, period);
  const content = loadContent().filter((c) => c.projectId === project.id);
  const actions = loadActions().filter((a) => a.projectId === project.id && a.status !== "Готово");
  const periodLabel = PERIODS.find((p) => p.id === period)!.label.toLowerCase();
  const deltaVis = stats.visibilityDelta;
  const promptsLabel = plan.limits.prompts > 10000 ? "безлимит" : `${stats.promptsNow} / ${plan.limits.prompts}`;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          {project.name} · {project.url} · тариф «{plan.name}». Метрики считаются по этому сайту.
        </p>
        <div className="inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px] font-medium">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              className={`rounded-md px-2.5 py-1.5 ${period === p.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            k: "ИИ-видимость",
            v: `${stats.visibilityNow}%`,
            d: `${deltaVis >= 0 ? "+" : ""}${deltaVis} п.п. за ${periodLabel}`,
            good: deltaVis >= 0,
            series: stats.visibility,
            color: "#ea580c",
          },
          {
            k: "Ответов с брендом",
            v: stats.answersNow.toLocaleString("ru-RU"),
            d: `+${stats.answersDelta.toLocaleString("ru-RU")} за ${periodLabel}`,
            good: true,
            series: stats.answers,
            color: "#0f766e",
          },
          {
            k: "Промпты",
            v: promptsLabel,
            d: plan.limits.prompts > 10000 ? `съём за ${periodLabel}` : `за ${periodLabel}`,
            good: true,
            series: stats.prompts,
            color: "#7c3aed",
          },
          {
            k: "Проекты",
            v: plan.limits.projects > 1000 ? `${projects.length} · безлимит` : `${projects.length} / ${plan.limits.projects}`,
            d: plan.limits.actionItems ? "задачи включены" : "задачи на Росте",
            good: true,
            series: projects.map((_, i) => i + 1).concat(Array.from({ length: Math.max(0, stats.labels.length - projects.length) }, () => projects.length)),
            color: "#1d4ed8",
          },
        ].map((x) => (
          <div key={x.k} className="ws-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[12px] font-medium text-[#6b7280]">{x.k}</div>
                <div className="mt-1 text-[26px] font-bold tracking-tight">{x.v}</div>
                <div className={`text-[12px] ${x.good ? "text-[#16a34a]" : "text-[#b91c1c]"}`}>{x.d}</div>
              </div>
              <SparkLine values={x.series} color={x.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="ws-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-[15px] font-semibold">Как часто бренд в ответах</h2>
            <span className="text-[12px] text-[#9ca3af]">%, {periodLabel}</span>
          </div>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Доля ответов Яндекса, Google и Bing, где назван {project.name}. Наведите на линию — увидите дату.
          </p>
          <LineChart
            points={stats.labels.map((label, i) => ({ label, value: stats.visibility[i] }))}
            color="#ea580c"
            unit="%"
          />
        </div>
        <div className="ws-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-[15px] font-semibold">Сколько раз бренд упомянули</h2>
            <span className="text-[12px] text-[#9ca3af]">штук, {periodLabel}</span>
          </div>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Число ответов с брендом за каждый день (или час / неделю — как выбран период).
          </p>
          <ColumnChart
            points={stats.labels.map((label, i) => ({ label, value: stats.answers[i] }))}
            color="#ea580c"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          { href: "/kabinet/vidimost", icon: "chart", t: "Обзор GEO", d: "Доля ответов и конкуренты" },
          { href: "/kabinet/kluchi", icon: "key", t: "Ключи", d: "Wordstat и посадочные конкурентов" },
          { href: "/kabinet/audit", icon: "search", t: "Аудит сайта", d: `Оценка ${geo.visibility > 30 ? "средняя" : "слабая"}` },
          { href: "/kabinet/statyi", icon: "edit", t: "Написать статью", d: `${plan.limits.articles - session.articlesUsed} из ${plan.limits.articles}` },
          { href: "/kabinet/boty", icon: "bot", t: "Боты", d: "Кто ходит на сайт" },
          { href: "/kabinet/strategiya", icon: "map", t: "Стратегия", d: "Кластеры и разрывы" },
          { href: "/kabinet/deystviya", icon: "zap", t: "Задачи", d: `${actions.length} открытых` },
          { href: "/kabinet/posadochnye", icon: "folder", t: "Посадочные", d: "Страницы и карта сайта" },
          { href: "/kabinet/regiony", icon: "map", t: "Регионы", d: "Города и Яндекс-регион" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="ws-card flex items-start gap-3 p-4 hover:border-[#fdba74]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
              <Ico name={x.icon} />
            </span>
            <span>
              <span className="block font-semibold">{x.t}</span>
              <span className="text-[13px] text-[#6b7280]">{x.d}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="ws-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Недавний контент</h2>
            <Link href="/kabinet/kontent" className="text-[13px] text-[#ea580c]">
              Все
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-[#f3f4f6]">
            {content.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5 text-[13.5px]">
                <span className="truncate pr-3">{c.title}</span>
                <span className="shrink-0 text-[#9ca3af]">{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ws-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Очередь</h2>
            <Link href="/kabinet/deystviya" className="text-[13px] text-[#ea580c]">
              Центр действий
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            {actions.slice(0, 4).map((a) => (
              <li key={a.id} className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ea580c]" />
                <span>
                  <span className="text-[#9ca3af]">{a.impact} · </span>
                  {a.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
