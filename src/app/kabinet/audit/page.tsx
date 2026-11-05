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
    commercial: Record<string, boolean>;
    geo: { llmsTxt: boolean; aiBotsAllowed: boolean };
    redirects: { httpToHttps: boolean; wwwResolve: boolean; note: string };
    notFound: { returns404: boolean; status: number };
  };
  note: string;
};

const SEV: Record<Finding["severity"], { label: string; cls: string }> = {
  critical: { label: "критично", cls: "bg-[#fef2f2] text-[#b91c1c]" },
  high: { label: "важно", cls: "bg-[#fff7ed] text-[#b45309]" },
  medium: { label: "средне", cls: "bg-[#f0fdf4] text-[#15803d]" },
  low: { label: "желательно", cls: "bg-[#f3f4f6] text-[#4b5563]" },
};

type AuditModule = "robots" | "sitemap" | "speed" | "onpage" | "commercial" | "geo" | "security" | "redirects";

const MODULE_LABELS: Record<AuditModule, string> = {
  robots: "robots.txt",
  sitemap: "Sitemap",
  speed: "Скорость",
  onpage: "On-page",
  commercial: "Коммерческие",
  geo: "GEO/AI",
  security: "Безопасность",
  redirects: "Редиректы",
};

export default function AuditPage() {
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sev, setSev] = useState("все");
  const [savedNote, setSavedNote] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [depth, setDepth] = useState<"быстрый" | "полный">("полный");
  const [modules, setModules] = useState<Set<AuditModule>>(new Set(Object.keys(MODULE_LABELS) as AuditModule[]));

  if (!ready || !session || !project) return null;

  function toggleModule(m: AuditModule) {
    setModules((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }

  async function run() {
    setBusy(true);
    setErr("");
    setSavedNote("");
    setAudit(null);
    const targetUrl = customUrl.trim() || project!.url;
    const res = await fetch("/api/kabinet/site-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: targetUrl, projectId: project!.id }),
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
    // фильтруем находки по выбранным модулям
    const filtered = data.audit.findings.filter((f) => {
      const area = f.area.toLowerCase();
      if (!modules.has("robots") && (area.includes("robots") || area.includes("индексац"))) return false;
      if (!modules.has("speed") && area.includes("скорость")) return false;
      if (!modules.has("commercial") && area.includes("коммерч")) return false;
      if (!modules.has("geo") && (area.includes("geo") || area.includes("ai"))) return false;
      if (!modules.has("security") && area.includes("безопасн")) return false;
      return true;
    });
    setAudit({ ...data.audit, findings: depth === "быстрый" ? filtered.filter((f) => f.severity !== "low") : filtered });
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
    } catch { /* */ }
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
    setSavedNote(`Добавлено: ${fresh.length} задач.`);
  }

  function exportReport() {
    if (!audit) return;
    const lines = [
      `# Аудит ${audit.site} — ${new Date().toISOString().slice(0, 10)}`,
      `Google: ${audit.googleScore}/100 | Яндекс: ${audit.yandexScore}/100 | ${(audit.durationMs / 1000).toFixed(1)}с`,
      "",
      "## Находки",
      ...audit.findings.map((f) => `### [${SEV[f.severity].label}] ${f.area}: ${f.title}\n${f.detail}\n**Чинить:** ${f.fix}\n**Проверка:** ${f.watch}\n`),
      "",
      "## Факты",
      `- robots: ${audit.facts.robots.found ? "есть" : "нет"}, Clean-param: ${audit.facts.robots.cleanParam ? "✓" : "—"}`,
      `- sitemap: ${audit.facts.sitemap.urls} URL`,
      `- TTFB: ${audit.facts.speed.avgTtfbMs}мс`,
      `- llms.txt: ${audit.facts.geo.llmsTxt ? "✓" : "—"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-${audit.site.replace(/https?:\/\//, "").replace(/\//g, "-")}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  }

  const shown = audit?.findings.filter((f) => sev === "все" || SEV[f.severity].label === sev) || [];
  const googleBlocks = audit?.blocks.filter((b) => b.engine === "google") || [];
  const yandexBlocks = audit?.blocks.filter((b) => b.engine === "yandex") || [];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Панель параметров */}
      <div className="ws-card space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="block text-[13px] font-medium">
            Адрес сайта (или конкретная страница)
            <input
              className="ws-input mt-1"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={project.url}
            />
          </label>
          <div>
            <p className="text-[13px] font-medium">Глубина</p>
            <div className="mt-1 inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px]">
              {(["быстрый", "полный"] as const).map((d) => (
                <button
                  key={d}
                  className={`rounded-md px-3 py-1.5 ${depth === d ? "bg-white font-medium shadow-sm" : "text-[#6b7280]"}`}
                  onClick={() => setDepth(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button className="ws-btn ws-btn-primary self-end" onClick={() => void run()} disabled={busy}>
            {busy ? "Обходим…" : "Запустить"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(MODULE_LABELS) as AuditModule[]).map((m) => (
            <button
              key={m}
              className={`rounded-lg border px-2.5 py-1 text-[12px] transition-all ${
                modules.has(m)
                  ? "border-[#ea580c] bg-[#fff7ed] font-medium text-[#ea580c]"
                  : "border-[#e5e7eb] text-[#6b7280]"
              }`}
              onClick={() => toggleModule(m)}
            >
              {modules.has(m) ? "✓ " : ""}{MODULE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {err && <p className="mt-3 rounded-lg bg-[#fef2f2] px-3 py-2 text-[13px] text-[#b91c1c]">{err}</p>}

      {audit && (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-[180px_180px_1fr]">
            <div className="ws-card flex flex-col items-center p-4">
              <Gauge value={audit.googleScore} label="Google" />
            </div>
            <div className="ws-card flex flex-col items-center p-4">
              <Gauge value={audit.yandexScore} label="Яндекс" />
            </div>
            <div className="ws-card p-4 text-[13px] leading-relaxed text-[#374151]">
              <p><b>{audit.site}</b> · {(audit.durationMs / 1000).toFixed(1)}с</p>
              <p className="mt-1">
                TTFB {audit.facts.speed.avgTtfbMs}мс · sitemap {audit.facts.sitemap.urls} URL ·
                H1 ×{audit.facts.homepage.h1Count} · schema: {audit.facts.homepage.schemaTypes.slice(0, 3).join(", ") || "нет"}
              </p>
              <p className="mt-1">
                Коммерческие: {[["тел", audit.facts.commercial.phone], ["ИНН", audit.facts.commercial.innOrgrn], ["адрес", audit.facts.commercial.address], ["цены", audit.facts.commercial.prices]].map(([l, v]) => `${v ? "✓" : "—"} ${l}`).join(" · ")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="ws-btn ws-btn-outline py-1.5 text-[12px]" onClick={pushToActions}>В Центр действий</button>
                <button className="ws-btn ws-btn-outline py-1.5 text-[12px]" onClick={exportReport}>Скачать .md</button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="ws-card p-4">
              <h2 className="text-sm font-semibold">Блоки Google-скора</h2>
              <HBars items={googleBlocks.map((b) => ({ label: `${b.block} (${b.weight})`, value: b.score, color: b.score >= 70 ? "#16a34a" : b.score >= 50 ? "#ea580c" : "#dc2626" }))} />
            </div>
            <div className="ws-card p-4">
              <h2 className="text-sm font-semibold">Блоки Яндекс-скора</h2>
              <HBars items={yandexBlocks.map((b) => ({ label: `${b.block} (${b.weight})`, value: b.score, color: b.score >= 70 ? "#16a34a" : b.score >= 50 ? "#ea580c" : "#dc2626" }))} />
            </div>
          </div>

          <div className="ws-card mt-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f3f4f6] p-4">
              <h2 className="text-sm font-semibold">Находки: {audit.findings.length}</h2>
              <select className="ws-input w-auto py-1.5 text-[13px]" value={sev} onChange={(e) => setSev(e.target.value)}>
                <option value="все">Все</option>
                <option value="критично">Критично</option>
                <option value="важно">Важно</option>
                <option value="средне">Средне</option>
                <option value="желательно">Желательно</option>
              </select>
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
                  <div className="text-[13px]"><b>Чинить:</b> {f.fix}</div>
                  <div className="text-[12px] text-[#9ca3af]">Поймём по: {f.watch}</div>
                </li>
              ))}
              {!shown.length && <li className="p-6 text-center text-sm text-[#15803d]">Чисто.</li>}
            </ul>
          </div>
          <p className="mt-3 text-[12px] text-[#9ca3af]">{audit.note}</p>
        </>
      )}
    </div>
  );
}
