"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadStyles, saveStyles, STYLE_PRESETS, type WritingStyle } from "@/lib/workspace";

type Pov = "я" | "мы" | "вы" | "они" | "нейтральный";
type Goal = "информировать" | "продавать" | "сравнивать" | "обучать";
type Level = "новичок" | "средний" | "эксперт";

const inputCls = "ws-input mt-1";
const labelCls = "block text-[13px] font-medium";

export default function StylesPage() {
  const { project, plan, ready } = useWorkspace();
  const [items, setItems] = useState<WritingStyle[]>([]);
  const [edit, setEdit] = useState<WritingStyle | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => setItems(loadStyles()), []);
  if (!ready || !project) return null;

  const mine = items.filter((s) => s.projectId === project.id);

  function save(s: WritingStyle) {
    const exists = items.some((x) => x.id === s.id);
    const next = exists ? items.map((x) => (x.id === s.id ? s : x)) : [...items, s];
    if (!exists && mine.length >= plan.limits.styles) {
      alert(`На тарифе «${plan.name}» стилей: ${plan.limits.styles}`);
      return;
    }
    setItems(next);
    saveStyles(next);
    setEdit(null);
  }

  function remove(id: string) {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    saveStyles(next);
  }

  function fromPreset(presetId: string) {
    const preset = STYLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setEdit({
      id: "s-" + Date.now().toString(36),
      projectId: project.id,
      name: preset.style.name,
      tone: preset.style.tone,
      audience: preset.style.audience,
      rules: preset.style.rules,
      pov: preset.style.pov,
      goal: preset.style.goal,
      readingLevel: preset.style.readingLevel,
      bannedWords: preset.style.bannedWords,
      preferredPhrases: preset.style.preferredPhrases,
      exampleText: "",
    });
    setShowPresets(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Стили письма: тон, аудитория, от лица, запрещённые слова. Применяются при генерации статей.
          Стилей: {mine.length} из {plan.limits.styles}.
        </p>
        <div className="flex gap-2">
          <button className="ws-btn ws-btn-outline" onClick={() => setShowPresets(!showPresets)}>
            Пресеты
          </button>
          <button
            className="ws-btn ws-btn-primary"
            onClick={() =>
              setEdit({
                id: "s-" + Date.now().toString(36),
                projectId: project.id,
                name: "",
                tone: "деловой",
                audience: "",
                rules: "",
                pov: "нейтральный",
                goal: "информировать",
                readingLevel: "средний",
                bannedWords: [],
                preferredPhrases: [],
                exampleText: "",
              })
            }
          >
            + Создать
          </button>
        </div>
      </div>

      {/* Пресеты */}
      {showPresets && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STYLE_PRESETS.map((p) => (
            <button
              key={p.id}
              className="ws-card flex flex-col gap-1 p-4 text-left transition-all hover:border-[#fdba74] hover:shadow-md"
              onClick={() => fromPreset(p.id)}
            >
              <span className="text-[15px] font-semibold">{p.name}</span>
              <span className="text-[13px] text-[#6b7280]">{p.desc}</span>
              {p.style.bannedWords?.length ? (
                <span className="mt-1 text-[11px] text-[#9ca3af]">Без: {p.style.bannedWords.slice(0, 3).join(", ")}…</span>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {/* Список стилей */}
      <div className="mt-4 space-y-3">
        {mine.map((s) => (
          <div key={s.id} className="ws-card flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="font-medium">{s.name}</div>
              <div className="mt-0.5 text-[13px] text-[#6b7280]">
                Тон: {s.tone}
                {s.audience ? ` · для: ${s.audience}` : ""}
                {s.pov ? ` · от лица «${s.pov}»` : ""}
                {s.goal ? ` · цель: ${s.goal}` : ""}
              </div>
              {s.bannedWords?.length ? (
                <div className="mt-1 text-[12px] text-[#b45309]">Без слов: {s.bannedWords.join(", ")}</div>
              ) : null}
              {s.preferredPhrases?.length ? (
                <div className="mt-0.5 text-[12px] text-[#0f766e]">Обороты: {s.preferredPhrases.join(", ")}</div>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => setEdit(s)}>
                Править
              </button>
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px] text-[#b91c1c]" onClick={() => remove(s.id)}>
                ×
              </button>
            </div>
          </div>
        ))}
        {!mine.length && !showPresets && (
          <div className="ws-card border-dashed p-6 text-center text-[13px] text-[#6b7280]">
            Пока нет стилей. Создайте свой или возьмите готовый пресет.
          </div>
        )}
      </div>

      {/* Редактор стиля */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-auto rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold">{edit.name ? `Править «${edit.name}»` : "Новый стиль"}</h2>

            <div className="mt-4 space-y-3">
              <label className={labelCls}>
                Название *
                <input className={inputCls} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Копирайтер, Эксперт..." />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className={labelCls}>
                  Тон
                  <input className={inputCls} value={edit.tone} onChange={(e) => setEdit({ ...edit, tone: e.target.value })} placeholder="деловой, живой" />
                </label>
                <label className={labelCls}>
                  Аудитория
                  <input className={inputCls} value={edit.audience} onChange={(e) => setEdit({ ...edit, audience: e.target.value })} placeholder="кто читатель" />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className={labelCls}>
                  От лица
                  <select className={inputCls} value={edit.pov || "нейтральный"} onChange={(e) => setEdit({ ...edit, pov: e.target.value as Pov })}>
                    <option value="нейтральный">нейтрально</option>
                    <option value="я">я</option>
                    <option value="мы">мы</option>
                    <option value="вы">вы</option>
                    <option value="они">они</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Цель
                  <select className={inputCls} value={edit.goal || "информировать"} onChange={(e) => setEdit({ ...edit, goal: e.target.value as Goal })}>
                    <option value="информировать">информировать</option>
                    <option value="продавать">продавать</option>
                    <option value="сравнивать">сравнивать</option>
                    <option value="обучать">обучать</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Уровень
                  <select className={inputCls} value={edit.readingLevel || "средний"} onChange={(e) => setEdit({ ...edit, readingLevel: e.target.value as Level })}>
                    <option value="новичок">новичок</option>
                    <option value="средний">средний</option>
                    <option value="эксперт">эксперт</option>
                  </select>
                </label>
              </div>

              <label className={labelCls}>
                Правила письма
                <textarea
                  className={`${inputCls} min-h-[60px]`}
                  value={edit.rules}
                  onChange={(e) => setEdit({ ...edit, rules: e.target.value })}
                  placeholder="Каждый абзац — новая мысль. Цифры вместо прилагательных..."
                />
              </label>

              <label className={labelCls}>
                Запрещённые слова (через запятую)
                <input
                  className={inputCls}
                  value={(edit.bannedWords || []).join(", ")}
                  onChange={(e) => setEdit({ ...edit, bannedWords: e.target.value.split(/[,\n]/).map((w) => w.trim()).filter(Boolean) })}
                  placeholder="инновационный, уникальный, лучший"
                />
              </label>

              <label className={labelCls}>
                Предпочтительные обороты (через запятую)
                <input
                  className={inputCls}
                  value={(edit.preferredPhrases || []).join(", ")}
                  onChange={(e) => setEdit({ ...edit, preferredPhrases: e.target.value.split(/[,\n]/).map((w) => w.trim()).filter(Boolean) })}
                  placeholder="по нашим данным, проверено на практике"
                />
              </label>

              <label className={labelCls}>
                Пример «живого» текста (для калибровки тона)
                <textarea
                  className={`${inputCls} min-h-[70px]`}
                  value={edit.exampleText || ""}
                  onChange={(e) => setEdit({ ...edit, exampleText: e.target.value })}
                  placeholder="Вставьте 1–2 абзаца текста в нужном стиле..."
                />
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="ws-btn ws-btn-primary flex-1" onClick={() => save(edit)} disabled={!edit.name.trim()}>
                Сохранить стиль
              </button>
              <button className="ws-btn ws-btn-outline" onClick={() => setEdit(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
