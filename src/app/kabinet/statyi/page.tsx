"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { consumePrompt, saveSession } from "@/lib/session";
import { loadContent, loadStyles, saveContent } from "@/lib/workspace";

function buildArticle(topic: string, brand: string, tone: string) {
  const t = topic.trim() || "как выбрать продукт в 2026 году";
  const b = brand.trim() || "ваш бренд";
  return `# ${t[0].toUpperCase() + t.slice(1)}

*INSONT · голос: ${tone} · бренд: ${b}*

## Короткий ответ

Если выбирать быстро: свежие цифры, прозрачные условия, сравнение в таблице. ${b} закрывает запрос в первом экране.

## Что спрашивают в ИИ

Люди пишут целиком: «${t}». Статья должна ответить сразу, а не «подводить» к оферу.

## Критерии

| Критерий | Зачем модели | Как закрыть |
| --- | --- | --- |
| Цифра с датой | Берут свежий факт | Блок раз в месяц |
| Сравнение | Таблица цитируется целиком | 4–6 строк |
| Ограничения | Меньше галлюцинаций | Кому не подходит |
| Источник | Доля цитирования | Методика и первоисточник |

## FAQ

**Подойдёт новичку?** Да, если свериться с первоисточником.

**Почему ${b}?** Страница отвечает на промпт целиком: определение, таблица, дата.
`;
}

function Writer() {
  const params = useSearchParams();
  const { session, setSession, project, plan, ready } = useWorkspace();
  const [topic, setTopic] = useState("игровой ноутбук до 120 тысяч 2026");
  const [tone, setTone] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const t = params.get("tema");
    if (t) setTopic(t);
  }, [params]);

  const styles = useMemo(() => (project ? loadStyles().filter((s) => s.projectId === project.id) : []), [project]);

  if (!ready || !session || !project) return null;
  const left = plan.limits.articles - session.articlesUsed;
  const voice = tone || styles[0]?.name || "деловой";

  function generate() {
    if (!session) return;
    const used = consumePrompt(session, plan.limits.prompts);
    setSession(used.session);
    if (!used.ok) {
      setErr(`Лимит промптов тарифа: ${plan.limits.prompts}. Смените план или дождитесь месяца.`);
      return;
    }
    if (left <= 0) {
      setErr(`Лимит статей: ${plan.limits.articles}.`);
      return;
    }
    setErr("");
    setBusy(true);
    window.setTimeout(() => {
      const body = buildArticle(topic, project.name, voice);
      setOut(body);
      const next = { ...used.session, articlesUsed: used.session.articlesUsed + 1 };
      saveSession(next);
      setSession(next);
      const all = loadContent();
      saveContent([
        {
          id: "c-" + Date.now(),
          projectId: project.id,
          title: topic,
          type: "статья",
          status: "черновик",
          words: body.split(/\s+/).length,
          updated: new Date().toISOString().slice(0, 10),
          body,
        },
        ...all,
      ]);
      setBusy(false);
    }, 700);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[320px_1fr]">
      <form
        className="ws-card h-fit space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <p className="text-[13px] text-[#6b7280]">
          Осталось {left} из {plan.limits.articles} статей · промпты {session.promptsUsed}/{plan.limits.prompts}
        </p>
        <label className="block text-[13px] font-medium">
          Тема / промпт
          <input className="ws-input mt-1" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>
        <label className="block text-[13px] font-medium">
          Стиль
          <select className="ws-input mt-1" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="">По умолчанию</option>
            {styles.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        {err && <p className="text-[13px] text-[#b91c1c]">{err}</p>}
        <button className="ws-btn ws-btn-primary w-full" disabled={busy}>
          {busy ? "Собираем…" : "Собрать статью"}
        </button>
      </form>
      <div className="ws-card p-5">
        {out ? (
          <>
            <div className="mb-3 flex justify-end">
              <button className="ws-btn ws-btn-outline py-1.5 text-[13px]" onClick={() => navigator.clipboard.writeText(out)}>
                Копировать
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed">{out}</pre>
          </>
        ) : (
          <p className="text-sm text-[#6b7280]">
            Здесь появится статья: ответ в первом абзаце, таблица, FAQ. Так модели цитируют.
          </p>
        )}
      </div>
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
