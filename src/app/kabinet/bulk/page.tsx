"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { saveSession, type Session } from "@/lib/session";
import { loadStyles, STYLE_PRESETS } from "@/lib/workspace";

type Row = {
  key: string; h1?: string; city?: string; url?: string;
  state: "в очереди" | "работает" | "готово" | "ошибка"; articleId?: string; error?: string;
};
type Job = {
  id: string; provider: "deepseek" | "yandex" | "demo";
  status: "работает" | "готово" | "прерван" | "ошибка"; rows: Row[]; error?: string;
};

type Length = "короткая" | "средняя" | "длинная";
type Tone = string;

const SAMPLE = `ключ;заголовок;город;ссылка
остекление балкона цена;Остекление балконов в Москве;Москва;https://example.ru/balkony
отделка балкона под ключ;Отделка балкона под ключ;Москва;`;

function parseCsv(text: string): Row[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const sep = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ";" : ",";
  let start = 0;
  if (/^(ключ|key)/i.test(lines[0].split(sep)[0] || "")) start = 1;
  const rows: Row[] = [];
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (!cols[0]) continue;
    rows.push({ key: cols[0], h1: cols[1] || undefined, city: cols[2] || undefined, url: cols[3] || undefined, state: "в очереди" });
  }
  return rows.slice(0, 200);
}

