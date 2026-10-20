import { activeProvider, llmComplete } from "@/lib/llm";

export type Provider = "deepseek" | "yandex" | "demo";

export { activeProvider };

export type ArticlePlan = {
  title: string; // H1 с ключом
  intent: "коммерческий" | "информационный" | "сравнение" | "навигационный";
  intro: string; // короткий ответ (1–2 предложения) — то, что цитируют модели
  sections: { h2: string; hint: string }[];
  faq: { q: string; a: string }[];
};

export type ArticleContext = {
  key: string; // ключевой запрос
  brand: string;
  site?: string;
  industry?: string;
  region?: string;
  tone?: string;
  audience?: string;
  rules?: string;
};

function cap(s: string | undefined, n: number) {
  return String(s || "").slice(0, n);
}

// --- Парсинг JSON из ответа модели --------------------------------------------

function extractJson(text: string): unknown | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function sanitizePlan(raw: unknown, key: string): ArticlePlan {
  const obj = (raw || {}) as Record<string, unknown>;
  const sections = Array.isArray(obj.sections)
    ? (obj.sections as Record<string, unknown>[])
        .filter((s) => typeof s.h2 === "string" && String(s.h2).trim())
        .slice(0, 7)
        .map((s) => ({ h2: String(s.h2).slice(0, 120), hint: String(s.hint || "").slice(0, 300) }))
    : [];
  const faq = Array.isArray(obj.faq)
    ? (obj.faq as Record<string, unknown>[])
        .filter((f) => typeof f.q === "string" && String(f.q).trim())
        .slice(0, 5)
        .map((f) => ({ q: String(f.q).slice(0, 160), a: String(f.a || "").slice(0, 300) }))
    : [];
  const intentRaw = String(obj.intent || "");
  const intent: ArticlePlan["intent"] =
    intentRaw === "коммерческий" || intentRaw === "сравнение" || intentRaw === "навигационный"
      ? intentRaw
      : "информационный";
  return {
    title: cap(typeof obj.title === "string" ? obj.title : "", 140) || key,
    intent,
    intro: cap(typeof obj.intro === "string" ? obj.intro : "", 400),
    sections: sections.length ? sections : demoPlan(key).sections,
    faq,
  };
}

// --- Demo-режим (без ключей YandexGPT) ----------------------------------------

export function demoPlan(key: string): ArticlePlan {
  return {
    title: key[0].toUpperCase() + key.slice(1),
    intent: "информационный",
    intro: `Короткий ответ по запросу «${key}»: свежие цифры, условия и ограничения — в первом экране, без «подводок».`,
    sections: [
      { h2: "Короткий ответ", hint: "Прямой ответ на запрос в первых двух предложениях" },
      { h2: "Как выбрать", hint: "Критерии выбора: 4–6 пунктов, факты и цифры" },
      { h2: "Сравнение вариантов", hint: "Таблица на 4–6 строк — модели цитируют таблицы целиком" },
      { h2: "Частые ошибки", hint: "Что делают неверно и к чему это приводит" },
      { h2: "FAQ", hint: "3–5 вопросов формулировками из поиска" },
    ],
    faq: [
      { q: `Сколько стоит ${key}?`, a: "Зависит от объёма и сроков; назовите вилку и что в неё входит." },
      { q: "Как быстро будет результат?", a: "Первые изменения — 2–4 недели, устойчивый рост — 2–4 месяца." },
    ],
  };
}

function demoDraft(plan: ArticlePlan, ctx: ArticleContext): string {
  const rows = plan.sections
    .slice(0, 4)
    .map((s) => `| ${s.h2} | что важно | как закрыть |`)
    .join("\n");
  return `# ${plan.title}

${plan.intro}

## Короткий ответ

${ctx.brand} закрывает запрос «${ctx.key}» в первом экране: определение, цифры, ограничения.

## Что важно

| Раздел | Что важно | Как закрыто |
| --- | --- | --- |
${rows}

## FAQ

${plan.faq.map((f) => `**${f.q}** ${f.a}`).join("\n\n")}
`;
}

// --- Промпты ------------------------------------------------------------------

function styleLine(ctx: ArticleContext) {
  const parts = [`тон: ${cap(ctx.tone, 60) || "деловой, живой, без канцелярита"}`];
  if (ctx.audience) parts.push(`аудитория: ${cap(ctx.audience, 120)}`);
  if (ctx.rules) parts.push(`правила: ${cap(ctx.rules, 400)}`);
  return parts.join("; ");
}

function brandLine(ctx: ArticleContext) {
  return `Бренд: ${cap(ctx.brand, 80)}${ctx.site ? ` (сайт ${cap(ctx.site, 120)})` : ""}${
    ctx.industry ? `, сфера: ${cap(ctx.industry, 80)}` : ""
  }${ctx.region ? `, регион: ${cap(ctx.region, 60)}` : ""}`;
}

const PLAN_SYSTEM =
  "Ты старший SEO-редактор российского интернет-издания. Отвечаешь строго валидным JSON без markdown-обёртки.";

