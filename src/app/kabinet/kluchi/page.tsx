"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AreaChart } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { hostOf } from "@/lib/workspace";
import { REGIONS, SPHERES, guessSphere, type SphereId } from "@/lib/spheres";
import type { FoundLanding } from "@/lib/landings";
import type { WordstatBundle } from "@/lib/wordstat";
import { consumePrompt } from "@/lib/session";

type Result = {
  phrase: string;
  sphere: { id: string; label: string };
  suggest: string[];
  wordstat: WordstatBundle;
  wordstatLive: boolean;
  wordstatError?: string;
  landings: FoundLanding[];
};

const TOKEN_KEY = "insont.wordstat.token";
const EXTRA_KEY = "insont.wordstat.hosts";
const SAVED_KEY = "insont.wordstat.saved";

export default function KeysPage() {
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [phrase, setPhrase] = useState("");
  const [sphere, setSphere] = useState<SphereId>("electronics");
  const [region, setRegion] = useState(225);
  const [token, setToken] = useState("");
  const [hosts, setHosts] = useState("");
  const [showTok, setShowTok] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [tab, setTab] = useState<"keys" | "landings">("keys");

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY) || "");
    setHosts(localStorage.getItem(EXTRA_KEY) || "");
    try {
      setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
    } catch {
      /* */
    }
  }, []);

  useEffect(() => {
    if (!project) return;
    const guessed = guessSphere(hostOf(project.url), project.name);
    setSphere(guessed);
    const def = SPHERES.find((s) => s.id === guessed);
    if (def?.seeds[0] && !phrase) setPhrase(def.seeds[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const months = useMemo(
    () => (res?.wordstat.dynamics || []).map((d) => d.date.slice(5, 7)),
    [res]
  );

  if (!ready || !session || !project) return null;

  async function run(nextPhrase?: string) {
    const q = (nextPhrase || phrase).trim();
    if (q.length < 2 || !session || !project) return;
    const used = consumePrompt(session, plan.limits.prompts);
    setSession(used.session);
    if (!used.ok) {
      setErr(`Лимит промптов тарифа «${plan.name}»: ${plan.limits.prompts}.`);
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/kabinet/kluchi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: q,
          sphere,
          region,
          token: token || undefined,
          extraHosts: hosts
            .split(/[\s,]+/)
            .map((h) => h.trim())
            .filter(Boolean),
          projectHost: hostOf(project.url),
          projectName: project.name,
        }),
      });
      const data = (await r.json()) as Result & { error?: string };
      if (!r.ok) throw new Error(data.error || "Ошибка запроса");
      setRes(data);
      setPhrase(q);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Не удалось собрать ключи");
    } finally {
      setBusy(false);
    }
  }

  function persistToken() {
    localStorage.setItem(TOKEN_KEY, token.trim());
    localStorage.setItem(EXTRA_KEY, hosts.trim());
  }

  function toggleSave(k: string) {
    const next = saved.includes(k) ? saved.filter((x) => x !== k) : [...saved, k];
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }

  const seedHints = SPHERES.find((s) => s.id === sphere)?.seeds || [];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#6b7280]">
        Ядро из Wordstat и живых подсказок Яндекса. По сфере — посадочные конкурентов: sitemap,
        известные разделы и проверка URL.
      </p>

      <form
        className="ws-card mt-4 space-y-3 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          persistToken();
          void run();
        }}
      >
        <div className="flex flex-col gap-2 lg:flex-row">
          <input
            className="ws-input flex-1"
            placeholder="Фраза, как в Wordstat: игровой ноутбук"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
          <select className="ws-input lg:w-56" value={sphere} onChange={(e) => setSphere(e.target.value as SphereId)}>
            {SPHERES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <select className="ws-input lg:w-44" value={region} onChange={(e) => setRegion(Number(e.target.value))}>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <button className="ws-btn ws-btn-primary lg:w-40" disabled={busy}>
            {busy ? "Снимаем…" : "Собрать ключи"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {seedHints.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[12px] text-[#374151] hover:bg-[#fff7ed]"
              onClick={() => void run(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button type="button" className="text-[12.5px] text-[#6b7280]" onClick={() => setShowTok((v) => !v)}>
          {showTok ? "Скрыть подключение Wordstat" : "Подключить API Wordstat и свои домены"}
        </button>
        {showTok && (
          <div className="grid gap-2 md:grid-cols-2">
            <label className="text-[12px] text-[#6b7280]">
              OAuth-токен Wordstat (Bearer). Можно также задать YANDEX_WORDSTAT_TOKEN в .env
              <input
                className="ws-input mt-1 font-mono text-[13px]"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="y0_…"
              />
            </label>
            <label className="text-[12px] text-[#6b7280]">
              Домены конкурентов через запятую
              <input
                className="ws-input mt-1"
                value={hosts}
                onChange={(e) => setHosts(e.target.value)}
                placeholder="competitor.ru, other.ru"
              />
            </label>
          </div>
        )}
        <p className="text-[12px] text-[#9ca3af]">
          Промпты: {session.promptsUsed}/{plan.limits.prompts}. Один съём = один промпт.
        </p>
      </form>

      {err && <p className="mt-3 text-sm text-[#b91c1c]">{err}</p>}

      {res && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Stat
              k="Частота фразы"
              v={res.wordstat.totalCount ? res.wordstat.totalCount.toLocaleString("ru-RU") : "—"}
              d={res.wordstatLive ? "Wordstat, 30 дней" : "оценка + подсказки Яндекса"}
            />
            <Stat k="Фраз в топе" v={String(res.wordstat.top.length)} d={`${res.suggest.length} подсказок`} />
            <Stat
              k="Посадочные"
              v={String(res.landings.length)}
              d={`${res.landings.filter((l) => l.live).length} открылись сейчас`}
            />
          </div>

          {res.wordstatError && (
            <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-[13px] text-[#9a3412]">{res.wordstatError}</p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              className={`rounded-lg px-3 py-1.5 text-[13px] ${tab === "keys" ? "bg-[#111827] text-white" : "bg-white ring-1 ring-[#e5e7eb]"}`}
              onClick={() => setTab("keys")}
            >
              Ключи
            </button>
            <button
              className={`rounded-lg px-3 py-1.5 text-[13px] ${tab === "landings" ? "bg-[#111827] text-white" : "bg-white ring-1 ring-[#e5e7eb]"}`}
              onClick={() => setTab("landings")}
            >
              Посадочные конкурентов
            </button>
          </div>

          {tab === "keys" && (
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="ws-card min-w-0 overflow-x-auto">
                <div className="flex items-center justify-between border-b border-[#f3f4f6] px-4 py-3">
                  <h2 className="text-sm font-semibold">Топ запросов</h2>
                  <span className="text-[11px] text-[#9ca3af]">
                    {res.wordstatLive ? "api.wordstat.yandex.net" : "suggest.yandex.ru"}
                  </span>
                </div>
                <table className="ws-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Фраза</th>
                      <th>Частота</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.wordstat.top.map((row) => (
                      <tr key={row.phrase}>
                        <td>
                          <input
                            type="checkbox"
                            checked={saved.includes(row.phrase)}
                            onChange={() => toggleSave(row.phrase)}
                          />
                        </td>
                        <td>
                          <button className="text-left font-medium hover:text-[#ea580c]" onClick={() => void run(row.phrase)}>
                            {row.phrase}
                          </button>
                        </td>
                        <td className="tabular-nums">{row.count.toLocaleString("ru-RU")}</td>
                        <td>
                          <Link
                            className="text-[12px] text-[#ea580c]"
                            href={`/kabinet/statyi?tema=${encodeURIComponent(row.phrase)}`}
                          >
                            Статья
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4">
                <div className="ws-card p-4">
                  <h2 className="text-sm font-semibold">Динамика</h2>
                  <p className="mb-2 text-[12px] text-[#9ca3af]">{res.wordstat.phrase}</p>
                  {res.wordstat.dynamics.length > 1 ? (
                    <AreaChart values={res.wordstat.dynamics.map((d) => d.count)} labels={months} />
                  ) : (
                    <p className="text-sm text-[#6b7280]">Нет ряда. Подключите Wordstat — появится помесячно.</p>
                  )}
                </div>
                <div className="ws-card p-4">
                  <h2 className="text-sm font-semibold">Регионы</h2>
                  <ul className="mt-2 space-y-1.5 text-[13px]">
                    {(res.wordstat.regions.length ? res.wordstat.regions : []).map((r) => (
                      <li key={r.name} className="flex justify-between">
                        <span>{r.name}</span>
                        <span className="tabular-nums text-[#6b7280]">{r.count.toLocaleString("ru-RU")}</span>
                      </li>
                    ))}
                    {res.wordstat.regions.length === 0 && <li className="text-[#6b7280]">Нет среза по регионам</li>}
                  </ul>
                </div>
                {res.suggest.length > 0 && (
                  <div className="ws-card p-4">
                    <h2 className="text-sm font-semibold">Подсказки Яндекса</h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {res.suggest.map((s) => (
                        <button
                          key={s}
                          className="rounded-md bg-[#f3f4f6] px-2 py-1 text-[12px]"
                          onClick={() => void run(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "landings" && (
            <div className="ws-card mt-4 min-w-0 overflow-x-auto">
              <div className="border-b border-[#f3f4f6] px-4 py-3">
                <h2 className="text-sm font-semibold">Посадочные в сфере «{res.sphere.label}»</h2>
                <p className="text-[12px] text-[#9ca3af]">
                  Сопоставляем ключи с URL и title. Зелёная точка — страница ответила при проверке.
                </p>
              </div>
              <table className="ws-table">
                <thead>
                  <tr>
                    <th>Конкурент</th>
                    <th>Страница</th>
                    <th>Ключи</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {res.landings.map((l) => (
                    <tr key={l.url}>
                      <td className="font-medium">{l.competitor}</td>
                      <td>
                        <a href={l.url} target="_blank" rel="noreferrer" className="text-[#ea580c] hover:underline">
                          {l.title}
                        </a>
                        <div className="text-[11px] text-[#9ca3af]">{l.url.replace(/^https?:\/\//, "")}</div>
                        {l.snippet && <div className="mt-0.5 text-[12px] text-[#6b7280]">{l.snippet}</div>}
                      </td>
                      <td className="text-[12px] text-[#4b5563]">{l.matched.join(", ") || "—"}</td>
                      <td>
                        <span className="inline-flex items-center gap-1.5 text-[12px]">
                          <span className={`h-2 w-2 rounded-full ${l.live ? "bg-[#16a34a]" : "bg-[#d1d5db]"}`} />
                          {l.live ? l.status : "не открылась"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {res.landings.length === 0 && (
                <p className="p-6 text-sm text-[#6b7280]">
                  Посадочных не нашли. Добавьте домены конкурентов или смените сферу.
                </p>
              )}
            </div>
          )}

          {saved.length > 0 && (
            <div className="mt-4 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm">
              В ядре {saved.length} фраз.{" "}
              <Link href={`/kabinet/strategiya`} className="font-medium text-[#ea580c]">
                Открыть стратегию
              </Link>{" "}
              ·{" "}
              <Link
                href={`/kabinet/statyi?tema=${encodeURIComponent(saved[0])}`}
                className="font-medium text-[#ea580c]"
              >
                Написать статью по первой
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ k, v, d }: { k: string; v: string; d: string }) {
  return (
    <div className="ws-card p-4">
      <div className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">{k}</div>
      <div className="mt-1 text-[26px] font-bold tracking-tight">{v}</div>
      <div className="text-[12px] text-[#6b7280]">{d}</div>
    </div>
  );
}
