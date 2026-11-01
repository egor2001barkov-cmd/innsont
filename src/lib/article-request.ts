import type { ArticleContext } from "@/lib/article";

/** Разбор и зачистка полей запроса генерации (Writesonic-уровень параметров). */
export function contextFromRequest(body: Record<string, unknown>): ArticleContext {
  const style = (body.style || {}) as Record<string, unknown>;
  const project = (body.project || {}) as Record<string, unknown>;

  function str(v: unknown, max: number): string {
    return String(v || "").trim().slice(0, max);
  }
  function bool(v: unknown, dflt: boolean): boolean {
    return typeof v === "boolean" ? v : dflt;
  }
  function arr(v: unknown): string[] {
    return Array.isArray(v) ? v.map(String).filter(Boolean).slice(0, 20) : [];
  }

  const length = String(body.length || "");
  const pov = String(body.pov || body.style && style.pov || "");
  const goal = String(body.goal || body.style && style.goal || "");
  const readingLevel = String(body.readingLevel || body.style && style.readingLevel || "");

  return {
    key: str(body.key, 120),
    brand: str(project.name || body.brand, 80),
    site: str(project.url, 200),
    industry: str(project.industry, 80),
    region: str(body.region, 60),
    tone: str(style.tone, 60),
    audience: str(style.audience || body.audience, 200),
    rules: str(style.rules, 600),
    // Writesonic-уровень
    length: length === "короткая" || length === "средняя" || length === "длинная" ? length : undefined,
    pov: ["я", "мы", "вы", "они", "нейтральный"].includes(pov) ? pov as ArticleContext["pov"] : undefined,
    goal: ["информировать", "продавать", "сравнивать", "обучать"].includes(goal) ? goal as ArticleContext["goal"] : undefined,
    readingLevel: ["новичок", "средний", "эксперт"].includes(readingLevel) ? readingLevel as ArticleContext["readingLevel"] : undefined,
    includeFaq: bool(body.includeFaq, true),
    includeTables: bool(body.includeTables, true),
    includeStats: bool(body.includeStats, false),
    includeCta: bool(body.includeCta, false),
    keywords: arr(body.keywords),
    instructions: str(body.instructions, 600),
    referenceUrl: str(body.referenceUrl, 250),
    bannedWords: arr(body.bannedWords),
    preferredPhrases: arr(body.preferredPhrases),
  };
}
