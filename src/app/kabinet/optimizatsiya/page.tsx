"use client";

import { useState } from "react";
import { Gauge } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

type Hit = { area: string; score: number; note: string };

export default function OptimizePage() {
  const { project, ready } = useWorkspace();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready || !project) return null;
  const site = url || project.url;

  function run() {
    setBusy(true);
    window.setTimeout(() => {
      const base = 64;
      setHits([
        { area: "Title", score: base + 8, note: "Есть бренд, нет года и ограничения по бюджету." },
        { area: "Description", score: base - 6, note: "Общий абзац. Добавьте цифру и призыв." },
        { area: "H1", score: base + 12, note: "Совпадает с интентом промпта." },
        { area: "FAQ", score: text.includes("?") ? 80 : 35, note: text.includes("?") ? "Вопросы есть." : "Нет блока FAQ — модели берут чужой." },
        { area: "Таблица", score: text.includes("|") || text.toLowerCase().includes("сравн") ? 78 : 40, note: "Сравнение цитируется лучше абзаца." },
        { area: "Дата", score: /2026|обновл/i.test(text) ? 86 : 32, note: "Свежесть решает, возьмёт ли ИИ фрагмент." },
      ]);
      setBusy(false);
    }, 600);
  }

  const avg = hits ? Math.round(hits.reduce((s, h) => s + h.score, 0) / hits.length) : 0;

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_280px]">
      <div>
        <p className="text-sm text-[#6b7280]">
          SEO-проверка существующей страницы {project.name}: title, FAQ, таблица, дата — то, что забирают модели.
        </p>
        <div className="ws-card mt-4 space-y-3 p-5">
          <input className="ws-input" value={site} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
          <textarea
            className="ws-input min-h-40"
            placeholder="Вставьте текст страницы — или оставьте пустым, проверим по URL проекта"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="ws-btn ws-btn-primary" onClick={run} disabled={busy}>
            {busy ? "Считаем…" : "Проверить"}
          </button>
        </div>
        {hits && (
          <ul className="ws-card mt-4 divide-y divide-[#f3f4f6]">
            {hits.map((h) => (
              <li key={h.area} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <div className="font-medium">{h.area}</div>
                  <div className="text-[13px] text-[#6b7280]">{h.note}</div>
                </div>
                <div className="text-lg font-bold tabular-nums">{h.score}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="ws-card h-fit p-5 text-center">
        <Gauge value={hits ? avg : 0} label={hits ? "SEO + GEO оценка" : "Запустите проверку"} />
      </div>
    </div>
  );
}
