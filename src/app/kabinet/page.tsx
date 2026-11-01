"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PricingCards } from "@/components/kabinet/PricingCards";
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

/** Dashboard в стиле Writesonic: конвейер «Создать → Проверить → Опубликовать» + реальные данные */
export default function KabinetHome() {
  const { session, setSession, project, plan, ready } = useWorkspace();
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
  const hasMetrika = stats?.metrikaConfigured && stats?.metrika?.totals;
  const articlesLeft = Math.max(0, plan.limits.articles - session.articlesUsed);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Конвейер: Создать → Проверить → Опубликовать */}
      <div className="grid gap-3 md:grid-cols-3">
        <Link
          href="/kabinet/statyi"
          className="group flex items-center gap-4 rounded-2xl border-2 border-[#ea580c] bg-gradient-to-br from-[#fff7ed] to-white p-5 transition-all hover:shadow-lg"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ea580c] text-white">
            <Ico name="edit" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-[17px] font-bold text-[#111827]">Написать статью</span>
            <span className="mt-0.5 block text-[13px] text-[#6b7280]">
              Ключ → план → черновик → WP. Осталось {articlesLeft} из {plan.limits.articles}
            </span>
          </span>
        </Link>

        <Link
          href="/kabinet/audit"
          className="group flex items-center gap-4 rounded-2xl border-2 border-[#e5e7eb] bg-white p-5 transition-all hover:border-[#0f766e] hover:shadow-lg"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0f766e] text-white">
            <Ico name="search" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-[17px] font-bold text-[#111827]">Аудит сайта</span>
            <span className="mt-0.5 block text-[13px] text-[#6b7280]">
              {lastAudit ? `Последний: ${lastAudit.google}/${lastAudit.yandex} · ${lastAudit.at}` : "Двойной скор Google/Яндекс"}
            </span>
          </span>
        </Link>

        <Link
          href="/kabinet/otchet"
          className="group flex items-center gap-4 rounded-2xl border-2 border-[#e5e7eb] bg-white p-5 transition-all hover:border-[#1d4ed8] hover:shadow-lg"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1d4ed8] text-white">
            <Ico name="chart" className="h-7 w-7" />
          </span>
          <span>
            <span className="block text-[17px] font-bold text-[#111827]">Недельный отчёт</span>
            <span className="mt-0.5 block text-[13px] text-[#6b7280]">28 дней vs предыдущие 28</span>
          </span>
        </Link>
      </div>

      {/* Реальные цифры */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            k: "Статей в библиотеке",
            v: String(articles.length),
            sub: `${articles.filter((a) => a.status === "готово").length} готово · ${articles.filter((a) => a.status === "опубликовано").length} опубликовано`,
          },
          {
            k: "Промпты (месяц)",
            v: plan.limits.prompts > 10000 ? "безлимит" : `${session.promptsUsed} / ${plan.limits.prompts}`,
            sub: session.freeQueriesUsed > 0 ? `бесплатных: ${session.freeQueriesUsed}/5` : "",
          },
          {
            k: "Аудит сайта",
            v: lastAudit ? `${lastAudit.google} / ${lastAudit.yandex}` : "—",
            sub: lastAudit ? `Google / Яндекс · ${lastAudit.at}` : "не запускался",
          },
          {
            k: "Трафик (Метрика)",
            v: hasMetrika ? String(stats!.metrika!.totals!.visits) : "—",
            sub: hasMetrika ? `${stats!.metrika!.totals!.bounceRate}% отказов` : "подключите Метрику",
          },
        ].map((x) => (
          <div key={x.k} className="ws-card p-4">
            <div className="text-[12px] font-medium text-[#6b7280]">{x.k}</div>
            <div className="mt-1 text-[28px] font-bold tracking-tight">{x.v}</div>
            <div className="text-[12px] text-[#9ca3af]">{x.sub}</div>
          </div>
        ))}
      </div>

      {/* Быстрые инструменты */}
      <div className="mt-5 grid gap-3 md:grid-cols-4 lg:grid-cols-6">
        {[
          { href: "/kabinet/bulk", icon: "spark", t: "Пакет CSV", d: "200 ключей" },
          { href: "/kabinet/humanizer", icon: "pen", t: "Очеловечить", d: "18 паттернов" },
          { href: "/kabinet/kluchi", icon: "key", t: "Ключи", d: "Wordstat" },
          { href: "/kabinet/kanibalizatsiya", icon: "search", t: "Каннибализация", d: "конфликты" },
          { href: "/kabinet/konkurenty", icon: "chart", t: "Конкуренты", d: "сравнение" },
          { href: "/kabinet/boty", icon: "bot", t: "ИИ-боты", d: "7 роботов" },
        ].map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="ws-card flex flex-col items-center gap-2 p-4 text-center transition-all hover:border-[#fdba74] hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7ed] text-[#ea580c]">
              <Ico name={x.icon} className="h-5 w-5" />
            </span>
            <span className="text-[13px] font-semibold">{x.t}</span>
            <span className="text-[11px] text-[#9ca3af]">{x.d}</span>
          </Link>
        ))}
      </div>

      {/* Контент + задачи */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="ws-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Последние статьи</h2>
            <Link href="/kabinet/kontent" className="text-[13px] text-[#ea580c]">
              Все →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-[#f3f4f6]">
            {articles.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5 text-[13.5px]">
                <span className="truncate pr-3">{c.title}</span>
                <span className="shrink-0 text-[12px] text-[#9ca3af]">{c.status}</span>
              </li>
            ))}
            {!articles.length && (
              <li className="py-4 text-[13px] text-[#9ca3af]">
                Пока пусто. <Link href="/kabinet/statyi" className="text-[#ea580c]">Напишите первую →</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="ws-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Очередь задач</h2>
            <Link href="/kabinet/deystviya" className="text-[13px] text-[#ea580c]">
              Центр действий →
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            {actions.slice(0, 5).map((a) => (
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
                Задач нет. Запустите аудит — находки появятся здесь.
              </li>
            )}
          </ul>
        </div>
      </div>

      {!hasMetrika && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-[#e5e7eb] bg-[#fafafa] p-4">
          <div>
            <p className="text-[14px] font-medium">Подключите Метрику и Вебмастер</p>
            <p className="mt-0.5 text-[13px] text-[#6b7280]">
              Трафик, источники и индексация — прямо в кабинете и в недельном отчёте
            </p>
          </div>
          <Link href="/kabinet/integratsii" className="ws-btn ws-btn-primary shrink-0">
            Подключить
          </Link>
        </div>
      )}
    </div>
  );
}
