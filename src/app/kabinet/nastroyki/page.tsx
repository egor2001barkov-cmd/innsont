"use client";

import { useState } from "react";
import { emptySession, saveSession } from "@/lib/session";
import { useWorkspace } from "@/components/kabinet/useWorkspace";

export default function SettingsPage() {
  const { session, setSession, ready } = useWorkspace();
  const [ok, setOk] = useState("");
  if (!ready || !session) return null;

  return (
    <div className="mx-auto max-w-xl">
      <form
        className="ws-card space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const next = emptySession({
            ...session,
            region: String(fd.get("region")),
            timezone: String(fd.get("timezone")),
            notifyEmail: fd.get("notifyEmail") === "on",
            notifyWeekly: fd.get("notifyWeekly") === "on",
            notifyTelegram: fd.get("notifyTelegram") === "on",
          });
          saveSession(next);
          setSession(next);
          setOk("Сохранено");
        }}
      >
        <label className="block text-[13px] font-medium">
          Регион Яндекса
          <select className="ws-input mt-1" name="region" defaultValue={session.region}>
            {["Москва", "Санкт-Петербург", "Екатеринбург", "Казань", "Новосибирск", "Россия"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-[13px] font-medium">
          Часовой пояс
          <select className="ws-input mt-1" name="timezone" defaultValue={session.timezone}>
            <option value="Europe/Moscow">Москва (UTC+3)</option>
            <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
            <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="notifyEmail" defaultChecked={session.notifyEmail} /> Письма о просадке
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="notifyWeekly" defaultChecked={session.notifyWeekly} /> Еженедельный отчёт
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="notifyTelegram" defaultChecked={session.notifyTelegram} /> Telegram
        </label>
        <div className="flex items-center gap-3">
          <button className="ws-btn ws-btn-primary">Сохранить</button>
          {ok && <span className="text-sm text-[#16a34a]">{ok}</span>}
        </div>
      </form>
    </div>
  );
}
