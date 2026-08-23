"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { saveSession, seedDemoSession, type PlanId } from "@/lib/session";
import { clearPendingRef, readPendingRef } from "@/lib/referral";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = (params.get("plan") as PlanId) || "starter";
  const billing = params.get("period") === "monthly" ? "monthly" : "annual";

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Breadcrumbs path="/registratsiya" />
      <h1 className="text-4xl">5 запросов бесплатно</h1>
      <p className="mt-2 text-muted">
        Без карты и без срока. После 5 запросов — тариф. Стартовый план:{" "}
        <b>{plan === "starter" ? "Старт" : plan === "basic" ? "Базовый" : "Рост"}</b>,{" "}
        {billing === "annual" ? "год −10%" : "месяц"}.
      </p>
      <form
        className="card mt-8 space-y-3 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get("email"));
          const pending = (params.get("ref") || readPendingRef()).toUpperCase();
          saveSession(
            seedDemoSession({
              email,
              name: String(fd.get("name")),
              company: String(fd.get("company")),
              plan,
              billing,
              paid: false,
              paymentFailed: true,
              referredBy: pending,
            })
          );
          if (pending) {
            void fetch("/api/ref", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: pending, email }),
            });
            clearPendingRef();
          }
          router.push("/kabinet/onboarding");
        }}
      >
        <input className="input" name="name" required placeholder="Имя" />
        <input className="input" name="company" placeholder="Компания" />
        <input className="input" type="email" name="email" required placeholder="Рабочая почта" />
        <input className="input" type="password" name="password" required placeholder="Пароль" />
        <button className="btn-primary w-full" type="submit">
          Создать кабинет
        </button>
        <p className="text-center text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link href="/vhod" className="text-orange">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
