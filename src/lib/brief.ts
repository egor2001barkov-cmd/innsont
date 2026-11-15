const UA = "InsontBrief/1.0 (+https://insont.ru)";

export type BriefPage = {
  url: string;
  ok: boolean;
  title: string;
  h1: string[];
  h2: string[];
  words: number;
  tables: number;
  questions: string[];
  schema: string[];
};

export type Brief = {
  key: string;
  pages: BriefPage[];
  medianWords: number;
  commonH2: string[];
  questions: string[];
  markdown: string;
};

function strip(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function heads(html: string, tag: "h1" | "h2" | "h3") {
  return [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))]
    .map((m) => strip(m[1]))
    .filter((t) => t.length > 2 && t.length < 160);
}

async function fetchPage(url: string): Promise<BriefPage> {
  const empty: BriefPage = { url, ok: false, title: "", h1: [], h2: [], words: 0, tables: 0, questions: [], schema: [] };
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return empty;
    const html = (await res.text()).slice(0, 500_000);
    const title = strip((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || "");
    const h2 = heads(html, "h2");
    const words = strip(html).split(/\s+/).filter(Boolean).length;
    const questions = [...heads(html, "h2"), ...heads(html, "h3")].filter((h) => h.includes("?"));
    const schema = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);

    return {
      url,
      ok: true,
      title,
      h1: heads(html, "h1"),
      h2,
      words,
      tables: (html.match(/<table/gi) || []).length,
      questions: [...new Set(questions)].slice(0, 10),
      schema: [...new Set(schema)].slice(0, 8),
    };
  } catch {
    return empty;
  }
}

const normalize = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim();

/** Бриф по страницам конкурентов: структура, объём, вопросы, разметка. */
export async function buildBrief(key: string, urls: string[]): Promise<Brief> {
  const list = [...new Set(urls.map((u) => u.trim()).filter(Boolean))].slice(0, 3);
  const pages = await Promise.all(list.map((u) => fetchPage(u.startsWith("http") ? u : `https://${u}`)));
  const ok = pages.filter((p) => p.ok);

  const wordsSorted = ok.map((p) => p.words).sort((a, b) => a - b);
  const medianWords = wordsSorted.length ? wordsSorted[Math.floor(wordsSorted.length / 2)] : 0;

  const counts = new Map<string, number>();
  for (const page of ok) {
    for (const h of page.h2) {
      const n = normalize(h);
      if (n.length < 6) continue;
      counts.set(n, (counts.get(n) || 0) + 1);
    }
  }
  const commonH2 = [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([h]) => h);

  const questions = [...new Set(ok.flatMap((p) => p.questions))].slice(0, 10);

  const lines: string[] = [`Бриф по запросу «${key}»`];
  if (ok.length) {
    lines.push(`\nКонкуренты в топе (${ok.length}):`);
    for (const p of ok) {
      lines.push(`- ${p.h1[0] || p.title || p.url} — ${p.words} слов, ${p.tables > 0 ? "есть таблицы" : "без таблиц"}${p.schema.length ? `, schema: ${p.schema.slice(0, 3).join(", ")}` : ""}`);
    }
    lines.push(`\nОриентир по объёму: ${medianWords} слов (медиана).`);
    if (commonH2.length) lines.push(`\nПовторяющиеся разделы (обязательно закрыть):\n${commonH2.map((h) => `- ${h}`).join("\n")}`);
    if (questions.length) lines.push(`\nВопросы, которые задают читатели:\n${questions.map((q) => `- ${q}`).join("\n")}`);
    const withTables = ok.filter((p) => p.tables > 0).length;
    if (withTables >= 2) lines.push("\nУ конкурентов есть таблицы: сделай минимум одну таблицу сравнения.");
  } else {
    lines.push("\nСтраницы конкурентов не загрузились — бриф пустой, пиши по общим правилам.");
  }

  return { key, pages, medianWords, commonH2, questions, markdown: lines.join("\n") };
}
