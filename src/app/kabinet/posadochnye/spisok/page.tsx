"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import {
  CITY_CATALOG,
  LANDING_TYPES,
  emptyLanding,
  ensureProjectPages,
  loadLandings,
  saveLandings,
  type LandingPage,
} from "@/lib/cabinet-pages";

export default function LandingsList() {
  const { project, ready } = useWorkspace();
  const [items, setItems] = useState<LandingPage[]>([]);
  const [url, setUrl] = useState("");
  const [filter, setFilter] = useState("все");

  useEffect(() => {
    if (project) setItems(ensureProjectPages(project));
  }, [project?.id]);

  if (!ready || !project) return null;

  const shown = filter === "все" ? items : items.filter((i) => i.type === filter);

  function persist(next: LandingPage[]) {
    const others = loadLandings().filter((l) => l.projectId !== project!.id);
    saveLandings([...others, ...next]);
    setItems(next);
  }

  function add() {
    if (!url.trim()) return;
    persist([...items, emptyLanding(project.id, url.trim())]);
    setUrl("");
  }

  function patch(id: string, part: Partial<LandingPage>) {
    persist(items.map((i) => (i.id === id ? { ...i, ...part } : i)));
  }

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Список посадочных {project.name}. Смените проект — список будет другой.
      </p>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          className="ws-input flex-1"
          placeholder="https://site.ru/usluga"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="ws-btn ws-btn-primary">Добавить</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {["все", ...LANDING_TYPES].map((t) => (
          <button
            key={t}
            className={`rounded-lg px-3 py-1.5 text-[13px] ${
              filter === t ? "bg-[#111827] text-white" : "bg-white text-[#4b5563] ring-1 ring-[#e5e7eb]"
            }`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="ws-card mt-4 overflow-x-auto">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Регион</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((i) => (
              <tr key={i.id}>
                <td>
                  <input
                    className="ws-input py-1.5"
                    value={i.title}
                    onChange={(e) => patch(i.id, { title: e.target.value })}
                  />
                  <div className="mt-1 truncate text-[11px] text-[#9ca3af]">{i.url}</div>
                </td>
                <td>
                  <select
                    className="ws-input py-1.5"
                    value={i.type}
                    onChange={(e) => patch(i.id, { type: e.target.value as LandingPage["type"] })}
                  >
                    {LANDING_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="ws-input py-1.5"
                    value={i.region}
                    onChange={(e) => patch(i.id, { region: e.target.value })}
                  >
                    {CITY_CATALOG.map((c) => (
                      <option key={c.yandexId}>{c.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="ws-input py-1.5"
                    value={i.status}
                    onChange={(e) => patch(i.id, { status: e.target.value as LandingPage["status"] })}
                  >
                    <option>черновик</option>
                    <option>в работе</option>
                    <option>готово</option>
                  </select>
                </td>
                <td>
                  <button
                    className="text-[12px] text-[#b91c1c]"
                    onClick={() => persist(items.filter((x) => x.id !== i.id))}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
