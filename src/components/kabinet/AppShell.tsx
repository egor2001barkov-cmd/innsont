"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatRub } from "@/lib/site";
import { clearSession, isDevAccount, loadSession, planForSession, saveSession, type Session } from "@/lib/session";
import {
  hasOnboardedProject,
  hostOf,
  loadActiveProjectId,
  loadProjects,
  saveActiveProjectId,
  saveProjects,
  type Project,
} from "@/lib/workspace";
import { BrandMark, Ico } from "./icons";

const NAV = [
  { href: "/kabinet", label: "Главная", icon: "home", exact: true },
  { href: "/kabinet/kontent", label: "Ваш контент", icon: "file" },
  { href: "/kabinet/stili", label: "Стили письма", icon: "pen" },
  { href: "/kabinet/druzia", label: "Пригласить друга", icon: "mail" },
];

const GEO = [
  { href: "/kabinet/vidimost", label: "Обзор", icon: "chart" },
  { href: "/kabinet/boty", label: "Аналитика ботов", icon: "bot" },
  { href: "/kabinet/deystviya", label: "Центр действий", icon: "zap" },
];

const SEO_TOP = [
  { href: "/kabinet/kluchi", label: "Ключи", icon: "key" },
  { href: "/kabinet/audit", label: "Аудит сайта", icon: "search" },
];
const SEO_NEW = [
  { href: "/kabinet/strategiya", label: "Стратегия", icon: "map" },
  { href: "/kabinet/statyi", label: "Создание контента", icon: "edit" },
  { href: "/kabinet/chat", label: "Чат", icon: "chat" },
];
const SEO_OLD = [
  { href: "/kabinet/optimizatsiya", label: "Оптимизация", icon: "wrench" },
  { href: "/kabinet/pereupakovka", label: "Переупаковка", icon: "recycle" },
];

const LANDINGS = [
  { href: "/kabinet/posadochnye", label: "Обзор", icon: "folder", exact: true },
  { href: "/kabinet/posadochnye/spisok", label: "Страницы", icon: "file" },
  { href: "/kabinet/posadochnye/karta", label: "Карта", icon: "chart" },
];

const REGIONS_NAV = [
  { href: "/kabinet/regiony", label: "Обзор", icon: "map", exact: true },
  { href: "/kabinet/regiony/goroda", label: "Города", icon: "map" },
  { href: "/kabinet/regiony/yandex", label: "Яндекс-регион", icon: "search" },
];

