"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { WpDialog } from "@/components/kabinet/WpDialog";
import { saveSession, type Session } from "@/lib/session";
import { loadStyles, STYLE_PRESETS, type WritingStyle } from "@/lib/workspace";
import type { ArticlePlan } from "@/lib/article";

type Step = "form" | "plan" | "draft";

type Length = "короткая" | "средняя" | "длинная";
type Pov = "я" | "мы" | "вы" | "они" | "нейтральный";
type Goal = "информировать" | "продавать" | "сравнивать" | "обучать";
type Level = "новичок" | "средний" | "эксперт";

function applyProfile(s: Session | null, profile: Partial<Session> | undefined, setSession: (s: Session) => void) {
  if (!profile || !s) return;
  const next = { ...s, ...profile };
  saveSession(next);
  setSession(next);
}

const TONES = [
  "деловой",
  "живой",
  "нейтральный",
  "экспертный",
  "разговорный",
  "энергичный",
  "тёплый",
  "ироничный",
  "строгий",
  "убеждающий",
];

const AUDIENCES = [
  "владельцы малого бизнеса",
  "маркетологи",
  "SEO-специалисты",
  "разработчики",
  "руководители",
  "покупатели B2C",
  "закупщики B2B",
  "студенты и новички",
];

function Writer() {
  const params = useSearchParams();
  const { session, setSession, project, plan: planLimit, ready } = useWorkspace();
  const [step, setStep] = useState<Step>("form");
  const [key, setKey] = useState("");
  const [styleId, setStyleId] = useState("");
  const [region, setRegion] = useState("");
  const [planData, setPlanData] = useState<ArticlePlan | null>(null);
  const [provider, setProvider] = useState<"deepseek" | "yandex" | "demo" | "">("");
  const [markdown, setMarkdown] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [savedId, setSavedId] = useState("");
  const [wpLink, setWpLink] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [wpOpen, setWpOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Writesonic-уровень параметров
  const [length, setLength] = useState<Length>("средняя");
  const [tone, setTone] = useState("деловой");
  const [audience, setAudience] = useState("");
  const [pov, setPov] = useState<Pov>("нейтральный");
  const [goal, setGoal] = useState<Goal>("информировать");
  const [readingLevel, setReadingLevel] = useState<Level>("средний");
  const [includeFaq, setIncludeFaq] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [includeStats, setIncludeStats] = useState(false);
  const [includeCta, setIncludeCta] = useState(false);
  const [extraKeys, setExtraKeys] = useState("");
  const [instructions, setInstructions] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [bannedWords, setBannedWords] = useState("");

  useEffect(() => {
    const t = params.get("tema");
    if (t) setKey(t);
  }, [params]);

  const styles = useMemo(
    () => (project ? loadStyles().filter((s) => s.projectId === project.id) : []),
    [project]
  );
  const style = styles.find((s) => s.id === styleId) || styles[0];

  // применить параметры выбранного стиля к форме
  useEffect(() => {
    if (style) {
      if (style.tone) setTone(style.tone);
      if (style.audience) setAudience(style.audience);
      if (style.pov) setPov(style.pov);
      if (style.goal) setGoal(style.goal);
      if (style.readingLevel) setReadingLevel(style.readingLevel);
      if (style.bannedWords?.length) setBannedWords(style.bannedWords.join(", "));
    }
  }, [styleId, styles]);

  if (!ready || !session || !project) return null;

  async function call<T>(url: string, body: unknown): Promise<T | null> {
    setErr("");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string; profile?: Partial<Session> };
    applyProfile(session, data.profile, setSession);
    if (!res.ok) {
      setErr(data.error || `Ошибка ${res.status}`);
      return null;
    }
    return data;
  }

  function requestBody() {
    return {
      key,
      projectId: project!.id,
      region,
      length,
      pov,
      goal,
      readingLevel,
      includeFaq,
      includeTables,
      includeStats,
      includeCta,
      keywords: extraKeys.split(/[,\n]/).map((k) => k.trim()).filter(Boolean),
      instructions,
      referenceUrl,
      bannedWords: bannedWords.split(/[,\n]/).map((w) => w.trim()).filter(Boolean),
      preferredPhrases: style?.preferredPhrases || [],
      style: {
        tone: tone || style?.tone || "",
        audience: audience || style?.audience || "",
        rules: style?.rules || "",
        pov,
        goal,
        readingLevel,
      },
      project: { name: project!.name, url: project!.url, industry: project!.industry },
    };
  }

  async function makePlan() {
    if (!key.trim()) {
      setErr("Введите ключевой запрос");
      return;
    }
    setBusy("plan");
    const data = await call<{ plan: ArticlePlan; provider: "deepseek" | "yandex" | "demo" }>(
      "/api/article/plan",
      requestBody()
    );
    setBusy("");
    if (!data) return;
    setPlanData(data.plan);
    setProvider(data.provider);
    setStep("plan");
  }

  async function makeDraft() {
    if (!planData) return;
    setBusy("draft");
    const data = await call<{ markdown: string; provider: "deepseek" | "yandex" | "demo" }>(
      "/api/article/draft",
      { ...requestBody(), plan: planData }
    );
    setBusy("");
    if (!data) return;
    setMarkdown(data.markdown);
    setProvider(data.provider);
    setSeoTitle("");
    setSeoDescription("");
    setSavedId("");
    setWpLink("");
    setStep("draft");
  }

  async function polish() {
    setBusy("polish");
    const data = await call<{ seoTitle: string; seoDescription: string; provider: string }>(
      "/api/article/polish",
      { ...requestBody(), markdown }
    );
    setBusy("");
    if (!data) return;
    setSeoTitle(data.seoTitle);
    setSeoDescription(data.seoDescription);
  }

  async function save() {
    setBusy("save");
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project!.id,
        title: planData?.title || key,
        type: "статья",
        status: "черновик",
        body: markdown,
        meta: { key, seoTitle, seoDescription, provider: provider || "manual", source: "writer" },
        spend: true,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; article?: { id: string }; profile?: Partial<Session> };
    applyProfile(session, data.profile, setSession);
    setBusy("");
    if (!res.ok) {
      setErr(data.error || "Не удалось сохранить");
      return;
    }
    setSavedId(data.article?.id || "");
  }

  async function publishWp() {
    if (!savedId) {
      setErr("Сначала сохраните статью");
      return;
    }
    setBusy("wp");
    const data = await call<{ link?: string }>("/api/article/publish", {
      articleId: savedId,
      projectId: project!.id,
    });
    setBusy("");
    if (!data) return;
    setWpLink(data.link || "");
  }

  const words = markdown ? markdown.split(/\s+/).filter(Boolean).length : 0;
  const articlesLeft = planLimit.limits.articles - session.articlesUsed;

  const inputCls = "ws-input mt-1";
  const labelCls = "block text-[13px] font-medium";

  return (
    <div className="mx-auto max-w-5xl">
      {step === "form" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="ws-card space-y-4 p-5">
            {/* Основное */}
            <label className={labelCls}>
              Ключевой запрос *
              <input
                className={inputCls}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="например: остекление балкона цена"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                Стиль
                <select className={inputCls} value={styleId} onChange={(e) => setStyleId(e.target.value)}>
                  <option value="">Без стиля</option>
                  {styles.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className={labelCls}>
                Регион
                <input className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Москва" />
              </label>
            </div>

            {/* Объём и тон */}
            <div>
              <p className="text-[13px] font-medium">Объём статьи</p>
              <div className="mt-1.5 inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px]">
                {(["короткая", "средняя", "длинная"] as Length[]).map((l) => (
                  <button
                    key={l}
                    className={`rounded-md px-4 py-2 ${length === l ? "bg-white font-medium shadow-sm" : "text-[#6b7280]"}`}
                    onClick={() => setLength(l)}
                  >
                    {l === "короткая" ? "~800 слов" : l === "средняя" ? "~1500 слов" : "2500+ слов"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                Тон
                <select className={inputCls} value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className={labelCls}>
                Аудитория
                <input
                  className={inputCls}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="кто читатель"
                  list="audiences"
                />
                <datalist id="audiences">
                  {AUDIENCES.map((a) => <option key={a} value={a} />)}
                </datalist>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className={labelCls}>
                От лица
                <select className={inputCls} value={pov} onChange={(e) => setPov(e.target.value as Pov)}>
                  <option value="нейтральный">нейтрально</option>
                  <option value="я">я</option>
                  <option value="мы">мы</option>
                  <option value="вы">вы</option>
                  <option value="они">они</option>
                </select>
              </label>
              <label className={labelCls}>
                Цель
                <select className={inputCls} value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
                  <option value="информировать">информировать</option>
                  <option value="продавать">продавать</option>
                  <option value="сравнивать">сравнивать</option>
                  <option value="обучать">обучать</option>
                </select>
              </label>
              <label className={labelCls}>
                Уровень
                <select className={inputCls} value={readingLevel} onChange={(e) => setReadingLevel(e.target.value as Level)}>
                  <option value="новичок">новичок</option>
                  <option value="средний">средний</option>
                  <option value="эксперт">эксперт</option>
                </select>
              </label>
            </div>

            {/* Переключатели контента */}
            <div>
              <p className="text-[13px] font-medium">Включить в статью</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {[
                  { v: includeFaq, set: setIncludeFaq, label: "FAQ" },
                  { v: includeTables, set: setIncludeTables, label: "Таблицы" },
                  { v: includeStats, set: setIncludeStats, label: "Цифры и статистика" },
                  { v: includeCta, set: setIncludeCta, label: "Призыв к действию" },
                ].map((t) => (
                  <button
                    key={t.label}
                    className={`rounded-lg border px-3 py-1.5 text-[13px] transition-all ${
                      t.v
                        ? "border-[#ea580c] bg-[#fff7ed] font-medium text-[#ea580c]"
                        : "border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db]"
                    }`}
                    onClick={() => t.set(!t.v)}
                  >
                    {t.v ? "✓ " : ""}{t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Расширенные параметры */}
            <button
              className="flex w-full items-center justify-between border-t border-[#f3f4f6] pt-3 text-[13px] font-medium text-[#6b7280] hover:text-[#111827]"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Дополнительные параметры
              <span className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}>▾</span>
            </button>

            {showAdvanced && (
              <div className="space-y-3 rounded-xl bg-[#fafafa] p-4">
                <label className={labelCls}>
                  Дополнительные ключи (через запятую)
                  <input
                    className={inputCls}
                    value={extraKeys}
                    onChange={(e) => setExtraKeys(e.target.value)}
                    placeholder="lsi-ключи, синонимы, смежные темы"
                  />
                </label>
                <label className={labelCls}>
                  Референс (URL статьи-примера)
                  <input
                    className={inputCls}
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </label>
                <label className={labelCls}>
                  Запрещённые слова (через запятую)
                  <input
                    className={inputCls}
                    value={bannedWords}
                    onChange={(e) => setBannedWords(e.target.value)}
                    placeholder="инновационный, уникальный, лучший"
                  />
                </label>
                <label className={labelCls}>
                  Указания для ИИ
                  <textarea
                    className={`${inputCls} min-h-[80px]`}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Не упоминать конкурентов. Добавить блок о сроках. Начать с истории клиента..."
                  />
                </label>
              </div>
            )}

            {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
            <button
              className="ws-btn ws-btn-primary w-full py-3 text-[15px]"
              onClick={() => void makePlan()}
              disabled={Boolean(busy)}
            >
              {busy === "plan" ? "Собираем план…" : "Собрать план статьи →"}
            </button>
          </div>

          {/* Боковая панель со сводкой */}
          <div className="ws-card h-fit space-y-3 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9ca3af]">Параметры</p>
            <ul className="space-y-1.5 text-[13px] text-[#4b5563]">
              <li>Объём: <b>{length === "короткая" ? "800" : length === "средняя" ? "1500" : "2500+"} слов</b></li>
              <li>Тон: <b>{tone}</b></li>
              {audience && <li>Аудитория: <b>{audience}</b></li>}
              <li>От лица: <b>{pov}</b></li>
              <li>Цель: <b>{goal}</b></li>
              <li>Уровень: <b>{readingLevel}</b></li>
              <li>FAQ: {includeFaq ? "✓" : "—"} · Таблицы: {includeTables ? "✓" : "—"}</li>
            </ul>
            <div className="border-t border-[#f3f4f6] pt-3">
              <p className="text-[12px] text-[#9ca3af]">Осталось статей: {articlesLeft} из {planLimit.limits.articles}</p>
              {provider && <p className="mt-1 text-[12px] text-[#9ca3af]">Провайдер: {provider}</p>}
            </div>
          </div>
        </div>
      )}

      {/* План */}
      {step === "plan" && planData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">План статьи · можно править</h2>
            <button className="ws-btn ws-btn-outline text-[13px]" onClick={() => setStep("form")}>← Изменить запрос</button>
          </div>
          <div className="ws-card space-y-4 p-5">
            <label className={labelCls}>
              H1
              <input className={inputCls} value={planData.title} onChange={(e) => setPlanData({ ...planData, title: e.target.value })} />
            </label>
            <label className={labelCls}>
              Короткий ответ
              <textarea className={`${inputCls} min-h-[50px]`} value={planData.intro} onChange={(e) => setPlanData({ ...planData, intro: e.target.value })} />
            </label>
            <div>
              <p className="text-[13px] font-medium">Разделы</p>
              {planData.sections.map((s, i) => (
                <div key={i} className="mt-2 flex gap-2">
                  <input
                    className="ws-input flex-1"
                    value={s.h2}
                    onChange={(e) => {
                      const sections = [...planData.sections];
                      sections[i] = { ...s, h2: e.target.value };
                      setPlanData({ ...planData, sections });
                    }}
                  />
                  <button
                    className="ws-btn ws-btn-outline px-3"
                    onClick={() => setPlanData({ ...planData, sections: planData.sections.filter((_, j) => j !== i) })}
                  >×</button>
                </div>
              ))}
              <button
                className="ws-btn ws-btn-outline mt-2 text-[13px]"
                onClick={() => setPlanData({ ...planData, sections: [...planData.sections, { h2: "Новый раздел", hint: "" }] })}
              >+ Раздел</button>
            </div>
          </div>
          <button
            className="ws-btn ws-btn-primary w-full py-3 text-[15px]"
            onClick={() => void makeDraft()}
            disabled={Boolean(busy)}
          >
            {busy === "draft" ? "Пишем черновик…" : "Написать черновик →"}
          </button>
        </div>
      )}

      {/* Черновик */}
      {step === "draft" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[16px] font-semibold">Черновик · {words} слов</h2>
            <div className="flex gap-2">
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => void polish()} disabled={Boolean(busy)}>
                {busy === "polish" ? "Готовим…" : "Мета-описание"}
              </button>
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => navigator.clipboard.writeText(markdown)}>
                Копировать
              </button>
            </div>
          </div>
          <textarea
            className="ws-input min-h-[400px] font-mono text-[13px] leading-relaxed"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
          {(seoTitle || seoDescription) && (
            <div className="space-y-2 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">Мета</p>
              <label className="block text-[13px]">Title<input className="ws-input mt-1" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></label>
              <label className="block text-[13px]">Description<textarea className="ws-input mt-1 min-h-[50px]" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></label>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button className="ws-btn ws-btn-primary" onClick={() => void save()} disabled={Boolean(busy) || Boolean(savedId)}>
              {busy === "save" ? "Сохраняем…" : savedId ? "Сохранено ✓" : "Сохранить в контент"}
            </button>
            {savedId && (
              <>
                <button className="ws-btn ws-btn-outline" onClick={() => setWpOpen(true)}>WordPress</button>
                <button className="ws-btn ws-btn-outline" onClick={() => void publishWp()} disabled={Boolean(busy)}>
                  {busy === "wp" ? "Публикуем…" : wpLink ? "Опубликовано ✓" : "Опубликовать в WP"}
                </button>
              </>
            )}
            <button className="ws-btn ws-btn-outline" onClick={() => setStep("form")} disabled={Boolean(busy)}>
              ← Новая статья
            </button>
          </div>
          {wpLink && (
            <p className="text-[13px] text-[#0f766e]">
              <a className="underline" href={wpLink} target="_blank" rel="noreferrer">Открыть в WP →</a>
            </p>
          )}
        </div>
      )}

      <WpDialog projectId={project.id} open={wpOpen} onClose={() => setWpOpen(false)} />
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense>
      <Writer />
    </Suspense>
  );
}
