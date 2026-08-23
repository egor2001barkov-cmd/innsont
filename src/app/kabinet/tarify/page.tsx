"use client";

import { PricingCards } from "@/components/kabinet/PricingCards";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { isDevAccount, saveSession } from "@/lib/session";

export default function PlanPage() {
  const { session, setSession, ready } = useWorkspace();
  if (!ready || !session) return null;
  const dev = isDevAccount(session.email);

  return (
    <div className="mx-auto max-w-6xl">
      {dev && (
        <p className="mb-6 rounded-lg bg-[#111827] px-4 py-3 text-sm text-white">
          Вход как разработчик: промпты, проекты, статьи, аудиты и центр действий без лимита.
        </p>
      )}
      {session.paid && !dev ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#6b7280]">
            Сейчас: <b>{session.plan === "starter" ? "Старт" : session.plan === "basic" ? "Базовый" : "Рост"}</b>,{" "}
            {session.billing === "annual" ? "год" : "месяц"}.
          </p>
          <button
            className="text-[13px] text-[#b91c1c]"
            onClick={() => {
              const next = { ...session, paid: false, paymentFailed: true };
              saveSession(next);
              setSession(next);
            }}
          >
            Отменить подписку
          </button>
        </div>
      ) : null}
      <PricingCards session={session} onChange={setSession} expired={!session.paid} />
    </div>
  );
}
