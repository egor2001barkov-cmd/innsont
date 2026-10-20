import type { ArticleContext } from "@/lib/article";

/** Разбор и зачистка полей запроса генерации. */
export function contextFromRequest(body: Record<string, unknown>): ArticleContext {
  const style = (body.style || {}) as Record<string, unknown>;
  const project = (body.project || {}) as Record<string, unknown>;
  return {
    key: String(body.key || "").trim().slice(0, 120),
    brand: String(project.name || body.brand || "проект").slice(0, 80),
    site: String(project.url || "").slice(0, 120),
    industry: String(project.industry || "").slice(0, 80),
    region: String(body.region || project.region || "").slice(0, 60),
    tone: String(style.tone || "").slice(0, 60),
    audience: String(style.audience || "").slice(0, 120),
    rules: String(style.rules || "").slice(0, 400),
  };
}
