"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icons";

function useInView(threshold = 0.32) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

function Count({
  to,
  on,
  suffix = "",
  prefix = "",
  duration = 900,
}: {
  to: number;
  on: boolean;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to, duration]);
  return (
    <>
      {prefix}
      {n}
      {suffix}
    </>
  );
}

export function SeoKicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-orange text-[12px] font-bold text-orange">
        {n}
      </span>
      <span className="text-[13px] font-semibold tracking-[0.16em] text-orange">{label}</span>
    </div>
  );
}

export function SeoStage({
  n,
  label,
  title,
  children,
  mock,
  flip,
}: {
  n: string;
  label: string;
  title: string;
  children: ReactNode;
  mock: ReactNode;
  flip?: boolean;
}) {
  return (
    <section className="mt-24">
      <SeoKicker n={n} label={label} />
      <h2 className="mx-auto mt-4 max-w-3xl text-center text-3xl leading-[1.12] md:text-5xl">{title}</h2>
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className={flip ? "lg:order-2" : ""}>
          <div className="space-y-4 text-[17px] leading-[1.7]">{children}</div>
        </div>
        <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>{mock}</div>
      </div>
    </section>
  );
}

export function SeoActionMock() {
  const { ref, on } = useInView();
  const rows = [
    {
      icon: "cart",
      t: "Цены и запись на витрине",
      d: "УЗИ, терапевт, анализы — сейчас «по запросу»",
      n: 18,
      prio: "Высокий",
      href: "/seo/kommercheskie-faktory",
    },
    {
      icon: "search",
      t: "Регион в Вебмастере",
      d: "Сайт смотрит «всю Россию», заявки — из Москвы",
      n: 1,
      prio: "Высокий",
      href: "/seo/vebmaster",
    },
    {
      icon: "doc",
      t: "Title и сниппет",
      d: "Капслок, нет города, кликают мимо",
      n: 24,
      prio: "Средний",
      href: "/seo/metategi",
    },
    {
      icon: "wrench",
      t: "Индекс и robots",
      d: "Карточки врачей закрыты, дубли фильтров",
      n: 7,
      prio: "Высокий",
      href: "/seo/tekhnicheskiy-audit",
    },
  ];
  return (
    <div ref={ref} className={`seo-play ui-stage ${on ? "is-on" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold leading-snug">Центр действий</div>
          <p className="mt-0.5 text-[13px] leading-snug text-muted">После прогона Яндекса, Google и Вебмастера</p>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#eaf6ee] px-2.5 py-1 text-[12px] font-medium text-good">
          <span className="seo-dot h-1.5 w-1.5 rounded-full bg-good" />
          Следующий прогон · 10:51
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-y-4 rounded-[18px] bg-[var(--bg-deep)] px-3 py-3 sm:grid-cols-4">
        {[
          ["Открыто", 64, ""],
          ["В работе", 11, ""],
          ["Закрыто", 29, ""],
          ["В топ-10", 18, "+"],
        ].map(([k, v, p]) => (
          <div key={k as string} className="text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{k}</div>
            <div
              className={`mt-1 font-sans text-[28px] font-bold tabular-nums leading-none ${
                p === "+" ? "text-good" : ""
              }`}
            >
              {p === "+" ? "+" : ""}
              <Count to={v as number} on={on} />
            </div>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.t}
            className="seo-row rounded-[16px] bg-[var(--bg)] px-3 py-2.5"
            style={{ animationDelay: `${120 + i * 90}ms` }}
          >
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-[#8a5a38]">
                <Icon name={r.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 text-sm font-semibold leading-snug">{r.t}</div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      r.prio === "Высокий" ? "bg-[#eaf6ee] text-good" : "bg-[#fff4e5] text-[#c47a12]"
                    }`}
                  >
                    {r.prio}
                  </span>
                </div>
                <div className="mt-0.5 text-[12px] leading-snug text-muted">{r.d}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] text-muted">{r.n} URL</span>
                  <Link
                    href={r.href}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-[12px] font-semibold"
                  >
                    Чинить
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SeoBeforeAfter() {
  const { ref, on } = useInView(0.25);
  return (
    <div ref={ref} className={`seo-play grid gap-3 md:grid-cols-2 ${on ? "is-on" : ""}`}>
      <article className="ui-stage">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl">До</h3>
          <span className="rounded-full border border-line bg-[var(--bg)] px-2.5 py-1 text-[12px] text-muted">
            СМ-Клиника в GigaChat · 12%
          </span>
        </div>
        <p className="mt-4 rounded-full bg-[var(--bg)] px-3 py-1.5 text-center text-[13px] text-muted">
          какую клинику выбрать в москве
        </p>
        <p className="mt-4 text-[14px] leading-relaxed">
          Для большинства людей удобнее смотреть агрегатор: там сразу цена и слот.
        </p>
        <div className="table-wrap mt-3">
          <table className="sheet">
            <thead>
              <tr>
                <th>Кому</th>
                <th>Куда ведут</th>
                <th className="num">Почему</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Большинству</td>
                <td>НаПоправку</td>
                <td className="num">цена и отзывы</td>
              </tr>
              <tr>
                <td>Срочно</td>
                <td>СберЗдоровье</td>
                <td className="num">запись сегодня</td>
              </tr>
              <tr>
                <td>По ОМС</td>
                <td>Госуслуги</td>
                <td className="num">полис</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="seo-warn mt-4 rounded-[14px] px-3 py-2.5 text-[13px] leading-relaxed">
          СМ-Клинику почти не называют. 284 чужих промпта ведут на агрегаторы.
        </p>
      </article>
      <article className="ui-stage ui-stage-good">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl">После</h3>
          <span className="rounded-full bg-[#eaf6ee] px-2.5 py-1 text-[12px] font-semibold text-good">
            +<Count to={71} on={on} suffix="%" /> видимость
          </span>
        </div>
        <p className="mt-4 rounded-full bg-[var(--bg)] px-3 py-1.5 text-center text-[13px] text-muted">
          какую клинику выбрать в москве
        </p>
        <p className="mt-4 text-[14px] leading-relaxed">
          Для большинства СМ-Клиника — нормальный выбор: цена, метро, запись на странице.
        </p>
        <div className="table-wrap mt-3">
          <table className="sheet">
            <thead>
              <tr>
                <th>Кому</th>
                <th>Куда ведут</th>
                <th className="num">Почему</th>
              </tr>
            </thead>
            <tbody>
              <tr className="seo-hit">
                <td>Большинству</td>
                <td>
                  <span className="rounded-full bg-[#eaf6ee] px-2 py-0.5 font-semibold text-good">СМ-Клиника</span>
                </td>
                <td className="num">приём от 2 400 ₽</td>
              </tr>
              <tr>
                <td>Срочно</td>
                <td>СберЗдоровье</td>
                <td className="num">запись сегодня</td>
              </tr>
              <tr>
                <td>По ОМС</td>
                <td>Госуслуги</td>
                <td className="num">полис</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="seo-ok mt-4 rounded-[14px] px-3 py-2.5 text-[13px] leading-relaxed">
          Назвали в 14 из 40 промптов. Раньше было 3. Ссылок не покупали — открыли карточки врачей и поставили цену.
        </p>
      </article>
    </div>
  );
}

export function SeoSerpMock() {
  const { ref, on } = useInView();
  const rows = [
    { pos: 3, was: 14, host: "smclinic.ru", title: "УЗИ в Москве — цена, врачи, запись" },
    { pos: 6, was: 11, host: "smclinic.ru/uzi", title: "УЗИ органов брюшной полости, метро" },
    { pos: 8, was: 19, host: "smclinic.ru/terapevt", title: "Терапевт в СМ-Клинике, приём сегодня" },
  ];
  return (
    <div ref={ref} className={`seo-play ui-stage ${on ? "is-on" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[17px] font-semibold">Выдача · Москва</div>
          <p className="text-[13px] text-muted">узи рядом · Яндекс и Google, 8 недель</p>
        </div>
        <span className="text-[12px] text-muted">регион: Москва</span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.host}
            className="seo-row rounded-[16px] bg-[var(--bg)] px-3 py-3"
            style={{ animationDelay: `${100 + i * 120}ms` }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-muted">{r.host}</span>
              <span className="text-sm font-semibold tabular-nums text-good">
                {r.was} → {r.pos}
              </span>
            </div>
            <div className="mt-1 text-sm font-medium">{r.title}</div>
            <div className="seo-bar mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
              <span style={{ ["--w" as string]: `${Math.round((16 - r.pos) * 6)}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted">
        Не «весь сайт в топ». Три URL, по которым люди реально записываются.
      </p>
    </div>
  );
}

export function SeoWordstatMock() {
  const { ref, on } = useInView();
  const rows = [
    { q: "узи москва цена", n: 14800, kind: "витрина" },
    { q: "узи рядом с метро", n: 2900, kind: "витрина" },
    { q: "что показывает узи брюшной полости", n: 5400, kind: "статья" },
    { q: "узи или мрт что лучше", n: 1900, kind: "статья" },
  ];
  const max = 14800;
  return (
    <div ref={ref} className={`seo-play ui-stage ${on ? "is-on" : ""}`}>
      <div className="text-[17px] font-semibold">Wordstat · Москва</div>
      <p className="text-[13px] text-muted">Спрос есть. Страниц под него — нет или это простыня «про здоровье».</p>
      <ul className="mt-4 space-y-3">
        {rows.map((r, i) => (
          <li key={r.q} className="seo-row" style={{ animationDelay: `${80 + i * 90}ms` }}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>{r.q}</span>
              <span className="tabular-nums text-muted">
                <Count to={r.n} on={on} />
              </span>
            </div>
            <div className="seo-bar mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--bg)]">
              <span style={{ ["--w" as string]: `${Math.round((r.n / max) * 100)}%` }} />
            </div>
            <div className="mt-1 text-[12px] text-muted">{r.kind}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SeoFactorsMock() {
  const { ref, on } = useInView();
  const items = [
    "Цена на услуге, не «по запросу»",
    "Врач, метро, кнопка записи",
    "Регион Москва в Вебмастере",
    "Карточка в Яндекс Бизнесе совпадает с сайтом",
    "Title без КАПСЛОКА, с городом",
    "Карточки врачей открыты роботу",
  ];
  return (
    <div ref={ref} className={`seo-play ui-stage ${on ? "is-on" : ""}`}>
      <div className="text-[17px] font-semibold">Что Яндекс считает витриной</div>
      <p className="text-[13px] text-muted">Google смотрит почти то же. Без этого статьи не спасают.</p>
      <ul className="mt-4 space-y-2">
        {items.map((t, i) => (
          <li
            key={t}
            className="seo-row flex items-start gap-2.5 text-sm"
            style={{ animationDelay: `${90 + i * 80}ms` }}
          >
            <span className="seo-check mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf6ee] text-good">
              <Icon name="check" className="h-3.5 w-3.5" />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
