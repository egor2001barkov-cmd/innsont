"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { TEMPLATES, type TemplateDef } from "@/lib/templates";
import { saveSession, type Session } from "@/lib/session";
import { STYLE_PRESETS, loadStyles, type WritingStyle } from "@/lib/workspace";

const GROUPS = ["Контент", "SEO", "Маркетинг", "E-commerce"] as const;

export default function TemplatesPage() {
  const { session, setSession, project, ready } = useWorkspace();
  const [group, setGroup] = useState<(typeof GROUPS)[number] | "все">("все");
  const [openTpl, setOpenTpl] = useState<TemplateDef | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [styleId, setStyleId] = useState("none");
  const [styles, setStyles] = useState<WritingStyle[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<{ text: string; title: string; contentType: string } | null>(null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setStyles(loadStyles());
  }, [project?.id]);

  // Brand Voice: пользовательские стили + встроенные пресеты
  const styleOptions = [
    { id: "none", name: "Без стиля" },
    ...styles.map((s) => ({ id: s.id, name: `Стиль: ${s.name}` })),
    ...STYLE_PRESETS.map((p) => ({ id: "preset:" + p.id, name: `Пресет: ${p.name}` })),
  ];
  const activeStyle =
    styleId === "none"
      ? undefined
      : styleId.startsWith("preset:")
        ? STYLE_PRESETS.find((p) => "preset:" + p.id === styleId)?.style
        : styles.find((s) => s.id === styleId);

  if (!ready || !project) return null;

  const shown = TEMPLATES.filter((t) => group === "все" || t.group === group);

  function open(t: TemplateDef) {
    setOpenTpl(t);
    setValues({});
    setResult(null);
    setErr("");
    setSaved("");
  }

  async function generate() {
    if (!openTpl || busy) return;
    setBusy(true);
    setErr("");
    setResult(null);
    setSaved("");
    const res = await fetch("/api/template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: openTpl.id,
        fields: values,
        projectName: project?.name,
        projectUrl: project?.url,
        style: activeStyle,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      text?: string;
      title?: string;
      contentType?: string;
      error?: string;
      profile?: Partial<Session>;
    };
    setBusy(false);
    if (data.profile && session) {
      const next = { ...session, ...data.profile };
      saveSession(next);
      setSession(next);
    }
    if (!res.ok || !data.text) {
      setErr(data.error || "Не удалось сгенерировать");
      return;
    }
    setResult({ text: data.text, title: data.title || openTpl.outputName, contentType: data.contentType || openTpl.contentType });
  }

  async function saveToContent() {
    if (!result || !openTpl) return;
    setSaved("");
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project!.id,
        title: result.title,
        body: result.text,
        type: result.contentType,
        status: "черновик",
        meta: { key: values.key || values.topic || "", provider: "template:" + openTpl.id },
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { item?: { id: string }; profile?: Partial<Session>; error?: string };
    if (data.profile && session) {
      const next = { ...session, ...data.profile };
      saveSession(next);
      setSession(next);
    }
    setSaved(res.ok && data.item ? "Сохранено в «Мой контент»" : data.error || "Ошибка сохранения");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Шаблоны</h1>
        <p className="mt-1 max-w-xl text-sm text-[#6b7280]">
          Выберите формат — заполните пару полей — получите готовый текст. Результат сохраняется в «Мой контент»
          и оттуда публикуется в WordPress.
        </p>
      </div>

      {/* Фильтр по группам */}
      <div className="mt-4 inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px] font-medium">
        {(["все", ...GROUPS] as const).map((g) => (
          <button
            key={g}
            className={`rounded-md px-3.5 py-1.5 ${group === g ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setGroup(g)}
          >
            {g === "все" ? "Все" : g}
          </button>
        ))}
      </div>

      {/* Сетка карточек */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <button
            key={t.id}
            onClick={() => open(t)}
            className="ws-card group p-4 text-left transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f0ff] text-[15px] text-[#7c3aed]">
                {icon(t.icon)}
              </span>
              <span className="text-[14px] font-semibold">{t.name}</span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-[#6b7280]">{t.desc}</p>
            <span className="mt-3 inline-block rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[11px] text-[#9ca3af]">{t.group}</span>
          </button>
        ))}
      </div>

      {/* Форма шаблона */}
      {openTpl && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4" onClick={() => !busy && setOpenTpl(null)}>
          <div className="ws-card mt-8 w-full max-w-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{openTpl.name}</h2>
                <p className="mt-0.5 text-[13px] text-[#6b7280]">{openTpl.desc}</p>
              </div>
              <button className="text-[20px] leading-none text-[#9ca3af] hover:text-[#111827]" onClick={() => !busy && setOpenTpl(null)} aria-label="Закрыть">×</button>
            </div>

            {!result && (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1 block text-[13px] font-medium">Стиль бренда (Brand Voice)</span>
                  <select
                    className="ws-input"
                    value={styleId}
                    onChange={(e) => setStyleId(e.target.value)}
                    disabled={busy}
                  >
                    {styleOptions.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[11px] text-[#9ca3af]">
                    Тон, аудитория и правила из «Стили письма» применяются к генерации
                  </span>
                </label>
                {openTpl.fields.map((f) => (
                  <label key={f.id} className="block">
                    <span className="mb-1 block text-[13px] font-medium">
                      {f.label}
                      {f.required && <span className="text-[#b91c1c]"> *</span>}
                    </span>
                    {f.type === "textarea" ? (
                      <textarea
                        className="ws-input min-h-[90px]"
                        placeholder={f.placeholder}
                        value={values[f.id] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                        disabled={busy}
                      />
                    ) : f.type === "select" ? (
                      <select
                        className="ws-input"
                        value={values[f.id] || f.options?.[0] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                        disabled={busy}
                      >
                        {f.options?.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === "url" ? (
                      <input
                        type="url"
                        inputMode="url"
                        className="ws-input"
                        placeholder={f.placeholder || "https://…"}
                        value={values[f.id] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value.trim() }))}
                        disabled={busy}
                      />
                    ) : (
                      <input
                        className="ws-input"
                        placeholder={f.placeholder}
                        value={values[f.id] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                        disabled={busy}
                      />
                    )}
                  </label>
                ))}

                {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}

                <div className="flex items-center gap-3 pt-1">
                  <button className="ws-btn ws-btn-primary" onClick={() => void generate()} disabled={busy}>
                    {busy ? (
                      <span className="flex items-center gap-2">
                        <span className="ws-spinner" /> Генерируем…
                      </span>
                    ) : (
                      "Сгенерировать"
                    )}
                  </button>
                  <span className="text-[12px] text-[#9ca3af]">1 промпт тарифа</span>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#f0fdf4] px-2 py-0.5 text-[12px] font-medium text-[#15803d]">Готово</span>
                  <button className="ws-btn ws-btn-outline py-1 text-[12px]" onClick={() => navigator.clipboard.writeText(result.text)}>
                    Копировать
                </button>
                  <button className="ws-btn ws-btn-outline py-1 text-[12px]" onClick={() => void saveToContent()}>
                    В «Мой контент»
                  </button>
                  {saved && <span className="text-[12px] text-[#15803d]">{saved}</span>}
                  <button className="ml-auto text-[13px] text-[#6b7280] hover:text-[#ea580c]" onClick={() => { setResult(null); setSaved(""); }}>
                    Изменить поля
                  </button>
                </div>
                <textarea
                  className="ws-input min-h-[320px] font-mono text-[13px]"
                  value={result.text}
                  onChange={(e) => setResult({ ...result, text: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function icon(name: string): string {
  const map: Record<string, string> = {
    layout: "▤", box: "▣", chat: "✎", mail: "✉", target: "◎",
    tag: "#", help: "?", heading: "H", pen: "✐", list: "☰",
  };
  return map[name] || "✦";
}
