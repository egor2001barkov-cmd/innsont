"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { loadContent, saveContent, type ContentItem } from "@/lib/workspace";

export default function ContentLibrary() {
  const { project, ready } = useWorkspace();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("все");
  const [open, setOpen] = useState<ContentItem | null>(null);

  useEffect(() => setItems(loadContent()), []);
  if (!ready || !project) return null;

  const mine = items.filter((i) => i.projectId === project.id);
  const shown = mine.filter(
    (i) =>
      (type === "все" || i.type === type) &&
      i.title.toLowerCase().includes(q.toLowerCase())
  );

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveContent(next);
    setOpen(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Библиотека {project.name}: статьи, FAQ, письма. {mine.length} материалов.
        </p>
        <Link href="/kabinet/statyi" className="ws-btn ws-btn-primary">
          + Создать
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <input className="ws-input max-w-xs" placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="ws-input w-auto" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="все">Все типы</option>
          <option value="статья">Статьи</option>
          <option value="FAQ">FAQ</option>
          <option value="пост">Посты</option>
          <option value="письмо">Письма</option>
          <option value="бриф">Брифы</option>
        </select>
      </div>
      <div className="ws-card mt-4 min-w-0 overflow-x-auto">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Слова</th>
              <th>Обновлён</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((i) => (
              <tr key={i.id} className="cursor-pointer hover:bg-[#fafafa]" onClick={() => setOpen(i)}>
                <td className="font-medium">{i.title}</td>
                <td>{i.type}</td>
                <td>{i.status}</td>
                <td className="tabular-nums">{i.words}</td>
                <td className="text-[#6b7280]">{i.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold">{open.title}</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {open.type} · {open.status} · {open.words} слов
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#374151]">
              {open.body ||
                "Черновик из конвейера. Откройте «Создание контента», чтобы пересобрать текст под голос проекта."}
            </p>
            <div className="mt-4 flex gap-2">
              <Link href="/kabinet/statyi" className="ws-btn ws-btn-primary">
                Пересобрать
              </Link>
              <button className="ws-btn ws-btn-outline text-[#b91c1c]" onClick={() => remove(open.id)}>
                Удалить
              </button>
              <button className="ws-btn ws-btn-outline ml-auto" onClick={() => setOpen(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
