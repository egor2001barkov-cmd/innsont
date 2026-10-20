"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Counter = { id: number; name: string; site: string };
type Host = { host_id: string; host: string; verified: boolean };

type Status = {
  metrika: { connected: boolean; login?: string; counters?: Counter[] };
  webmaster: { connected: boolean; login?: string };
  webmasterHosts: Host[];
  bindings: { counterByProject: Record<string, number>; hostByProject: Record<string, string> };
};

type Stats = {
  metrikaConfigured: boolean;
  webmasterConfigured: boolean;
  counterId: number | null;
  metrika?: {
    totals?: { visits: number; users: number; bounceRate: number; avgDurationSec: number };
    sources?: { name: string; visits: number }[];
    topPages?: { path: string; visits: number }[];
    errors: string[];
  };
  webmaster?: { indexStats?: { date: string; indexed: number; crawled: number }[]; errors: string[] };
};

export default function IntegrationsPage() {
  const { project, ready } = useWorkspace();
  const [status, setStatus] = useState<Status | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [metrikaToken, setMetrikaToken] = useState("");
  const [wmToken, setWmToken] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  const reload = useCallback(() => {
    if (!project) return;
    void fetch("/api/integrations", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => undefined);
    void fetch(`/api/integrations/stats?projectId=${encodeURIComponent(project.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, [project]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (!ready || !project) return null;

  async function call(body: unknown, label: string) {
    setErr("");
    setBusy(label);
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy("");
    if (!res.ok) {
      setErr(data.error || "Не удалось подключить");
      return false;
    }
    reload();
    return true;
  }

  const boundCounter = status?.bindings.counterByProject[project.id];
  const boundHost = status?.bindings.hostByProject[project.id];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <p className="text-sm text-[#6b7280]">
        Подключите Яндекс.Метрику и Вебмастер проекта «{project.name}»: трафик, источники и индексация —
        прямо в кабинете. Токены хранятся на сервере и не показываются в браузере.
      </p>
      {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}

      {/* Метрика */}
      <div className="ws-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Яндекс.Метрика</h2>
          <span className={`text-[13px] ${status?.metrika.connected ? "text-[#15803d]" : "text-[#9ca3af]"}`}>
            {status?.metrika.connected ? "подключена" : "не подключена"}
          </span>
        </div>
        {!status?.metrika.connected ? (
          <div className="mt-3 space-y-2">
            <p className="text-[13px] text-[#6b7280]">
              Токен: oauth.yandex.ru → разрешить «Яндекс.Метрика» → скопировать токен.
            </p>
            <div className="flex gap-2">
              <input
                className="ws-input flex-1"
                type="password"
                placeholder="OAuth-токен Метрики"
                value={metrikaToken}
                onChange={(e) => setMetrikaToken(e.target.value)}
              />
              <button
                className="ws-btn ws-btn-primary"
                disabled={busy === "metrika" || !metrikaToken}
                onClick={() => void call({ service: "metrika", token: metrikaToken }, "metrika")}
              >
                {busy === "metrika" ? "Проверяем…" : "Подключить"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <label className="block text-[13px] font-medium">
              Счётчик для проекта «{project.name}»
              <select
                className="ws-input mt-1"
                value={boundCounter || ""}
                onChange={(e) =>
                  void call(
                    { projectId: project.id, counterId: Number(e.target.value) },
                    "bind-counter"
                  )
                }
              >
                <option value="">— выбрать —</option>
                {(status.metrika.counters || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.site} (#{c.id})
                  </option>
                ))}
              </select>
            </label>
            <button
              className="ws-btn ws-btn-outline text-[#b91c1c]"
              onClick={async () => {
                await fetch("/api/integrations?service=metrika", { method: "DELETE" });
                reload();
              }}
            >
              Отключить Метрику
            </button>
          </div>
        )}
        {stats?.metrikaConfigured && stats.metrika?.totals && (
          <div className="mt-4 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
              Последние 30 дней
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 text-[14px] md:grid-cols-4">
              <div>
                <b className="text-lg">{stats.metrika.totals.visits}</b>
                <div className="text-[12px] text-[#6b7280]">визитов</div>
              </div>
              <div>
                <b className="text-lg">{stats.metrika.totals.users}</b>
                <div className="text-[12px] text-[#6b7280]">посетителей</div>
              </div>
              <div>
                <b className="text-lg">{stats.metrika.totals.bounceRate}%</b>
                <div className="text-[12px] text-[#6b7280]">отказы</div>
              </div>
              <div>
                <b className="text-lg">{Math.round(stats.metrika.totals.avgDurationSec / 60)} мин</b>
                <div className="text-[12px] text-[#6b7280]">среднее время</div>
              </div>
            </div>
            {Boolean(stats.metrika.sources?.length) && (
              <div className="mt-3">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">Источники</p>
                <ul className="mt-1 space-y-0.5 text-[13.5px]">
                  {stats.metrika.sources!.slice(0, 6).map((s) => (
                    <li key={s.name} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="tabular-nums text-[#6b7280]">{s.visits}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Boolean(stats.metrika.topPages?.length) && (
              <div className="mt-3">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  Топ страниц
                </p>
                <ul className="mt-1 space-y-0.5 text-[13.5px]">
                  {stats.metrika.topPages!.slice(0, 5).map((p) => (
                    <li key={p.path} className="flex justify-between gap-2">
                      <span className="truncate">{p.path}</span>
                      <span className="shrink-0 tabular-nums text-[#6b7280]">{p.visits}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stats.metrika.errors.length > 0 && (
              <p className="mt-2 text-[12px] text-[#b45309]">
                Часть данных не получена: {stats.metrika.errors.join("; ")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Вебмастер */}
      <div className="ws-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Яндекс.Вебмастер</h2>
          <span className={`text-[13px] ${status?.webmaster.connected ? "text-[#15803d]" : "text-[#9ca3af]"}`}>
            {status?.webmaster.connected ? "подключён" : "не подключён"}
          </span>
        </div>
        {!status?.webmaster.connected ? (
          <div className="mt-3 space-y-2">
            <p className="text-[13px] text-[#6b7280]">
              Токен: oauth.yandex.ru → разрешить «Вебмастер и API». Доступ к API Вебмастера
              открывается по заявке в интерфейсе Вебмастера; без неё API ответит 403 — аудит сайта
              работает и без этого.
            </p>
            <div className="flex gap-2">
              <input
                className="ws-input flex-1"
                type="password"
                placeholder="OAuth-токен Вебмастера"
                value={wmToken}
                onChange={(e) => setWmToken(e.target.value)}
              />
              <button
                className="ws-btn ws-btn-primary"
                disabled={busy === "webmaster" || !wmToken}
                onClick={() => void call({ service: "webmaster", token: wmToken }, "webmaster")}
              >
                {busy === "webmaster" ? "Проверяем…" : "Подключить"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <label className="block text-[13px] font-medium">
              Сайт в Вебмастере для «{project.name}»
              <select
                className="ws-input mt-1"
                value={boundHost || ""}
                onChange={(e) => void call({ projectId: project.id, hostId: e.target.value }, "bind-host")}
              >
                <option value="">— выбрать —</option>
                {status.webmasterHosts.map((h) => (
                  <option key={h.host_id} value={h.host_id}>
                    {h.host}
                    {h.verified ? "" : " (не подтверждён)"}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="ws-btn ws-btn-outline text-[#b91c1c]"
              onClick={async () => {
                await fetch("/api/integrations?service=webmaster", { method: "DELETE" });
                reload();
              }}
            >
              Отключить Вебмастер
            </button>
          </div>
        )}
        {stats?.webmasterConfigured && stats.webmaster?.indexStats?.length ? (
          <div className="mt-4 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
              Индексация (последние записи)
            </p>
            <ul className="mt-1 space-y-0.5 text-[13.5px]">
              {stats.webmaster.indexStats.slice(-5).reverse().map((s) => (
                <li key={s.date} className="flex justify-between">
                  <span>{s.date}</span>
                  <span className="tabular-nums text-[#6b7280]">
                    в поиске: {s.indexed} · обошли: {s.crawled}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {stats?.webmasterConfigured && stats.webmaster?.errors?.length ? (
          <p className="mt-2 text-[12px] text-[#b45309]">
            Статистика индексации не получена: {stats.webmaster.errors.join("; ")}
          </p>
        ) : null}
      </div>

      <p className="text-[12px] text-[#9ca3af]">
        Отказы из подключённой Метрики автоматически учитываются в аудите сайта (блок «Поведенческие»
        Яндекс-скора).
      </p>
    </div>
  );
}
