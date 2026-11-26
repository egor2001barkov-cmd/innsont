"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { apiRegister } from "@/lib/client-auth";
import { clearPendingRef, readPendingRef, rememberPendingRef } from "@/lib/referral";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/**
 * Заголовок и описание остаются в статическом HTML: форма зависит от параметра `ref`
 * и рендерится после загрузки скриптов, а без JavaScript страница раньше была пустой
 * (обход 26.11.2026: 0 H1, 7 слов в теле — так её видели роботы без исполнения JS).
 */
function Form() {
  const params = useSearchParams();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = params.get("ref") || "";
  if (ref) rememberPendingRef(ref);

  return (
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
        window.location.assign("/kabinet/onboarding");
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
  );
}

function FormFallback() {
  return (
    <div className="card mt-8 space-y-3 p-6">
      <p className="text-sm text-muted">Форма регистрации загружается…</p>
      <noscript>
        <p className="text-sm text-muted">
          Для регистрации нужен включённый JavaScript. Если удобнее письмом — напишите на
          support@insont.ru.
        </p>
      </noscript>
    </div>
  );
}

const INSIDE = [
  "Аудит страницы: 19 проверок по адресу сайта",
  "Статья по ключу: план, черновик, доводка",
  "Ключи из подсказок Яндекса, перелинковка, очеловечиватель текста",
  "Библиотека черновиков с экспортом",
];

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Breadcrumbs path="/registratsiya" />
      <h1 className="text-4xl">Создайте кабинет INSONT</h1>
      <p className="mt-2 text-muted">
        Без карты и без срока. После 5 запросов — тариф. Пароль нужен, чтобы кабинет и статьи
        были вашими: храним только защищённый хэш.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
        {INSIDE.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <Suspense fallback={<FormFallback />}>
        <Form />
      </Suspense>
    </div>
  );
}
