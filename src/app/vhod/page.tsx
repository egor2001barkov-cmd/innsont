"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadSession, saveSession, seedDemoSession } from "@/lib/session";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Breadcrumbs path="/vhod" />
      <h1 className="text-4xl">Войти в INSONT</h1>
      <p className="mt-2 text-muted">Кабинет видимости, статей и тарифа.</p>
      <form
        className="card mt-8 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get("email") || "");
          const existing = loadSession();
          if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
            saveSession({ ...existing, email });
            router.push("/kabinet");
            return;
          }
          saveSession(
            seedDemoSession({
              email,
              name: email.split("@")[0] || "IN",
            })
          );
          router.push("/kabinet/onboarding");
        }}
      >
        <input className="input" type="email" name="email" required placeholder="Почта" />
        <input
          className="input mt-3"
          type="password"
          name="password"
          required
          placeholder="Пароль"
        />
        <button className="btn-primary mt-5 w-full" type="submit">
          Войти
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
