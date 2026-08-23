"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import {
  CITY_CATALOG,
  ensureProjectRegions,
  loadRegions,
  saveRegions,
  type RegionPref,
} from "@/lib/cabinet-pages";

export default function CitiesPage() {
  const { project, ready } = useWorkspace();
  const [items, setItems] = useState<RegionPref[]>([]);
  const [addId, setAddId] = useState(String(CITY_CATALOG[3].yandexId));

  useEffect(() => {
    if (project) setItems(ensureProjectRegions(project));
  }, [project?.id]);

  if (!ready || !project) return null;

  function persist(next: RegionPref[]) {
    const others = loadRegions().filter((r) => r.projectId !== project!.id);
    saveRegions([...others, ...next]);
    setItems(next);
  }

  function add() {
    const city = CITY_CATALOG.find((c) => String(c.yandexId) === addId);
    if (!city || items.some((i) => i.yandexId === city.yandexId)) return;
    persist([
      ...items,
      {
        id: `${project.id}-${city.yandexId}`,
        projectId: project.id,
        name: city.name,
        yandexId: city.yandexId,
        priority: "средний",
        enabled: true,
      },
    ]);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-[#6b7280]">
        Города {project.name}. Включённый регион попадает в приоритет выдачи и в привязку посадочных.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <select className="ws-input" value={addId} onChange={(e) => setAddId(e.target.value)}>
          {CITY_CATALOG.map((c) => (
            <option key={c.yandexId} value={c.yandexId}>
              {c.name} · id {c.yandexId}
            </option>
          ))}
        </select>
        <button className="ws-btn ws-btn-primary" onClick={add}>
          Добавить город
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((r) => (
          <div key={r.id} className="ws-card flex flex-wrap items-center gap-3 p-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={r.enabled}
                onChange={(e) => persist(items.map((x) => (x.id === r.id ? { ...x, enabled: e.target.checked } : x)))}
              />
              <span className="font-semibold">{r.name}</span>
            </label>
            <span className="text-[12px] text-[#9ca3af]">Яндекс {r.yandexId}</span>
            <select
              className="ws-input ml-auto w-auto py-1.5"
              value={r.priority}
              onChange={(e) =>
                persist(items.map((x) => (x.id === r.id ? { ...x, priority: e.target.value as RegionPref["priority"] } : x)))
              }
            >
              <option value="высокий">высокий</option>
              <option value="средний">средний</option>
              <option value="низкий">низкий</option>
            </select>
            <button className="text-[12px] text-[#b91c1c]" onClick={() => persist(items.filter((x) => x.id !== r.id))}>
              Убрать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
