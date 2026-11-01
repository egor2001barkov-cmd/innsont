/**
 * Очеловечиватель: находит ИИ-паттерны (методика humanizer) и предлагает правки.
 * Паттерны — по скиллу humanizer (§1–§22, русская адаптация).
 */

export type Severity = "высокая" | "средняя" | "низкая";
export type Hit = { fragment: string; index: number };
export type PatternResult = { id: string; section: string; name: string; severity: Severity; hits: Hit[] };
export type Report = {
  score: number;
  totalPatterns: number;
  totalHits: number;
  patterns: PatternResult[];
  cleanedText: string;
  autoRemoved: number;
};

type Rule = {
  id: string;
  section: string;
  name: string;
  severity: Severity;
  source: string;
  flags: string;
  replacement?: string;
};

const RULES: Rule[] = [
  { id: "moral", section: "§2", name: "«Мораль:» / «Вывод один:»", severity: "высокая",
    source: "Мораль[:\\s]|Вывод один[:\\s]|Запомните одно[:\\s]", flags: "g", replacement: "" },
  { id: "davaite", section: "§4", name: "«Давайте разберём»", severity: "высокая",
    source: "[Дд]авайте\\s+(?:разбер|погруз|начн|перейд|посмотр)\\s*", flags: "g", replacement: "" },
  { id: "otmetit", section: "§4", name: "«стоит отметить» / «важно отметить»", severity: "высокая",
    source: "[Сс]тоит отметить,?\\s*|[Вв]ажно отметить,?\\s*|[Пп]одчеркн[её]м, что\\s*", flags: "g", replacement: "" },
  { id: "ne-sekret", section: "§4", name: "«не секрет» / «честно говоря»", severity: "средняя",
    source: "не секрет, что\\s*|честно говоря,?\\s*", flags: "gi", replacement: "" },
  { id: "modern-world", section: "§13", name: "«в современном мире»", severity: "высокая",
    source: "в современном мире\\s*", flags: "gi", replacement: "" },
  { id: "chat-tail", section: "§22", name: "Чат-хвосты", severity: "высокая",
    source: "Надеюсь, этот (?:материал|текст|гайд)[^.]*\\.", flags: "gi", replacement: "" },
  { id: "cliche-end", section: "§2", name: "«В заключение» / «Подводя итог»", severity: "средняя",
    source: "В заключение[,\\s]*|Подводя итог[,\\s]*|Резюмируя[,\\s]*", flags: "g", replacement: "" },
  { id: "simple-words", section: "§2", name: "«Простыми словами —»", severity: "средняя",
    source: "Простыми словами[—:]\\s*", flags: "gi", replacement: "" },
  { id: "why-closer", section: "§2", name: "«и вот почему:» / «Вот почему»", severity: "средняя",
    source: "и вот почему[:\\s]|Вот почему[,:]\\s*", flags: "gi", replacement: "" },
  { id: "predstavte", section: "§4", name: "«Представьте»", severity: "средняя",
    source: "^Представьте\\s+[^.]*\\.", flags: "gim", replacement: "" },
  { id: "key-role", section: "§12", name: "«играет ключевую роль»", severity: "средняя",
    source: "играет ключевую роль|играет ключевую|ключевую роль", flags: "gi" },
  { id: "svidetelstvuet", section: "§12", name: "«свидетельствует» / «демонстрирует»", severity: "низкая",
    source: "свидетельствует о|демонстрирует|подчёркивает", flags: "gi" },
  { id: "sales", section: "§16", name: "«надёжный партнёр» / «идеальное решение»", severity: "средняя",
    source: "надёжный партн[её]р|идеальное решение|уникальное решение", flags: "gi" },
  { id: "innov", section: "§12", name: "«инновационный» / «прорывной»", severity: "средняя",
    source: "инновационн|прорывн", flags: "gi" },
  { id: "proryv", section: "§13", name: "«настоящий прорыв» / «новый уровень»", severity: "средняя",
    source: "настоящий прорыв|новый уровень|кардинально меняет", flags: "gi" },
  { id: "not-x-y", section: "§1", name: "«не просто X — это Y»", severity: "высокая",
    source: "не\\s+(?:просто|только)[^.!?]{0,80}[—,]\\s*это", flags: "gi" },
  { id: "split-contrast", section: "§1", name: "«Это не X. Это Y.»", severity: "высокая",
    source: "(?:^|\\. )Это не [^.]{5,60}\\.\\s*Это [^.]{5,60}\\.", flags: "g" },
  { id: "triad", section: "§6", name: "Триады-перечисления", severity: "низкая",
    source: "(?:эффективность|качество|над[её]жность|гибкость)[,\\s]+(?:и|плюс)\\s+(?:эффективность|качество|над[её]жность|гибкость)", flags: "gi" },
];

function insideQuotes(text: string, idx: number): boolean {
  const before = text.slice(Math.max(0, idx - 60), idx);
  const after = text.slice(idx, idx + 100);
  return before.lastIndexOf("\u00AB") >= 0 && after.indexOf("\u00BB") > 0;
}

export function analyze(text: string, autoFix: boolean): Report {
  const patterns: PatternResult[] = [];
  let totalHits = 0;
  let cleaned = text;
  let autoRemoved = 0;

  for (const rule of RULES) {
    const rx = new RegExp(rule.source, rule.flags);
    const hits: Hit[] = [];
    const found = text.matchAll(rx);
    for (const m of found) {
      if (insideQuotes(text, m.index ?? 0)) continue;
      hits.push({ fragment: m[0].slice(0, 120), index: m.index ?? 0 });
      if (hits.length >= 50) break;
    }
    if (hits.length > 0) {
      patterns.push({ id: rule.id, section: rule.section, name: rule.name, severity: rule.severity, hits });
      totalHits += hits.length;
    }
    if (autoFix && rule.replacement !== undefined) {
      const rx2 = new RegExp(rule.source, rule.flags);
      cleaned = cleaned.replace(rx2, rule.replacement);
      autoRemoved++;
    }
  }

  if (autoFix) {
    cleaned = cleaned.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n");
  }

  let penalty = 0;
  for (const p of patterns) {
    const w = p.severity === "высокая" ? 4 : p.severity === "средняя" ? 2 : 1;
    penalty += p.hits.length * w;
  }
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const density = (penalty / words) * 1000;
  const score = Math.max(0, Math.min(100, Math.round(100 - Math.min(100, density * 2))));

  return { score, totalPatterns: patterns.length, totalHits, patterns, cleanedText: cleaned, autoRemoved };
}
