"use client";

import { useEffect, useState } from "react";

/** Модалка реквизитов WordPress проекта. Пароль уходит на сервер и назад не возвращается. */
export function WpDialog({
  projectId,
  open,
  onClose,
  onSaved,
}: {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [url, setUrl] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErr("");
    setPassword("");
    void fetch(`/api/wp?projectId=${encodeURIComponent(projectId)}`)
      .then((r) => r.json())
      .then((d: { configured?: boolean; url?: string; user?: string; hasPassword?: boolean }) => {
        setUrl(d.url || "");
        setUser(d.user || "");
        setHasPassword(Boolean(d.hasPassword));
      })
      .catch(() => undefined);
  }, [open, projectId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setErr("");
          setBusy(true);
          const res = await fetch("/api/wp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, url, user, appPassword: password }),
          });
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setBusy(false);
          if (!res.ok) {
            setErr(data.error || "Не удалось сохранить");
            return;
          }
          onSaved?.();
          onClose();
        }}
      >
        <h2 className="text-lg font-semibold">WordPress проекта</h2>
        <p className="text-[13px] text-[#6b7280]">
          Публикация уходит черновиком в ваш WordPress. Пароль приложения создаётся в WP:
          Пользователи → Профиль → Пароли приложений. Хранится на сервере INSONT и не показывается
          в браузере.
        </p>
        <input
          className="ws-input"
          required
          placeholder="https://ваш-сайт.ru"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="ws-input"
          required
          placeholder="Логин в WordPress"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="ws-input"
          required={!hasPassword}
          type="password"
          placeholder={hasPassword ? "Пароль приложения (задан — введите новый, чтобы сменить)" : "Пароль приложения"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
        <div className="flex gap-2 pt-1">
          <button className="ws-btn ws-btn-primary flex-1" disabled={busy}>
            {busy ? "Сохраняем…" : "Сохранить"}
          </button>
          <button type="button" className="ws-btn ws-btn-outline" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
