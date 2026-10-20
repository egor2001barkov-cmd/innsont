"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Bot = {
  name: string;
  kind: "поиск" | "ИИ";
  note: string;
  robotsRule: string;
  bannedInRobots: boolean;
  siteResponds: boolean | null;
  status: number | null;
};

export default function BotsPage() {
  const { project, ready } = useWorkspace();
  const [bots, setBots] = useState<Bot[] | null>(null);
  const [robotsFound, setRobotsFound] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!ready || !project) return null;

  async function run() {
    setBusy(true);
    setErr("");
    setBots(null);
    const res = await fetch("/api/kabinet/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: project!.url }),
    });
    const data = (await res.json().catch(() => ({}))) as { bots?: Bot[]; robotsFound?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.bots) {
      setErr(data.error || "Не удалось проверить");
      return;
    }
    setBots(data.bots);
    setRobotsFound(data.robotsFound !== false);
  }

  const problems = (bots || []).filter(
    (b) => (b.kind === "ИИ" && b.bannedInRobots) || b.siteResponds === false
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Реальная проверка: что robots.txt разрешает роботам {project.url} и отвечает ли сайт каждому
          боту при живом заходе с его User-Agent.
        </p>
        <button className="ws-btn ws-btn-primary" onClick={() => void run()} disabled={busy}>
          {busy ? "Заходим ботами…" : "Проверить ботов"}
        </button>
      </div>
      {err && <p className="mt-3 text-[13px] text-[#b91c1c]">{err}</p>}
      {!robotsFound && bots && (
        <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-[13px] text-[#9a3412]">
          robots.txt не найден — правила не заданы, боты ходят по всему сайту.
        </p>
      )}

      {problems.length > 0 && (
        <div className="ws-card mt-4 border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] text-[#b91c1c]">
          {problems.map((b) => (
            <p key={b.name}>
              {b.bannedInRobots
                ? `${b.name} закрыт в robots.txt — ${b.note} не увидит сайт.`
                : `${b.name}: сайт не ответил на заход бота (код ${b.status ?? "нет ответа"}) — возможно, WAF режет роботов.`}
            </p>
          ))}
        </div>
      )}

      {bots && (
        <div className="ws-card mt-4 min-w-0 overflow-x-auto">
          <table className="ws-table">
            <thead>
              <tr>
                <th>Робот</th>
                <th>Тип</th>
                <th>robots.txt</th>
                <th>Живой заход</th>
                <th>Ответ</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((b) => (
                <tr key={b.name}>
                  <td className="font-medium">
                    {b.name}
                    <span className="block text-[11px] font-normal text-[#9ca3af]">{b.note}</span>
                  </td>
                  <td>{b.kind === "ИИ" ? "ИИ-модель" : "Поисковик"}</td>
                  <td className={b.bannedInRobots ? "text-[#b91c1c]" : "text-[#15803d]"}>{b.robotsRule}</td>
                  <td
                    className={
                      b.siteResponds === true ? "text-[#15803d]" : b.siteResponds === false ? "text-[#b91c1c]" : ""
                    }
                  >
                    {b.siteResponds === true ? "впускает" : b.siteResponds === false ? "не ответил" : "—"}
                  </td>
                  <td className="tabular-nums text-[#6b7280]">{b.status ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[#f3f4f6] p-3 text-[12px] text-[#9ca3af]">
            «Живой заход» — сервер INSONT реально запросил главную страницу с User-Agent бота. AI-боты
            (GPTBot, ClaudeBot, PerplexityBot) важны для попадания в ответы моделей.
          </p>
        </div>
      )}
    </div>
  );
}
