"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PLANS, formatRub } from "@/lib/site";
import { Icon } from "./Icons";

export function PricingCards({ cta = "trial" }: { cta?: "trial" | "checkout" }) {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-center gap-3 text-sm font-semibold">
        <span className={!annual ? "font-bold" : "text-muted"}>Ежемесячно</span>
        <button
          type="button"
          onClick={() => setAnnual((v) => !v)}
          className={`relative h-7 w-12 rounded-full ${annual ? "bg-orange" : "bg-[#d9d0c3]"}`}
          aria-label="Переключить период оплаты"
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
              annual ? "left-5" : "left-0.5"
            }`}
          />
        </button>
        <span className={annual ? "font-bold" : "text-muted"}>
          Год <span className="font-extrabold text-orange">−10%</span>
        </span>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const price = annual ? p.priceAnnual : p.priceMonthly;
          const href =
            cta === "checkout"
              ? `/oplata?plan=${p.id}&period=${annual ? "annual" : "monthly"}`
              : `/registratsiya?plan=${p.id}&period=${annual ? "annual" : "monthly"}`;
          return (
            <article
              key={p.id}
              className={`card flex flex-col p-6 ${p.popular ? "ring-2 ring-orange" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-2xl font-extrabold tracking-tight">{p.name}</h3>
                {p.popular && (
                  <span className="rounded-full bg-orange px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                    Чаще берут
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-bold text-orange">{p.audience}</p>
              <p className="mt-1 text-[15px] font-bold">{p.job}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  {formatRub(price)}
                </span>
                <span className="mb-1 text-sm font-bold text-muted">/мес</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-muted">
                {annual
                  ? `при оплате года · экономия ${formatRub(p.saveYear / 12)} /мес`
                  : `месячная оплата · ${formatRub(p.priceMonthly)}`}
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#3a3632]">{p.forWho}</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#3a3632]">{p.blurb}</p>
              <Link href={href} className="btn-primary mt-5 w-full">
                {cta === "checkout" ? "Оформить" : "5 запросов бесплатно"}
              </Link>
              <Block title="Видимость" items={p.visibility} />
              <Block title="Контент и SEO" items={p.content} />
              <Block title="Агенты и автоматизация" items={p.agents} />
              <Block title="Команда" items={p.team} />
              <Block title="Не входит" items={p.notIncluded} muted />
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Рубли, счёт, 152-ФЗ. Холдингу и агентской сети — корпоративный контур ниже.
      </p>
    </div>
  );
}

export function AgencyPlans() {
  return (
    <div id="agentstva" className="scroll-mt-24">
      <h2 className="text-2xl md:text-[28px]">Для агентств</h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed">
        Питч по клиенту без отдельного бюджета на проект. Если зашло — тот же
        кабинет ведёт клиента дальше. Не «нейросети это будущее», а «вас нет в
        четырёх ответах из десяти».
      </p>
      <div className="mt-8 grid overflow-hidden border border-line lg:grid-cols-2">
        <article className="bg-paper p-7 md:p-10">
          <p className="text-sm text-muted">Агентство · питч</p>
          <p className="mt-1 text-sm font-semibold text-orange">Прогоны по потенциальным клиентам</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-5xl font-bold tracking-tight">{formatRub(8910)}</span>
            <span className="mb-1 rounded-full border border-orange/40 px-2 py-0.5 text-[12px] font-semibold text-orange">
              −{formatRub(11880)} за год
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">в месяц при оплате года · иначе 9 900 ₽</p>
          <p className="mt-4 text-[15px] leading-relaxed">
            Аудит видимости по бренду за минуты. На встречу приходите с цифрами.
            Кто купил сопровождение — переводите в обычный проект.
          </p>
          <Link href="/demo" className="btn-primary mt-6 inline-flex w-full">
            Заказать демо
          </Link>
          <Block
            title="Питч-проекты"
            items={[
              "До 20 питчей в месяц",
              "2 000 ответов моделей",
              "Проект живёт 1–7 дней и сам встаёт",
            ]}
          />
          <Block
            title="Какие площадки"
            items={[
              "GigaChat, YandexGPT, Алиса, ChatGPT, Gemini",
              "Сводка и отчёт, который можно отдать клиенту",
            ]}
          />
          <Block
            title="Дальше"
            items={[
              "Питч → обычный проект, от 4 990 ₽/мес",
              "Кабинет под вашим именем — на корпоративном",
            ]}
          />
        </article>
        <article className="agency-dark p-7 md:p-10">
          <p className="text-sm text-white/55">Корпоративный</p>
          <p className="mt-1 text-sm font-semibold text-orange">Питч + постоянные клиенты + платформа</p>
          <div className="mt-4">
            <span className="text-5xl font-bold tracking-tight">По счёту</span>
          </div>
          <p className="mt-1 text-sm text-white/55">от 59 900 ₽ в месяц · договор и ЭДО</p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/85">
            Для агентской сети и холдинга. Кабинеты клиентам, один счёт, отчёты
            под вашим брендом, человек на связи. Не самообслуживание.
          </p>
          <Link href="/demo" className="btn-primary mt-6 inline-flex w-full">
            Обсудить контур
          </Link>
          <div className="agency-dark-list">
            <Block
              title="Проекты"
              items={[
                "Свои питчи и постоянные проекты",
                "Кабинеты клиентов, общий счёт",
                "Отчёты под вашим брендом, шаблоны ТЗ",
              ]}
            />
            <Block
              title="Видимость и работа"
              items={[
                "Все пять площадок плюс Центр действий",
                "Тексты, аудит сайта, очередь работ",
                "Агенты без лимита «на попробовать»",
              ]}
            />
            <Block
              title="Сопровождение"
              items={[
                "Роли и доступы",
                "Выделенный стратег",
                "152-ФЗ, серверы в РФ, ЭДО, договор",
              ]}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

function Block({
  title,
  items,
  muted,
}: {
  title: string;
  items: readonly string[];
  muted?: boolean;
}) {
  return (
    <div className="mt-6">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink">
        {title}
      </div>
      <ul className="mt-2 space-y-2">
        {items.map((it) => (
          <li
            key={it}
            className={`flex gap-2 text-[13.5px] font-semibold leading-snug ${muted ? "text-muted" : "text-ink"}`}
          >
            <span className={`mt-0.5 ${muted ? "text-muted" : "text-orange"}`}>
              <Icon name={muted ? "x" : "check"} className="h-4 w-4" />
            </span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CompareTable() {
  const rows = useMemo(
    () => [
      ["Для кого", "Соло, пилот GEO", "In-house SEO и контент", "Агентство, ecom, рост"],
      ["Главная задача", "Увидеть упоминания", "Писать цитируемый контент", "Чинить очередь пробелов"],
      ["Платформы", "ChatGPT, GigaChat", "+ YandexGPT, Gemini, Google AI", "+ Алиса, Claude, Perplexity"],
      ["Промпты / ответы в день", "25 / 25", "80 / 150", "150 / 400"],
      ["Статьи / мес", "5", "20", "40"],
      ["Аудиты", "3 × 50 стр.", "12 × 400 стр.", "25 × 1 500 стр."],
      ["Автор статей", "Да, лимит", "Да + контент-агент", "Да, пакеты сверху"],
      ["Трекер рекламы", "—", "Обзор", "Полный"],
      ["Трекер покупок", "—", "—", "Да"],
      ["Тональность", "—", "—", "Да"],
      ["Центр действий", "—", "—", "10 + 10 / мес"],
      ["Запуски агентов", "3 пробных", "20", "60"],
      ["API", "—", "—", "Да"],
      ["Пользователи / проекты", "1 / 1", "2 / 1", "4 / 3"],
      ["Поддержка", "Почта", "Почта", "Приоритет"],
    ],
    []
  );
  return (
    <div className="table-wrap card mt-16">
      <table className="data">
        <thead>
          <tr>
            <th className="!text-ink">Что входит</th>
            <th className="!text-ink">Старт · 4 490 ₽</th>
            <th className="!text-ink">Базовый · 10 790 ₽</th>
            <th className="!text-ink">Рост · 22 490 ₽</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i} className={i === 0 ? "font-bold" : "font-semibold"}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
