"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { WpDialog } from "@/components/kabinet/WpDialog";
import { saveSession, type Session } from "@/lib/session";
import { loadStyles } from "@/lib/workspace";
import type { ArticlePlan } from "@/lib/article";

type Step = "form" | "plan" | "draft";

function applyProfile(s: Session | null, profile: Partial<Session> | undefined, setSession: (s: Session) => void) {
  if (!profile || !s) return;
  const next = { ...s, ...profile };
  saveSession(next);
  setSession(next);
}

function Writer() {
  const params = useSearchParams();
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [step, setStep] = useState<Step>("form");
  const [key, setKey] = useState("");
  const [styleId, setStyleId] = useState("");
  const [region, setRegion] = useState("");
  const [planData, setPlanData] = useState<ArticlePlan | null>(null);
  const [provider, setProvider] = useState<"yandex" | "demo" | "">("");
  const [markdown, setMarkdown] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [savedId, setSavedId] = useState("");
  const [wpLink, setWpLink] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [wpOpen, setWpOpen] = useState(false);

  useEffect(() => {
    const t = params.get("tema");
    if (t) setKey(t);
  }, [params]);

  const styles = useMemo(
    () => (project ? loadStyles().filter((s) => s.projectId === project.id) : []),
    [project]
  );
  const style = styles.find((s) => s.id === styleId) || styles[0];

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
      style: { tone: style?.tone || "", audience: style?.audience || "", rules: style?.rules || "" },
      project: { name: project!.name, url: project!.url, industry: project!.industry },
    };
  }

  async function makePlan() {
    if (!key.trim()) {
      setErr("Введите ключевой запрос");
      return;
    }
    setBusy("plan");
    const data = await call<{ plan: ArticlePlan; provider: "yandex" | "demo" }>(
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
    const data = await call<{ markdown: string; provider: "yandex" | "demo" }>(
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
    const data = await call<{ seoTitle: string; seoDescription: string; provider: "yandex" | "demo" }>(
      "/api/article/polish",
      { ...requestBody(), markdown }
    );
    setBusy("");
    if (!data) return;
    setSeoTitle(data.seoTitle);
    setSeoDescription(data.seoDescription);
  }

  async function save(spentPromptAlready: boolean) {
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
        meta: {
          key,
          seoTitle,
          seoDescription,
          provider: provider || "manual",
          source: "writer",
        },
        spend: true,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      article?: { id: string };
      profile?: Partial<Session>;
    };
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
  const left = plan.limits.articles - session.articlesUsed;

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[320px_1fr]">
      <div className="ws-card h-fit space-y-3 p-5">
        <p className="text-[13px] text-[#6b7280]">
          Осталось {left} из {plan.limits.articles} статей · промпты {session.promptsUsed}/
          {plan.limits.prompts}
          {provider && (
            <> · {provider === "yandex" ? "генерация: YandexGPT" : "демо-режим (без ключа YandexGPT)"}</>
          )}
        </p>
        <label className="block text-[13px] font-medium">
          Ключевой запрос
          <input
            className="ws-input mt-1"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="например: остекление балкона цена"
            disabled={step !== "form"}
          />
        </label>
        <label className="block text-[13px] font-medium">
          Стиль
          <select className="ws-input mt-1" value={styleId} onChange={(e) => setStyleId(e.target.value)}>
            <option value="">По умолчанию</option>
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[13px] font-medium">
          Регион
          <input
            className="ws-input mt-1"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Москва"
          />
        </label>
        {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
        {step === "form" && (
          <button className="ws-btn ws-btn-primary w-full" onClick={() => void makePlan()} disabled={Boolean(busy)}>
            {busy === "plan" ? "Собираем план…" : "Собрать план"}
          </button>
        )}
        {step === "plan" && (
          <>
            <button className="ws-btn ws-btn-primary w-full" onClick={() => void makeDraft()} disabled={Boolean(busy)}>
              {busy === "draft" ? "Пишем черновик…" : "Черновик по плану"}
            </button>
            <button className="ws-btn ws-btn-outline w-full" onClick={() => setStep("form")} disabled={Boolean(busy)}>
              ← Изменить запрос
            </button>
          </>
        )}
        {step === "draft" && (
          <>
            <button
              className="ws-btn ws-btn-primary w-full"
              onClick={() => void save(false)}
              disabled={Boolean(busy) || Boolean(savedId)}
            >
              {busy === "save" ? "Сохраняем…" : savedId ? "Сохранено ✓" : "Сохранить в контент"}
            </button>
            <button className="ws-btn ws-btn-outline w-full" onClick={() => setWpOpen(true)}>
              Реквизиты WordPress
            </button>
            {savedId && (
              <button className="ws-btn ws-btn-outline w-full" onClick={() => void publishWp()} disabled={Boolean(busy)}>
                {busy === "wp" ? "Публикуем…" : wpLink ? "Опубликовано ✓" : "Опубликовать в WP (черновик)"}
              </button>
            )}
            <button className="ws-btn ws-btn-outline w-full" onClick={() => setStep("form")} disabled={Boolean(busy)}>
              ← Новая статья
            </button>
          </>
        )}
      </div>

      <div className="ws-card p-5">
        {step === "form" && (
          <div className="space-y-3 text-sm text-[#6b7280]">
            <p className="text-[15px] font-semibold text-[#111827]">Три шага до статьи</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Ключ и стиль — план статьи с разделами и FAQ (можно править).</li>
              <li>Черновик: ответ в первом абзаце, таблицы, FAQ — то, что цитируют нейросети.</li>
              <li>Правка текста, мета-описание, сохранение и публикация в WordPress.</li>
            </ol>
          </div>
        )}

        {step === "plan" && planData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">План статьи · можно править</h2>
              <span className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">
                интент: {planData.intent}
              </span>
            </div>
            <label className="block text-[13px] font-medium">
              H1
              <input
                className="ws-input mt-1"
                value={planData.title}
                onChange={(e) => setPlanData({ ...planData, title: e.target.value })}
              />
            </label>
            <label className="block text-[13px] font-medium">
              Короткий ответ (первый абзац)
              <textarea
                className="ws-input mt-1 min-h-[60px]"
                value={planData.intro}
                onChange={(e) => setPlanData({ ...planData, intro: e.target.value })}
              />
            </label>
            <div>
              <p className="text-[13px] font-medium">Разделы H2</p>
              <div className="mt-1 space-y-2">
                {planData.sections.map((s, i) => (
                  <div key={i} className="flex gap-2">
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
                      title="Удалить раздел"
                      onClick={() =>
                        setPlanData({ ...planData, sections: planData.sections.filter((_, j) => j !== i) })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="ws-btn ws-btn-outline text-[13px]"
                  onClick={() => setPlanData({ ...planData, sections: [...planData.sections, { h2: "Новый раздел", hint: "" }] })}
                >
                  + Раздел
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "draft" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold">Черновик · {words} слов</h2>
              <div className="flex gap-2">
                <button
                  className="ws-btn ws-btn-outline py-1.5 text-[13px]"
                  onClick={() => void polish()}
                  disabled={Boolean(busy)}
                >
                  {busy === "polish" ? "Готовим…" : "Мета-описание"}
                </button>
                <button
                  className="ws-btn ws-btn-outline py-1.5 text-[13px]"
                  onClick={() => navigator.clipboard.writeText(markdown)}
                >
                  Копировать
                </button>
              </div>
            </div>
            <textarea
              className="ws-input min-h-[420px] font-mono text-[13px] leading-relaxed"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
            {(seoTitle || seoDescription) && (
              <div className="space-y-2 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-3">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">Мета для страницы</p>
                <label className="block text-[13px]">
                  Title
                  <input className="ws-input mt-1" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                </label>
                <label className="block text-[13px]">
                  Description
                  <textarea
                    className="ws-input mt-1 min-h-[56px]"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                </label>
              </div>
            )}
            {wpLink && (
              <p className="text-[13px] text-[#0f766e]">
                Ушло в WordPress черновиком:{" "}
                <a className="underline" href={wpLink} target="_blank" rel="noreferrer">
                  открыть в WP
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      <WpDialog
        projectId={project.id}
        open={wpOpen}
        onClose={() => setWpOpen(false)}
        onSaved={() => setErr("")}
      />
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
