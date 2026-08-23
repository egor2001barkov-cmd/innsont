"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const KEY = "insont.cookies";

export function CookieBanner() {
  const path = usePathname() || "";
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (path.startsWith("/kabinet")) {
      setShow(false);
      return;
    }
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, [path]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-[640px] items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5 shadow-[0_12px_40px_rgba(40,24,8,0.12)] sm:px-4">
        <p className="min-w-0 flex-1 text-[13px] leading-snug text-ink">
          Мы используем cookies для корректной работы сайта.{" "}
          <Link href="/cookies" className="font-semibold text-orange hover:underline">
            Подробнее
          </Link>
        </p>
        <button
          type="button"
          className="btn-primary shrink-0 px-3 py-1.5 text-[13px]"
          onClick={() => {
            try {
              localStorage.setItem(KEY, "1");
            } catch {
              /* ignore */
            }
            setShow(false);
          }}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
