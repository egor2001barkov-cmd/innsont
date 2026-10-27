"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { saveSession, type Session } from "@/lib/session";

type Msg = { role: "you" | "bot"; text: string };

export default function ChatPage() {
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Я чат INSONT: отвечаю через подключённую модель. Реальные замеры сайта — в разделах «Аудит», «Видимость», «Ключи» и «Конкуренты»; я не выдумываю цифры.",
    },
  ]);

  if (!ready || !session || !project) return null;

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "you", text: q }]);
    setBusy(true);
    try {
      const res = await fetch("/api/kabinet/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...msgs, { role: "you" as const, text: q }]
            .filter((m) => m.role !== "bot" || m.text.length < 2000)
            .map((m) => ({ role: m.role === "you" ? ("user" as const) : ("assistant" as const), text: m.text })),
          project: { name: project!.name, url: project!.url },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
        profile?: Partial<Session>;
      };
      if (data.profile) {
        const next = { ...session, ...data.profile } as Session;
        saveSession(next);
        setSession(next);
      }
      setMsgs((m) => [
        ...m,
        { role: "bot", text: data.reply || data.error || "Не удалось получить ответ" },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Сеть недоступна — попробуйте ещё раз" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-3xl flex-col">
      <p className="mb-3 text-sm text-[#6b7280]">
        Чат по проекту {project.name}. Промпты: {session.promptsUsed}/{plan.limits.prompts}.
      </p>
      <div className="ws-card flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed ${
                  m.role === "you" ? "bg-[#ea580c] text-white" : "bg-[#f3f4f6] text-[#111827]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {busy && <div className="text-[13px] text-[#9ca3af]">Модель отвечает…</div>}
        </div>
        <form
          className="flex gap-2 border-t border-[#f3f4f6] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <input
            className="ws-input"
            placeholder="Напишите запрос…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
          />
          <button className="ws-btn ws-btn-primary" disabled={busy}>
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
