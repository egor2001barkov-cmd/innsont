"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { emptySession, saveSession } from "@/lib/session";
import {
  CITY_CATALOG,
  ensureProjectPages,
  ensureProjectRegions,
  loadLandings,
  saveLandings,
  type LandingPage,
  type RegionPref,
} from "@/lib/cabinet-pages";

export default function YandexRegionPage() {
  const { session, setSession, project, ready } = useWorkspace();
  const [regs, setRegs] = useState<RegionPref[]>([]);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!project) return;
    setRegs(ensureProjectRegions(project));
    setPages(ensureProjectPages(project));
  }, [project?.id]);

  if (!ready || !session || !project) return null;

  const main = CITY_CATALOG.find((c) => c.name === session.region) || CITY_CATALOG[1];

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-[#6b7280]">
        Регион Яндекса для {project.name}. Его ставят в Вебмастере. Посадочные ниже можно привязать к городу.
      </p>

      <form
        className="ws-card mt-5 space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const next = emptySession({ ...session, region: String(new FormData(e.currentTarget).get("region")) });
          saveSession(next);
          setSession(next);
          setOk("Регион кабинета сохранён");
        }}
      >
        <label className="block text-[13px] font-medium">
          Основной регион Вебмастера
          <select className="ws-input mt-1" name="region" defaultValue={session.region}>
            {CITY_CATALOG.map((c) => (
              <option key={c.yandexId} value={c.name}>
                {c.name} · id {c.yandexId}
              </option>
            ))}
          </select>
        </label>
        <p className="text-[12px] text-[#9ca3af]">
          Сейчас: {main.name}, идентификатор {main.yandexId}. Коммерция в Яндексе смотрит этот регион первым.
        </p>
        <div className="flex items-center gap-3">
          <button className="ws-btn ws-btn-primary">Сохранить регион</button>
          {ok && <span className="text-sm text-[#16a34a]">{ok}</span>}
        </div>
      </form>

      <div className="ws-card mt-4 overflow-hidden">
        <div className="border-b border-[var(--ws-line,#e5e7eb)] px-4 py-3 text-sm font-semibold">
          Посадочные по регионам
        </div>
        <table className="ws-table">
          <thead>
            <tr>
              <th>Страница</th>
              <th>Регион</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-[11px] text-[#9ca3af]">{p.url}</div>
                </td>
                <td>
                  <select
                    className="ws-input py-1.5"
                    value={p.region}
                    onChange={(e) => {
                      const next = pages.map((x) => (x.id === p.id ? { ...x, region: e.target.value } : x));
                      const others = loadLandings().filter((l) => l.projectId !== project.id);
                      saveLandings([...others, ...next]);
                      setPages(next);
                    }}
                  >
                    {regs.filter((r) => r.enabled).map((r) => (
                      <option key={r.id}>{r.name}</option>
                    ))}
                    {CITY_CATALOG.map((c) => (
                      <option key={c.yandexId}>{c.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
