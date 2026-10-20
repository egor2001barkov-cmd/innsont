"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { WpDialog } from "@/components/kabinet/WpDialog";
import { saveSession, type Session } from "@/lib/session";

type ServerArticle = {
  id: string;
  projectId: string;
  title: string;
  type: "статья" | "FAQ" | "пост" | "письмо" | "бриф";
  status: "черновик" | "готово" | "опубликовано";
  words: number;
  updated: string;
  body: string;
  meta?: {
    key?: string;
    seoTitle?: string;
    seoDescription?: string;
    provider?: string;
    source?: string;
    wpUrl?: string;
    wpPostId?: number;
  };
};

export default function ContentLibrary() {
  const { session, setSession, project, ready } = useWorkspace();
  const [items, setItems] = useState<ServerArticle[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("все");
  const [open, setOpen] = useState<ServerArticle | null>(null);
  const [editBody, setEditBody] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [wpOpen, setWpOpen] = useState(false);

  const reload = useCallback(() => {
    if (!project) return;
    void fetch(`/api/content?projectId=${encodeURIComponent(project.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { items?: ServerArticle[]; profile?: Partial<Session> }) => {
        setItems(d.items || []);
        if (d.profile && session) {
          const next = { ...session, ...d.profile };
          saveSession(next);
          setSession(next);
        }
      })
      .catch(() => undefined);
  }, [project, session, setSession]);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  if (!ready || !project) return null;

  const shown = items.filter(
    (i) => (type === "все" || i.type === type) && i.title.toLowerCase().includes(q.toLowerCase())
  );

  function remove(id: string) {
    void fetch(`/api/content?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setOpen(null);
      })
      .catch(() => undefined);
  }

  async function saveEdit() {
    if (!open) return;
    setBusy("save");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: open.id, body: editBody, status: "готово" }),
    });
    setBusy("");
    if (!res.ok) {
      setErr("Не удалось сохранить");
      return;
    }
    const data = (await res.json()) as { article: ServerArticle };
    setItems((prev) => prev.map((i) => (i.id === data.article.id ? data.article : i)));
    setOpen(data.article);
  }

  async function publishWp() {
    if (!open) return;
    setBusy("wp");
    const res = await fetch("/api/article/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: open.id, projectId: project!.id }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; article?: ServerArticle; link?: string };
    setBusy("");
    if (!res.ok) {
      setErr(data.error || "Не удалось опубликовать");
      return;
    }
    if (data.article) {
      setItems((prev) => prev.map((i) => (i.id === data.article!.id ? data.article! : i)));
      setOpen(data.article);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Библиотека {project.name}: статьи, FAQ, письма. {items.length} материалов · хранятся на
          сервере.
        </p>
        <div className="flex gap-2">
          <button className="ws-btn ws-btn-outline" onClick={() => setWpOpen(true)}>
            WordPress
          </button>
          <Link href="/kabinet/statyi" className="ws-btn ws-btn-primary">
            + Создать
          </Link>
        </div>
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
              <tr
                key={i.id}
                className="cursor-pointer hover:bg-[#fafafa]"
                onClick={() => {
                  setOpen(i);
                  setEditBody(i.body);
                  setErr("");
                }}
              >
                <td className="font-medium">
                  {i.title}
                  {i.meta?.wpUrl && <span className="ml-2 text-[11px] text-[#0f766e]">в WP ✓</span>}
                </td>
                <td>{i.type}</td>
                <td>{i.status}</td>
                <td className="tabular-nums">{i.words}</td>
                <td className="text-[#6b7280]">{i.updated}</td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#9ca3af]">
                  Пока пусто. Создайте первую статью в разделе «Создание контента».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold">{open.title}</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {open.type} · {open.status} · {open.words} слов
              {open.meta?.provider === "deepseek" && " · DeepSeek"}{open.meta?.provider === "yandex" && " · YandexGPT"}{open.meta?.provider === "demo" && " · демо-генерация"}
            </p>
            {err && <p className="mt-2 text-[13px] text-[#b91c1c]">{err}</p>}
            <textarea
              className="ws-input mt-3 min-h-[300px] flex-1 font-mono text-[13px]"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="ws-btn ws-btn-primary" onClick={() => void saveEdit()} disabled={Boolean(busy)}>
                {busy === "save" ? "Сохраняем…" : "Сохранить правки"}
              </button>
              <button className="ws-btn ws-btn-outline" onClick={() => void publishWp()} disabled={Boolean(busy)}>
                {busy === "wp" ? "Публикуем…" : "В WordPress (черновик)"}
              </button>
              <a
                className="ws-btn ws-btn-outline"
                href={`/api/content/export?id=${encodeURIComponent(open.id)}&format=md`}
              >
                .md
              </a>
              <a
                className="ws-btn ws-btn-outline"
                href={`/api/content/export?id=${encodeURIComponent(open.id)}&format=html`}
              >
                .html
              </a>
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

      <WpDialog projectId={project.id} open={wpOpen} onClose={() => setWpOpen(false)} onSaved={reload} />
    </div>
  );
}
