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
  const [live, setLive] = useState<null | { md: string; reasoning: string; label: string; progress: number; startedAt: number }>(null);
  const [elapsed, setElapsed] = useState(0);
  const [reviseText, setReviseText] = useState("");
  const [prevMarkdown, setPrevMarkdown] = useState("");
  const [humanizerNote, setHumanizerNote] = useState("");

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

  // Секундомер на экране генерации: 60–90 секунд без индикатора кажутся зависанием.
  useEffect(() => {
    if (!live) return;
    const startedAt = live.startedAt;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.startedAt]);

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

  async function fetchPlan(): Promise<ArticlePlan | null> {
    if (!key.trim()) {
      setErr("Введите ключевой запрос");
      return null;
    }
    setErr("");
    setBusy("plan");
    const data = await call<{ plan: ArticlePlan; provider: "deepseek" | "yandex" | "demo" }>(
      "/api/article/plan",
      requestBody()
    );
    setBusy("");
    if (!data) return null;
    setProvider(data.provider);
    return data.plan;
  }

  async function makePlan() {
    const plan = await fetchPlan();
    if (!plan) return;
    setPlanData(plan);
    setStep("plan");
  }

  async function runDraftLegacy(plan: ArticlePlan) {
    const data = await call<{ markdown: string; provider: "deepseek" | "yandex" | "demo" }>(
      "/api/article/draft",
      { ...requestBody(), plan }
    );
    if (!data) return;
    setMarkdown(data.markdown);
    setProvider(data.provider);
    setSeoTitle("");
    setSeoDescription("");
    setSavedId("");
    setWpLink("");
    setStep("draft");
  }

  function applyArticle(markdownText: string) {
    setMarkdown(markdownText);
    setProvider("deepseek");
    setSeoTitle("");
    setSeoDescription("");
    setSavedId("");
    setWpLink("");
    setStep("draft");
  }

  /**
   * Читает SSE-поток генерации: текст, reasoning, этапы.
   * baseLength — длина исходной статьи при правках: по ней считаем прогресс,
   * потому что там этап один и status приходит только в начале.
   */
  async function readSse(res: Response, opts: { baseLength?: number } = {}): Promise<{ markdown: string; words: number; humanizer?: { before: number; after: number; dashesBefore?: number; dashesAfter?: number; applied: boolean } }> {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let acc = "";
    let lastPaint = 0;
    let finished: { markdown: string; words: number; humanizer?: { before: number; after: number; dashesBefore?: number; dashesAfter?: number; applied: boolean } } | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;

        const evt = JSON.parse(line.slice(5).trim()) as {
          type: string;
          text?: string;
          label?: string;
          progress?: number;
          markdown?: string;
          words?: number;
          humanizer?: { before: number; after: number; dashesBefore?: number; dashesAfter?: number; applied: boolean };
          message?: string;
        };

        if (evt.type === "content" && evt.text) {
          acc += evt.text;
          const now = Date.now();
          if (now - lastPaint > 70) {
            lastPaint = now;
            const snapshot = acc;
            const progress = opts.baseLength
              ? Math.min(94, 10 + Math.round((snapshot.length / Math.max(opts.baseLength, 1)) * 84))
              : undefined;
            setLive((prev) => (prev ? { ...prev, md: snapshot, ...(progress ? { progress } : {}) } : prev));
          }
        } else if (evt.type === "reasoning" && evt.text) {
          const snapshot = evt.text.replace(/deepseek/gi, "INSONT AI");
          setLive((prev) => (prev ? { ...prev, reasoning: snapshot } : prev));
        } else if (evt.type === "status") {
          setLive((prev) => (prev ? { ...prev, label: evt.label || prev.label, progress: evt.progress ?? prev.progress } : prev));
        } else if (evt.type === "done" && evt.markdown) {
          finished = { markdown: evt.markdown, words: evt.words || 0, humanizer: evt.humanizer };
        } else if (evt.type === "error") {
          throw new Error(evt.message || "Генерация прервалась");
        }
      }
    }

    const result = finished as { markdown: string; words: number; humanizer?: { before: number; after: number; dashesBefore?: number; dashesAfter?: number; applied: boolean } } | null;
    if (!result) throw new Error("Поток завершился без текста");
    return result;
  }

  async function runDraft(plan: ArticlePlan) {
    setErr("");
    setBusy("draft");
    setLive({ md: "", reasoning: "", label: "Пишем вступление", progress: 4, startedAt: Date.now() });

    let res: Response;
    try {
      res = await fetch("/api/article/draft-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...requestBody(), plan }),
      });
    } catch {
      setLive(null);
      setBusy("");
      await runDraftLegacy(plan);
      return;
    }

    const isStream = res.ok && res.body && (res.headers.get("content-type") || "").includes("text/event-stream");
    if (!isStream) {
      setLive(null);
      setBusy("");
      await runDraftLegacy(plan);
      return;
    }

    try {
      const result = await readSse(res);
      applyArticle(result.markdown);
      if (result.humanizer) {
        setHumanizerNote(
          result.humanizer.applied
            ? `humanizer: ${result.humanizer.before} → ${result.humanizer.after}${
                result.humanizer.dashesBefore ? `, тире ${result.humanizer.dashesBefore} → ${result.humanizer.dashesAfter}` : ""
              }`
            : `humanizer: чисто, правки не понадобились`,
        );
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Генерация прервалась");
    } finally {
      setLive(null);
      setBusy("");
    }
  }

  async function runRevise() {
    const instruction = reviseText.trim();
    if (instruction.length < 3) {
      setErr("Опишите, что исправить");
      return;
    }
    setErr("");
    setPrevMarkdown(markdown);
    setBusy("revise");
    setLive({ md: "", reasoning: "", label: "Применяем правки", progress: 8, startedAt: Date.now() });

    let res: Response;
    try {
      res = await fetch("/api/article/revise-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown, instruction }),
      });
    } catch {
      setLive(null);
      setBusy("");
      setErr("Не удалось отправить правки — проверьте сеть");
      return;
    }

    const isStream = res.ok && res.body && (res.headers.get("content-type") || "").includes("text/event-stream");
    if (!isStream) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setLive(null);
      setBusy("");
      setErr(data.error || "Не удалось применить правки");
      return;
    }

    try {
      const result = await readSse(res, { baseLength: markdown.length });
      setMarkdown(result.markdown);
      if (result.humanizer) {
        setHumanizerNote(
          result.humanizer.applied
            ? `humanizer: ${result.humanizer.before} → ${result.humanizer.after}${
                result.humanizer.dashesBefore ? `, тире ${result.humanizer.dashesBefore} → ${result.humanizer.dashesAfter}` : ""
              }`
            : `humanizer: чисто, правки не понадобились`,
        );
      }
      setSavedId("");
      setWpLink("");
      setReviseText("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Правки не применились");
    } finally {
      setLive(null);
      setBusy("");
    }
  }

  async function makeDraft() {
    if (!planData) return;
    await runDraft(planData);
  }

  // Один клик «Написать статью»: план собирается и сразу уходит в черновик,
  // чтобы не получать на выходе только план (жалоба 15.11.2026).
  async function makeArticle() {
    const plan = await fetchPlan();
    if (!plan) return;
    setPlanData(plan);
    setStep("plan");
    await runDraft(plan);
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
              <p className="mt-1.5 text-[12px] text-[#9ca3af]">
                Выключенные пункты не попадут в статью: «Таблицы» убирает и разметку, и табличные строки.
              </p>
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
              onClick={() => void makeArticle()}
              disabled={Boolean(busy)}
            >
              {busy === "plan" ? "Планируем…" : busy === "draft" ? "Пишем статью…" : "Написать статью →"}
            </button>
            <button
              className="ws-btn ws-btn-outline w-full py-2 text-[13px]"
              onClick={() => void makePlan()}
              disabled={Boolean(busy)}
            >
              Собрать только план
            </button>
            {busy === "plan" && (
              <div className="ws-skeleton" aria-hidden>
                <span /><span style={{ width: "70%" }} /><span style={{ width: "86%" }} />
              </div>
            )}
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
              {provider && (
                <p className="mt-1 text-[12px] text-[#9ca3af]">
                  Движок: {provider === "deepseek" ? "INSONT AI" : provider === "yandex" ? "INSONT AI (YandexGPT)" : "demo"}
                </p>
              )}
              {provider === "demo" && (
                <p className="mt-1 text-[12px] text-[#b45309]">
                  demo-режим: статья будет заглушкой, пока на сервере не задан ключ LLM
                </p>
              )}
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
            <h2 className="text-[16px] font-semibold">
              Черновик · {words} слов
              {humanizerNote && <span className="ml-2 rounded bg-[#f0fdf4] px-2 py-0.5 text-[11px] font-normal text-[#15803d]">{humanizerNote}</span>}
            </h2>
            <div className="flex gap-2">
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => void polish()} disabled={Boolean(busy)}>
                {busy === "polish" ? "Готовим…" : "Мета-описание"}
              </button>
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => navigator.clipboard.writeText(markdown)}>
                Копировать
              </button>
            </div>
          </div>
          <div className="ws-card space-y-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold">Правки к статье</p>
              {prevMarkdown && (
                <button
                  className="text-[12px] text-[#6b7280] underline"
                  onClick={() => {
                    setMarkdown(prevMarkdown);
                    setPrevMarkdown("");
                  }}
                >
                  ← Вернуть прошлую версию
                </button>
              )}
            </div>
            <p className="text-[12px] text-[#9ca3af]">
              Опишите, что исправить — статья перегенерируется целиком с учётом правок, структура и H1 сохранятся.
            </p>
            <textarea
              className="ws-input min-h-[64px]"
              maxLength={600}
              placeholder="Например: сократи вступление, добавь блок про цены и сроки, убери канцелярит"
              value={reviseText}
              onChange={(e) => setReviseText(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button className="ws-btn ws-btn-primary text-[13px]" onClick={() => void runRevise()} disabled={Boolean(busy)}>
                {busy === "revise" ? "Применяем правки…" : "Перегенерировать с правками →"}
              </button>
              {["Сократить на 30%", "Добавить цены", "Проще язык", "Убрать воду"].map((chip) => (
                <button
                  key={chip}
                  className="ws-btn ws-btn-outline px-2 py-1 text-[12px]"
                  onClick={() => setReviseText(chip)}
                  disabled={Boolean(busy)}
                >
                  {chip}
                </button>
              ))}
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
              {markdown && (
                <a href={`/kabinet/humanizer?text=${encodeURIComponent(markdown.slice(0, 2000))}`} className="ws-btn ws-btn-outline">
                  Очеловечить →
                </a>
              )}
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

      {live && (
        <div className="ws-write-overlay" role="status" aria-live="polite">
          <div className="ws-write-card">
            <div className="ws-write-head">
              <span className="ws-dot" />
              <span className="ws-write-title">{busy === "revise" ? "Правим статью" : "Пишем статью"}</span>
              <span className="ws-write-timer">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}</span>
              <span className="ws-write-pct">{live.progress}%</span>
            </div>
            <div className="ws-progress"><span style={{ width: `${live.progress}%` }} /></div>
            <div className="ws-write-stage">{live.label}</div>

            {live.reasoning && (
              <details className="ws-think" open>
                <summary>Модель думает</summary>
                <div className="ws-think-text">{live.reasoning.slice(-420)}</div>
              </details>
            )}

            <div className="ws-live">
              {live.md ? (
                live.md
                  .split("\n")
                  .filter((l) => l.trim())
                  .slice(-30)
                  .map((line, i) =>
                    line.startsWith("## ") ? (
                      <div key={i} className="ws-live-h">{line.slice(3)}</div>
                    ) : (
                      <p key={i} className="ws-live-p">{line}</p>
                    )
                  )
              ) : (
                <div className="ws-skeleton" aria-hidden>
                  <span /><span style={{ width: "72%" }} /><span style={{ width: "88%" }} /><span style={{ width: "64%" }} />
                </div>
              )}
              <span className="ws-caret" />
            </div>

            <div className="ws-write-foot">
              {busy === "revise" ? "Обычно 40–70 секунд: статья переписывается с учётом правок и прогоняется через humanizer." : "Обычно 80–110 секунд: план, разделы, FAQ и финальный проход humanizer. Вкладку можно не закрывать."}
            </div>
          </div>
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
