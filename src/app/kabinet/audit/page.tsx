"use client";

import { useEffect, useState } from "react";
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

type DeepPage = { url: string; status: number; ms: number; words: number; h1: number; h2: number; humanHits: number; noindex: boolean; canonical: string; schema: string[] };
type Deep = {
  pages: DeepPage[];
  summary: { pages: number; avgWords: number; thinPages: number; withoutH1: number; noindexPages: number; humanHits: number; questionsPages: number; tablesPages: number; llms: { status: number; bytes: number } };
  schema: { found: string[]; missing: string[] };
  cannibalization: { a: string; b: string; overlap: number }[];
  actions: { priority: string; title: string; evidence: string; action: string; verify: string }[];
};

type Audit = {
  site: string;
  durationMs: number;
  googleScore: number | null;
  yandexScore: number | null;
  blocks: { engine: "google" | "yandex"; block: string; weight: number; score: number | null; measured: boolean; comment: string }[];
  coverage: { blocksTotal: number; blocksMeasured: number; weightMeasured: number; weightTotal: number };
  findings: Finding[];
  deep?: Deep;
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
  const [live, setLive] = useState<null | { stage: string; progress: number; pages: { url: string; status: number; words: number; humanHits: number }[]; startedAt: number }>(null);
  const [elapsed, setElapsed] = useState(0);
  const [err, setErr] = useState("");
  const [sev, setSev] = useState("все");
  const [savedNote, setSavedNote] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [depth, setDepth] = useState<"быстрый" | "полный">("полный");
  const [modules, setModules] = useState<Set<AuditModule>>(new Set(Object.keys(MODULE_LABELS) as AuditModule[]));

  useEffect(() => {
    if (!live) return;
    const startedAt = live.startedAt;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.startedAt]);

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
    setLive({ stage: "Проверяем robots.txt и sitemap", progress: 4, pages: [], startedAt: Date.now() });
    let data: { audit?: Audit; deep?: Audit["deep"]; error?: string; profile?: Partial<Session> } = {};

    async function legacy() {
      const res = await fetch("/api/kabinet/site-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: targetUrl, projectId: project!.id }),
      });
      return { res, data: (await res.json().catch(() => ({}))) as typeof data };
    }

    try {
      const res = await fetch("/api/kabinet/site-audit-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: targetUrl, projectId: project!.id, maxPages: depth === "полный" ? 12 : 5 }),
      });
      const isStream = res.ok && res.body && (res.headers.get("content-type") || "").includes("text/event-stream");
      if (!isStream) throw new Error("stream unavailable");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let sep: number;
        while ((sep = buffer.indexOf("\n\n")) >= 0) {
          const raw = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          const line = raw.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const evt = JSON.parse(line.slice(5).trim()) as {
            type: string; label?: string; progress?: number; audit?: Audit; deep?: Audit["deep"];
            url?: string; status?: number; words?: number; humanHits?: number;
            message?: string; profile?: Partial<Session>;
          };
          if (evt.type === "status") {
            setLive((p) => (p ? { ...p, stage: evt.label || p.stage, progress: evt.progress ?? p.progress } : p));
          } else if (evt.type === "page") {
            setLive((p) => (p ? { ...p, progress: evt.progress ?? p.progress, pages: [...p.pages, { url: evt.url || "", status: evt.status || 0, words: evt.words || 0, humanHits: evt.humanHits || 0 }].slice(-12) } : p));
          } else if (evt.type === "audit") {
            data.audit = evt.audit;
          } else if (evt.type === "done") {
            data.audit = evt.audit; data.deep = evt.deep; data.profile = evt.profile; finished = true;
          } else if (evt.type === "error") {
            throw new Error(evt.message || "Аудит прервался");
          }
        }
      }
      if (!finished) throw new Error("Поток завершился без результата");
    } catch {
      const { res, data: fallback } = await legacy();
      data = fallback;
      if (!res.ok) data.error = data.error || "Не удалось выполнить аудит";
    } finally {
      setLive(null);
    }

    setBusy(false);
    if (data.profile) {
      const next = { ...session, ...data.profile } as Session;
      saveSession(next);
      setSession(next);
    }
    if (data.error || !data.audit) {
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
    setAudit({ ...data.audit, deep: data.deep, findings: depth === "быстрый" ? filtered.filter((f) => f.severity !== "low") : filtered });
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
      `Google: ${audit.googleScore ?? "н/д"}/100 | Яндекс: ${audit.yandexScore ?? "н/д"}/100 | ${(audit.durationMs / 1000).toFixed(1)}с`,
      `Измерено блоков: ${audit.coverage.blocksMeasured} из ${audit.coverage.blocksTotal} (${Math.round((audit.coverage.weightMeasured / audit.coverage.weightTotal) * 100)}% веса)`,
      "",
      "## Находки",
      ...audit.findings.map((f) => `### [${SEV[f.severity].label}] ${f.area}: ${f.title}\n${f.detail}\n**Чинить:** ${f.fix}\n**Проверка:** ${f.watch}\n`),
      "",
      "## Полный аудит",
      ...(audit.deep ? [
        `Страниц: ${audit.deep.summary.pages}, средний объём ${audit.deep.summary.avgWords} слов, тонких ${audit.deep.summary.thinPages}, без H1 ${audit.deep.summary.withoutH1}, noindex ${audit.deep.summary.noindexPages}, ИИ-паттернов ${audit.deep.summary.humanHits}`,
        `Schema: есть ${audit.deep.schema.found.join(", ") || "—"}; нет ${audit.deep.schema.missing.join(", ") || "—"}`,
        ...audit.deep.cannibalization.map((c) => `Каннибализация: ${c.a} ↔ ${c.b} — ${c.overlap}%`),
        ...audit.deep.actions.map((a) => `- [${a.priority}] ${a.title}: ${a.evidence}. Действие: ${a.action}. Проверка: ${a.verify}`),
      ] : ["нет данных"]),
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

      {live && (
        <div className="ws-card mt-4 p-5">
          <div className="flex items-center gap-2">
            <span className="ws-dot" />
            <span className="text-[14px] font-semibold">Аудит идёт</span>
            <span className="ml-auto text-[12px] text-[#9ca3af]">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} · {live.progress}%</span>
          </div>
          <div className="ws-progress mt-3"><span style={{ width: `${live.progress}%` }} /></div>
          <p className="mt-2 text-[13px] text-[#6b7280]">{live.stage}</p>
          <div className="mt-3 space-y-1">
            {live.pages.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px]">
                <span className={p.status === 200 ? "text-[#15803d]" : "text-[#b91c1c]"}>{p.status}</span>
                <span className="flex-1 truncate text-[#374151]">{p.url.replace(/^https?:\/\/[^/]+/, "") || "/"}</span>
                <span className="text-[#9ca3af]">{p.words} слов</span>
                {p.humanHits > 0 && <span className="text-[#b45309]">проверка {p.humanHits}</span>}
              </div>
            ))}
            {live.pages.length === 0 && <div className="ws-skeleton"><span /><span style={{ width: "70%" }} /></div>}
          </div>
          <p className="mt-3 text-[11px] text-[#9ca3af]">Проверяем robots, sitemap, редиректы, страницы, schema и ИИ-паттерны. Каждая строка — реально загруженная страница.</p>
        </div>
      )}

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
              <p className="mt-1 text-[#6b7280]">
                Оценка по {audit.coverage.blocksMeasured} из {audit.coverage.blocksTotal} блоков ({Math.round((audit.coverage.weightMeasured / audit.coverage.weightTotal) * 100)}% веса). Остальное — «нет данных», а не ноль.
              </p>
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
                <a href="/kabinet/kanibalizatsiya" className="ws-btn ws-btn-outline py-1.5 text-[12px]">
                  Проверить каннибализацию →
                </a>
                <a href="/instrumenty/ochelovechivatel" className="ws-btn ws-btn-outline py-1.5 text-[12px]" target="_blank">
                  Очеловечиватель (публичный) ↗
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="ws-card p-4">
              <h2 className="text-sm font-semibold">Блоки Google-скора</h2>
              <HBars items={googleBlocks.filter((b) => b.score !== null).map((b) => ({ label: `${b.block} (${b.weight})`, value: b.score as number, color: (b.score as number) >= 70 ? "#16a34a" : (b.score as number) >= 50 ? "#ea580c" : "#dc2626" }))} />
              {googleBlocks.some((b) => b.score === null) && (
                <p className="mt-2 text-[12px] text-[#9ca3af]">
                  Нет данных: {googleBlocks.filter((b) => b.score === null).map((b) => b.block).join(", ")}
                </p>
              )}
            </div>
            <div className="ws-card p-4">
              <h2 className="text-sm font-semibold">Блоки Яндекс-скора</h2>
              <HBars items={yandexBlocks.filter((b) => b.score !== null).map((b) => ({ label: `${b.block} (${b.weight})`, value: b.score as number, color: (b.score as number) >= 70 ? "#16a34a" : (b.score as number) >= 50 ? "#ea580c" : "#dc2626" }))} />
              {yandexBlocks.some((b) => b.score === null) && (
                <p className="mt-2 text-[12px] text-[#9ca3af]">
                  Нет данных: {yandexBlocks.filter((b) => b.score === null).map((b) => b.block).join(", ")}
                </p>
              )}
            </div>
          </div>

          {audit.deep && (
            <div className="ws-card mt-4 space-y-4 p-4">
              <div>
                <h2 className="text-sm font-semibold">Полный аудит</h2>
                <p className="mt-1 text-[12px] text-[#6b7280]">
                  Проверено {audit.deep.summary.pages} стр. · средний объём {audit.deep.summary.avgWords} слов ·
                  тонких {audit.deep.summary.thinPages} · без H1 {audit.deep.summary.withoutH1} ·
                  noindex {audit.deep.summary.noindexPages} · ИИ-паттернов {audit.deep.summary.humanHits} ·
                  llms.txt {audit.deep.summary.llms.status} ({audit.deep.summary.llms.bytes} б)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead><tr className="text-left text-[#9ca3af]"><th>URL</th><th>Код</th><th>Слов</th><th>H1</th><th>noindex</th><th>Schema</th><th>Проверка</th></tr></thead>
                  <tbody>
                    {audit.deep.pages.map((p) => (
                      <tr key={p.url} className="border-t border-[#f3f4f6]">
                        <td className="max-w-[320px] truncate py-1" title={p.url}>{p.url.replace(audit.site, "") || "/"}</td>
                        <td>{p.status}</td><td>{p.words}</td><td>{p.h1}</td><td>{p.noindex ? "да" : "—"}</td>
                        <td>{p.schema.length || "нет"}</td><td>{p.humanHits || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div>
                  <p className="text-[12px] font-semibold">Schema</p>
                  <p className="text-[12px] text-[#6b7280]">Есть: {audit.deep.schema.found.join(", ") || "—"}</p>
                  <p className="text-[12px] text-[#b45309]">Нет: {audit.deep.schema.missing.join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold">Каннибализация</p>
                  {audit.deep.cannibalization.length === 0 ? (
                    <p className="text-[12px] text-[#6b7280]">По заголовкам не найдено</p>
                  ) : (
                    audit.deep.cannibalization.map((c, i) => (
                      <p key={i} className="text-[12px] text-[#b45309]">{c.a.replace(audit.site, "")} ↔ {c.b.replace(audit.site, "")} — {c.overlap}%</p>
                    ))
                  )}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-semibold">Что делать</p>
                <ul className="mt-1 space-y-1">
                  {audit.deep.actions.map((a, i) => (
                    <li key={i} className="text-[12px] text-[#374151]">
                      <b>{a.priority}</b> {a.title} — {a.evidence}. {a.action} <span className="text-[#9ca3af]">Проверка: {a.verify}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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
