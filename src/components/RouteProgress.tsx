"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ползунок загрузки при переходах между вкладками и разделами.
 * Без внешних зависимостей: перехват кликов по внутренним ссылкам (capture)
 * и кнопок «назад/вперёд» (popstate); завершение — по факту смены маршрута.
 * Страховка от «зависшего» ползунка: автозавершение через 8 секунд.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<number | null>(null); // null = скрыт
  const progressRef = useRef<number | null>(null);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failSafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = useCallback((v: number | null) => {
    progressRef.current = v;
    setProgress(v);
  }, []);

  const clearTimers = useCallback(() => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
    if (finishTimer.current) {
      clearTimeout(finishTimer.current);
      finishTimer.current = null;
    }
    if (failSafe.current) {
      clearTimeout(failSafe.current);
      failSafe.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    set(100);
    finishTimer.current = setTimeout(() => set(null), 350);
  }, [clearTimers, set]);

  const start = useCallback(() => {
    if (progressRef.current !== null) return; // уже идёт
    clearTimers();
    // стартовая позиция без Math.random: время дня даёт лёгкое «живое» дрожание
    set(10 + (Date.now() % 90) / 10);
    // плавное «подтекание» до 86% — страница грузится
    trickle.current = setInterval(() => {
      const p = progressRef.current;
      if (p === null) return;
      set(p >= 86 ? p : p + (100 - p) * 0.09);
    }, 180);
    // страховка: если переход затерялся — завершаем сами
    failSafe.current = setTimeout(finish, 8000);
  }, [clearTimers, finish, set]);

  // перехват кликов по внутренним ссылкам + назад/вперёд
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // переход на ту же страницу (в т.ч. якорь) — ползунок не нужен
      if (url.pathname === window.location.pathname) return;
      start();
    };
    const onPop = () => start();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [start]);

  // маршрут сменился — дожимаем до 100% и прячем
  useEffect(() => {
    if (progressRef.current === null) return;
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // размонтирование: убрать таймеры
  useEffect(() => clearTimers, [clearTimers]);

  if (progress === null) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[9999]">
      <div
        className="h-[3px] bg-gradient-to-r from-[#ea580c] to-[#f59e0b] shadow-[0_0_10px_rgba(234,88,12,0.75)] transition-[width] duration-200 ease-out will-change-width"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