export default function BulkPage() {
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [csv, setCsv] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Writesonic-уровень параметров
  const [length, setLength] = useState<Length>("средняя");
  const [tone, setTone] = useState<Tone>("деловой");
  const [styleId, setStyleId] = useState("");
  const [includeFaq, setIncludeFaq] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const styles = project ? loadStyles().filter((s) => s.projectId === project.id) : [];
  const selectedStyle = styles.find((s) => s.id === styleId);

  useEffect(() => {
    if (selectedStyle) {
      setTone(selectedStyle.tone || "деловой");
    }
  }, [styleId]);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  if (!ready || !session || !project) return null;

  const rows = parseCsv(csv);
  const left = plan.limits.articles - session.articlesUsed;

  function poll(id: string) {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(async () => {
      const res = await fetch(`/api/bulk?id=${encodeURIComponent(id)}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { job?: Job };
      if (!data.job) return;
      setJob(data.job);
      const me = await fetch("/api/auth/me", { cache: "no-store" });
      if (me.ok) {
        const d = (await me.json()) as { profile?: Partial<Session> };
        if (d.profile) {
          const next = { ...session, ...d.profile } as Session;
          saveSession(next);
          setSession(next);
        }
      }
      if (data.job.status !== "работает") {
        if (timer.current) clearInterval(timer.current);
      }
    }, 3000);
  }

  async function start() {
    setErr("");
    if (!rows.length) { setErr("Вставьте CSV или загрузите файл"); return; }
    setBusy(true);
    const res = await fetch("/api/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project!.id, rows,
        length, tone, includeFaq, includeTables,
        style: selectedStyle ? { tone: selectedStyle.tone, audience: selectedStyle.audience, rules: selectedStyle.rules } : undefined,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { job?: Job; error?: string };
    setBusy(false);
    if (!res.ok || !data.job) { setErr(data.error || "Ошибка"); return; }
    setJob(data.job);
    poll(data.job.id);
  }

  const done = job ? job.rows.filter((r) => r.state === "готово").length : 0;
  const failed = job ? job.rows.filter((r) => r.state === "ошибка").length : 0;
  const pct = job ? Math.round(((done + failed) / job.rows.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Пакетная генерация из CSV · {project.name}. Осталось: {left} статей.
        {job?.provider === "demo" && " · демо-режим."}
      </p>

      {/* Параметры генерации */}
      <div className="ws-card mt-3 space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-[13px] font-medium">Объём</p>
            <div className="mt-1 inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[12px]">
              {(["короткая", "средняя", "длинная"] as Length[]).map((l) => (
                <button
                  key={l}
                  className={`rounded-md px-3 py-1.5 ${length === l ? "bg-white font-medium shadow-sm" : "text-[#6b7280]"}`}
                  onClick={() => setLength(l)}
                >
                  {l === "короткая" ? "800" : l === "средняя" ? "1500" : "2500+"}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-[13px] font-medium">
            Стиль
            <select className="ws-input mt-1" value={styleId} onChange={(e) => setStyleId(e.target.value)}>
              <option value="">Без стиля</option>
              {styles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="block text-[13px] font-medium">
            Тон
            <select className="ws-input mt-1" value={tone} onChange={(e) => setTone(e.target.value)}>
              {["деловой", "живой", "нейтральный", "экспертный", "разговорный", "энергичный"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-lg border px-3 py-1 text-[12px] ${includeFaq ? "border-[#ea580c] bg-[#fff7ed] font-medium text-[#ea580c]" : "border-[#e5e7eb] text-[#6b7280]"}`}
            onClick={() => setIncludeFaq(!includeFaq)}
          >
            {includeFaq ? "✓ " : ""}FAQ
          </button>
          <button
            className={`rounded-lg border px-3 py-1 text-[12px] ${includeTables ? "border-[#ea580c] bg-[#fff7ed] font-medium text-[#ea580c]" : "border-[#e5e7eb] text-[#6b7280]"}`}
            onClick={() => setIncludeTables(!includeTables)}
          >
            {includeTables ? "✓ " : ""}Таблицы
          </button>
        </div>
      </div>

      {/* CSV ввод */}
      <div className="ws-card mt-3 space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-medium">CSV: ключ;заголовок;город;ссылка (до 200 строк)</p>
          <div className="flex gap-2">
            <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => setCsv(SAMPLE + (csv ? "\n" + csv : ""))}>
              Пример
            </button>
            <label className="ws-btn ws-btn-outline cursor-pointer py-1.5 text-[13px]">
              Загрузить CSV
              <input
                type="file" accept=".csv,.txt" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) setCsv(await file.text());
                }}
              />
            </label>
          </div>
        </div>
        <textarea
          className="ws-input min-h-[120px] font-mono text-[13px]"
          placeholder={SAMPLE}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          disabled={Boolean(job && job.status === "работает")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-[#6b7280]">Строк: {rows.length} / 200</span>
          {err && <span className="text-[13px] text-[#b91c1c]">{err}</span>}
          <button
            className="ws-btn ws-btn-primary ml-auto"
            onClick={() => void start()}
            disabled={busy || Boolean(job && job.status === "работает") || !rows.length}
          >
            {busy ? "Запускаем…" : job && job.status === "работает" ? "Идёт генерация…" : "Запустить генерацию"}
          </button>
        </div>
      </div>

      {/* Прогресс */}
      {job && (
        <div className="ws-card mt-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">
              {job.id} · {job.status === "работает" ? `${pct}%` : job.status}
              {job.status === "готово" && ` · готово ${done}, ошибок ${failed}`}
            </p>
            <div className="flex gap-2">
              {done > 0 && (
                <>
                  <a className="ws-btn ws-btn-outline py-1.5 text-[13px]" href={`/api/bulk/export?id=${job.id}`}>
                    Скачать всё (.md)
                  </a>
                  <Link className="ws-btn ws-btn-outline py-1.5 text-[13px]" href="/kabinet/kontent">В библиотеку</Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
            <div className="h-full rounded-full bg-[#111827] transition-all" style={{ width: `${pct}%` }} />
          </div>
          {job.status === "прерван" && (
            <p className="mt-2 text-[13px] text-[#b45309]">Задача прервана. Готовые статьи сохранились.</p>
          )}
          <ul className="mt-4 divide-y divide-[#f3f4f6] text-[13.5px]">
            {job.rows.map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 flex-1 truncate">
                  {r.h1 || r.key}
                  {r.city && <span className="ml-2 text-[11px] text-[#9ca3af]">{r.city}</span>}
                </span>
                <span className={r.state === "готово" ? "text-[#15803d]" : r.state === "ошибка" ? "text-[#b91c1c]" : "text-[#6b7280]"}>
                  {r.state === "ошибка" ? `ошибка: ${r.error || ""}` : r.state}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
