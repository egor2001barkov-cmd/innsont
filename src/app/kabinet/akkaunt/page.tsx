"use client";

import { useState } from "react";
import { emptySession, saveSession } from "@/lib/session";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

export default function AccountPage() {
  const { session, setSession, ready } = useWorkspace();
  const [ok, setOk] = useState("");
  if (!ready || !session) return null;

  const initials = (session.name || session.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="ws-card flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ea580c] text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <div className="text-lg font-semibold">{session.name || "Без имени"}</div>
          <div className="text-sm text-[#6b7280]">{session.email}</div>
        </div>
      </div>
      <form
        className="mt-5 grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const next = emptySession({
            ...session,
            name: String(fd.get("name")),
            company: String(fd.get("company")),
            phone: String(fd.get("phone")),
            inn: String(fd.get("inn")),
            city: String(fd.get("city")),
            site: String(fd.get("site")),
            job: String(fd.get("job")),
          });
          saveSession(next);
          setSession(next);
          setOk("Сохранено");
          window.setTimeout(() => setOk(""), 2000);
        }}
      >
        {[
          ["name", "Имя", session.name],
          ["job", "Должность", session.job],
          ["company", "Компания", session.company],
          ["inn", "ИНН", session.inn],
          ["phone", "Телефон", session.phone],
          ["city", "Город", session.city],
        ].map(([name, label, val]) => (
          <label key={name} className="block text-[13px] font-medium">
            {label}
            <input className="ws-input mt-1" name={name} defaultValue={val} />
          </label>
        ))}
        <label className="block text-[13px] font-medium md:col-span-2">
          Сайт
          <input className="ws-input mt-1" name="site" defaultValue={session.site} />
        </label>
        <div className="flex items-center gap-3 md:col-span-2">
          <button className="ws-btn ws-btn-primary" type="submit">
            Сохранить
          </button>
          {ok && <span className="text-sm text-[#16a34a]">{ok}</span>}
        </div>
      </form>
    </div>
  );
}
