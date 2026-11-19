"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Тонкая полоса загрузки сверху при любой смене раздела кабинета.
 * Анимация: разгон до 80% и финиш до 100%; классы из kabinet.css (ws-route-*).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "run" | "done">("run");

  useEffect(() => {
    // Навигация в кабинете — браузерная (UrlBarLoad), каждая страница = новая загрузка:
    // полоса показывается и на монтировании, и на смене пути.
    setPhase("run");
    const t1 = setTimeout(() => setPhase("done"), 450);
    const t2 = setTimeout(() => setPhase("idle"), 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  if (phase === "idle") return null;
  return (
    <div className="ws-route-bar" aria-hidden="true">
      <span className={phase === "run" ? "ws-route-run" : "ws-route-done"} />
    </div>
  );
}
