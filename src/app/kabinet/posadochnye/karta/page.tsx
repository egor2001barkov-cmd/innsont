"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { ensureProjectPages, landingScore, type LandingPage } from "@/lib/cabinet-pages";

export default function LandingsMap() {
  const { project, ready } = useWorkspace();
  const [items, setItems] = useState<LandingPage[]>([]);

  useEffect(() => {
    if (project) setItems(ensureProjectPages(project));
  }, [project?.id]);

  if (!ready || !project) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-[#6b7280]">
        Карта посадочных {hostLabel(project.url)}. Оценка — готовность URL к выдаче Яндекса и Google.
      </p>
      <div className="mt-5 space-y-2">
        {items.map((i) => {
          const score = landingScore(i.url);
          return (
            <div key={i.id} className="ws-card flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{i.title}</div>
                <div className="truncate text-[12px] text-[#9ca3af]">{i.url}</div>
                <div className="mt-1 text-[12px] text-[#6b7280]">
                  {i.type} · {i.region} · {i.status}
                </div>
              </div>
              <div className="w-40">
                <div className="mb-1 flex justify-between text-[12px]">
                  <span>Оценка</span>
                  <span className="tabular-nums">{score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${score}%`,
                      background: score >= 70 ? "#16a34a" : score >= 50 ? "#ea580c" : "#dc2626",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-[#6b7280]">Добавьте страницы в списке посадочных.</p>}
      </div>
    </div>
  );
}

function hostLabel(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
