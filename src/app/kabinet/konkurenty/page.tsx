"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Profile = {
  site: string;
  ok: boolean;
  statusCode: number | null;
  https: boolean;
  ttfbMs: number;
  title: string;
  titleLen: number;
  descriptionLen: number;
  h1Count: number;
  schemaTypes: string[];
  htmlKb: number;
  sitemapUrls: number;
  lastmodNewest: string;
  llmsTxt: boolean;
  aiBotsAllowed: boolean | null;
  phone: boolean;
  prices: boolean;
  blogPages: number;
  error?: string;
};

const LS_KEY = "insont.competitors.v1";

function loadCompetitors(projectId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Record<string, string[]>;
    return all[projectId] || [];
  } catch {
    return [];
  }
}

function saveCompetitors(projectId: string, list: string[]) {
  const all = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Record<string, string[]>;
  all[projectId] = list;
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

export default function CompetitorsPage() {
  const { project, ready } = useWorkspace();
  const [raw, setRaw] = useState("");
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (project) setRaw([project.url, ...loadCompetitors(project.id)].join("\n"));
  }, [project?.id]);

  if (!ready || !project) return null;

  const rows = raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  async function run() {
    setBusy(true);
    setErr("");
    setProfiles(null);
    const res = await fetch("/api/kabinet/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sites: rows }),
    });
    const data = (await res.json().catch(() => ({}))) as { profiles?: Profile[]; error?: string };
    setBusy(false);
    if (!res.ok || !data.profiles) {
      setErr(data.error || "Не удалось сравнить");
      return;
    }
    setProfiles(data.profiles);
    // запоминаем конкурентов (первый сайт — свой проект)
    saveCompetitors(project!.id, rows.slice(1).filter((s) => s !== project!.url));
  }

  type RowDef = {
    label: string;
    hint?: string;
    value: (p: Profile) => string;
    better: "min" | "max" | "bool" | null; // что считается лучшим
    num?: (p: Profile) => number;
    bool?: (p: Profile) => boolean | null;
  };

  const rowDefs: RowDef[] = [
    { label: "Отвечает", value: (p) => (p.ok ? `200 · ${p.ttfbMs} мс` : `ошибка${p.statusCode ? " " + p.statusCode : ""}`), better: "min", num: (p) => (p.ok ? p.ttfbMs : 99999) },
    { label: "HTTPS", value: (p) => (p.https ? "да" : "нет"), better: "bool", bool: (p) => p.https },
    { label: "Title", hint: "50–70 символов хорошо", value: (p) => (p.titleLen ? `${p.titleLen} симв.` : "нет"), better: null },
    { label: "Description", hint: "140–160 символов хорошо", value: (p) => (p.descriptionLen ? `${p.descriptionLen} симв.` : "нет"), better: null },
    { label: "H1 на главной", value: (p) => `×${p.h1Count}`, better: null },
    { label: "Schema.org", hint: "сколько типов разметки", value: (p) => (p.schemaTypes.length ? `${p.schemaTypes.length}: ${p.schemaTypes.slice(0, 3).join(", ")}` : "нет"), better: "max", num: (p) => p.schemaTypes.length },
    { label: "Страниц в sitemap", value: (p) => (p.sitemapUrls ? p.sitemapUrls.toLocaleString("ru-RU") : "нет"), better: "max", num: (p) => p.sitemapUrls },
    { label: "Из них блог/статьи", value: (p) => (p.blogPages ? p.blogPages.toLocaleString("ru-RU") : "0"), better: "max", num: (p) => p.blogPages },
    { label: "Sitemap обновлён", hint: "последний lastmod", value: (p) => p.lastmodNewest || "—", better: null },
    { label: "llms.txt", hint: "карта сайта для ИИ-моделей", value: (p) => (p.llmsTxt ? "есть" : "нет"), better: "bool", bool: (p) => p.llmsTxt },
    { label: "AI-боты в robots", hint: "GPTBot, ClaudeBot, PerplexityBot", value: (p) => (p.aiBotsAllowed === null ? "неясно" : p.aiBotsAllowed ? "открыты" : "закрыты"), better: "bool", bool: (p) => p.aiBotsAllowed },
    { label: "Телефон на сайте", value: (p) => (p.phone ? "есть" : "нет"), better: "bool", bool: (p) => p.phone },
    { label: "Цены на главной", value: (p) => (p.prices ? "есть" : "нет"), better: "bool", bool: (p) => p.prices },
    { label: "HTML главной", hint: "меньше — быстрее", value: (p) => `${p.htmlKb} КБ`, better: "min", num: (p) => p.htmlKb || 99999 },
  ];

  function best(def: RowDef): Set<string> {
    const set = new Set<string>();
    if (!profiles || def.better === null) return set;
    if (def.better === "bool" && def.bool) {
      for (const p of profiles) if (def.bool(p) === true) set.add(p.site);
      return set;
    }
    if (def.num) {
      const values = profiles.filter((p) => p.ok).map(def.num);
      if (!values.length) return set;
      const bestVal = def.better === "min" ? Math.min(...values) : Math.max(...values);
      for (const p of profiles) if (p.ok && def.num!(p) === bestVal) set.add(p.site);
    }
    return set;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#6b7280]">
        Свой сайт и до 5 конкурентов — сравнение реальными замерами: скорость, мета, разметка,
        покрытие sitemap, готовность к ИИ-поиску и коммерческие факторы. Первый адрес — ваш сайт.
      </p>

      <div className="ws-card mt-4 space-y-3 p-5">
        <textarea
          className="ws-input min-h-24 font-mono text-[13px]"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={"https://vash-site.ru\nhttps://konkurent1.ru\nhttps://konkurent2.ru"}
        />
        <p className="text-[13px] text-[#6b7280]">Сайтов в списке: {rows.length} из 6</p>
        {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
        <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy || rows.length < 2}>
          {busy ? "Замеряем сайты… (до минуты)" : "Сравнить сайты"}
        </button>
      </div>

      {profiles && (
        <div className="ws-card mt-4 min-w-0 overflow-x-auto">
          <table className="ws-table">
            <thead>
              <tr>
                <th className="min-w-40">Метрика</th>
                {profiles.map((p, i) => (
                  <th key={p.site} className={i === 0 ? "text-[#ea580c]" : ""}>
                    {p.site.replace(/^https?:\/\//, "")}
                    {i === 0 ? " (вы)" : ""}
                    {p.error && <span className="block text-[11px] font-normal text-[#b91c1c]">{p.error}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowDefs.map((def) => {
                const winners = best(def);
                return (
                  <tr key={def.label}>
                    <td className="font-medium">
                      {def.label}
                      {def.hint && <span className="block text-[11px] font-normal text-[#9ca3af]">{def.hint}</span>}
                    </td>
                    {profiles.map((p) => (
                      <td
                        key={p.site}
                        className={winners.has(p.site) ? "bg-[#f0fdf4] font-medium text-[#15803d]" : ""}
                      >
                        {def.value(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-[#f3f4f6] p-3 text-[12px] text-[#9ca3af]">
            Зелёным — лучшее значение в строке. Все цифры — живые замеры на момент сравнения.
          </p>
        </div>
      )}
    </div>
  );
}
