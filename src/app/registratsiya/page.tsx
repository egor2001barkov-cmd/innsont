"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { apiRegister } from "@/lib/client-auth";
import { clearPendingRef, readPendingRef, rememberPendingRef } from "@/lib/referral";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = params.get("ref") || "";
  if (ref) rememberPendingRef(ref);

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Breadcrumbs path="/registratsiya" />
      <h1 className="text-4xl">5 запросов бесплатно</h1>
      <p className="mt-2 text-muted">
        Без карты и без срока. После 5 запросов — тариф. Пароль нужен, чтобы кабинет и статьи
        были вашими: храним только защищённый хэш.
      </p>
      <form
        className="card mt-8 space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setErr("");
          setBusy(true);
          const fd = new FormData(e.currentTarget);
          const password = String(fd.get("password") || "");
          if (password.length < 8) {
            setErr("Пароль — минимум 8 символов");
            setBusy(false);
            return;
          }
          const res = await apiRegister({
            name: String(fd.get("name") || ""),
            company: String(fd.get("company") || ""),
            email: String(fd.get("email") || ""),
            password,
            refCode: (ref || readPendingRef()).toUpperCase(),
          });
          setBusy(false);
          if (!res.ok) {
            setErr(res.error);
            return;
          }
          clearPendingRef();
          router.push("/kabinet/onboarding");
        }}
      >
        <input className="input" name="name" required placeholder="Имя" autoComplete="name" />
        <input className="input" name="company" placeholder="Компания" autoComplete="organization" />
        <input
          className="input"
          type="email"
          name="email"
          required
          placeholder="Рабочая почта"
          autoComplete="email"
        />
        <input
          className="input"
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="Пароль (минимум 8 символов)"
          autoComplete="new-password"
        />
        {err && <p className="text-sm text-[#b91c1c]">{err}</p>}
        <button className="btn-primary w-full" type="submit" disabled={busy}>
          {busy ? "Создаём кабинет…" : "Создать кабинет"}
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
