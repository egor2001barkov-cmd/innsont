"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PricingCards } from "@/components/kabinet/PricingCards";
import { LineChart } from "@/components/kabinet/WsChart";
import { HBars } from "@/components/kabinet/Charts";
import { Ico } from "@/components/kabinet/icons";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadActions } from "@/lib/workspace";
import { saveSession, type Session } from "@/lib/session";

type Stats = {
  metrikaConfigured: boolean;
  webmasterConfigured: boolean;
  metrika?: {
    totals?: { visits: number; users: number; bounceRate: number; avgDurationSec: number };
    byDay?: { date: string; visits: number }[];
    sources?: { name: string; visits: number }[];
    errors: string[];
  };
};

type ServerArticle = { id: string; title: string; status: string; updated: string; projectId: string };

export default function KabinetHome() {
  const { session, setSession, project, projects, plan, ready } = useWorkspace();
  const [stats, setStats] = useState<Stats | null>(null);
  const [articles, setArticles] = useState<ServerArticle[]>([]);
  const [lastAudit, setLastAudit] = useState<{ google: number; yandex: number; at: string } | null>(null);

  useEffect(() => {
    if (!project) return;
    void fetch(`/api/integrations/stats?projectId=${encodeURIComponent(project.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
    void fetch(`/api/content?projectId=${encodeURIComponent(project.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { items?: ServerArticle[]; profile?: Partial<Session> }) => {
        setArticles(d.items || []);
        if (d.profile && session) {
          const next = { ...session, ...d.profile } as Session;
          saveSession(next);
          setSession(next);
        }
      })
      .catch(() => undefined);
    try {
      const raw = localStorage.getItem(`insont.lastAudit.${project.id}`);
      if (raw) setLastAudit(JSON.parse(raw));
    } catch {
      /* */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  if (!ready || !session || !project) return null;

  if (!session.paid) {
    return <PricingCards session={session} onChange={setSession} expired />;
  }

  const actions = loadActions().filter((a) => a.projectId === project.id && a.status !== "Готово");
  const m = stats?.metrika;
  const hasMetrika = stats?.metrikaConfigured && m?.totals;

  const cards = [
    hasMetrika
      ? {
          k: "Визиты за 30 дней",
          v: m!.totals!.visits.toLocaleString("ru-RU"),
          d: `${m!.totals!.users.toLocaleString("ru-RU")} посетителей · отказы ${m!.totals!.bounceRate}%`,
          good: m!.totals!.bounceRate < 40,
        }
      : {
          k: "Трафик",
          v: "—",
          d: "подключите Метрику в «Интеграциях»",
          good: null as boolean | null,
        },
    lastAudit
      ? {
          k: "Аудит сайта",
          v: `${lastAudit.google} / ${lastAudit.yandex}`,
          d: `Google-скор / Яндекс-скор · ${lastAudit.at}`,
          good: lastAudit.yandex >= 70,
        }
      : {
          k: "Аудит сайта",
          v: "—",
          d: "ещё не запускали в этом проекте",
          good: null as boolean | null,
        },
    {
      k: "Промпты (месяц)",
      v: plan.limits.prompts > 10000 ? "безлимит" : `${session.promptsUsed} / ${plan.limits.prompts}`,
      d: plan.limits.prompts > 10000 ? "тариф разработчика" : `${Math.max(0, plan.limits.prompts - session.promptsUsed)} осталось`,
      good: true,
    },
    {
      k: "Статьи (месяц)",
      v: plan.limits.articles > 1000 ? `${session.articlesUsed} · безлимит` : `${session.articlesUsed} / ${plan.limits.articles}`,
      d: `${articles.length} в библиотеке проекта`,
      good: true,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          {project.name} · {project.url} · тариф «{plan.name}». Все цифры на этой странице — реальные
          данные ваших сервисов.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((x) => (
          <div key={x.k} className="ws-card p-4">
            <div className="text-[12px] font-medium text-[#6b7280]">{x.k}</div>
            <div className="mt-1 text-[26px] font-bold tracking-tight">{x.v}</div>
            <div className={`text-[12px] ${x.good === null ? "text-[#9ca3af]" : x.good ? "text-[#16a34a]" : "text-[#b91c1c]"}`}>
              {x.d}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="ws-card p-5">
          <h2 className="text-[15px] font-semibold">Визиты по дням</h2>
          {hasMetrika && m!.byDay?.length ? (
            <>
              <p className="mt-1 text-[13px] text-[#6b7280]">Яндекс.Метрика, последние {m!.byDay.length} дней</p>
              <LineChart
                points={m!.byDay.map((d) => ({ label: d.date.slice(5), value: d.visits }))}
                color="#ea580c"
              />
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-[#e5e7eb] p-6 text-center text-[13px] text-[#9ca3af]">
              Нет данных. Подключите Яндекс.Метрику в{" "}
              <Link href="/kabinet/integratsii" className="font-medium text-[#ea580c]">
                «Интеграциях»
              </Link>{" "}
              — график станет реальным.
            </div>
          )}
        </div>
        <div className="ws-card p-5">
          <h2 className="text-[15px] font-semibold">Источники трафика</h2>
          {hasMetrika && m!.sources?.length ? (
            <>
              <p className="mb-3 text-[13px] text-[#6b7280]">Визиты за 30 дней по источникам</p>
              <HBars
                items={m!.sources.slice(0, 7).map((s) => ({
                  label: s.name,
                  value: s.visits,
                  color: "#0f766e",
                }))}
              />
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-[#e5e7eb] p-6 text-center text-[13px] text-[#9ca3af]">
              Здесь появятся источники трафика после подключения Метрики.
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          { href: "/kabinet/audit", icon: "search", t: "Аудит сайта", d: lastAudit ? `Последний: ${lastAudit.google}/${lastAudit.yandex}` : "По методике seo-ru" },
          { href: "/kabinet/otchet", icon: "chart", t: "Недельный отчёт", d: "28 дней против предыдущих 28" },
          { href: "/kabinet/konkurenty", icon: "chart", t: "Конкуренты", d: "Сравнение с 5 сайтами" },
          { href: "/kabinet/kluchi", icon: "key", t: "Ключи", d: "Wordstat и посадочные конкурентов" },
          { href: "/kabinet/statyi", icon: "edit", t: "Написать статью", d: `${Math.max(0, plan.limits.articles - session.articlesUsed)} из ${plan.limits.articles} осталось` },
          { href: "/kabinet/bulk", icon: "spark", t: "Пакетная генерация", d: "CSV → статьи" },
          { href: "/kabinet/boty", icon: "bot", t: "Боты", d: "Реальный доступ роботов" },
          { href: "/kabinet/strategiya", icon: "map", t: "Стратегия", d: "Кластеры из ваших ключей" },
          { href: "/kabinet/deystviya", icon: "zap", t: "Задачи", d: `${actions.length} открытых` },
          { href: "/kabinet/integratsii", icon: "chart", t: "Интеграции", d: "Метрика и Вебмастер" },
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
            {articles.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5 text-[13.5px]">
                <span className="truncate pr-3">{c.title}</span>
                <span className="shrink-0 text-[#9ca3af]">{c.status}</span>
              </li>
            ))}
            {!articles.length && (
              <li className="py-3 text-[13px] text-[#9ca3af]">Пока пусто — создайте первую статью.</li>
            )}
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
            {!actions.length && (
              <li className="text-[13px] text-[#9ca3af]">
                Задач нет. Запустите аудит — находки можно добавить сюда одной кнопкой.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
