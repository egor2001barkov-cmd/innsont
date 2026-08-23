"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURED, PLATFORM, RESOURCES, SITE, SOLUTIONS } from "@/lib/site";
import { SITE_SECTIONS } from "@/lib/site-map";
import { loadSession } from "@/lib/session";
import { Icon, LogoMark, MaxMark, TelegramMark } from "./Icons";
import { Wordmark } from "./Wordmark";

function Item({
  href,
  title,
  desc,
  icon,
  highlight,
  onClick,
}: {
  href: string;
  title: string;
  desc: string;
  icon: string;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex gap-3 rounded-2xl p-3 transition duration-200 ${
        highlight ? "bg-orange-soft" : "hover:bg-bg-deep"
      }`}
    >
      <span className="mt-0.5 text-[#c96a38] transition duration-200 group-hover:text-orange">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span>
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted">{desc}</span>
      </span>
    </Link>
  );
}

function Promo({
  badge,
  title,
  desc,
  href,
  kind,
}: {
  badge: string;
  title: string;
  desc: string;
  href: string;
  kind: "hub" | "study";
}) {
  return (
    <Link href={href} className="block rounded-[20px] bg-bg-deep p-4">
      <div className="overflow-hidden rounded-2xl bg-[#111] text-white">
        {kind === "hub" ? (
          <div className="relative aspect-[16/9] p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">
              Хаб проектов
            </div>
            <div className="mt-2 text-xl font-semibold">Кабинет проектов</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              {["Видимость 71.9%", "Цитаты 64.2%", "GigaChat 44.1%", "Яндекс 38.5%"].map(
                (x) => (
                  <div key={x} className="rounded-lg bg-white/8 px-2 py-2">
                    {x}
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/9] p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-orange">
              Доля цитат
            </div>
            <div className="mt-3 text-lg font-semibold leading-snug">
              Что отделяет победителей ИИ-видимости?
            </div>
            <div className="mt-4 text-[12px] text-white/60">
              4 670 брендов · 4 месяца
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
        {badge}
      </div>
      <div className="mt-2 text-[17px] font-semibold leading-snug">{title}</div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{desc}</p>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<null | "platform" | "solutions" | "resources">(
    null
  );
  const [mobile, setMobile] = useState(false);
  const [acc, setAcc] = useState<string | null>("Платформа");
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    setAuthed(!!loadSession());
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobile(false);
    setOpen(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  if (pathname.startsWith("/kabinet")) return null;

  const mobileSections = SITE_SECTIONS.filter(
    (s) => s.title !== "Главное" && s.items.length > 0
  );

  return (
    <header
      className={`site-header sticky top-0 z-50 border-b text-ink ${
        scrolled ? "border-line bg-bg/90 backdrop-blur-xl" : "border-transparent bg-bg"
      }`}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 text-ink">
            <LogoMark className="h-8 w-8" />
            <Wordmark className="text-[15px] text-ink sm:text-[16px]" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium ${
                open === "platform" ? "text-orange" : "text-ink/80"
              }`}
              onMouseEnter={() => setOpen("platform")}
            >
              Платформа
              <Icon name="chevron" className="h-4 w-4" />
            </button>
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium ${
                open === "solutions" ? "text-orange" : "text-ink/80"
              }`}
              onMouseEnter={() => setOpen("solutions")}
            >
              Решения
              <Icon name="chevron" className="h-4 w-4" />
            </button>
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium ${
                open === "resources" ? "text-orange" : "text-ink/80"
              }`}
              onMouseEnter={() => setOpen("resources")}
            >
              Ресурсы
              <Icon name="chevron" className="h-4 w-4" />
            </button>
            <Link
              href="/seo"
              className="rounded-full px-3 py-2 text-[15px] font-medium text-ink/80"
              onMouseEnter={() => setOpen(null)}
            >
              SEO
            </Link>
            <Link
              href="/geo"
              className="rounded-full px-3 py-2 text-[15px] font-medium text-ink/80"
              onMouseEnter={() => setOpen(null)}
            >
              Нейросети
            </Link>
            <Link
              href="/tseny"
              className="rounded-full px-3 py-2 text-[15px] font-medium text-ink/80"
              onMouseEnter={() => setOpen(null)}
            >
              Тарифы
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full opacity-95 transition hover:opacity-100"
            aria-label={`Telegram ${SITE.telegramHandle}`}
          >
            <TelegramMark className="h-9 w-9" />
          </a>
          <a
            href={SITE.max}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full opacity-95 transition hover:opacity-100"
            aria-label="MAX"
          >
            <MaxMark className="h-9 w-9" />
          </a>
          <div className="hidden items-center gap-2 lg:flex">
            {authed ? (
              <Link href="/kabinet" className="btn-primary">
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link href="/vhod" className="btn-ghost">
                  Войти
                </Link>
                <Link href="/registratsiya" className="btn-outline">
                  Создать аккаунт
                </Link>
                <Link href="/demo" className="btn-primary">
                  Заказать демо
                </Link>
              </>
            )}
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            onClick={() => setMobile((v) => !v)}
            aria-label={mobile ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobile}
          >
            <Icon name={mobile ? "x" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-1/2 hidden w-[min(1120px,calc(100vw-32px))] -translate-x-1/2 pb-4 lg:block">
          <div className="mega card overflow-hidden">
            {open === "platform" && (
              <div className="grid grid-cols-[1fr_340px]">
                <div className="grid grid-cols-2 gap-2 p-5">
                  <div>
                    {PLATFORM.filter((g) =>
                      ["Исследовать", "Отслеживать"].includes(g.label)
                    ).map((g) => (
                      <div key={g.label} className="mb-4">
                        <div className="px-3 pb-1 text-[13px] font-semibold text-orange">
                          {g.label}
                        </div>
                        {g.items.map((it) => (
                          <Item key={it.href} {...it} onClick={() => setOpen(null)} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div>
                    {PLATFORM.filter((g) =>
                      ["Приоритизировать", "Действовать"].includes(g.label)
                    ).map((g) => (
                      <div key={g.label} className="mb-4">
                        <div className="px-3 pb-1 text-[13px] font-semibold text-orange">
                          {g.label}
                        </div>
                        {g.items.map((it) => (
                          <Item key={it.href} {...it} onClick={() => setOpen(null)} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-l border-line bg-bg-deep p-4">
                  <Promo {...FEATURED.platform} kind="hub" />
                </div>
              </div>
            )}
            {open === "solutions" && (
              <div className="grid grid-cols-2 gap-2 p-5 xl:grid-cols-3">
                {SOLUTIONS.map((it) => (
                  <Item key={it.href} {...it} onClick={() => setOpen(null)} />
                ))}
              </div>
            )}
            {open === "resources" && (
              <div className="grid grid-cols-[1fr_340px]">
                <div className="grid grid-cols-2 gap-2 p-5">
                  <div>
                    {RESOURCES.filter((g) =>
                      ["Учиться", "Бесплатные инструменты", "Подключать"].includes(
                        g.label
                      )
                    ).map((g) => (
                      <div key={g.label} className="mb-4">
                        <div className="px-3 pb-1 text-[13px] font-semibold text-orange">
                          {g.label}
                        </div>
                        {g.items.map((it) => (
                          <Item key={it.href} {...it} onClick={() => setOpen(null)} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div>
                    {RESOURCES.filter((g) =>
                      ["Разрабатывать", "Доказывать", "Партнёрам"].includes(g.label)
                    ).map((g) => (
                      <div key={g.label} className="mb-4">
                        <div className="px-3 pb-1 text-[13px] font-semibold text-orange">
                          {g.label}
                        </div>
                        {g.items.map((it) => (
                          <Item key={it.href} {...it} onClick={() => setOpen(null)} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-l border-line bg-bg-deep p-4">
                  <Promo {...FEATURED.resources} kind="study" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {mobile && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto border-t border-line bg-bg px-5 py-4 text-ink lg:hidden">
          <div className="mx-auto flex max-w-[640px] flex-col pb-24">
            {mobileSections.map((sec) => {
              const opened = acc === sec.title;
              return (
                <div key={sec.title} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    onClick={() => setAcc(opened ? null : sec.title)}
                    aria-expanded={opened}
                  >
                    <span className="text-[16px] font-semibold">{sec.title}</span>
                    <span
                      className={`shrink-0 text-muted transition ${opened ? "rotate-180" : ""}`}
                    >
                      <Icon name="chevron" className="h-4 w-4" />
                    </span>
                  </button>
                  {opened && (
                    <div className="flex flex-col gap-1 pb-4">
                      {sec.href && (
                        <Link
                          href={sec.href}
                          className="rounded-xl px-3 py-2 text-[14px] font-semibold text-orange"
                        >
                          Все страницы раздела
                        </Link>
                      )}
                      {sec.items.map((it) => (
                        <Link
                          key={it.href}
                          href={it.href}
                          className="rounded-xl px-3 py-2.5 hover:bg-bg-deep"
                        >
                          <span className="block text-[15px] font-medium">{it.name}</span>
                          {it.desc && (
                            <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                              {it.desc}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-3 flex flex-col gap-1 text-[15px]">
              <Link href="/tseny" className="rounded-xl px-3 py-2.5 font-medium">
                Тарифы
              </Link>
              <Link href="/strategiya" className="rounded-xl px-3 py-2.5 font-medium">
                Стратегии
              </Link>
              <Link href="/pochemu-insont" className="rounded-xl px-3 py-2.5 font-medium">
                Почему INSONT
              </Link>
              <Link href="/dlya-komand" className="rounded-xl px-3 py-2.5 font-medium">
                Для команд
              </Link>
              <Link href="/karta-sayta" className="rounded-xl px-3 py-2.5 font-medium">
                Карта сайта
              </Link>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Telegram {SITE.telegramHandle}
              </a>
              <a
                href={SITE.max}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Написать в MAX
              </a>
              {authed ? (
                <Link href="/kabinet" className="btn-primary">
                  Личный кабинет
                </Link>
              ) : (
                <>
                  <Link href="/demo" className="btn-primary">
                    Заказать демо
                  </Link>
                  <Link href="/registratsiya" className="btn-outline">
                    Создать аккаунт
                  </Link>
                  <Link href="/vhod" className="btn-ghost">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
