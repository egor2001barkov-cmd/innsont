"use client";

import { useState } from "react";
import { Gauge, HBars } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { saveSession, type Session } from "@/lib/session";
import { loadActions, saveActions, type ActionItem } from "@/lib/workspace";

type Finding = {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  area: string;
  title: string;
  detail: string;
  fix: string;
  watch: string;
};

type Audit = {
  site: string;
  durationMs: number;
  googleScore: number;
  yandexScore: number;
  blocks: { engine: "google" | "yandex"; block: string; weight: number; score: number; comment: string }[];
  findings: Finding[];
  facts: {
    robots: { found: boolean; cleanParam: boolean; sitemapDirective: boolean; aiBotsBanned: string[] };
    sitemap: { found: boolean; urls: number; lastmodNewest: string };
    speed: { avgTtfbMs: number; pages: { url: string; ttfbMs: number }[] };
    homepage: { title: string; h1Count: number; schemaTypes: string[]; htmlKb: number };
    commercial: { phone: boolean; email: boolean; innOrOgrn: boolean; address: boolean; prices: boolean; messenger: boolean };
    geo: { llmsTxt: boolean; aiBotsAllowed: boolean };
  };
  note: string;
};

const SEV: Record<Finding["severity"], { label: string; cls: string }> = {
  critical: { label: "критично", cls: "bg-[#fef2f2] text-[#b91c1c]" },
  high: { label: "важно", cls: "bg-[#fff7ed] text-[#b45309]" },
  medium: { label: "средне", cls: "bg-[#f0fdf4] text-[#15803d]" },
  low: { label: "желательно", cls: "bg-[#f3f4f6] text-[#4b5563]" },
};

