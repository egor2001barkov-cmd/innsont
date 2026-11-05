/**
 * Проверка каннибализации: сравнивает заголовки страниц/статей проекта,
 * находит пары с пересекающимся интентом (общие значимые слова в title/H1).
 */

export type PageEntry = { url: string; title: string; h1?: string; source: string };

export type Conflict = {
  keywords: string[];
  pages: PageEntry[];
  severity: "высокая" | "средняя" | "низкая";
  recommendation: string;
};

export type CannibalizationReport = {
  totalPages: number;
  totalConflicts: number;
  conflicts: Conflict[];
};

const STOP_WORDS = new Set([
  "и", "в", "на", "с", "по", "для", "к", "от", "под", "или", "как", "что", "это",
  "не", "а", "но", "же", "бы", "за", "из", "у", "о", "об", "до", "при", "про",
  "the", "a", "an", "of", "for", "in", "on", "to", "and", "is", "are",
  "инсонт", "innsont", "|", "—", "-", "ru", "com", "www",
]);

function extractKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[|—–\-·•]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function overlapWords(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((x) => b.has(x));
}

export function findCannibalization(pages: PageEntry[]): CannibalizationReport {
  const keywordSets = pages.map((p) => new Set(extractKeywords(`${p.title} ${p.h1 || ""}`)));
  const conflicts: Conflict[] = [];
  const used = new Set<number>(); // страницы уже в конфликте — не дублируем

  for (let i = 0; i < pages.length; i++) {
    if (used.has(i)) continue;
    const group: number[] = [i];
    let bestOverlap: string[] = [];

    for (let j = i + 1; j < pages.length; j++) {
      if (used.has(j)) continue;
      const sim = jaccard(keywordSets[i], keywordSets[j]);
      const shared = overlapWords(keywordSets[i], keywordSets[j]);

      // порог: ≥50% совпадения ИЛИ ≥3 общих слова ИЛИ ≥2 длинных общих слов (≥6 символов)
      const longShared = shared.filter((w) => w.length >= 6);
      const isConflict = sim >= 0.5 || shared.length >= 3 || longShared.length >= 2;

      if (isConflict) {
        group.push(j);
        used.add(j);
        bestOverlap = [...new Set([...bestOverlap, ...shared])];
      }
    }

    if (group.length >= 2) {
      used.add(i);
      const groupPages = group.map((idx) => pages[idx]);
      const avgTitleLen =
        groupPages.reduce((s, p) => s + extractKeywords(p.title).length, 0) / groupPages.length;
      const severity: Conflict["severity"] =
        bestOverlap.length >= 4 ? "высокая" : bestOverlap.length >= 2 ? "средняя" : "низкая";

      const recommendation =
        groupPages.length === 2
          ? `Оставить одну страницу (сильнейшую), вторую — 301 или переработать под другой интент`
          : `${groupPages.length} страницы делят один интент — оставить одну, остальные склеить/развести`;

      conflicts.push({
        keywords: bestOverlap.slice(0, 6),
        pages: groupPages,
        severity,
        recommendation,
      });
      void avgTitleLen;
    }
  }

  conflicts.sort((a, b) => {
    const rank = { высокая: 0, средняя: 1, низкая: 2 };
    return rank[a.severity] - rank[b.severity] || b.pages.length - a.pages.length;
  });

  return { totalPages: pages.length, totalConflicts: conflicts.length, conflicts };
}