export async function generatePlan(
  ctx: ArticleContext
): Promise<{ plan: ArticlePlan; provider: Provider }> {
  if (activeProvider() === "demo") return { plan: demoPlan(ctx.key), provider: "demo" };
  const user = `Составь план SEO-статьи для Рунета по запросу: «${cap(ctx.key, 120)}».
${brandLine(ctx)}. ${styleLine(ctx)}.

Требования к плану:
- title: заголовок H1 с ключом, до 70 символов, без точек в конце;
- intent: коммерческий | информационный | сравнение | навигационный;
- intro: прямой ответ на запрос в 1–2 предложениях (его цитируют нейросети);
- sections: 4–6 разделов H2, каждый — с подсказкой (hint) что в нём должно быть: цифры, таблицы, ограничения. Первый раздел отвечает на запрос, дальше — выбор/сравнение/ошибки;
- faq: 3–5 вопросов формулировками, как их пишут в поиске, с короткими ответами.

Ответ — только JSON вида:
{"title":"…","intent":"…","intro":"…","sections":[{"h2":"…","hint":"…"}],"faq":[{"q":"…","a":"…"}]}`;

  const res = await llmComplete(
    [
      { role: "system", text: PLAN_SYSTEM },
      { role: "user", text: user },
    ],
    { temperature: 0.3, maxTokens: 1200 }
  );
  if (!res.ok) return { plan: demoPlan(ctx.key), provider: "demo" };
  return { plan: sanitizePlan(extractJson(res.text), ctx.key), provider: activeProvider() };
}

const DRAFT_SYSTEM =
  "Ты русский копирайтер уровня главного редактора. Пишешь фактурно: цифры, конкретика, ни воды. Выход — только markdown-текст раздела, без пояснений.";

export async function generateDraft(
  plan: ArticlePlan,
  ctx: ArticleContext
): Promise<{ markdown: string; provider: Provider }> {
  if (activeProvider() === "demo") return { markdown: demoDraft(plan, ctx), provider: "demo" };

  const parts: string[] = [];
  // вступление
  const lead = await llmComplete(
    [
      { role: "system", text: DRAFT_SYSTEM },
      {
        role: "user",
        text: `Статья для Рунета по запросу «${cap(ctx.key, 120)}». ${brandLine(ctx)}. ${styleLine(ctx)}.
Напиши вводный абзац (2–3 предложения, 40–60 слов) — прямой ответ на запрос: что это, для кого, ключевые цифры. Без воды и без «в современном мире». Первый абзац должен быть пригоден для цитаты нейросетью.`,
      },
    ],
    { temperature: 0.5, maxTokens: 400 }
  );
  if (!lead.ok) return { markdown: demoDraft(plan, ctx), provider: "demo" };
  parts.push(`# ${plan.title}\n\n${lead.text.trim()}\n`);

  // секции (по одной — держим контекст и лимит токенов)
  for (const s of plan.sections) {
    const sec = await llmComplete(
      [
        { role: "system", text: DRAFT_SYSTEM },
        {
          role: "user",
          text: `Раздел статьи «${plan.title}» по запросу «${cap(ctx.key, 120)}». ${brandLine(ctx)}. ${styleLine(ctx)}.
Напиши раздел с заголовком «## ${s.h2}». Что должно войти: ${s.hint || "конкретика по теме"}.
Правила: 150–250 слов; если уместно — таблица markdown (модели цитируют таблицы); ключевую фразу используй 1–2 раза, без переспама; пиши как для человека, который выбирает и сравнивает. Выход — только текст раздела, начиная с «## ».`,
        },
      ],
      { temperature: 0.55, maxTokens: 900 }
    );
    if (sec.ok) parts.push(sec.text.trim() + "\n");
  }

  // FAQ
  if (plan.faq.length) {
    const faq = await llmComplete(
      [
        { role: "system", text: DRAFT_SYSTEM },
        {
          role: "user",
          text: `Раздел FAQ статьи по запросу «${cap(ctx.key, 120)}». ${brandLine(ctx)}.
Вопросы:\n${plan.faq.map((f, i) => `${i + 1}. ${f.q}`).join("\n")}
Ответы: по 2–4 предложения, прямо отвечают на вопрос первым предложением. Формат: «**Вопрос** — ответ» через пустую строку. Выход — только текст раздела, начиная с «## FAQ».`,
        },
      ],
      { temperature: 0.4, maxTokens: 800 }
    );
    if (faq.ok) parts.push(faq.text.trim() + "\n");
  }

  return { markdown: parts.join("\n"), provider: activeProvider() };
}

export async function polishArticle(
  markdown: string,
  ctx: ArticleContext
): Promise<{
  seoTitle: string;
  seoDescription: string;
  provider: Provider;
}> {
  const fallbackTitle = cap(ctx.key, 70);
  if (activeProvider() === "demo") {
    return {
      seoTitle: fallbackTitle,
      seoDescription: cap(`Как выбрать: ${ctx.key}. Короткий ответ, таблица сравнения и FAQ. ${cap(ctx.brand, 40)}.`, 160),
      provider: "demo",
    };
  }
  const res = await llmComplete(
    [
      { role: "system", text: PLAN_SYSTEM },
      {
        role: "user",
        text: `Для SEO-статьи по запросу «${cap(ctx.key, 120)}» (${brandLine(ctx)}) составь:
- seoTitle: title страницы, до 65 символов, с ключом в начале, без кавычек-ёлочек;
- seoDescription: description, 140–160 символов, конкретика и выгода, без общих слов.

Первые 1500 символов статьи:
"""
${markdown.slice(0, 1500)}
"""

Ответ — только JSON вида {"seoTitle":"…","seoDescription":"…"}`,
      },
    ],
    { temperature: 0.3, maxTokens: 400 }
  );
  if (!res.ok) {
    return { seoTitle: fallbackTitle, seoDescription: "", provider: "demo" };
  }
  const obj = (extractJson(res.text) || {}) as Record<string, unknown>;
  return {
    seoTitle: cap(typeof obj.seoTitle === "string" ? obj.seoTitle : "", 90) || fallbackTitle,
    seoDescription: cap(typeof obj.seoDescription === "string" ? obj.seoDescription : "", 200),
    provider: activeProvider(),
  };
}
