"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Bot = {
  name: string; kind: "поиск" | "ИИ"; note: string; robotsRule: string;
  bannedInRobots: boolean; siteResponds: boolean | null; status: number | null;
};

const CUSTOM_UA_PRESETS = [
  { label: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { label: "YandexBot", ua: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)" },
  { label: "GPTBot", ua: "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)" },
  { label: "ClaudeBot", ua: "Mozilla/5.0 (compatible; ClaudeBot/1.0)" },
  { label: "PerplexityBot", ua: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai)" },
  { label: "AhrefsBot", ua: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" },
  { label: "curl", ua: "curl/8.0" },
  { label: "Python", ua: "python-requests/2.31" },
];

export default function BotsPage() {
  const { project, ready } = useWorkspace();
  const [bots, setBots] = useState<Bot[] | null>(null);
  const [robotsFound, setRobotsFound] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [filterKind, setFilterKind] = useState<"все" | "поиск" | "ИИ">("все");
  const [customUa, setCustomUa] = useState("");
  const [customResult, setCustomResult] = useState<string>("");

  if (!ready || !project) return null;

  async function run() {
    setBusy(true); setErr(""); setBots(null); setCustomResult("");
    const target = customUrl.trim() || project!.url;
    const res = await fetch("/api/kabinet/bots", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: target }),
    });
    const data = (await res.json().catch(() => ({}))) as { bots?: Bot[]; robotsFound?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.bots) { setErr(data.error || "Ошибка"); return; }
    setBots(data.bots);
    setRobotsFound(data.robotsFound !== false);
  }

  async function testCustomUa() {
    if (!customUa.trim()) return;
    setCustomResult("Проверяем…");
    const target = customUrl.trim() || project!.url;
    try {
      const res = await fetch(`/api/kabinet/bots`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: target, customUa: customUa.trim() }),
      });
      const data = await res.json();
      if (data.customUaResult) {
        setCustomResult(`UA "${customUa.slice(0, 30)}…" → ${data.customUaResult.status || "нет ответа"}`);
      } else {
        setCustomResult("API не поддерживает кастомный UA");
      }
    } catch {
      setCustomResult("Ошибка сети");
    }
  }

  const shown = bots?.filter((b) => filterKind === "все" || b.kind === filterKind) ?? [];
  const problems = shown.filter((b) => (b.kind === "ИИ" && b.bannedInRobots) || b.siteResponds === false);
  const okBots = shown.filter((b) => !b.bannedInRobots && b.siteResponds === true);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Параметры */}
      <div className="ws-card space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block text-[13px] font-medium">
            Адрес сайта
            <input className="ws-input mt-1" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder={project.url} />
          </label>
          <button className="ws-btn ws-btn-primary self-end" onClick={() => void run()} disabled={busy}>
            {busy ? "Заходим ботами…" : "Проверить"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-[#6b7280]">Фильтр:</span>
          {(["все", "поиск", "ИИ"] as const).map((k) => (
            <button
              key={k}
              className={`rounded-lg border px-3 py-1 text-[12px] ${
                filterKind === k ? "border-[#ea580c] bg-[#fff7ed] font-medium text-[#ea580c]" : "border-[#e5e7eb] text-[#6b7280]"
              }`}
              onClick={() => setFilterKind(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Кастомный UA тест */}
      <div className="ws-card mt-3 p-4">
        <p className="text-[13px] font-medium">Проверить свой User-Agent</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CUSTOM_UA_PRESETS.map((p) => (
            <button
              key={p.label}
              className={`rounded-lg border px-2.5 py-1 text-[12px] ${
                customUa === p.ua ? "border-[#ea580c] bg-[#fff7ed] text-[#ea580c]" : "border-[#e5e7eb] text-[#6b7280]"
              }`}
              onClick={() => setCustomUa(p.ua)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="ws-input flex-1 font-mono text-[12px]"
            value={customUa}
            onChange={(e) => setCustomUa(e.target.value)}
            placeholder="User-Agent строка"
          />
          <button className="ws-btn ws-btn-outline" onClick={() => void testCustomUa()} disabled={!customUa.trim()}>
            Тест
          </button>
        </div>
        {customResult && <p className="mt-2 text-[13px] text-[#374151]">{customResult}</p>}
      </div>

      {err && <p className="mt-3 text-[13px] text-[#b91c1c]">{err}</p>}
      {!robotsFound && bots && (
        <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-[13px] text-[#9a3412]">robots.txt не найден.</p>
      )}

      {/* Сводка */}
      {bots && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="ws-card p-4 text-center">
            <div className="text-[28px] font-bold text-[#16a34a]">{okBots.length}</div>
            <div className="text-[12px] text-[#6b7280]">пускают</div>
          </div>
          <div className="ws-card p-4 text-center">
            <div className="text-[28px] font-bold text-[#b91c1c]">{problems.length}</div>
            <div className="text-[12px] text-[#6b7280]">проблемы</div>
          </div>
          <div className="ws-card p-4 text-center">
            <div className="text-[28px] font-bold">{shown.length}</div>
            <div className="text-[12px] text-[#6b7280]">всего проверено</div>
          </div>
        </div>
      )}

      {/* Таблица результатов */}
      {bots && (
        <div className="ws-card mt-4 min-w-0 overflow-x-auto">
          <table className="ws-table">
            <thead>
              <tr>
                <th>Робот</th>
                <th>Тип</th>
                <th>robots.txt</th>
                <th>Живой заход</th>
                <th>Код</th>
                <th>Зачем</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => (
                <tr key={b.name}>
                  <td className="font-medium">{b.name}</td>
                  <td>{b.kind === "ИИ" ? "🤖" : "🔍"}</td>
                  <td className={b.bannedInRobots ? "text-[#b91c1c]" : "text-[#15803d]"}>{b.robotsRule}</td>
                  <td className={b.siteResponds === true ? "text-[#15803d]" : b.siteResponds === false ? "text-[#b91c1c]" : ""}>
                    {b.siteResponds === true ? "✓" : b.siteResponds === false ? "✗" : "—"}
                  </td>
                  <td className="tabular-nums text-[#6b7280]">{b.status ?? "—"}</td>
                  <td className="text-[12px] text-[#6b7280]">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[#f3f4f6] p-3 text-[12px] text-[#9ca3af]">
            «Живой заход» — сервер реально запросил страницу с User-Agent робота. Ловит WAF.
          </p>
        </div>
      )}

      {problems.length > 0 && (
        <div className="ws-card mt-4 border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] text-[#b91c1c]">
          {problems.map((b) => (
            <p key={b.name}>
              {b.bannedInRobots
                ? `${b.name} закрыт в robots — ${b.note} не увидит сайт.`
                : `${b.name}: сайт не ответил на заход (код ${b.status ?? "нет"}) — вероятно WAF.`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
