"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { PLANS, formatRub } from "@/lib/site";
import { loadSession, saveSession, type PlanId } from "@/lib/session";

function Checkout() {
  const params = useSearchParams();
  const router = useRouter();
  const planId = (params.get("plan") as PlanId) || "growth";
  const annual = params.get("period") !== "monthly";
  const plan = useMemo(() => PLANS.find((p) => p.id === planId) || PLANS[2], [planId]);
  const price = annual ? plan.priceAnnual : plan.priceMonthly;
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-5 py-14">
      <h1 className="text-4xl">Оплата тарифа</h1>
      <p className="mt-2 text-muted">
        {plan.name} · {annual ? "год" : "месяц"} · {formatRub(price)} /мес
        {annual ? ` · к оплате ${formatRub(price * 12)}` : ""}
      </p>
      {done ? (
        <div className="card mt-8 p-6">
          <h2 className="text-2xl">Счёт сформирован</h2>
          <p className="mt-2 text-sm text-muted">
            В продакшене здесь СБП, карта МИР и счёт юрлица. Для демо тариф
            активирован в кабинете.
          </p>
          <button className="btn-primary mt-4" onClick={() => router.push("/kabinet/tarify")}>
            В кабинет
          </button>
        </div>
      ) : (
        <form
          className="card mt-8 space-y-3 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const s = loadSession();
            if (s) {
              saveSession({
                ...s,
                plan: plan.id,
                billing: annual ? "annual" : "monthly",
                paid: true,
              });
            }
            setDone(true);
          }}
        >
          <input className="input" required placeholder="Имя плательщика / компания" />
          <input className="input" placeholder="ИНН (для юрлица)" />
          <input className="input" required placeholder="Email для закрывающих" />
          <select className="input" defaultValue="sbp">
            <option value="sbp">СБП</option>
            <option value="mir">Карта МИР</option>
            <option value="invoice">Счёт юрлица</option>
          </select>
          <button className="btn-primary w-full">Оплатить {formatRub(annual ? price * 12 : price)}</button>
        </form>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Checkout />
    </Suspense>
  );
}