export default function AuditPage() {
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sev, setSev] = useState("все");
  const [savedNote, setSavedNote] = useState("");

  if (!ready || !session || !project) return null;

  async function run() {
    setBusy(true);
    setErr("");
    setSavedNote("");
    setAudit(null);
    const res = await fetch("/api/kabinet/site-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: project!.url, projectId: project!.id }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      audit?: Audit;
      error?: string;
      profile?: Partial<Session>;
    };
    setBusy(false);
    if (data.profile) {
      const next = { ...session, ...data.profile } as Session;
      saveSession(next);
      setSession(next);
    }
    if (!res.ok || !data.audit) {
      setErr(data.error || "Не удалось выполнить аудит");
      return;
    }
    setAudit(data.audit);
    try {
      localStorage.setItem(
        `insont.lastAudit.${project!.id}`,
        JSON.stringify({
          google: data.audit.googleScore,
          yandex: data.audit.yandexScore,
          at: new Date().toISOString().slice(0, 10),
        })
      );
      window.dispatchEvent(new Event("insont-workspace"));
    } catch {
      /* */
    }
  }

  function pushToActions() {
    if (!audit) return;
    const top = audit.findings.filter((f) => f.severity === "critical" || f.severity === "high").slice(0, 6);
    if (!top.length) {
      setSavedNote("Критичного нет — добавлять нечего.");
      return;
    }
    const fresh: ActionItem[] = top.map((f) => ({
      id: `site-audit-${Date.now()}-${f.id}`,
      projectId: project!.id,
      cat: f.area.includes("Коммерч") ? "Контент" : "Техника",
      title: `[${f.area}] ${f.title}`,
      impact: f.severity === "critical" ? "Высокий" : "Средний",
      status: "Открыто",
      detail: `${f.detail} Чинить: ${f.fix} Проверка: ${f.watch}`,
    }));
    saveActions([...fresh, ...loadActions()]);
    setSavedNote(`Добавлено в «Центр действий»: ${fresh.length} задач.`);
  }

  const shown = audit?.findings.filter((f) => sev === "все" || SEV[f.severity].label === sev) || [];
  const googleBlocks = audit?.blocks.filter((b) => b.engine === "google") || [];
  const yandexBlocks = audit?.blocks.filter((b) => b.engine === "yandex") || [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Полный аудит {project.url} по методике seo-ru: индексация, скорость, коммерческие факторы
          Яндекса, GEO-готовность. Два скора: Google и Яндекс. Лимит аудитов «{plan.name}»:{" "}
          {plan.limits.audits} / мес.
        </p>
        <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy}>
          {busy ? "Обходим сайт… (до минуты)" : "Запустить аудит сайта"}
        </button>
      </div>
      {err && <p className="mt-3 rounded-lg bg-[#fef2f2] px-3 py-2 text-[13px] text-[#b91c1c]">{err}</p>}
      {busy && (
        <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-[13px] text-[#9a3412]">
          Читаем robots.txt, sitemap, редиректы, скорость страниц, коммерческие факторы и разметку…
        </p>
      )}

      {audit && (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-[200px_200px_1fr]">
            <div className="ws-card flex flex-col items-center p-5">
              <Gauge value={audit.googleScore} label="Google-скор" />
            </div>
            <div className="ws-card flex flex-col items-center p-5">
              <Gauge value={audit.yandexScore} label="Яндекс-скор" />
            </div>
            <div className="ws-card p-5 text-[13px] leading-relaxed text-[#374151]">
              <p>
                <b>{audit.site}</b> · аудит занял {(audit.durationMs / 1000).toFixed(1)} с · TTFB в
                среднем {audit.facts.speed.avgTtfbMs} мс · sitemap:{" "}
                {audit.facts.sitemap.found ? `${audit.facts.sitemap.urls} URL` : "не найден"} · H1 на
                главной: ×{audit.facts.homepage.h1Count} · schema:{" "}
                {audit.facts.homepage.schemaTypes.slice(0, 3).join(", ") || "нет"}
              </p>
              <p className="mt-1">
                Коммерческие факторы: {[
                  ["телефон", audit.facts.commercial.phone],
                  ["почта", audit.facts.commercial.email],
                  ["ИНН/ОГРН", audit.facts.commercial.innOrOgrn],
                  ["адрес", audit.facts.commercial.address],
                  ["цены", audit.facts.commercial.prices],
                  ["мессенджер", audit.facts.commercial.messenger],
                ]
                  .map(([l, ok]) => (ok ? `✓ ${l}` : `— ${l}`))
                  .join(" · ")}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="ws-card p-5">
              <h2 className="text-sm font-semibold">Блоки Google-скора</h2>
              <p className="mb-4 text-[12px] text-[#9ca3af]">0–100 × вес блока</p>
              <HBars
                items={googleBlocks.map((b) => ({
                  label: `${b.block} · вес ${b.weight}`,
                  value: b.score,
                  color: b.score >= 70 ? "#16a34a" : b.score >= 50 ? "#ea580c" : "#dc2626",
                }))}
              />
            </div>
            <div className="ws-card p-5">
              <h2 className="text-sm font-semibold">Блоки Яндекс-скора</h2>
              <p className="mb-4 text-[12px] text-[#9ca3af]">0–100 × вес блока</p>
              <HBars
                items={yandexBlocks.map((b) => ({
                  label: `${b.block} · вес ${b.weight}`,
                  value: b.score,
                  color: b.score >= 70 ? "#16a34a" : b.score >= 50 ? "#ea580c" : "#dc2626",
                }))}
              />
            </div>
          </div>

          <div className="ws-card mt-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f3f4f6] p-4">
              <h2 className="text-sm font-semibold">
                Находки: {audit.findings.length} · приоритет: критично → желательно
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <select className="ws-input w-auto py-1.5 text-[13px]" value={sev} onChange={(e) => setSev(e.target.value)}>
                  <option value="все">Все</option>
                  <option value="критично">Критично</option>
                  <option value="важно">Важно</option>
                  <option value="средне">Средне</option>
                  <option value="желательно">Желательно</option>
                </select>
                <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={pushToActions}>
                  В «Центр действий»
                </button>
              </div>
            </div>
            {savedNote && <p className="px-4 pt-3 text-[13px] text-[#0f766e]">{savedNote}</p>}
            <ul className="divide-y divide-[#f3f4f6]">
              {shown.map((f) => (
                <li key={f.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${SEV[f.severity].cls}`}>
                      {SEV[f.severity].label}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">{f.area}</span>
                  </div>
                  <div className="mt-1 font-medium">{f.title}</div>
                  {f.detail && <div className="text-[13px] text-[#6b7280]">{f.detail}</div>}
                  <div className="mt-1 text-[13px]">
                    <b>Чинить:</b> {f.fix}
                  </div>
                  <div className="text-[12px] text-[#9ca3af]">Поймём по: {f.watch}</div>
                </li>
              ))}
              {!shown.length && (
                <li className="p-6 text-center text-sm text-[#15803d]">По этому фильтру всё чисто.</li>
              )}
            </ul>
          </div>
          <p className="mt-3 text-[12px] text-[#9ca3af]">{audit.note}</p>
        </>
      )}
    </div>
  );
}
