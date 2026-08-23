"use client";

import { useEffect, useState } from "react";
import { loadTeam, saveTeam, type TeamMember } from "@/lib/session";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

export default function TeamPage() {
  const { session, plan, ready } = useWorkspace();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (session) setMembers(loadTeam(session.email));
  }, [session]);

  if (!ready || !session) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-[#6b7280]">
        Мест на тарифе «{plan.name}»: {plan.limits.users}. Сейчас {members.length}.
      </p>
      <form
        className="ws-card mt-4 flex flex-col gap-2 p-4 md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (members.length >= plan.limits.users) {
            setErr("Лимит мест тарифа. Перейдите на план выше.");
            return;
          }
          const next = [
            ...members,
            { id: crypto.randomUUID(), name: name || email.split("@")[0], email, role: "редактор" as const },
          ];
          saveTeam(next);
          setMembers(next);
          setEmail("");
          setName("");
          setErr("");
        }}
      >
        <input className="ws-input" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="ws-input" type="email" required placeholder="Почта" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="ws-btn ws-btn-primary">Пригласить</button>
      </form>
      {err && <p className="mt-2 text-sm text-[#b91c1c]">{err}</p>}
      <ul className="ws-card mt-4 divide-y divide-[#f3f4f6]">
        {members.map((m) => (
          <li key={m.id} className="flex items-center justify-between p-4 text-[14px]">
            <span>
              <span className="font-medium">{m.name}</span>
              <span className="ml-2 text-[#6b7280]">{m.email}</span>
            </span>
            <span className="text-[#9ca3af]">{m.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
