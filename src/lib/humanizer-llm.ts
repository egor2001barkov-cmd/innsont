import { deepseekComplete, deepseekConfigured } from "./llm/deepseek";
import { analyze } from "./humanizer";

/**
 * Humanizer как обязательный этап статьи.
 *
 * Локальный analyze() — это regex-детектор: он находит шаблоны и умеет грубо
 * вычищать фразы, но на длинном тексте авто-замена ломает грамматику
 * («Стоит отметить, что…» → «что…»). Поэтому финальный проход делает модель:
 * переписывает по списку паттернов и сохраняет факты и структуру, а мы
 * проверяем результат тем же детектором — до и после.
 */

export const HUMANIZER_RULES = `Пиши без шаблонов ИИ:
- не строй фразы «не X, а Y», «это не просто X — это Y», «дело не в X, а в Y»;
- без вводных «стоит отметить», «важно понимать», «давайте разберём», «в современном мире», «как известно»;
- символ «—» запрещён полностью: вместо «X — Y» ставь точку, запятую или двоеточие;
- не собирай триады ради ритма («быстро, удобно и надёжно»), если в них нет трёх разных мыслей;
- без «играет ключевую роль», «свидетельствует о», «подчёркивает важность», «открывает новые горизонты»;
- без рекламных эпитетов: «надёжный партнёр», «идеальное решение», «инновационный», «уникальный»;
- без финальных «в заключение», «подводя итог», «и вот почему» и клишерных концовок на одну строку;
- каждый абзац добавляет факт, цифру или вывод, а не пересказывает предыдущий.`;

const HUMANIZE_SYSTEM = `Ты редактор-стилист. Переписываешь текст, убирая шаблоны ИИ-письма, и возвращаешь ТОЛЬКО переписанный markdown, без пояснений и без «вот исправленный текст».
Сохрани все факты, цифры, названия, ссылки, таблицы и структуру H1/H2. Ничего не добавляй и не удаляй по смыслу. Текущий год — 2026.`;

export type HumanizeResult = {
  markdown: string;
  before: number;
  after: number;
  dashesBefore: number;
  dashesAfter: number;
  applied: boolean;
};

function countDashes(text: string) {
  return (text.match(/\s[—–]\s/g) || []).length;
}

/** Финальный проход humanizer. При любой проблеме возвращает исходный текст. */
export async function humanizeArticle(markdown: string): Promise<HumanizeResult> {
  const before = analyze(markdown, false).totalHits;
  const dashesBefore = countDashes(markdown);
  const unchanged: HumanizeResult = {
    markdown,
    before,
    after: before,
    dashesBefore,
    dashesAfter: dashesBefore,
    applied: false,
  };

  // Детектор ловит не всё (например, тире в нём нет), поэтому решение о проходе
  // принимаем и по тире: иначе «0 паттернов» пропускал текст с «—» через строку.
  if (!deepseekConfigured() || (before === 0 && dashesBefore === 0)) return unchanged;

  const words = markdown.split(/\s+/).filter(Boolean).length;
  if (words < 150) return unchanged;

  const res = await deepseekComplete(
    [
      { role: "system", text: HUMANIZE_SYSTEM },
      {
        role: "user",
        text: `${HUMANIZER_RULES}\n\nТекст:\n<<<\n${markdown}\n>>>\n\nПерепиши текст по правилам и верни только markdown.`,
      },
    ],
    { temperature: 0.25, maxTokens: Math.min(8000, Math.round(words * 2.2)) },
  );

  if (!res.ok) return unchanged;

  const text = res.text.trim();
  const resultWords = text.split(/\s+/).filter(Boolean).length;

  // Защита от обрезки и «забыл вернуть статью»: текст должен быть сопоставим
  // по объёму, начинаться с H1 и сохранять число разделов.
  const h2Before = (markdown.match(/^## /gm) || []).length;
  const h2After = (text.match(/^## /gm) || []).length;
  const tablesBefore = (markdown.match(/^\s*\|/gm) || []).length;
  const tablesAfter = (text.match(/^\s*\|/gm) || []).length;
  const linksBefore = (markdown.match(/\]\(/g) || []).length;
  const linksAfter = (text.match(/\]\(/g) || []).length;

  if (
    !text.startsWith("# ") ||
    resultWords < words * 0.6 ||
    h2After < Math.max(1, h2Before - 1) ||
    (tablesBefore > 0 && tablesAfter === 0) ||
    linksAfter < linksBefore * 0.7
  ) {
    return unchanged;
  }

  return {
    markdown: text,
    before,
    after: analyze(text, false).totalHits,
    dashesBefore,
    dashesAfter: countDashes(text),
    applied: true,
  };
}
