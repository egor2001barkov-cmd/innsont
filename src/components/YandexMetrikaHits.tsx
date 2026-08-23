"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const YM_ID = 111878788;

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function YandexMetrikaHits() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const qs = searchParams.toString();
    const url = pathname + (qs ? `?${qs}` : "");
    window.ym?.(YM_ID, "hit", url);
  }, [pathname, searchParams]);

  return null;
}
