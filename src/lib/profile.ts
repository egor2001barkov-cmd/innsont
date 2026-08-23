export const ROLES = [
  { id: "owner", label: "Владелец бизнеса", desc: "Отвечаю за прибыль и рост" },
  { id: "founder", label: "Основатель", desc: "Строю компанию с нуля или масштабирую" },
  { id: "marketer", label: "Маркетолог", desc: "Спрос, каналы, бренд" },
  { id: "seo", label: "SEO / GEO", desc: "Поиск, выдача, нейросети" },
  { id: "content", label: "Контент", desc: "Тексты, блог, соцсети" },
  { id: "agency", label: "Агентство", desc: "Веду клиентов" },
  { id: "other", label: "Другое", desc: "Не из списка" },
] as const;

export const TEAM_SIZES = [
  { id: "1", label: "Только я" },
  { id: "2-10", label: "2–10" },
  { id: "11-50", label: "11–50" },
  { id: "51-200", label: "51–200" },
  { id: "201+", label: "200+" },
] as const;

export const REVENUES = [
  { id: "", label: "Предпочитаю не указывать" },
  { id: "<10m", label: "До 10 млн ₽ в год" },
  { id: "10-50m", label: "10–50 млн ₽" },
  { id: "50-200m", label: "50–200 млн ₽" },
  { id: "200m+", label: "Больше 200 млн ₽" },
] as const;

export const GOALS = [
  { id: "sales", label: "Поднять продажи" },
  { id: "leads", label: "Больше заявок" },
  { id: "marketing", label: "Улучшить маркетинг" },
  { id: "content", label: "Автоматизировать контент" },
  { id: "visibility", label: "Видимость в ИИ-поиске" },
  { id: "seo", label: "Выше в Яндексе и Google" },
  { id: "compete", label: "Обогнать конкурентов" },
  { id: "time", label: "Сэкономить время команды" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];
export type TeamSizeId = (typeof TEAM_SIZES)[number]["id"];
export type RevenueId = (typeof REVENUES)[number]["id"];
export type GoalId = (typeof GOALS)[number]["id"];

export function hostOf(url: string) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function normalizeSiteUrl(raw: string) {
  let s = raw.trim().replace(/\s/g, "");
  if (!s) return "";
  s = s.replace(/^\/+/, "");
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!u.hostname.includes(".")) return "";
    return `${u.protocol}//${u.host}`;
  } catch {
    return "";
  }
}

export function defaultMapUrl(origin: string, path: string) {
  if (!origin) return "";
  return origin.replace(/\/$/, "") + path;
}

export function splitLines(text: string) {
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
