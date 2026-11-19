"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Тонкая полоса загрузки сверху при любой смене раздела кабинета.
 * Анимация: разгон до 80% и финиш до 100%; классы из kabinet.css (ws-route-*).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // первый рендер — без полосы
    if (phase === "idle" && !timers.current.length) {
      timers.current.push(setTimeout(() => {}, 0));
      return;
    }
    setPhase("run");
    const t1 = setTimeout(() => setPhase("done"), 450);
    const t2 = setTimeout(() => setPhase("idle"), 750);
    timers.current.push(t1, t2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (phase === "idle") return null;
  return (
    <div className="ws-route-bar" aria-hidden="true">
      <span className={phase === "run" ? "ws-route-run" : "ws-route-done"} />
    </div>
  );
}
