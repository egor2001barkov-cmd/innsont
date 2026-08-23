"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Gauge, HBars } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { auditFor } from "@/lib/workspace";
import type { SiteScan } from "@/lib/site-scan";

function AuditInner() {
  const params = useSearchParams();
  const first = params.get("first") === "1";
  const { project, plan, ready } = useWorkspace();
  const [run, setRun] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sev, setSev] = useState("все");
  const [fixed, setFixed] = useState<string[]>([]);
  const [scan, setScan] = useState<SiteScan | null>(null);

  useEffect(() => {
    if (first && project && !run && !busy) void rescan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first, project?.id]);

  if (!ready || !project) return null;
  const data = auditFor(project);
  const issues = data.issues.filter((i) => (sev === "все" ? true : i.severity === sev) && !fixed.includes(i.id));
  const errors = data.issues.filter((i) => i.severity === "ошибка" && !fixed.includes(i.id)).length;
  const warns = data.issues.filter((i) => i.severity === "предупреждение" && !fixed.includes(i.id)).length;

  async function rescan() {
    if (!project) return;
    setBusy(true);
    try {
      const r = await fetch("/api/kabinet/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: project.url,
          sitemapUrl: project.sitemapUrl,
          robotsUrl: project.robotsUrl,
          mainPages: project.mainPages,
          blogUrl: project.blogUrl,
          casesUrl: project.casesUrl,
          formsUrl: project.formsUrl,
        }),
      });
      if (r.ok) setScan((await r.json()) as SiteScan);
    } catch {
      /* offline snapshot still shown */
    }
    setBusy(false);
    setRun(true);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Снимок {project.url}. Оценка считается по этому сайту, карте, robots и страницам из анкеты. Лимит
          аудитов «{plan.name}»: {plan.limits.audits} / мес.
        </p>
        <button className="ws-btn ws-btn-primary" onClick={rescan} disabled={busy}>
          {busy ? "Сканируем…" : "Запустить аудит"}
        </button>
      </div>

      {busy && (
        <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-[13px] text-[#9a3412]">
          Обходим сайт, robots.txt, карту и указанные страницы…
        </p>
      )}
      {run && (
        <p className="mt-3 rounded-lg bg-[#dcfce7] px-3 py-2 text-[13px] text-[#166534]">
          Аудит {project.name} готов. При смене проекта цифры пересчитаются.
        </p>
      )}
      {scan && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Probe label="Главная" ok={scan.home.ok} text={scan.home.title || (scan.home.status != null ? String(scan.home.status) : "нет ответа")} />
          <Probe label="robots.txt" ok={scan.robots.ok} text={scan.robots.ok ? "открыт" : "не найден"} />
          <Probe
            label="Карта сайта"
            ok={scan.sitemap.ok}
            text={scan.sitemap.ok ? `${scan.sitemap.urls} URL` : "не найдена"}
          />
          <Probe
            label="Страницы из анкеты"
            ok={scan.pages.some((p) => p.ok)}
            text={`${scan.pages.filter((p) => p.ok).length} из ${scan.pages.length || 0} ответили`}
          />
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="ws-card flex flex-col items-center p-5">
          <Gauge value={data.score} label="Здоровье сайта" />
          <div className="mt-2 grid w-full grid-cols-3 gap-2 text-center text-[12px]">
            <div>
              <div className="font-bold text-[#b91c1c]">{errors}</div>
              ошибки
            </div>
            <div>
              <div className="font-bold text-[#c2410c]">{warns}</div>
              предупр.
            </div>
            <div>
              <div className="font-bold">{data.issues.length - errors - warns - fixed.length}</div>
              советы
            </div>
          </div>
        </div>
        <div className="ws-card p-5">
          <h2 className="text-sm font-semibold">Инфографика разделов</h2>
          <p className="mb-4 text-[12px] text-[#9ca3af]">Оценка 0–100 по контуру сайта</p>
          <HBars
            items={data.health.map((h) => ({
              label: h.label,
              value: h.value,
              color: h.value >= 70 ? "#16a34a" : h.value >= 50 ? "#ea580c" : "#dc2626",
            }))}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="ws-card p-5">
          <h2 className="text-sm font-semibold">Покрытие сайта</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Cover n={data.crawled} l="прошли краулер" />
            <Cover n={data.indexed} l="в индексе" />
            <Cover n={data.blocked} l="закрыты" bad />
          </div>
          <div className="mt-5 space-y-2">
            {data.structure.map((s) => (
              <div key={s.path} className="flex items-center gap-3 text-[13px]">
                <code className="w-28 truncate text-[#6b7280]">{s.path}</code>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f3f4f6]">
                  <div className="h-full rounded-full bg-[#ea580c]" style={{ width: `${s.score}%` }} />
                </div>
                <span className="w-16 text-right tabular-nums text-[#6b7280]">{s.pages} стр.</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ws-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#f3f4f6] p-4">
            <h2 className="text-sm font-semibold">Замечания</h2>
            <select className="ws-input w-auto py-1.5 text-[13px]" value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="все">Все</option>
              <option value="ошибка">Ошибки</option>
              <option value="предупреждение">Предупреждения</option>
              <option value="совет">Советы</option>
            </select>
          </div>
          <ul className="divide-y divide-[#f3f4f6]">
            {issues.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        i.severity === "ошибка"
                          ? "bg-[#fee2e2] text-[#991b1b]"
                          : i.severity === "предупреждение"
                            ? "bg-[#ffedd5] text-[#9a3412]"
                            : "bg-[#f3f4f6] text-[#4b5563]"
                      }`}
                    >
                      {i.severity}
                    </span>
                    <span className="text-[11px] text-[#9ca3af]">{i.area}</span>
                  </div>
                  <div className="mt-1 text-[13.5px] font-medium">{i.title}</div>
                  <div className="text-[12px] text-[#6b7280]">{i.pages} страниц</div>
                </div>
                {i.fixable && (
                  <button
                    className="ws-btn ws-btn-outline py-1.5 text-[12px]"
                    onClick={() => setFixed((f) => [...f, i.id])}
                  >
                    Исправить
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Probe({ label, ok, text }: { label: string; ok: boolean; text: string }) {
  return (
    <div className="ws-card p-3">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#6b7280]">
        <span className={`h-2 w-2 rounded-full ${ok ? "bg-[#16a34a]" : "bg-[#d1d5db]"}`} />
        {label}
      </div>
      <div className="mt-1 truncate text-[13px] font-medium">{text}</div>
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense>
      <AuditInner />
    </Suspense>
  );
}

function Cover({ n, l, bad }: { n: number; l: string; bad?: boolean }) {
  return (
    <div>
      <div className={`text-xl font-bold ${bad ? "text-[#b91c1c]" : ""}`}>{n.toLocaleString("ru-RU")}</div>
      <div className="text-[12px] text-[#6b7280]">{l}</div>
    </div>
  );
}
