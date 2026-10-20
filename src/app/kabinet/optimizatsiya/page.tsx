"use client";

import { useState } from "react";
import { Gauge } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadActions, saveActions, type ActionItem } from "@/lib/workspace";

type Finding = {
  id: string;
  severity: "критично" | "важно" | "желательно";
  area: string;
  title: string;
  detail: string;
  fix: string;
};

type Audit = {
  finalUrl: string;
  statusCode: number;
  score: number;
  ttfbMs: number;
  findings: Finding[];
  facts: {
    title: string;
    titleLen: number;
    description: string;
    descriptionLen: number;
    h1: string[];
    h2: string[];
    schemaTypes: string[];
    images: { total: number; noAlt: number };
    textChars: number;
    internalLinks: number;
  };
  note: string;
};

const SEV_STYLE: Record<Finding["severity"], string> = {
  критично: "bg-[#fef2f2] text-[#b91c1c]",
  важно: "bg-[#fff7ed] text-[#b45309]",
  желательно: "bg-[#f0fdf4] text-[#15803d]",
};

export default function OptimizePage() {
  const { project, ready } = useWorkspace();
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [savedNote, setSavedNote] = useState("");

  if (!ready || !project) return null;
  const site = url || project.url;

  async function run() {
    setBusy(true);
    setErr("");
    setSavedNote("");
    setAudit(null);
    const res = await fetch("/api/kabinet/page-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: site, key }),
    });
    const data = (await res.json().catch(() => ({}))) as { audit?: Audit; error?: string };
    setBusy(false);
    if (!res.ok || !data.audit) {
      setErr(data.error || "Не удалось проверить страницу");
      return;
    }
    setAudit(data.audit);
  }

  function pushToActions() {
    if (!audit) return;
    const top = audit.findings.filter((f) => f.severity !== "желательно").slice(0, 5);
    if (!top.length) {
      setSavedNote("Критичных проблем нет — добавлять нечего.");
      return;
    }
    const items: ActionItem[] = loadActions();
    const fresh: ActionItem[] = top.map((f) => ({
      id: `audit-${Date.now()}-${f.id}`,
      projectId: project!.id,
      cat: "Техника",
      title: `[${f.area}] ${f.title}`,
      impact: f.severity === "критично" ? "Высокий" : "Средний",
      status: "Открыто",
      detail: `${f.detail} Как чинить: ${f.fix}`,
    }));
    saveActions([...fresh, ...items]);
    setSavedNote(`Добавлено в «Центр действий»: ${fresh.length} задач.`);
  }

  const f = audit?.facts;

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_280px]">
      <div>
        <p className="text-sm text-[#6b7280]">
          SEO-проверка страницы {project.name}: мета, структура, индексация, разметка, скорость —
          по живому HTML.
        </p>
        <div className="ws-card mt-4 space-y-3 p-5">
          <input
            className="ws-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Адрес страницы, например ${project.url}/usluga`}
          />
          <input
            className="ws-input"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Ключевой запрос (необязательно): остекление балкона цена"
          />
          {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
          <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy}>
            {busy ? "Проверяем страницу…" : "Проверить"}
          </button>
        </div>

        {audit && f && (
          <>
            <div className="ws-card mt-4 p-5 text-[13px] leading-relaxed text-[#374151]">
              <p className="font-semibold text-[#111827]">{audit.finalUrl}</p>
              <p>
                Ответ {audit.statusCode} · {audit.ttfbMs} мс · title {f.titleLen} симв. · description{" "}
                {f.descriptionLen} симв. · H1 ×{f.h1.length} · H2 ×{f.h2.length} · текст ~
                {Math.round(f.textChars / 1000)} тыс. знаков · картинок {f.images.total} (без alt:{" "}
                {f.images.noAlt}) · schema: {f.schemaTypes.join(", ") || "нет"}
              </p>
            </div>
            <ul className="ws-card mt-4 divide-y divide-[#f3f4f6]">
              {audit.findings.map((finding) => (
                <li key={finding.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${SEV_STYLE[finding.severity]}`}>
                      {finding.severity}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">
                      {finding.area}
                    </span>
                  </div>
                  <div className="mt-1 font-medium">{finding.title}</div>
                  {finding.detail && <div className="mt-0.5 text-[13px] text-[#6b7280]">{finding.detail}</div>}
                  <div className="mt-1 text-[13px] text-[#374151]">
                    <b>Как чинить:</b> {finding.fix}
                  </div>
                </li>
              ))}
              {!audit.findings.length && (
                <li className="p-6 text-center text-sm text-[#15803d]">
                  Критичных проблем не найдено — страница в порядке.
                </li>
              )}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button className="ws-btn ws-btn-outline" onClick={pushToActions}>
                Добавить проблемы в «Центр действий»
              </button>
              {savedNote && <span className="text-[13px] text-[#0f766e]">{savedNote}</span>}
            </div>
            <p className="mt-3 text-[12px] text-[#9ca3af]">{audit.note}</p>
          </>
        )}
      </div>
      <div className="ws-card h-fit p-5 text-center">
        <Gauge value={audit ? audit.score : 0} label={audit ? "Скор страницы" : "Запустите проверку"} />
      </div>
    </div>
  );
}
