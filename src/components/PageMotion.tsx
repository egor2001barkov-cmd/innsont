"use client";

/// <reference types="react/canary" />

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavigateEventLike = Event & {
  canIntercept?: boolean;
  hashChange?: boolean;
  downloadRequest?: string | null;
  destination?: { url: string };
};

declare global {
  interface Window {
    navigation?: EventTarget & {
      addEventListener(type: "navigate", listener: (event: NavigateEventLike) => void): void;
      removeEventListener(type: "navigate", listener: (event: NavigateEventLike) => void): void;
    };
  }
}

function isInternalNav(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
  return true;
}

export function RouteProgress() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(false);
  const [value, setValue] = useState(0);
  const gen = useRef(0);
  const trickle = useRef<number | null>(null);
  const finishTimer = useRef<number | null>(null);
  const failTimer = useRef<number | null>(null);
  const startedAt = useRef(0);
  const active = useRef(false);

  function clearTimers() {
    if (trickle.current) window.clearInterval(trickle.current);
    if (finishTimer.current) window.clearTimeout(finishTimer.current);
    if (failTimer.current) window.clearTimeout(failTimer.current);
    trickle.current = null;
    finishTimer.current = null;
    failTimer.current = null;
  }

  function start() {
    gen.current += 1;
    const my = gen.current;
    active.current = true;
    startedAt.current = performance.now();
    clearTimers();
    setDone(false);
    setOn(true);
    setValue(0.12);
    document.documentElement.dataset.routing = "1";

    trickle.current = window.setInterval(() => {
      setValue((v) => {
        if (v >= 0.82) return v;
        const step = v < 0.25 ? 0.09 : v < 0.5 ? 0.045 : v < 0.7 ? 0.02 : 0.008;
        return Math.min(0.82, v + step * (0.55 + Math.random() * 0.7));
      });
    }, 180);

    failTimer.current = window.setTimeout(() => {
      if (gen.current === my) complete();
    }, 8000);
  }

  function complete() {
    if (!active.current) return;
    const my = gen.current;
    clearTimers();
    const wait = Math.max(0, 160 - (performance.now() - startedAt.current));
    finishTimer.current = window.setTimeout(() => {
      if (gen.current !== my) return;
      setValue(1);
      finishTimer.current = window.setTimeout(() => {
        if (gen.current !== my) return;
        setDone(true);
        finishTimer.current = window.setTimeout(() => {
          if (gen.current !== my) return;
          active.current = false;
          setOn(false);
          setDone(false);
          setValue(0);
          delete document.documentElement.dataset.routing;
        }, 160);
      }, 90);
    }, wait);
  }

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNav(anchor, event)) return;
      start();
    };
    document.addEventListener("click", onClick, true);

    const nav = window.navigation;
    const onNavigate = (event: NavigateEventLike) => {
      if (!event.canIntercept || event.hashChange || event.downloadRequest) return;
      const dest = event.destination?.url;
      if (!dest) return;
      try {
        const url = new URL(dest);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      } catch {
        return;
      }
      if (!active.current) start();
    };
    nav?.addEventListener("navigate", onNavigate);

    return () => {
      document.removeEventListener("click", onClick, true);
      nav?.removeEventListener("navigate", onNavigate);
      clearTimers();
      delete document.documentElement.dataset.routing;
    };
    // start/complete close over latest setters; mount-once is enough
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (active.current) complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!on) return null;

  return (
    <div
      className={`nav-progress${done ? " is-done" : ""}`}
      aria-hidden
    >
      <span style={{ transform: `scaleX(${value})` }} />
    </div>
  );
}

export function RouteStage({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const [basePath] = useState(path);
  const live = path !== basePath;
  const className = live ? "route-stage is-switch" : "route-stage";
  const stage = <div className={className}>{children}</div>;
  if (!ViewTransition) return stage;

  return (
    <ViewTransition
      key={path}
      enter={live ? "route-in" : "none"}
      exit="route-out"
      default="none"
    >
      {stage}
    </ViewTransition>
  );
}
