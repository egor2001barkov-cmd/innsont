"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { rememberPendingRef } from "@/lib/referral";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SiteJsonLd } from "./SiteJsonLd";
import { ThemeToggle } from "./ThemeToggle";
import { CookieBanner } from "./CookieBanner";
export { Breadcrumbs } from "./Breadcrumbs";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "";
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) rememberPendingRef(ref);
  }, [path]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".reveal, .reveal-stagger"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  if (path.startsWith("/kabinet")) {
    return (
      <main className="min-w-0 flex-1">
        {children}
        <ThemeToggle />
      </main>
    );
  }
  return (
    <>
      <SiteJsonLd />
      <Header />
      <main className="min-w-0 flex-1 pb-16 sm:pb-8">{children}</main>
      <Footer />
      <CookieBanner />
      <ThemeToggle />
    </>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function CtaBand({
  title = "Продвижение в Яндексе, Google и нейросетях.",
  text = "Покажем позиции в поиске, витрину и где бренд стоит в GigaChat. Без покупки ссылок и накрутки.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="mx-auto mt-20 max-w-[1100px] border-t border-line px-5 py-14">
      <h2 className="max-w-3xl text-2xl leading-snug md:text-[28px]">{title}</h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">{text}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href="/demo" className="btn-primary">
          Заказать демо
        </a>
        <a href="/registratsiya" className="btn-outline">
          5 запросов бесплатно
        </a>
      </div>
    </section>
  );
}