const TITLES: Record<string, string> = {
  "/kabinet": "Главная",
  "/kabinet/kontent": "Ваш контент",
  "/kabinet/stili": "Стили письма",
  "/kabinet/druzia": "Пригласить друга",
  "/kabinet/vidimost": "Обзор видимости",
  "/kabinet/boty": "Аналитика ботов",
  "/kabinet/deystviya": "Центр действий",
  "/kabinet/kluchi": "Ключи",
  "/kabinet/onboarding": "Новый проект",
  "/kabinet/audit": "Аудит сайта",
  "/kabinet/strategiya": "Стратегия",
  "/kabinet/statyi": "Создание контента",
  "/kabinet/chat": "Чат",
  "/kabinet/optimizatsiya": "Оптимизация",
  "/kabinet/pereupakovka": "Переупаковка",
  "/kabinet/posadochnye": "Посадочные",
  "/kabinet/posadochnye/spisok": "Посадочные · страницы",
  "/kabinet/posadochnye/karta": "Посадочные · карта",
  "/kabinet/regiony": "Региональность",
  "/kabinet/regiony/goroda": "Регионы · города",
  "/kabinet/regiony/yandex": "Регионы · Яндекс",
  "/kabinet/tarify": "Тарифы",
  "/kabinet/akkaunt": "Аккаунт",
  "/kabinet/komanda": "Команда",
  "/kabinet/scheta": "Счета",
  "/kabinet/nastroyki": "Настройки",
  "/kabinet/issledovanie": "Исследование",
};

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] ${
        active ? "bg-[#f3f4f6] font-medium text-[#111827]" : "text-[#4b5563] hover:bg-[#f7f7f8]"
      }`}
    >
      <Ico name={icon} className="h-[16px] w-[16px] shrink-0 text-[#6b7280]" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState("site");
  const [openSwitch, setOpenSwitch] = useState(false);
  const [manage, setManage] = useState(false);
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      if (!s) {
        router.replace("/vhod");
        return;
      }
      setSession(s);
      void fetch(`/api/ref?email=${encodeURIComponent(s.email)}`)
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.count === "number" && d.count !== s.referralCount) {
            saveSession({ ...s, refCode: d.code || s.refCode, referralCount: d.count });
          }
        })
        .catch(() => undefined);
      const ps = loadProjects();
      setProjects(ps);
      setActiveId(loadActiveProjectId(ps));
    };
    sync();
    window.addEventListener("insont-session", sync);
    window.addEventListener("insont-workspace", sync);
    return () => {
      window.removeEventListener("insont-session", sync);
      window.removeEventListener("insont-workspace", sync);
    };
  }, [router]);

  useEffect(() => {
    if (!session) return;
    if (!hasOnboardedProject(projects) && pathname !== "/kabinet/onboarding") {
      router.replace("/kabinet/onboarding");
    }
  }, [session, projects, pathname, router]);

  const active = projects.find((p) => p.id === activeId) || projects[0];
  const plan = planForSession(session);
  const dev = isDevAccount(session?.email);
  const title =
    pathname === "/kabinet" && session
      ? greet(session.name)
      : TITLES[pathname] || "Кабинет";

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.url.toLowerCase().includes(q.toLowerCase())
      ),
    [projects, q]
  );

  function selectProject(id: string) {
    saveActiveProjectId(id);
    setActiveId(id);
    setOpenSwitch(false);
  }

  function removeProject(id: string) {
    const next = projects.filter((p) => p.id !== id);
    saveProjects(next);
    setProjects(next);
    if (activeId === id) {
      if (next[0]) selectProject(next[0].id);
      else router.push("/kabinet/onboarding");
    }
  }

  function retryPay() {
    if (!session) return;
    saveSession({ ...session, paid: true, paymentFailed: false });
    setSession({ ...session, paid: true, paymentFailed: false });
    setToast("Оплата прошла, тариф активен");
  }

  if (!session) {
    return (
      <div className="ws-app flex min-h-screen items-center justify-center text-sm text-[#6b7280]">
        Загрузка кабинета…
      </div>
    );
  }

  if (!hasOnboardedProject(projects) && pathname === "/kabinet/onboarding") {
    return (
      <div className="ws-app min-h-screen bg-[#f7f7f8]">
        <header className="flex items-center justify-between border-b border-[#ececec] bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <BrandMark className="h-7 w-7" />
            <span className="text-[15px] font-semibold">INSONT</span>
          </div>
          <span className="text-[13px] text-[#6b7280]">{session.email}</span>
        </header>
        <div className="p-5 md:p-10">{children}</div>
      </div>
    );
  }

  const initials = (session.name || session.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sidebar = (
    <>
      <div className="flex items-center gap-2 px-1 pb-3">
        <BrandMark className="h-7 w-7" />
        <span className="text-[15px] font-semibold tracking-tight">INSONT</span>
        <span className="rounded-md bg-[#f3f4f6] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
          {dev ? "Dev" : "Standard"}
        </span>
      </div>

      <div className="relative mb-3">
        <button
          className="flex w-full items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-2 text-left hover:bg-[#fafafa]"
          onClick={() => setOpenSwitch((v) => !v)}
        >
          <ProjectAvatar p={active} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium">{active?.name || "Добавить сайт"}</span>
          </span>
          <Ico name="chev" className="h-4 w-4 text-[#9ca3af]" />
        </button>
        {openSwitch && (
          <div className="absolute left-0 right-0 z-40 mt-1 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-xl">
            <div className="flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
              Ваши проекты
              <Ico name="filter" className="h-3.5 w-3.5" />
            </div>
            {projects.map((p) => (
              <button
                key={p.id}
                className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f9fafb]"
                onClick={() => selectProject(p.id)}
              >
                <ProjectAvatar p={p} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium">{p.name}</span>
                  <span className="block truncate text-[11px] text-[#9ca3af]">{hostOf(p.url)}</span>
                </span>
                {p.id === activeId && <Ico name="check" className="h-4 w-4 text-[#111827]" />}
              </button>
            ))}
            <Link
              href="/kabinet/onboarding"
              className="flex w-full items-center gap-2 border-t border-[#f3f4f6] px-3 py-2.5 text-[13.5px] text-[#374151] hover:bg-[#f9fafb]"
              onClick={() => setOpenSwitch(false)}
            >
              <Ico name="plus" className="h-4 w-4" /> Добавить проект
            </Link>
            <button
              className="flex w-full items-center gap-2 px-3 py-2.5 text-[13.5px] text-[#374151] hover:bg-[#f9fafb]"
              onClick={() => {
                setOpenSwitch(false);
                setManage(true);
              }}
            >
              <Ico name="wrench" className="h-4 w-4" /> Управление проектами
            </button>
          </div>
        )}
      </div>

      <nav className="space-y-0.5">
        {NAV.map((n) => (
          <NavLink
            key={n.href}
            {...n}
            active={n.exact ? pathname === n.href : pathname.startsWith(n.href)}
          />
        ))}
      </nav>

      <div className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
        Видимость в ИИ (GEO)
      </div>
      <nav className="mt-1 space-y-0.5">
        {GEO.map((n) => (
          <NavLink key={n.href} {...n} active={pathname.startsWith(n.href)} />
        ))}
      </nav>

      <div className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
        SEO и контент
      </div>
      <nav className="mt-1 space-y-0.5">
        {SEO_TOP.map((n) => (
          <NavLink key={n.href} {...n} active={pathname.startsWith(n.href)} />
        ))}
      </nav>
      <div className="mt-2 px-2 text-[11px] text-[#9ca3af]">Новый контент</div>
      <nav className="mt-0.5 space-y-0.5">
        {SEO_NEW.map((n) => (
          <NavLink key={n.href} {...n} active={pathname.startsWith(n.href)} />
        ))}
      </nav>
      <div className="mt-2 px-2 text-[11px] text-[#9ca3af]">Существующий контент</div>
      <nav className="mt-0.5 space-y-0.5">
        {SEO_OLD.map((n) => (
          <NavLink key={n.href} {...n} active={pathname.startsWith(n.href)} />
        ))}
      </nav>

      <div className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
        Посадочные
      </div>
      <nav className="mt-1 space-y-0.5">
        {LANDINGS.map((n) => (
          <NavLink
            key={n.href}
            {...n}
            active={n.exact ? pathname === n.href : pathname.startsWith(n.href)}
          />
        ))}
      </nav>

      <div className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
        Региональность
      </div>
      <nav className="mt-1 space-y-0.5">
        {REGIONS_NAV.map((n) => (
          <NavLink
            key={n.href}
            {...n}
            active={n.exact ? pathname === n.href : pathname.startsWith(n.href)}
          />
        ))}
      </nav>

      {dev ? (
        <div className="mt-5 rounded-lg bg-[#111827] px-3 py-2 text-center text-[12px] font-medium text-white">
          Разработчик · безлимит
        </div>
      ) : (
        <Link
          href="/kabinet/tarify"
          className="mt-5 flex items-center justify-center gap-1.5 rounded-lg border border-[#fdba74] px-3 py-2 text-[13.5px] font-semibold text-[#ea580c] hover:bg-[#fff7ed]"
        >
          <Ico name="spark" className="h-4 w-4" /> Обновить тариф
        </Link>
      )}

      <div className="mt-auto border-t border-[#f3f4f6] pt-3">
        <button
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-[#f9fafb]"
          onClick={() => setMenu((v) => !v)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111827] text-[11px] font-bold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium">Личное пространство</span>
            <span className="block text-[11px] text-[#9ca3af]">Приватное</span>
          </span>
          <Ico name="chev" className="h-4 w-4 text-[#9ca3af]" />
        </button>
        {menu && (
          <div className="mt-1 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white py-1 text-[13px] shadow-lg">
            <Link href="/kabinet/akkaunt" className="block px-3 py-1.5 hover:bg-[#f9fafb]" onClick={() => setMenu(false)}>
              Аккаунт
            </Link>
            <Link href="/kabinet/komanda" className="block px-3 py-1.5 hover:bg-[#f9fafb]" onClick={() => setMenu(false)}>
              Команда
            </Link>
            <Link href="/kabinet/scheta" className="block px-3 py-1.5 hover:bg-[#f9fafb]" onClick={() => setMenu(false)}>
              Счета
            </Link>
            <Link href="/kabinet/nastroyki" className="block px-3 py-1.5 hover:bg-[#f9fafb]" onClick={() => setMenu(false)}>
              Настройки
            </Link>
            <button
              className="block w-full px-3 py-1.5 text-left text-[#b91c1c] hover:bg-[#fef2f2]"
              onClick={() => {
                clearSession();
                router.push("/");
              }}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="ws-app flex min-h-screen">
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[#ececec] bg-white p-3 md:flex">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {session.paymentFailed && (
          <div className="flex flex-wrap items-center gap-3 border-b border-[#fecaca] bg-[#fff7f7] px-5 py-2.5">
            <p className="flex-1 text-[13.5px] text-[#b91c1c]">
              Платёж {formatRub(session.failedAmount)} не прошёл. Повторите оплату или обновите способ, чтобы
              пользоваться INSONT.
            </p>
            <button className="text-[13.5px] font-medium text-[#111827]" onClick={() => setPayOpen(true)}>
              Обновить способ оплаты
            </button>
            <button className="ws-btn ws-btn-primary py-1.5 text-[13px]" onClick={retryPay}>
              Повторить оплату
            </button>
          </div>
        )}

        <header className="flex items-center justify-between border-b border-[#ececec] bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <button className="md:hidden" onClick={() => setMobileNav(true)} aria-label="Меню">
              <Ico name="home" />
            </button>
            <h1 className="truncate text-[15px] font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1.5 text-[13.5px] text-[#4b5563] hover:text-[#111827]"
              onClick={() => setHelp(true)}
            >
              <Ico name="help" className="h-4 w-4" /> Справка
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5e7eb] text-[11px] font-bold"
              onClick={() => router.push("/kabinet/akkaunt")}
            >
              {initials}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </div>

      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileNav(false)} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-[248px] flex-col bg-white p-3">
            <button className="mb-2 self-end text-sm text-[#6b7280]" onClick={() => setMobileNav(false)}>
              Закрыть
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {manage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Управление проектами</h2>
                <p className="mt-0.5 text-[13px] text-[#6b7280]">Редактируйте или удаляйте проекты пространства</p>
              </div>
              <button onClick={() => setManage(false)} aria-label="Закрыть">
                <Ico name="x" className="h-5 w-5 text-[#6b7280]" />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                className="ws-input"
                placeholder="Поиск"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="ws-btn ws-btn-outline px-3" aria-label="Фильтр">
                <Ico name="filter" />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] px-3 py-2.5">
                  <ProjectAvatar p={p} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium">{p.name}</div>
                    <div className="truncate text-[12px] text-[#9ca3af]">{p.url}</div>
                  </div>
                  <details className="relative">
                    <summary className="list-none cursor-pointer p-1 text-[#9ca3af]">
                      <Ico name="dots" />
                    </summary>
                    <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white py-1 text-[13px] shadow-lg">
                      <button
                        className="block w-full px-3 py-1.5 text-left hover:bg-[#f9fafb]"
                        onClick={() => {
                          selectProject(p.id);
                          setManage(false);
                        }}
                      >
                        Открыть
                      </button>
                      <button
                        className="block w-full px-3 py-1.5 text-left text-[#b91c1c] hover:bg-[#fef2f2]"
                        onClick={() => removeProject(p.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </details>
                </div>
              ))}
            </div>
            <Link
              href="/kabinet/onboarding"
              className="ws-btn ws-btn-primary mt-3 w-full"
              onClick={() => setManage(false)}
            >
              <Ico name="plus" className="h-4 w-4" /> Проект
            </Link>
          </div>
        </div>
      )}

      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              retryPay();
              setPayOpen(false);
            }}
          >
            <h2 className="text-lg font-semibold">Способ оплаты</h2>
            <p className="text-[13px] text-[#6b7280]">Карта, СБП или счёт юрлица. Для демо достаточно сохранить.</p>
            <input className="ws-input" required placeholder="Номер карты" defaultValue="2200 20•• •••• 4418" />
            <div className="grid grid-cols-2 gap-2">
              <input className="ws-input" required placeholder="ММ/ГГ" defaultValue="08/28" />
              <input className="ws-input" required placeholder="CVC" defaultValue="•••" />
            </div>
            <div className="flex gap-2 pt-1">
              <button className="ws-btn ws-btn-primary flex-1" type="submit">
                Сохранить и оплатить
              </button>
              <button className="ws-btn ws-btn-outline" type="button" onClick={() => setPayOpen(false)}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {help && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setHelp(false)}>
          <div className="h-full w-full max-w-md overflow-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Справка</h2>
              <button onClick={() => setHelp(false)}>
                <Ico name="x" />
              </button>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#374151]">
              <li>
                Раздел «Ключи»: Wordstat API (токен) + подсказки Яндекса + посадочные конкурентов по сфере.
              </li>
              <li>Промпты тарифа: {session.promptsUsed} из {plan.limits.prompts} в этом месяце.</li>
              <li>Проекты: {projects.length} из {plan.limits.projects}.</li>
              <li>Центр действий есть только на «Росте».</li>
              <li>
                Инфографика строится по выбранному проекту. Сайт и конкурентов задаёте сами.
              </li>
              <li>
                <Link href="/resursy/pomoshch" className="font-medium text-[#ea580c]" onClick={() => setHelp(false)}>
                  База знаний →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {toast && (
        <button
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-[#111827] px-4 py-2 text-sm text-white shadow-lg"
          onClick={() => setToast("")}
        >
          {toast}
        </button>
      )}
    </div>
  );
}

function ProjectAvatar({ p }: { p?: Project }) {
  if (!p) return <span className="h-8 w-8 rounded-full bg-[#e5e7eb]" />;
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
      style={{ background: p.color }}
    >
      {p.letter}
    </span>
  );
}

function greet(name: string) {
  const h = new Date().getHours();
  const hello = h < 12 ? "Доброе утро" : h < 18 ? "Добрый день" : "Добрый вечер";
  const short = (name || "гость").split(" ")[0];
  return `${hello}, ${short}!`;
}
