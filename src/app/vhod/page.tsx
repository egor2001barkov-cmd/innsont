"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiLogin } from "@/lib/client-auth";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Breadcrumbs path="/vhod" />
      <h1 className="text-4xl">Войти в INSONT</h1>
      <p className="mt-2 text-muted">Кабинет видимости, статей и тарифа.</p>
      <form
        className="card mt-8 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setErr("");
          setBusy(true);
          const fd = new FormData(e.currentTarget);
          const res = await apiLogin(String(fd.get("email") || ""), String(fd.get("password") || ""));
          setBusy(false);
          if (!res.ok) {
            setErr(res.error);
            return;
          }
          router.push("/kabinet");
        }}
      >
        <input className="input" type="email" name="email" required placeholder="Почта" autoComplete="email" />
        <input
          className="input mt-3"
          type="password"
          name="password"
          required
          placeholder="Пароль"
          autoComplete="current-password"
        />
        {err && <p className="mt-3 text-sm text-[#b91c1c]">{err}</p>}
        <button className="btn-primary mt-5 w-full" type="submit" disabled={busy}>
          {busy ? "Проверяем…" : "Войти"}
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Нет аккаунта?{" "}
          <Link href="/registratsiya" className="text-orange">
            5 запросов бесплатно
          </Link>
        </p>
      </form>
    </div>
  );
}
