"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRub } from "@/lib/site";
import { loadInvoices, type Invoice } from "@/lib/session";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

export default function BillsPage() {
  const { session, plan, ready } = useWorkspace();
  const [items, setItems] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!session) return;
    const amount = session.billing === "annual" ? Math.round(plan.priceMonthly * 0.8) * 12 : plan.priceMonthly;
    setItems(loadInvoices(plan.name, amount));
  }, [session, plan]);

  if (!ready || !session) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-[#6b7280]">История по тарифу «{plan.name}».</p>
      <div className="ws-card mt-4 min-w-0 overflow-x-auto">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Дата</th>
              <th>Назначение</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td className="font-medium">{i.id}</td>
                <td>{i.date}</td>
                <td>{i.title}</td>
                <td>{formatRub(i.amount)}</td>
                <td>{i.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/kabinet/tarify" className="ws-btn ws-btn-primary mt-5 inline-flex">
        Сменить тариф
      </Link>
    </div>
  );
}
