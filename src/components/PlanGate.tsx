"use client";

import Link from "next/link";
import { PLANS } from "@/lib/site";
import type { PlanId } from "@/lib/session";

const ORDER: PlanId[] = ["starter", "basic", "growth"];

export function PlanGate({
  need,
  current,
  children,
  title,
}: {
  need: PlanId;
  current: PlanId;
  children: React.ReactNode;
  title: string;
}) {
  if (ORDER.indexOf(current) >= ORDER.indexOf(need)) return children;
  const plan = PLANS.find((p) => p.id === need)!;
  return (
    <div className="card p-8">
      <div className="text-sm font-semibold uppercase tracking-wide text-orange">
        Тариф {plan.name}
      </div>
      <h2 className="mt-2 text-2xl">{title}</h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        {plan.job}. {plan.forWho} {formatHint(need)}
      </p>
      <Link href="/kabinet/tarify" className="btn-primary mt-5">
        Перейти на «{plan.name}»
      </Link>
    </div>
  );
}

function formatHint(need: PlanId) {
  if (need === "basic") return "Доступно с Базового.";
  if (need === "growth") return "Доступно с Роста.";
  return "";
}
