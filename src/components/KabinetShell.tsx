"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Icons";
import { Wordmark } from "@/components/Wordmark";
import {
  FREE_QUERIES,
  clearSession,
  loadSession,
  queriesLeft,
  type Session,
} from "@/lib/session";

const NAV = [
  { href: "/kabinet", label: "Обзор" },
  { href: "/kabinet/vidimost", label: "Видимость" },
  { href: "/kabinet/deystviya", label: "Центр действий" },
  { href: "/kabinet/statyi", label: "Автор статей" },
  { href: "/kabinet/issledovanie", label: "Исследование" },
  { href: "/kabinet/akkaunt", label: "Аккаунт" },
  { href: "/kabinet/komanda", label: "Команда" },
  { href: "/kabinet/tarify", label: "Подписка" },
  { href: "/kabinet/scheta", label: "Счета" },
  { href: "/kabinet/nastroyki", label: "Настройки" },
];

export function KabinetShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      if (!s) {
        router.replace("/vhod");
        return;
      }
      setSession(s);
    };
    sync();
    window.addEventListener("insont-session", sync);
    return () => window.removeEventListener("insont-session", sync);
  }, [router]);

  if (!session) {
    return <div className="p-10 text-sm text-muted">Загрузка кабинета…</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3eee6]">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-line bg-[#efe8db] p-4 md:block">
          <Link href="/" className="flex items-center gap-2 px-2 py-2">
            <LogoMark className="h-7 w-7" />
            <Wordmark className="text-[13px]" />
          </Link>
          <nav className="mt-6 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                  pathname === n.href ? "bg-white text-ink" : "text-muted hover:bg-white/60"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            className="mt-8 px-3 text-sm text-muted"
            onClick={() => {
              clearSession();
              router.push("/");
            }}
          >
            Выйти
          </button>
        </aside>
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="text-sm text-muted md:hidden">
              <LogoMark className="inline h-6 w-6" />
            </div>
            <div className="text-sm">
              {session.name} · {session.email}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted">
                {session.paid
                  ? "Тариф активен"
                  : `Запросов: ${queriesLeft(session)} из ${FREE_QUERIES}`}
              </span>
              <Link href="/kabinet/akkaunt" className="font-semibold text-orange">
                Аккаунт
              </Link>
            </div>
          </header>
          <div className="flex gap-2 overflow-auto border-b border-line px-4 py-2 md:hidden">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap text-sm">
                {n.label}
              </Link>
            ))}
          </div>
          <div className="p-5 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
