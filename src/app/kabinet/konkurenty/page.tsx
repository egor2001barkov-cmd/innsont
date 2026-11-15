"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Profile = {
  site: string; ok: boolean; statusCode: number | null; https: boolean; ttfbMs: number;
  title: string; titleLen: number; descriptionLen: number; h1Count: number;
  schemaTypes: string[]; htmlKb: number; sitemapUrls: number; lastmodNewest: string;
  llmsTxt: boolean; aiBotsAllowed: boolean | null; phone: boolean; prices: boolean;
  blogPages: number; error?: string;
};

const LS_KEY = "insont.competitors.v1";

function loadCompetitors(projectId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Record<string, string[]>;
    return all[projectId] || [];
  } catch { return []; }
}
function saveCompetitors(projectId: string, list: string[]) {
  const all = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Record<string, string[]>;
  all[projectId] = list;
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

type MetricKey = "speed" | "https" | "title" | "desc" | "h1" | "schema" | "sitemap" | "blog" | "lastmod" | "llms" | "aiBots" | "phone" | "prices" | "html";

const METRICS: { key: MetricKey; label: string; hint?: string; better: "min" | "max" | "bool" | null; value: (p: Profile) => string; num?: (p: Profile) => number; bool?: (p: Profile) => boolean | null }[] = [
  { key: "speed", label: "Скорость ответа", hint: "TTFB в мс, меньше = лучше", better: "min", value: (p) => (p.ok ? `${p.ttfbMs} мс` : "—"), num: (p) => (p.ok ? p.ttfbMs : 99999) },
  { key: "https", label: "HTTPS", better: "bool", value: (p) => (p.https ? "✓" : "—"), bool: (p) => p.https },
  { key: "title", label: "Длина Title", hint: "50–70 симв.", better: null, value: (p) => p.titleLen ? `${p.titleLen} симв.` : "—" },
  { key: "desc", label: "Длина Description", hint: "140–160 симв.", better: null, value: (p) => p.descriptionLen ? `${p.descriptionLen} симв.` : "—" },
  { key: "h1", label: "H1 на главной", better: null, value: (p) => `×${p.h1Count}` },
  { key: "schema", label: "Schema.org", hint: "количество типов", better: "max", value: (p) => p.schemaTypes.length ? `${p.schemaTypes.length}` : "0", num: (p) => p.schemaTypes.length },
  { key: "sitemap", label: "Страниц в sitemap", better: "max", value: (p) => p.sitemapUrls ? p.sitemapUrls.toLocaleString("ru-RU") : "0", num: (p) => p.sitemapUrls },
  { key: "blog", label: "Статей в блоге", better: "max", value: (p) => p.blogPages ? p.blogPages.toLocaleString("ru-RU") : "0", num: (p) => p.blogPages },
  { key: "lastmod", label: "Sitemap обновлён", better: null, value: (p) => p.lastmodNewest || "—" },
  { key: "llms", label: "llms.txt", hint: "карта для ИИ", better: "bool", value: (p) => p.llmsTxt ? "✓" : "—", bool: (p) => p.llmsTxt },
  { key: "aiBots", label: "AI-боты открыты", hint: "GPTBot, ClaudeBot", better: "bool", value: (p) => p.aiBotsAllowed === true ? "✓" : p.aiBotsAllowed === false ? "✗" : "?", bool: (p) => p.aiBotsAllowed },
  { key: "phone", label: "Телефон на сайте", better: "bool", value: (p) => p.phone ? "✓" : "—", bool: (p) => p.phone },
  { key: "prices", label: "Цены на главной", better: "bool", value: (p) => p.prices ? "✓" : "—", bool: (p) => p.prices },
  { key: "html", label: "Вес HTML", hint: "КБ, меньше = лучше", better: "min", value: (p) => `${p.htmlKb} КБ`, num: (p) => p.htmlKb || 99999 },
];

export default function CompetitorsPage() {
  const { project, ready } = useWorkspace();
  const [raw, setRaw] = useState("");
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState<Set<MetricKey>>(new Set(METRICS.map((m) => m.key)));
  const [showHints, setShowHints] = useState(true);
  const [localRaw, setLocalRaw] = useState("");
  const [localBusy, setLocalBusy] = useState(false);
  const [localErr, setLocalErr] = useState("");
  const [localReport, setLocalReport] = useState<null | {
    count: number; averageRating: number; medianReviews: number; withWebsite: number;
    top: { name: string; rating: number; reviews: number; score: number }[];
    vulnerable: { name: string; rating: number; reviews: number }[];
    recommendations: string[];
  }>(null);

  useEffect(() => {
    if (project) setRaw([project.url, ...loadCompetitors(project.id)].join("\n"));
  }, [project?.id]);

  if (!ready || !project) return null;

  const rows = raw.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean).slice(0, 6);

  function toggleMetric(k: MetricKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  async function run() {
    setBusy(true); setErr(""); setProfiles(null);
    const res = await fetch("/api/kabinet/competitors", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sites: rows }),
    });
    const data = (await res.json().catch(() => ({}))) as { profiles?: Profile[]; error?: string };
    setBusy(false);
    if (!res.ok || !data.profiles) { setErr(data.error || "Ошибка"); return; }
    setProfiles(data.profiles);
    saveCompetitors(project!.id, rows.slice(1).filter((s) => s !== project!.url));
  }

  async function runLocal() {
    const businesses = localRaw.split("\n").map((line) => {
      const [name, rating, reviews, website, category] = line.split(/[;|\t]/).map((x) => (x || "").trim());
      return { name, rating: Number(rating) || 0, reviews: Number(reviews) || 0, website, category };
    }).filter((b) => b.name);
    if (!businesses.length) { setLocalErr("Заполните хотя бы одну строку: Название; 4.8; 120; сайт"); return; }
    setLocalBusy(true); setLocalErr("");
    const res = await fetch("/api/kabinet/competitors/local", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businesses }),
    });
    const data = (await res.json().catch(() => ({}))) as { report?: typeof localReport; error?: string };
    setLocalBusy(false);
    if (!res.ok || !data.report) { setLocalErr(data.error || "Не удалось разобрать карточки"); return; }
    setLocalReport(data.report);
  }

  function exportCsv() {
    if (!profiles) return;
    const activeMetrics = METRICS.filter((m) => selected.has(m.key));
    const header = ["Метрика", ...profiles.map((p) => p.site.replace(/^https?:\/\//, ""))];
    const body = activeMetrics.map((m) => [m.label, ...profiles.map((p) => m.value(p))]);
    const csv = [header, ...body].map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `competitors-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const activeMetrics = METRICS.filter((m) => selected.has(m.key));

  function bestSet(def: typeof METRICS[0]): Set<string> {
    const set = new Set<string>();
    if (!profiles || def.better === null) return set;
    if (def.better === "bool" && def.bool) {
      for (const p of profiles) if (def.bool(p) === true) set.add(p.site);
      return set;
    }
    if (def.num) {
      const vals = profiles.filter((p) => p.ok).map(def.num);
      if (!vals.length) return set;
      const best = def.better === "min" ? Math.min(...vals) : Math.max(...vals);
      for (const p of profiles) if (p.ok && def.num!(p) === best) set.add(p.site);
    }
    return set;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-[#6b7280]">
          Сравните свой сайт с конкурентами по {METRICS.length} метрикам. Выберите какие показывать.
        </p>
        <div className="flex gap-2">
          <button className="ws-btn ws-btn-outline text-[13px]" onClick={() => setShowHints(!showHints)}>
            {showHints ? "Скрыть подсказки" : "Показать подсказки"}
          </button>
          {profiles && <button className="ws-btn ws-btn-outline text-[13px]" onClick={exportCsv}>Экспорт .csv</button>}
          <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy || rows.length < 2}>
            {busy ? "Замеряем…" : "Сравнить"}
          </button>
        </div>
      </div>

      {/* Выбор метрик */}
      <div className="ws-card mt-3 flex flex-wrap gap-1.5 p-3">
        {METRICS.map((m) => (
          <button
            key={m.key}
            className={`rounded-lg border px-2.5 py-1 text-[12px] transition-all ${
              selected.has(m.key) ? "border-[#ea580c] bg-[#fff7ed] font-medium text-[#ea580c]" : "border-[#e5e7eb] text-[#6b7280]"
            }`}
            onClick={() => toggleMetric(m.key)}
          >
            {selected.has(m.key) ? "✓ " : ""}{m.label}
          </button>
        ))}
      </div>

      {/* Ввод сайтов */}
      <div className="ws-card mt-3 p-4">
        <textarea
          className="ws-input min-h-[70px] font-mono text-[13px]"
          placeholder={"https://ваш-сайт.ru\nhttps://конкурент1.ru\nhttps://конкурент2.ru"}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          disabled={busy}
        />
        <p className="mt-1 text-[13px] text-[#6b7280]">Сайтов: {rows.length} из 6</p>
      </div>

      {err && <p className="mt-3 text-[13px] text-[#b91c1c]">{err}</p>}

      <div className="ws-card mt-6 p-5">
        <h2 className="text-[16px] font-semibold">Локальные конкуренты</h2>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          Вставьте карточки из выгрузки Google Maps или 2ГИС: по строке на конкурента, поля через точку с запятой.
        </p>
        <textarea
          className="ws-input mt-3 min-h-[110px]"
          placeholder={"Клиника на Ленина; 4.8; 120; https://klinika.ru\nСтоматология Плюс; 3.9; 80; https://plus.ru"}
          value={localRaw}
          onChange={(e) => setLocalRaw(e.target.value)}
        />
        <div className="mt-2 flex items-center gap-3">
          <button className="ws-btn ws-btn-primary text-[13px]" onClick={() => void runLocal()} disabled={localBusy}>
            {localBusy ? "Считаем…" : "Разобрать рынок →"}
          </button>
          {localErr && <span className="text-[12px] text-[#b91c1c]">{localErr}</span>}
        </div>

        {localReport && (
          <div className="mt-4 space-y-3 text-[13px]">
            <p className="text-[#374151]">
              Конкурентов: <b>{localReport.count}</b> · средний рейтинг <b>{localReport.averageRating}</b> ·
              медиана отзывов <b>{localReport.medianReviews}</b> · с сайтом <b>{localReport.withWebsite}</b>
            </p>
            <table className="ws-table">
              <thead><tr><th>Конкурент</th><th>Рейтинг</th><th>Отзывы</th><th>Видимость</th></tr></thead>
              <tbody>
                {localReport.top.map((b) => (
                  <tr key={b.name}><td>{b.name}</td><td>{b.rating}</td><td>{b.reviews}</td><td>{b.score}</td></tr>
                ))}
              </tbody>
            </table>
            {localReport.vulnerable.length > 0 && (
              <p className="text-[#b45309]">Уязвимые: {localReport.vulnerable.map((v) => `${v.name} (${v.rating}★, ${v.reviews})`).join(", ")}</p>
            )}
            <ul className="list-disc space-y-1 pl-5 text-[#374151]">
              {localReport.recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>

      {profiles && (
        <div className="ws-card mt-4 min-w-0 overflow-x-auto">
          <table className="ws-table">
            <thead>
              <tr>
                <th className="min-w-36">Метрика</th>
                {profiles.map((p, i) => (
                  <th key={p.site} className={i === 0 ? "text-[#ea580c]" : ""}>
                    {p.site.replace(/^https?:\/\//, "").split("/")[0]}
                    {i === 0 ? " (вы)" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeMetrics.map((def) => {
                const winners = bestSet(def);
                return (
                  <tr key={def.key}>
                    <td className="font-medium">
                      {def.label}
                      {showHints && def.hint && <span className="block text-[11px] font-normal text-[#9ca3af]">{def.hint}</span>}
                    </td>
                    {profiles.map((p) => (
                      <td key={p.site} className={winners.has(p.site) ? "bg-[#f0fdf4] font-medium text-[#15803d]" : ""}>
                        {def.value(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-[#f3f4f6] p-3 text-[12px] text-[#9ca3af]">
            Зелёным — лучшее значение. Замеры живые на момент сравнения.
          </p>
        </div>
      )}
    </div>
  );
}
