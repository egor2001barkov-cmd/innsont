"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { Ico } from "@/components/kabinet/icons";
import { Bars3D } from "@/components/kabinet/Chart3D";
import { ensureProjectPages, ensureProjectRegions, type RegionPref } from "@/lib/cabinet-pages";

export default function RegionsOverview() {
  const { project, ready } = useWorkspace();
  const [regs, setRegs] = useState<RegionPref[]>([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (!project) return;
    setRegs(ensureProjectRegions(project));
    setPageCount(ensureProjectPages(project).length);
  }, [project?.id]);

  if (!ready || !project) return null;
  const on = regs.filter((r) => r.enabled);
  const high = on.filter((r) => r.priority === "высокий").length;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Региональность {project.name}: где сайт должен быть в Яндексе и какие городские посадочные вести.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Включено регионов</div>
          <div className="mt-1 text-2xl font-bold">{on.length}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Высокий приоритет</div>
          <div className="mt-1 text-2xl font-bold">{high}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Посадочных в проекте</div>
          <div className="mt-1 text-2xl font-bold">{pageCount}</div>
        </div>
      </div>

      <div className="ws-card mt-4 p-5">
        <h2 className="text-sm font-semibold">Приоритет</h2>
        <Bars3D
          values={regs.filter((r) => r.enabled).map((r) => (r.priority === "высокий" ? 90 : r.priority === "средний" ? 55 : 25))}
          labels={regs.filter((r) => r.enabled).map((r) => r.name)}
          color="#fc3f1d"
          height={180}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/kabinet/regiony/goroda" className="ws-card flex items-start gap-3 p-4 hover:border-[#fdba74]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
            <Ico name="map" />
          </span>
          <span>
            <span className="block font-semibold">Города</span>
            <span className="text-[13px] text-[#6b7280]">Включить регион и задать приоритет</span>
          </span>
        </Link>
        <Link href="/kabinet/regiony/yandex" className="ws-card flex items-start gap-3 p-4 hover:border-[#fdba74]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
            <Ico name="search" />
          </span>
          <span>
            <span className="block font-semibold">Яндекс-регион</span>
            <span className="text-[13px] text-[#6b7280]">ID Вебмастера и привязка посадочных</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
