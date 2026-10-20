"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { bonusMultiplier, referralLink } from "@/lib/referral";
import { saveSession, type Session } from "@/lib/session";

type Invite = { email: string; at: string; confirmed?: boolean };

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const shown = name.slice(0, 1) + "***";
  return `${shown}@${domain}`;
}

export default function FriendsPage() {
  const { session, setSession, plan, ready } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.email]);

  if (!ready || !session) return null;

  const link = referralLink(session.refCode);
  const extra = Math.round((bonusMultiplier(session.referralCount) - 1) * 100);
  const confirmed = invites.filter((i) => i.confirmed).length;
  const inviteMessage = `Пользуюсь INSONT — продвижение в Яндексе и Google + готовые SEO-статьи в кабинете. Регистрируйся по ссылке, мне за это поднимают лимиты тарифа, тебе — 5 бесплатных запросов: ${link}`;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-[#6b7280]">
        Друг регистрируется по вашей ссылке и создаёт аккаунт — ваши лимиты растут на 20% за
        каждого подтверждённого. До 8 друзей. Считаются только реальные регистрации.
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
        <div className="mt-4 border-t border-[#f3f4f6] pt-4">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Готовое сообщение для мессенджера
          </div>
          <p className="mt-2 rounded-xl bg-[#fafafa] p-3 text-[13px] leading-relaxed text-[#374151]">
            {inviteMessage}
          </p>
          <button
            className="ws-btn ws-btn-outline mt-2 py-1.5 text-[13px]"
            onClick={() => {
              void navigator.clipboard.writeText(inviteMessage);
              setMsgCopied(true);
              window.setTimeout(() => setMsgCopied(false), 1600);
            }}
          >
            {msgCopied ? "Скопировано ✓" : "Скопировать сообщение"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Подтверждено</div>
          <div className="mt-1 text-2xl font-bold">{confirmed}</div>
          <div className="text-[11px] text-[#9ca3af]">из {invites.length} перешедших</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Надбавка</div>
          <div className="mt-1 text-2xl font-bold">+{extra}%</div>
          <div className="text-[11px] text-[#9ca3af]">к лимитам тарифа</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Промпты сейчас</div>
          <div className="mt-1 text-2xl font-bold">{plan.limits.prompts.toLocaleString("ru-RU")}</div>
          <div className="text-[11px] text-[#9ca3af]">в месяц</div>
        </div>
      </div>

      <div className="ws-card mt-4 overflow-hidden">
        <div className="border-b border-[#f3f4f6] px-4 py-3 text-sm font-semibold">Кто пришёл</div>
        {invites.length === 0 ? (
          <p className="p-4 text-sm text-[#6b7280]">Пока никого. Отправьте ссылку коллеге.</p>
        ) : (
          <ul className="divide-y divide-[#f3f4f6]">
            {invites.map((i) => (
              <li key={i.email} className="flex items-center justify-between px-4 py-3 text-[13.5px]">
                <span className="font-mono">{maskEmail(i.email)}</span>
                <span className="flex items-center gap-2">
                  {i.confirmed ? (
                    <span className="rounded-md bg-[#f0fdf4] px-1.5 py-0.5 text-[11px] font-semibold text-[#15803d]">
                      зарегистрировался
                    </span>
                  ) : (
                    <span className="rounded-md bg-[#f3f4f6] px-1.5 py-0.5 text-[11px] text-[#6b7280]">
                      ждём регистрацию
                    </span>
                  )}
                  <span className="text-[#9ca3af]">{i.at.slice(0, 10)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="border-t border-[#f3f4f6] p-3 text-[12px] text-[#9ca3af]">
          Почты маскируются. Засчитываются только те, кто создал аккаунт.
        </p>
      </div>
    </div>
  );
}
