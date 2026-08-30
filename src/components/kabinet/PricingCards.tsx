"use client";

import { useState } from "react";
import { PLANS, formatRub } from "@/lib/site";
import { saveSession, type Session } from "@/lib/session";
import { Ico, PlatformDots } from "./icons";

export function PricingCards({
  session,
  onChange,
  expired = false,
}: {
  session: Session;
  onChange: (s: Session) => void;
  expired?: boolean;
}) {
  const [period, setPeriod] = useState<"monthly" | "annual">(session.billing);
  const [open, setOpen] = useState<string | null>(null);

  function price(p: (typeof PLANS)[number]) {
    if (period === "annual") return Math.round(p.priceMonthly * 0.8);
    return p.priceMonthly;
  }

  function select(id: Session["plan"]) {
    const next = {
      ...session,
      plan: id,
      billing: period,
      paid: true,
      paymentFailed: false,
    };
    saveSession(next);
    onChange(next);
  }

  return (
    <div>
      {expired && (
        <div className="text-center">
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111827]">Срок тарифа истёк</h2>
          <p className="mt-2 text-[15px] text-[#6b7280]">Выберите план, чтобы продолжить работу в INSONT</p>
        </div>
      )}

      <div className="ws-plan-period mt-8">
        <button type="button" className={period === "monthly" ? "is-on" : ""} onClick={() => setPeriod("monthly")}>
          Ежемесячно
        </button>
        <button type="button" className={period === "annual" ? "is-on" : ""} onClick={() => setPeriod("annual")}>
          Год <span className="ws-plan-off">−20%</span>
        </button>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = session.plan === p.id && session.paid;
          return (
            <div key={p.id} className={`ws-plan ${p.popular ? "is-popular" : ""}`}>
              <div className="flex items-start justify-between">
                <span className="ws-plan-name">{p.name}</span>
                {p.popular && (
                  <span className="ws-plan-popular">
                    <Ico name="spark" className="h-3.5 w-3.5" /> Популярный
                  </span>
                )}
              </div>
              <div className="ws-plan-price">
                <b>{formatRub(price(p))}</b>
                <span>/мес</span>
              </div>
              <button className="ws-plan-btn" onClick={() => select(p.id)}>
                {current ? "Текущий" : "Выбрать"}
              </button>
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
                  <ul className="mt-2 space-y-1 text-[12.5px] text-[#4b5563]">
                    {[...p.visibility, ...p.content, ...p.agents, ...p.team].map((x) => (
                      <li key={x}>· {x}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-[14px] text-[#ea580c]">
        Нужно больше?{" "}
        <a href="mailto:sales@insont.ru" className="font-medium underline-offset-2 hover:underline">
          Написать в продажи
        </a>
      </p>
    </div>
  );
}
