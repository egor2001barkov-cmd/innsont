"use client";

import { useCallback, useEffect, useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

type State = {
  keys: ApiKey[];
  plan: string;
  planName: string;
  apiEnabled: boolean;
  quota: { limit: number; used: number; period: string };
};

export default function ApiKeysPage() {
  const [state, setState] = useState<State | null>(null);
  const [name, setName] = useState("");
  const [freshKey, setFreshKey] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const reload = useCallback(() => {
    void fetch("/api/kabinet/api-keys", { cache: "no-store" })
      .then((r) => r.json())
      .then(setState)
      .catch(() => setErr("Не удалось загрузить ключи"));
  }, []);

  useEffect(reload, [reload]);

  async function create() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/kabinet/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "Ключ" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setFreshKey(data.key);
      setName("");
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    if (!confirm("Отозвать ключ? Интеграции с ним перестанут работать сразу.")) return;
    await fetch(`/api/kabinet/api-keys?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    reload();
  }

  const active = state?.keys.filter((k) => !k.revokedAt) ?? [];
  const revoked = state?.keys.filter((k) => k.revokedAt) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">API-ключи</h1>
      <p className="mt-2 text-sm text-[#6b7280]">
        Программный интерфейс INSONT: аудит перелинковки, Яндекс-аудит, Вордстат, Вебмастер, конкуренты.
        Документация — <a className="underline" href="/api-dokumentaciya">/api-dokumentaciya</a>.
      </p>

      {state && (
        <div className="mt-6 rounded-xl border border-[#f3f4f6] p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              Тариф <b>{state.planName}</b> · API {state.apiEnabled ? "включён" : "не входит в тариф"}
            </div>
            <div className="text-[#6b7280]">
              Вызовов в этом месяце: {state.quota.used} / {state.quota.limit}
            </div>
          </div>
          {!state.apiEnabled && (
            <div className="mt-3 rounded-lg bg-[#fff7ed] p-3 text-[13px] text-[#9a3412]">
              API доступен на тарифе «Рост». <a className="underline" href="/tseny">Сравнить тарифы</a>
            </div>
          )}
        </div>
      )}

      {freshKey && (
        <div className="mt-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-sm">
          <div className="font-semibold">Ключ создан — скопируйте сейчас, второй раз не покажем</div>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-white p-2 font-mono text-[12px]">{freshKey}</code>
            <button
              className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-[13px]"
              onClick={() => {
                void navigator.clipboard.writeText(freshKey);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Скопировано" : "Копировать"}
            </button>
          </div>
          <div className="mt-2 text-[12px] text-[#6b7280]">
            Заголовок: <code>Authorization: Bearer {freshKey.slice(0, 16)}…</code>
          </div>
        </div>
      )}

      {state?.apiEnabled && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <input
            className="input"
            placeholder="Название ключа, например «CRM»"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-primary" disabled={busy} onClick={() => void create()}>
            {busy ? "Создаём…" : "Создать ключ"}
          </button>
        </div>
      )}

      {err && <div className="mt-3 text-sm text-[#b91c1c]">{err}</div>}

      <div className="mt-8">
        <div className="text-sm font-semibold">Активные ключи</div>
        {active.length === 0 ? (
          <div className="mt-2 text-sm text-[#6b7280]">Пока нет ни одного ключа.</div>
        ) : (
          <div className="mt-2 divide-y divide-[#f3f4f6] rounded-xl border border-[#f3f4f6]">
            {active.map((k) => (
              <div key={k.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <div>
                  <div className="font-medium">{k.name}</div>
                  <div className="font-mono text-[12px] text-[#9ca3af]">
                    {k.prefix}… · создан {k.createdAt.slice(0, 10)}
                    {k.lastUsedAt ? ` · последний вызов ${k.lastUsedAt.slice(0, 10)}` : " · ещё не использовался"}
                  </div>
                </div>
                <button className="text-[13px] text-[#b91c1c] underline" onClick={() => void revoke(k.id)}>
                  Отозвать
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {revoked.length > 0 && (
        <div className="mt-6 text-[12px] text-[#9ca3af]">
          Отозвано: {revoked.length}. Ключи хранятся как sha256-хэш — восстановить нельзя, можно только создать новый.
        </div>
      )}
    </div>
  );
}
