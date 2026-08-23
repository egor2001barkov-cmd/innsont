"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { Ico } from "@/components/kabinet/icons";
import { Bars3D } from "@/components/kabinet/Chart3D";
import {
  ensureProjectPages,
  landingScore,
  type LandingPage,
} from "@/lib/cabinet-pages";

export default function LandingsOverview() {
  const { project, ready } = useWorkspace();
  const [items, setItems] = useState<LandingPage[]>([]);

  useEffect(() => {
    if (project) setItems(ensureProjectPages(project));
  }, [project?.id]);

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => {
      map[i.type] = (map[i.type] || 0) + 1;
    });
    return map;
  }, [items]);

  if (!ready || !project) return null;

  const avg = items.length
    ? Math.round(items.reduce((s, i) => s + landingScore(i.url), 0) / items.length)
    : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Посадочные {project.name}: страницы, с которых Яндекс, Google и Bing берут сниппет. У каждого
        проекта свой набор.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Страниц</div>
          <div className="mt-1 text-2xl font-bold">{items.length}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Средняя оценка</div>
          <div className="mt-1 text-2xl font-bold">{avg}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Готово</div>
          <div className="mt-1 text-2xl font-bold">{items.filter((i) => i.status === "готово").length}</div>
        </div>
      </div>

      <div className="ws-card mt-4 p-5">
        <h2 className="text-sm font-semibold">По типам</h2>
        <Bars3D
          values={Object.values(byType)}
          labels={Object.keys(byType)}
          color="#ea580c"
          height={180}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/kabinet/posadochnye/spisok" className="ws-card flex items-start gap-3 p-4 hover:border-[#fdba74]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
            <Ico name="file" />
          </span>
          <span>
            <span className="block font-semibold">Список страниц</span>
            <span className="text-[13px] text-[#6b7280]">Добавить, тип, регион, статус</span>
          </span>
        </Link>
        <Link href="/kabinet/posadochnye/karta" className="ws-card flex items-start gap-3 p-4 hover:border-[#fdba74]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
            <Ico name="map" />
          </span>
          <span>
            <span className="block font-semibold">Карта посадочных</span>
            <span className="text-[13px] text-[#6b7280]">Оценка и покрытие по URL</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
