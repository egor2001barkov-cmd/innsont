"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadStyles, saveStyles, type WritingStyle } from "@/lib/workspace";

export default function StylesPage() {
  const { project, plan, ready } = useWorkspace();
  const [items, setItems] = useState<WritingStyle[]>([]);
  const [edit, setEdit] = useState<WritingStyle | null>(null);

  useEffect(() => setItems(loadStyles()), []);
  if (!ready || !project) return null;

  const mine = items.filter((s) => s.projectId === project.id);

  function save(s: WritingStyle) {
    const exists = items.some((x) => x.id === s.id);
    const next = exists ? items.map((x) => (x.id === s.id ? s : x)) : [...items, s];
    if (!exists && mine.length >= plan.limits.styles) {
      alert(`На тарифе «${plan.name}» голосов: ${plan.limits.styles}`);
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Голос бренда для статей и чата. {mine.length} из {plan.limits.styles} на тарифе «{plan.name}».
        </p>
        <button
          className="ws-btn ws-btn-primary"
          onClick={() =>
            setEdit({
              id: "new-" + Date.now(),
              projectId: project.id,
              name: "",
              tone: "деловой",
              audience: "",
              rules: "",
            })
          }
        >
          + Стиль
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {mine.map((s) => (
          <div key={s.id} className="ws-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="mt-1 text-[13px] text-[#6b7280]">{s.tone} · {s.audience}</div>
                <p className="mt-2 text-[13px] text-[#374151]">{s.rules}</p>
              </div>
              <div className="flex gap-2">
                <button className="ws-btn ws-btn-outline py-1.5 text-[12px]" onClick={() => setEdit(s)}>
                  Править
                </button>
                <button className="ws-btn ws-btn-outline py-1.5 text-[12px] text-[#b91c1c]" onClick={() => remove(s.id)}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
        {mine.length === 0 && (
          <div className="ws-card p-8 text-center text-sm text-[#6b7280]">
            Стиля ещё нет. Добавьте голос — автор статей будет писать им.
          </div>
        )}
      </div>
      {edit && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              save({
                ...edit,
                name: String(fd.get("name")),
                tone: String(fd.get("tone")),
                audience: String(fd.get("audience")),
                rules: String(fd.get("rules")),
              });
            }}
          >
            <h2 className="text-lg font-semibold">Стиль письма</h2>
            <input className="ws-input" name="name" defaultValue={edit.name} required placeholder="Название" />
            <input className="ws-input" name="tone" defaultValue={edit.tone} placeholder="Тон" />
            <input className="ws-input" name="audience" defaultValue={edit.audience} placeholder="Аудитория" />
            <textarea className="ws-input min-h-24" name="rules" defaultValue={edit.rules} placeholder="Правила" />
            <div className="flex gap-2">
              <button className="ws-btn ws-btn-primary flex-1" type="submit">
                Сохранить
              </button>
              <button className="ws-btn ws-btn-outline" type="button" onClick={() => setEdit(null)}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
