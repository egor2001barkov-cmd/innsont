"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadContent, saveContent } from "@/lib/workspace";

const FORMATS = [
  { id: "faq", label: "FAQ" },
  { id: "post", label: "Пост" },
  { id: "mail", label: "Письмо" },
  { id: "shorts", label: "Короткие ответы" },
];

export default function RepurposePage() {
  const { project, ready } = useWorkspace();
  const [src, setSrc] = useState("");
  const [fmt, setFmt] = useState("faq");
  const [out, setOut] = useState("");

  if (!ready || !project) return null;

  function run() {
    const text = src.trim() || `Материал ${project.name} про выбор и сравнение.`;
    if (fmt === "faq") {
      setOut(`**Кому подходит?**\nТем, кто сравнивает варианты и хочет цифру, а не слоган.\n\n**Чем ${project.name} отличается?**\nТаблица, дата обновления, ограничения — модель может взять абзац целиком.\n\n**Что делать дальше?**\nОткрыть посадочную и свериться с условиями.`);
    } else if (fmt === "post") {
      setOut(`${project.name}: ${text.slice(0, 180)}\n\nКоротко: сравнение → цифра → кому не подходит. Без воды.`);
    } else if (fmt === "mail") {
      setOut(`Тема: ${text.slice(0, 60)}\n\nДобрый день.\nСобрали короткое сравнение по запросу. Внутри — таблица и дата, чтобы можно было процитировать.\n\n${project.name}`);
    } else {
      setOut(`• ${text.slice(0, 90)}\n• Цифра и дата — в первом абзаце\n• ${project.name} закрывает сравнение таблицей`);
    }
  }

  function save() {
    if (!out) return;
    const all = loadContent();
    saveContent([
      {
        id: "r-" + Date.now(),
        projectId: project.id,
        title: `Переупаковка · ${FORMATS.find((f) => f.id === fmt)?.label}`,
        type: fmt === "mail" ? "письмо" : fmt === "post" ? "пост" : fmt === "faq" ? "FAQ" : "бриф",
        status: "готово",
        words: out.split(/\s+/).length,
        updated: new Date().toISOString().slice(0, 10),
        body: out,
      },
      ...all,
    ]);
    alert("Сохранено в «Ваш контент»");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
      <div className="ws-card space-y-3 p-5">
        <p className="text-sm text-[#6b7280]">Из статьи — FAQ, пост, письмо. Тот же смысл, другой формат.</p>
        <textarea
          className="ws-input min-h-48"
          placeholder="Вставьте исходный текст"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-[13px] ${
                fmt === f.id ? "bg-[#111827] text-white" : "bg-[#f3f4f6] text-[#374151]"
              }`}
              onClick={() => setFmt(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="ws-btn ws-btn-primary" onClick={run}>
          Переупаковать
        </button>
      </div>
      <div className="ws-card p-5">
        {out ? (
          <>
            <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed">{out}</pre>
            <div className="mt-4 flex gap-2">
              <button className="ws-btn ws-btn-outline" onClick={() => navigator.clipboard.writeText(out)}>
                Копировать
              </button>
              <button className="ws-btn ws-btn-primary" onClick={save}>
                В библиотеку
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#6b7280]">Результат появится здесь.</p>
        )}
      </div>
    </div>
  );
}
