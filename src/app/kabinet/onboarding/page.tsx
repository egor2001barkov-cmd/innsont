"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GOALS,
  REVENUES,
  ROLES,
  TEAM_SIZES,
  defaultMapUrl,
  normalizeSiteUrl,
  type GoalId,
  type RevenueId,
  type RoleId,
  type TeamSizeId,
} from "@/lib/profile";
import { emptyProject, saveActiveProjectId, saveProjects } from "@/lib/workspace";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { saveSession } from "@/lib/session";

export default function OnboardingPage() {
  const router = useRouter();
  const { session, setSession, projects, plan, ready } = useWorkspace();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleId | "">("");
  const [teamSize, setTeamSize] = useState<TeamSizeId | "">("");
  const [revenue, setRevenue] = useState<RevenueId>("");
  const [goals, setGoals] = useState<GoalId[]>([]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [robotsUrl, setRobotsUrl] = useState("");
  const [mainPages, setMainPages] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [casesUrl, setCasesUrl] = useState("");
  const [formsUrl, setFormsUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const origin = useMemo(() => normalizeSiteUrl(url), [url]);

  function fillDefaults() {
    if (!origin) return;
    if (!sitemapUrl) setSitemapUrl(defaultMapUrl(origin, "/sitemap.xml"));
    if (!robotsUrl) setRobotsUrl(defaultMapUrl(origin, "/robots.txt"));
  }

  function toggleGoal(id: GoalId) {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  }

  if (!ready || !session) return null;

  async function submit() {
    const site = normalizeSiteUrl(url);
    if (!site) {
      setErr("Укажите сайт: https://www.example.ru");
      return;
    }
    if (projects.length >= plan.limits.projects) {
      setErr(`На тарифе «${plan.name}» лимит проектов: ${plan.limits.projects}`);
      return;
    }
    setBusy(true);
    setErr("");
    const project = emptyProject({
      url: site,
      name: name.trim(),
      sitemapUrl: sitemapUrl.trim() || defaultMapUrl(site, "/sitemap.xml"),
      robotsUrl: robotsUrl.trim() || defaultMapUrl(site, "/robots.txt"),
      mainPages,
      blogUrl: blogUrl.trim(),
      casesUrl: casesUrl.trim(),
      formsUrl: formsUrl.trim(),
      role,
      teamSize,
      revenue,
      goals,
      onboarded: true,
      scannedAt: "",
    });
    const next = [...projects, project];
    saveProjects(next);
    saveActiveProjectId(project.id);
    if (!session) return;
    const nextSession = { ...session, site, company: session.company || project.name };
    saveSession(nextSession);
    setSession(nextSession);
    router.push("/kabinet/audit?first=1");
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#ea580c]">Шаг 1 из 1</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">Расскажите про сайт</h2>
      <p className="mt-1 text-sm text-[#6b7280]">
        Сначала сайт. Остальное — по желанию, но чем больше ссылок, тем глубже первый аудит. Аудит
        запустится только после этой формы.
      </p>

      <form
        className="mt-6 space-y-7"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <section className="ws-card space-y-3 p-5">
          <label className="block text-[13px] font-semibold">
            Сайт <span className="text-[#ea580c]">*</span>
            <input
              className="ws-input mt-1"
              required
              placeholder="www.company.ru или https://company.ru"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={fillDefaults}
            />
          </label>
          <label className="block text-[13px] font-medium text-[#374151]">
            Название проекта
            <input
              className="ws-input mt-1"
              placeholder="Как называть в кабинете — необязательно"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </section>

        <section>
          <h3 className="text-sm font-semibold">Кто вы</h3>
          <p className="mt-0.5 text-[12px] text-[#9ca3af]">Необязательно, как в американских кабинетах</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`rounded-xl border p-3 text-left ${
                  role === r.id ? "border-[#ea580c] bg-[#fff7ed]" : "border-[#e5e7eb] bg-white"
                }`}
              >
                <div className="text-[13.5px] font-semibold">{r.label}</div>
                <div className="text-[12px] text-[#6b7280]">{r.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] font-medium">
            Число сотрудников
            <select
              className="ws-input mt-1"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value as TeamSizeId)}
            >
              <option value="">Не указывать</option>
              {TEAM_SIZES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-medium">
            Выручка в год
            <select
              className="ws-input mt-1"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value as RevenueId)}
            >
              {REVENUES.map((t) => (
                <option key={t.id || "na"} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section>
          <h3 className="text-sm font-semibold">Зачем кабинет</h3>
          <p className="mt-0.5 text-[12px] text-[#9ca3af]">Можно несколько</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGoal(g.id)}
                className={`rounded-full px-3 py-1.5 text-[13px] ${
                  goals.includes(g.id) ? "bg-[#111827] text-white" : "bg-[#f3f4f6] text-[#374151]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        <section className="ws-card space-y-3 p-5">
          <h3 className="text-sm font-semibold">Для глубокого аудита</h3>
          <p className="text-[12px] text-[#9ca3af]">Необязательно. Если пусто — подставим стандартные пути.</p>
          <label className="block text-[13px] font-medium">
            Карта сайта
            <input
              className="ws-input mt-1"
              placeholder={origin ? `${origin}/sitemap.xml` : "https://site.ru/sitemap.xml"}
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
            />
          </label>
          <label className="block text-[13px] font-medium">
            robots.txt
            <input
              className="ws-input mt-1"
              placeholder={origin ? `${origin}/robots.txt` : "https://site.ru/robots.txt"}
              value={robotsUrl}
              onChange={(e) => setRobotsUrl(e.target.value)}
            />
          </label>
          <label className="block text-[13px] font-medium">
            Основные страницы
            <textarea
              className="ws-input mt-1 min-h-24"
              placeholder={"По одной ссылке в строке\nhttps://site.ru/uslugi\nhttps://site.ru/ceny"}
              value={mainPages}
              onChange={(e) => setMainPages(e.target.value)}
            />
          </label>
          <label className="block text-[13px] font-medium">
            Блог
            <input className="ws-input mt-1" placeholder="https://site.ru/blog" value={blogUrl} onChange={(e) => setBlogUrl(e.target.value)} />
          </label>
          <label className="block text-[13px] font-medium">
            Кейсы
            <input className="ws-input mt-1" placeholder="https://site.ru/keysy" value={casesUrl} onChange={(e) => setCasesUrl(e.target.value)} />
          </label>
          <label className="block text-[13px] font-medium">
            Форма заявки
            <input className="ws-input mt-1" placeholder="https://site.ru/kontakty" value={formsUrl} onChange={(e) => setFormsUrl(e.target.value)} />
          </label>
        </section>

        {err && <p className="text-sm text-[#b91c1c]">{err}</p>}
        <button className="ws-btn ws-btn-primary w-full py-3" disabled={busy}>
          {busy ? "Сохраняем…" : "Запустить аудит сайта"}
        </button>
      </form>
    </div>
  );
}
