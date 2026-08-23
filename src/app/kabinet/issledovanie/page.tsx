"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FREE_QUERIES,
  consumeQuery,
  loadSession,
  queriesLeft,
  type Session,
} from "@/lib/session";

const DB: Record<
  string,
  { visibility: number; citations: string[]; rivals: { name: string; score: number }[] }
> = {
  волна: {
    visibility: 71,
    citations: ["vc.ru/podcasts-2026", "t.me/audiohub", "afisha.ru/streaming"],
    rivals: [
      { name: "Волна", score: 71 },
      { name: "Яндекс Музыка", score: 64 },
      { name: "Звук", score: 41 },
    ],
  },
  default: {
    visibility: 18,
    citations: ["otzovik.com", "vc.ru", "dzen.ru"],
    rivals: [
      { name: "Лидер категории", score: 62 },
      { name: "Второй", score: 44 },
      { name: "Запрос", score: 18 },
    ],
  },
};

export default function ResearchPage() {
  const [q, setQ] = useState("Волна");
  const [res, setRes] = useState<typeof DB.волна | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => setSession(loadSession()), []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Исследователь брендов</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        Введите бренд или тему. Для демо попробуйте «Волна».
        {session && !session.paid && (
          <>
            {" "}
            Бесплатно осталось {queriesLeft(session)} из {FREE_QUERIES} запросов.
          </>
        )}
      </p>
      <form
        className="mt-5 flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!session) return;
          const used = consumeQuery(session);
          setSession(used.session);
          if (!used.ok) {
            setErr("Лимит 5 бесплатных запросов исчерпан. Оформите тариф.");
            return;
          }
          setErr("");
          const key = q.trim().toLowerCase();
          setRes(DB[key] || { ...DB.default, rivals: [{ name: q, score: 18 }, ...DB.default.rivals.slice(0, 2)] });
        }}
      >
        <input className="ws-input" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="ws-btn ws-btn-primary">Прогнать</button>
      </form>
      {err && (
        <p className="mt-3 text-sm text-bad">
          {err}{" "}
          <Link href="/kabinet/tarify" className="font-semibold underline">
            К подписке
          </Link>
        </p>
      )}
      {res && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="ws-card p-5">
            <div className="text-sm text-muted">ИИ-видимость</div>
            <div className="text-4xl font-semibold">{res.visibility}%</div>
            <ul className="mt-4 space-y-2 text-sm">
              {res.rivals.map((r) => (
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
              {res.citations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
