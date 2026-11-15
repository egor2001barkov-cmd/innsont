"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { PLAN_STATUSES, detectIntent, type PlanItem, type PlanStatus } from "@/lib/plan";

const INTENTS: PlanItem["intent"][] = ["коммерческий", "информационный", "смешанный"];

const STATUS_HINT: Record<PlanStatus, string> = {
  "идея": "ещё не брали",
  "бриф": "собираем структуру",
  "черновик": "текст пишется",
  "ревью": "проверяем перед публикацией",
  "опубликовано": "ждём индексации",
  "измерено": "есть цифры",
};

export default function PlanPage() {
  const { project, ready } = useWorkspace();
  const [items, setItems] = useState<PlanItem[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [next, setNext] = useState<PlanItem | null>(null);
  const [key, setKey] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [intent, setIntent] = useState<PlanItem["intent"] | "">("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulk, setBulk] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(() => {
    if (!project) return;
    void fetch(`/api/plan?projectId=${encodeURIComponent(project.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setStats(d.stats || {});
        setNext(d.next || null);
      })
      .catch(() => setErr("Не удалось загрузить план"));
  }, [project]);

  useEffect(load, [load]);

  const previewIntent = useMemo(() => detectIntent(key), [key]);

  async function addOne() {
    if (!project || !key.trim()) return;
    setBusy("add");
    setErr("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          items: [{ key, intent: intent || previewIntent, targetUrl, source: "вручную" }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      if (!data.added) setErr("Такой запрос уже есть в плане");
      setKey("");
      setTargetUrl("");
      setIntent("");
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy("");
    }
  }

  async function addBulk() {
    if (!project) return;
    const keys = bulk.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 50);
    if (keys.length === 0) return;
    setBusy("bulk");
    setErr("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, items: keys.map((k) => ({ key: k, source: "список" })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setBulk("");
      setBulkOpen(false);
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy("");
    }
  }

  async function patch(item: PlanItem, p: Partial<PlanItem>) {
    if (!project) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...p } : i)));
    await fetch("/api/plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, id: item.id, patch: p }),
    });
    load();
  }

  async function remove(item: PlanItem) {
    if (!project || !confirm(`Удалить «${item.key}» из плана?`)) return;
    await fetch(`/api/plan?projectId=${encodeURIComponent(project.id)}&id=${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    });
    load();
  }

  async function move(item: PlanItem, dir: -1 | 1) {
    const index = items.findIndex((i) => i.id === item.id);
    const neighbour = items[index + dir];
    if (!neighbour) return;
    await patch(item, { priority: neighbour.priority });
    await patch(neighbour, { priority: item.priority });
  }

  async function write(item: PlanItem) {
    if (item.status === "идея") await patch(item, { status: "бриф" });
    window.location.assign(`/kabinet/statyi?tema=${encodeURIComponent(item.key)}`);
  }

  if (!ready || !project) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold">Контент-план</h1>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          Очередь статей проекта: что писать дальше и на каком этапе каждая. Строка «Написать» сразу открывает
          генератор с подставленным запросом.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {PLAN_STATUSES.map((s) => (
          <div key={s} className="ws-card px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-[#9ca3af]">{s}</div>
            <div className="text-[20px] font-semibold">{stats[s] || 0}</div>
            <div className="text-[11px] text-[#9ca3af]">{STATUS_HINT[s]}</div>
          </div>
        ))}
      </div>

      {next && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4">
          <div className="text-[13px] text-[#9a3412]">
            Следующее действие: <b>{next.key}</b> · {next.status}
          </div>
          <button className="ws-btn ws-btn-primary text-[13px]" onClick={() => void write(next)}>
            Взять в работу →
          </button>
        </div>
      )}

      <div className="ws-card space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_180px_200px_auto]">
          <input
            className="ws-input"
            placeholder="Ключевой запрос, например «продвижение сайта в нейросетях»"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void addOne()}
          />
          <select
            className="ws-input"
            value={intent}
            onChange={(e) => setIntent(e.target.value as PlanItem["intent"] | "")}
          >
            <option value="">Интент: {previewIntent}</option>
            {INTENTS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <input
            className="ws-input"
            placeholder="Целевой URL (необязательно)"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
          <button className="ws-btn ws-btn-primary" onClick={() => void addOne()} disabled={busy === "add"}>
            {busy === "add" ? "Добавляем…" : "Добавить"}
          </button>
        </div>
        <button className="text-[12px] text-[#6b7280] underline" onClick={() => setBulkOpen((v) => !v)}>
          {bulkOpen ? "Скрыть список" : "Вставить списком"}
        </button>
        {bulkOpen && (
          <div className="space-y-2">
            <textarea
              className="ws-input min-h-[120px] font-mono text-[12px]"
              placeholder={"Один запрос в строке, до 50:\nпродвижение сайта в нейросетях\nкак попасть в ответы GigaChat\nGEO для интернет-магазина"}
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
            />
            <button className="ws-btn ws-btn-outline text-[13px]" onClick={() => void addBulk()} disabled={busy === "bulk"}>
              {busy === "bulk" ? "Добавляем…" : "Добавить списком"}
            </button>
          </div>
        )}
        {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
      </div>

      {items.length === 0 ? (
        <div className="ws-card p-6 text-[13px] text-[#6b7280]">
          План пуст. Добавьте запросы вручную или списком — из «Ключей», Вордстата или отчёта по каннибализации.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          <div className="hidden grid-cols-[1fr_130px_120px_120px_120px] gap-2 border-b border-[#f3f4f6] px-4 py-2 text-[11px] uppercase tracking-wide text-[#9ca3af] lg:grid">
            <div>Запрос</div>
            <div>Интент</div>
            <div>Статус</div>
            <div>Цель</div>
            <div className="text-right">Действия</div>
          </div>
          {items.map((item) => (
            <div key={item.id} className="grid gap-2 border-b border-[#f3f4f6] px-4 py-3 last:border-0 lg:grid-cols-[1fr_130px_120px_120px_120px] lg:items-center">
              <div>
                <div className="text-[13.5px] font-medium">{item.key}</div>
                <div className="mt-0.5 text-[11px] text-[#9ca3af]">{item.source} · {item.createdAt.slice(0, 10)}</div>
              </div>
              <div className="text-[12px] text-[#6b7280]">{item.intent}</div>
              <select
                className="rounded-lg border border-[#e5e7eb] px-2 py-1 text-[12px]"
                value={item.status}
                onChange={(e) => void patch(item, { status: e.target.value as PlanStatus })}
              >
                {PLAN_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="truncate text-[12px] text-[#6b7280]" title={item.targetUrl}>
                {item.targetUrl || "—"}
              </div>
              <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                <button className="ws-btn ws-btn-outline px-2 py-1 text-[12px]" onClick={() => void write(item)}>
                  Написать
                </button>
                <button className="px-1 text-[12px] text-[#9ca3af]" title="Выше" onClick={() => void move(item, -1)}>↑</button>
                <button className="px-1 text-[12px] text-[#9ca3af]" title="Ниже" onClick={() => void move(item, 1)}>↓</button>
                <button className="px-1 text-[12px] text-[#b91c1c]" title="Удалить" onClick={() => void remove(item)}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
