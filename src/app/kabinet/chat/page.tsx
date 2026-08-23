"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { consumePrompt } from "@/lib/session";

type Msg = { role: "you" | "bot"; text: string };

export default function ChatPage() {
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Я чат INSONT. Спросите про видимость, аудит или набросайте абзац под промпт.",
    },
  ]);

  if (!ready || !session || !project) return null;

  function send() {
    const q = input.trim();
    if (!q) return;
    if (!session) return;
    const used = consumePrompt(session, plan.limits.prompts);
    setSession(used.session);
    if (!used.ok) {
      setMsgs((m) => [
        ...m,
        { role: "you", text: q },
        { role: "bot", text: `Лимит промптов тарифа «${plan.name}»: ${plan.limits.prompts}.` },
      ]);
      setInput("");
      return;
    }
    const reply = replyTo(q, project.name);
    setMsgs((m) => [...m, { role: "you", text: q }, { role: "bot", text: reply }]);
    setInput("");
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
        </div>
        <form
          className="flex gap-2 border-t border-[#f3f4f6] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            className="ws-input"
            placeholder="Напишите запрос…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="ws-btn ws-btn-primary">Отправить</button>
        </form>
      </div>
    </div>
  );
}

function replyTo(q: string, brand: string) {
  const s = q.toLowerCase();
  if (s.includes("видимость") || s.includes("chatgpt") || s.includes("gigachat")) {
    return `${brand} чаще всего цитируют GigaChat и Google AI. В ChatGPT проседает кластер «сравнение». Закройте его таблицей с датой.`;
  }
  if (s.includes("аудит") || s.includes("robots") || s.includes("бот")) {
    return `На ${brand} GPTBot режется на каталоге. Снимите Disallow для /catalog — модели перестанут брать описания с агрегаторов.`;
  }
  if (s.includes("напиши") || s.includes("статья") || s.includes("абзац")) {
    return `Черновик для ${brand}: ответ в 40–70 слов, затем таблица из 4 строк и FAQ из двух вопросов. Без «в современном мире».`;
  }
  return `По ${brand}: зафиксируйте промпт «${q}» в обзоре видимости и проверьте, кто лидер. Если доля ниже 20% — нужна отдельная посадочная, а не правка title.`;
}
