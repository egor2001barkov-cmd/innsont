"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

const SAVED_KEY = "insont.wordstat.saved";

type Cluster = {
  topic: string;
  keys: string[];
  intent: string;
  action: string;
};

/** Кластеризация сохранённых ключей: группировка по первому значимому слову. */
function clusterKeys(keys: string[]): Cluster[] {
  const stop = new Set([
    "в", "на", "с", "по", "для", "и", "к", "от", "под", "купить", "цена", "стоимость",
    "заказать", "недорого", "от",
  ]);
  const groups = new Map<string, string[]>();
  for (const key of keys) {
    const words = key.toLowerCase().split(/[^a-zа-яё0-9]+/).filter((w) => w.length > 2 && !stop.has(w));
    if (!words.length) continue;
    const topic = words[0];
    const list = groups.get(topic) || [];
    list.push(key);
    groups.set(topic, list);
  }
  return [...groups.entries()]
    .map(([topic, list]) => ({
      topic: topic[0].toUpperCase() + topic.slice(1),
      keys: [...new Set(list)],
      intent: /купить|цена|стоимость|заказать|стоит/.test(list.join(" "))
        ? "коммерческий"
        : /как|что|почему|какой|лучше|сравн/.test(list.join(" "))
          ? "информационный"
          : "смешанный",
      action: "",
    }))
    .sort((a, b) => b.keys.length - a.keys.length)
    .slice(0, 12)
    .map((c) => ({
      ...c,
      action:
        c.intent === "коммерческий"
          ? "Посадочная + таблица + FAQ"
          : c.intent === "информационный"
            ? "Статья-гайд с ответом в первом абзаце"
            : "Статья + ссылка на услугу",
    }));
}

export default function StrategyPage() {
  const { project, ready } = useWorkspace();
  const [picked, setPicked] = useState<string[]>([]);

  const clusters = useMemo<Cluster[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const keys = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") as string[];
      return clusterKeys(keys);
    } catch {
      return [];
    }
  }, []);

  if (!ready || !project) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Кластеры собираются из ключей, которые вы сохранили в разделе «Ключи» — никаких
        выдуманных «разрывов»: только ваши реальные сохранённые запросы.
      </p>

      {!clusters.length ? (
        <div className="ws-card mt-5 border-dashed p-8 text-center">
          <p className="text-[14px] font-medium">Сохранённых ключей пока нет</p>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Соберите ключи по сфере проекта в разделе «Ключи» и отметьте нужные — они станут
            кластерами на этой странице.
          </p>
          <Link href="/kabinet/kluchi" className="ws-btn ws-btn-primary mt-4">
            Собрать ключи →
          </Link>
        </div>
      ) : (
        <div className="ws-card mt-5 min-w-0 overflow-x-auto">
          <table className="ws-table">
            <thead>
              <tr>
                <th></th>
                <th>Кластер</th>
                <th>Запросов</th>
                <th>Интент</th>
                <th>Что писать</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((c) => (
                <tr key={c.topic}>
                  <td>
                    <input
                      type="checkbox"
                      checked={picked.includes(c.topic)}
                      onChange={() =>
                        setPicked((p) => (p.includes(c.topic) ? p.filter((x) => x !== c.topic) : [...p, c.topic]))
                      }
                    />
                  </td>
                  <td className="font-medium">
                    {c.topic}
                    <span className="block max-w-md truncate text-[11px] font-normal text-[#9ca3af]">
                      {c.keys.slice(0, 3).join(" · ")}
                      {c.keys.length > 3 ? ` · +${c.keys.length - 3}` : ""}
                    </span>
                  </td>
                  <td className="tabular-nums">{c.keys.length}</td>
                  <td className="text-[#6b7280]">{c.intent}</td>
                  <td>{c.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {picked.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-[#6b7280]">Выбрано кластеров: {picked.length}</span>
          <Link
            href={`/kabinet/statyi?tema=${encodeURIComponent(picked[0].toLowerCase())}`}
            className="ws-btn ws-btn-primary"
          >
            Писать статью по «{picked[0]}» →
          </Link>
          <Link href="/kabinet/bulk" className="ws-btn ws-btn-outline">
            Загрузить все в пакетную генерацию →
          </Link>
        </div>
      )}
    </div>
  );
}
