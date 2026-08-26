"use client";

import { useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { strategyFor } from "@/lib/workspace";

export default function StrategyPage() {
  const { project, ready } = useWorkspace();
  const [picked, setPicked] = useState<string[]>([]);
  if (!ready || !project) return null;
  const rows = strategyFor(project);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Кластеры по {project.name}. Частота — как часто промпт звучит в ИИ. Разрыв — насколько вы отстаёте от лидера.
      </p>
      <div className="ws-card mt-5 min-w-0 overflow-x-auto">
        <table className="ws-table">
          <thead>
            <tr>
              <th></th>
              <th>Тема</th>
              <th>Частота</th>
              <th>Разрыв</th>
              <th>Интент</th>
              <th>Что писать</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.topic}>
                <td>
                  <input
                    type="checkbox"
                    checked={picked.includes(r.topic)}
                    onChange={() =>
                      setPicked((p) => (p.includes(r.topic) ? p.filter((x) => x !== r.topic) : [...p, r.topic]))
                    }
                  />
                </td>
                <td className="font-medium">{r.topic}</td>
                <td>{r.volume}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#f3f4f6]">
                      <div className="h-full bg-[#ea580c]" style={{ width: `${r.gap}%` }} />
                    </div>
                    <span className="tabular-nums text-[12px] text-[#6b7280]">{r.gap}</span>
                  </div>
                </td>
                <td className="text-[#6b7280]">{r.intent}</td>
                <td>{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {picked.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm">
          Выбрано {picked.length}. Откройте конвейер — тема подставится.
          <Link
            href={`/kabinet/statyi?tema=${encodeURIComponent(picked[0])}`}
            className="ws-btn ws-btn-primary py-1.5"
          >
            Создать контент
          </Link>
        </div>
      )}
    </div>
  );
}
