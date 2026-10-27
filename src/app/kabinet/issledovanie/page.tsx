"use client";

import Link from "next/link";
import { useState } from "react";

// Единственный «бренд» с данными — демо-пример. Живой замер ИИ-видимости
// (реальные опросы моделей) к бэкенду ещё не подключён; показывать
// сгенерированные проценты как измерения нельзя.
const DEMO = {
  brand: "Волна",
  visibility: 71,
  citations: ["vc.ru/podcasts-2026", "t.me/audiohub", "afisha.ru/streaming"],
  rivals: [
    { name: "Волна", score: 71 },
    { name: "Яндекс Музыка", score: 64 },
    { name: "Звук", score: 41 },
  ],
};

export default function ResearchPage() {
  const [q, setQ] = useState(DEMO.brand);
  const [showDemo, setShowDemo] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Исследователь брендов</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        Живой замер ИИ-видимости бренда подключается к моделям отдельно — сейчас раздел
        показывает{" "}
        <span className="font-medium text-[#374151]">один размеченный пример</span> на
        демо-бренде «Волна». Реальные данные прямо сейчас: «Ключи» (подсказки Яндекса и
        посадочные конкурентов) и «Аудит» (живой обход сайта).
      </p>
      <form
        className="mt-5 flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const key = q.trim().toLowerCase();
          if (key === DEMO.brand.toLowerCase()) {
            setErr("");
            setShowDemo(true);
          } else {
            setShowDemo(false);
            setErr(
              `Для «${q.trim() || "пустого запроса"}» живого замера пока нет. Доступен только пример на демо-бренде «Волна».`
            );
          }
        }}
      >
        <input className="ws-input" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="ws-btn ws-btn-primary">Прогнать</button>
      </form>
      {err && (
        <p className="mt-3 text-sm text-[#9a3412]">
          {err}{" "}
          <Link href="/kabinet/kluchi" className="font-semibold underline">
            Живые данные — в «Ключах»
          </Link>
        </p>
      )}
      {showDemo && (
        <>
          <p className="mt-5 rounded-lg bg-[#fff7ed] px-3 py-2 text-[13px] font-medium text-[#9a3412]">
            Пример отчёта: демо-данные для «Волна», не живой замер.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="ws-card p-5">
              <div className="text-sm text-muted">ИИ-видимость</div>
              <div className="text-4xl font-semibold">{DEMO.visibility}%</div>
              <ul className="mt-4 space-y-2 text-sm">
                {DEMO.rivals.map((r) => (
                  <li key={r.name} className="flex justify-between">
                    <span>{r.name}</span>
                    <span>{r.score}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ws-card p-5">
              <div className="text-sm text-[#6b7280]">Откуда ИИ берёт цитаты</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {DEMO.citations.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
