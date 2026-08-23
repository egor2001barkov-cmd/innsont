"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadActions, saveActions, type ActionItem } from "@/lib/workspace";

export default function ActionsPage() {
  const { session, project, plan, ready } = useWorkspace();
  const [items, setItems] = useState<ActionItem[]>([]);
  const [cat, setCat] = useState("все");

  useEffect(() => {
    setItems(loadActions());
  }, []);

  if (!ready || !session || !project) return null;

  if (!plan.limits.actionItems) {
    return (
      <div className="mx-auto max-w-xl ws-card p-8 text-center">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-[#ea580c]">Тариф Рост</div>
        <h2 className="mt-2 text-2xl font-bold">Центр действий</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Очередь задач с влиянием на видимость есть только на «Росте». На Старте и Базовом — 50 и 100 промптов,
          без задач.
        </p>
        <Link href="/kabinet/tarify" className="ws-btn ws-btn-primary mt-5">
          Перейти на Рост
        </Link>
      </div>
    );
  }

  const mine = items.filter((i) => i.projectId === project.id);
  const shown = cat === "все" ? mine : mine.filter((i) => i.cat === cat);
  const open = mine.filter((i) => i.status !== "Готово").length;

  function setStatus(id: string, status: ActionItem["status"]) {
    const next = items.map((i) => (i.id === id ? { ...i, status } : i));
    setItems(next);
    saveActions(next);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        {project.name}: {open} открытых задач. Сначала то, что режет краулинг и цитаты.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["все", "Контент", "Техника", "Цитаты", "Боты"].map((c) => (
          <button
            key={c}
            className={`rounded-lg px-3 py-1.5 text-[13px] ${
              cat === c ? "bg-[#111827] text-white" : "bg-white text-[#4b5563] ring-1 ring-[#e5e7eb]"
            }`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {shown.map((it) => (
          <div key={it.id} className="ws-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[#ea580c]">
                  {it.cat} · {it.impact}
                </div>
                <div className="mt-1 font-semibold">{it.title}</div>
                <p className="mt-1 text-[13px] text-[#6b7280]">{it.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="ws-input w-auto py-1.5 text-[13px]"
                  value={it.status}
                  onChange={(e) => setStatus(it.id, e.target.value as ActionItem["status"])}
                >
                  <option>Открыто</option>
                  <option>В работе</option>
                  <option>Готово</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
