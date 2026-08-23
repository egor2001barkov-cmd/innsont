"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { bonusMultiplier, referralLink, type ReferralInvite } from "@/lib/referral";
import { saveSession } from "@/lib/session";

export default function FriendsPage() {
  const { session, setSession, plan, ready } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const [invites, setInvites] = useState<ReferralInvite[]>([]);

  useEffect(() => {
    if (!session) return;
    void fetch(`/api/ref?email=${encodeURIComponent(session.email)}`)
      .then((r) => r.json())
      .then((d) => {
        const count = Number(d.count || 0);
        setInvites(d.invites || []);
        if (count !== session.referralCount) {
          const next = { ...session, refCode: d.code || session.refCode, referralCount: count };
          saveSession(next);
          setSession(next);
        }
      })
      .catch(() => undefined);
  }, [session?.email]);

  if (!ready || !session) return null;

  const link = referralLink(session.refCode);
  const extra = Math.round((bonusMultiplier(session.referralCount) - 1) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-[#6b7280]">
        Друг регистрируется по вашей ссылке — ваши лимиты растут на 20% за каждого. До 8 друзей.
      </p>

      <div className="ws-card mt-5 p-5">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9ca3af]">Ваша ссылка</div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input className="ws-input font-mono text-[13px]" readOnly value={link} />
          <button
            className="ws-btn ws-btn-primary sm:w-40"
            onClick={() => {
              void navigator.clipboard.writeText(link);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
        <p className="mt-2 text-[12px] text-[#9ca3af]">Код: {session.refCode}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Приглашено</div>
          <div className="mt-1 text-2xl font-bold">{session.referralCount}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Надбавка</div>
          <div className="mt-1 text-2xl font-bold">+{extra}%</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Промпты сейчас</div>
          <div className="mt-1 text-2xl font-bold">{plan.limits.prompts.toLocaleString("ru-RU")}</div>
        </div>
      </div>

      <div className="ws-card mt-4 overflow-hidden">
        <div className="border-b border-[var(--ws-line,#e5e7eb)] px-4 py-3 text-sm font-semibold">Кто пришёл</div>
        {invites.length === 0 ? (
          <p className="p-4 text-sm text-[#6b7280]">Пока никого. Отправьте ссылку коллеге.</p>
        ) : (
          <ul className="divide-y divide-[var(--ws-line,#e5e7eb)]">
            {invites.map((i) => (
              <li key={i.email} className="flex justify-between px-4 py-3 text-[13.5px]">
                <span>{i.email}</span>
                <span className="text-[#9ca3af]">{i.at.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
