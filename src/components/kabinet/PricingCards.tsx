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
          <h2 className="text-[32px] font-bold tracking-tight text-[#111827]">Срок тарифа истёк</h2>
          <p className="mt-1 text-[15px] text-[#6b7280]">Выберите план, чтобы продолжить работу в INNSONT</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-1">
        <div className="inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13.5px] font-medium">
          <button
            className={`rounded-md px-3 py-1.5 ${period === "monthly" ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setPeriod("monthly")}
          >
            Месяц
          </button>
          <button
            className={`rounded-md px-3 py-1.5 ${period === "annual" ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setPeriod("annual")}
          >
            Год
          </button>
        </div>
        <span className="ml-2 rounded-md bg-[#dcfce7] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
          −20%
        </span>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = session.plan === p.id && session.paid;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-5 ${
                p.popular ? "border-[#ea580c] shadow-[0_0_0_1px_#ea580c]" : "border-[#e5e7eb]"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[12px] font-semibold">{p.name}</span>
                {p.popular && (
                  <span className="flex items-center gap-1 text-[12px] font-medium text-[#ea580c]">
                    <Ico name="spark" className="h-3.5 w-3.5" /> Популярный
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-[36px] font-bold leading-none tracking-tight">{formatRub(price(p))}</span>
                <span className="mb-1 text-[13px] text-[#6b7280]">/мес</span>
              </div>
              <button
                className={`mt-4 w-full rounded-lg py-2.5 text-[14px] font-semibold ${
                  p.popular
                    ? "bg-[#ea580c] text-white hover:bg-[#c2410c]"
                    : "border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb]"
                }`}
                onClick={() => select(p.id)}
              >
                {current ? "Текущий" : "Выбрать"}
              </button>
              <ul className="mt-5 space-y-3 text-[14px]">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#374151]">
                    <Ico name="chat" className="h-4 w-4 text-[#9ca3af]" /> Промпты
                  </span>
                  <span className="font-medium">{p.limits.prompts}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#374151]">
                    <Ico name="folder" className="h-4 w-4 text-[#9ca3af]" /> Проекты
                  </span>
                  <span className="font-medium">{p.limits.projects}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#374151]">
                    <Ico name="zap" className="h-4 w-4 text-[#9ca3af]" /> Задачи
                  </span>
                  <span className="font-medium">{p.limits.actionItems ? "Да" : "Нет"}</span>
                </li>
              </ul>
              <div className="mt-5 border-t border-[#f3f4f6] pt-4">
                <div className="text-[13px] font-medium text-[#374151]">Площадки</div>
                <div className="mt-2">
                  <PlatformDots />
                </div>
              </div>
              <button
                className="mt-4 flex items-center gap-1 text-[13px] text-[#6b7280]"
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
          );
        })}
      </div>
      <p className="mt-8 text-center text-[14px] text-[#ea580c]">
        Нужно больше?{" "}
        <a href="mailto:sales@innsont.ru" className="font-medium underline-offset-2 hover:underline">
          Написать в продажи
        </a>
      </p>
    </div>
  );
}
