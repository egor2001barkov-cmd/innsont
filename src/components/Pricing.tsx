"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PLANS, formatRub } from "@/lib/site";
import { Icon } from "./Icons";
import { Ico, PlatformDots } from "./kabinet/icons";

export function PricingCards({ cta = "trial" }: { cta?: "trial" | "checkout" }) {
  const [annual, setAnnual] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <div className="ws-plan-period">
        <button type="button" className={!annual ? "is-on" : ""} onClick={() => setAnnual(false)}>
          Ежемесячно
        </button>
        <button type="button" className={annual ? "is-on" : ""} onClick={() => setAnnual(true)}>
          Год <span className="ws-plan-off">−10%</span>
        </button>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const price = annual ? p.priceAnnual : p.priceMonthly;
          const href =
            cta === "checkout"
              ? `/oplata?plan=${p.id}&period=${annual ? "annual" : "monthly"}`
              : `/registratsiya?plan=${p.id}&period=${annual ? "annual" : "monthly"}`;
          return (
            <article key={p.id} className={`ws-plan ${p.popular ? "is-popular" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="ws-plan-name">{p.name}</span>
                {p.popular && (
                  <span className="ws-plan-popular">
                    <Ico name="spark" className="h-3.5 w-3.5" /> Популярный
                  </span>
                )}
              </div>
              <div className="ws-plan-price">
                <b>{formatRub(price)}</b>
                <span>/мес</span>
              </div>
              <Link href={href} className="ws-plan-btn">
                Выбрать
              </Link>
              <div className="ws-plan-rows">
                <div className="ws-plan-row">
                  <span>
                    <Ico name="chat" className="h-4 w-4" /> Промпты
                  </span>
                  <b>{p.limits.prompts}</b>
                </div>
                <div className="ws-plan-row">
                  <span>
                    <Ico name="folder" className="h-4 w-4" /> Проекты
                  </span>
                  <b>{p.limits.projects}</b>
                </div>
                <div className="ws-plan-row">
                  <span>
                    <Ico name="zap" className="h-4 w-4" /> Задачи
                  </span>
                  <b>{p.limits.actionItems ? "Да" : "Нет"}</b>
                </div>
                <div className="ws-plan-plats mt-3">Площадки в тарифе</div>
                <div className="mt-2">
                  <PlatformDots />
                </div>
                <button
                  type="button"
                  className="ws-plan-more"
                  onClick={() => setOpen(open === p.id ? null : p.id)}
                >
                  Все возможности <Ico name="chev" className="h-4 w-4" />
                </button>
                {open === p.id && (
                  <ul className="mt-2 space-y-1 text-[13px] text-[#4b5563]">
                    {[...p.visibility, ...p.content, ...p.agents, ...p.team].map((x) => (
                      <li key={x}>· {x}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-center text-sm text-orange">
        Нужно больше?{" "}
        <Link href="/demo" className="font-medium underline-offset-2 hover:underline">
          Написать в продажи
        </Link>
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
