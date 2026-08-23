import { hostOf, type GoalId, type RevenueId, type RoleId, type TeamSizeId } from "@/lib/profile";
import { auditFromProject, geoFromProject, strategyFromProject } from "@/lib/project-metrics";

export type Project = {
  id: string;
  name: string;
  url: string;
  letter: string;
  color: string;
  onboarded: boolean;
  sitemapUrl: string;
  robotsUrl: string;
  mainPages: string;
  blogUrl: string;
  casesUrl: string;
  formsUrl: string;
  role: RoleId | "";
  teamSize: TeamSizeId | "";
  revenue: RevenueId;
  goals: GoalId[];
  industry: string;
  scannedAt: string;
};

const COLORS = ["#111827", "#0f766e", "#1d4ed8", "#7c3aed", "#b45309", "#be123c"];

export function emptyProject(partial: Partial<Project> & Pick<Project, "url">): Project {
  const url = partial.url;
  const host = hostOf(url);
  const name = partial.name || host.replace(/\.\w+$/, "") || "Проект";
  return {
    id: partial.id || "p-" + Date.now().toString(36),
    name,
    url,
    letter: (name[0] || "П").toUpperCase(),
    color: partial.color || COLORS[host.length % COLORS.length],
    onboarded: partial.onboarded ?? true,
    sitemapUrl: partial.sitemapUrl || "",
    robotsUrl: partial.robotsUrl || "",
    mainPages: partial.mainPages || "",
    blogUrl: partial.blogUrl || "",
    casesUrl: partial.casesUrl || "",
    formsUrl: partial.formsUrl || "",
    role: partial.role || "",
    teamSize: partial.teamSize || "",
    revenue: partial.revenue || "",
    goals: partial.goals || [],
    industry: partial.industry || "",
    scannedAt: partial.scannedAt || "",
  };
}

export type ContentItem = {
  id: string;
  projectId: string;
  title: string;
  type: "статья" | "FAQ" | "пост" | "письмо" | "бриф";
  status: "черновик" | "готово" | "опубликовано";
  words: number;
  updated: string;
  body: string;
};

export type WritingStyle = {
  id: string;
  projectId: string;
  name: string;
  tone: string;
  audience: string;
  rules: string;
};

const PROJECTS = "innsont.projects.v3";
const ACTIVE = "innsont.activeProject.v3";
const CONTENT = "innsont.content.v3";
const STYLES = "innsont.styles.v3";
const ACTIONS = "innsont.actions.v3";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PROJECTS);
  if (raw) {
    try {
      return (JSON.parse(raw) as Project[]).map((p) => emptyProject(p));
    } catch {
      /* fallthrough */
    }
  }
  return [];
}

export function saveProjects(items: Project[]) {
  localStorage.setItem(PROJECTS, JSON.stringify(items));
  window.dispatchEvent(new Event("innsont-workspace"));
}

export function loadActiveProjectId(projects: Project[]): string {
  if (typeof window === "undefined") return projects[0]?.id || "";
  const id = localStorage.getItem(ACTIVE);
  if (id && projects.some((p) => p.id === id)) return id;
  return projects[0]?.id || "";
}

export function hasOnboardedProject(projects: Project[]) {
  return projects.some((p) => p.onboarded && p.url);
}

export function saveActiveProjectId(id: string) {
  localStorage.setItem(ACTIVE, id);
  window.dispatchEvent(new Event("innsont-workspace"));
}

export { hostOf } from "@/lib/profile";

export function loadContent(): ContentItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONTENT);
  if (raw) {
    try {
      return JSON.parse(raw) as ContentItem[];
    } catch {
      /* fallthrough */
    }
  }
  return [];
}

export function saveContent(items: ContentItem[]) {
  localStorage.setItem(CONTENT, JSON.stringify(items));
  window.dispatchEvent(new Event("innsont-workspace"));
}

export function loadStyles(): WritingStyle[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STYLES);
  if (raw) {
    try {
      return JSON.parse(raw) as WritingStyle[];
    } catch {
      /* fallthrough */
    }
  }
  return [];
}

export function saveStyles(items: WritingStyle[]) {
  localStorage.setItem(STYLES, JSON.stringify(items));
  window.dispatchEvent(new Event("innsont-workspace"));
}

export type ActionItem = {
  id: string;
  projectId: string;
  cat: "Контент" | "Техника" | "Цитаты" | "Боты";
  title: string;
  impact: "Высокий" | "Средний" | "Низкий";
  status: "Открыто" | "В работе" | "Готово";
  detail: string;
};

export function loadActions(): ActionItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACTIONS);
  if (raw) {
    try {
      return JSON.parse(raw) as ActionItem[];
    } catch {
      /* fallthrough */
    }
  }
  return [];
}

export function saveActions(items: ActionItem[]) {
  localStorage.setItem(ACTIONS, JSON.stringify(items));
}

export type GeoSnapshot = {
  visibility: number;
  visibilityDelta: number;
  answers: number;
  answersDelta: number;
  pagesCited: number;
  ownPages: number;
  sentiment: { pos: number; neu: number; neg: number };
  platforms: { name: string; share: number; color: string }[];
  trend: number[];
  rivals: { name: string; score: number; you?: boolean }[];
  prompts: {
    q: string;
    you: number;
    leader: string;
    vol: "Высокая" | "Средняя" | "Низкая";
    platforms: Record<string, boolean>;
  }[];
};

export const GEO: Record<string, GeoSnapshot> = {
  default: {
    visibility: 41.6,
    visibilityDelta: 5.2,
    answers: 312,
    answersDelta: 28,
    pagesCited: 86,
    ownPages: 19,
    sentiment: { pos: 62, neu: 29, neg: 9 },
    platforms: [
      { name: "ChatGPT", share: 34, color: "#10a37f" },
      { name: "Google AI", share: 27, color: "#4285f4" },
      { name: "Gemini", share: 16, color: "#8b5cf6" },
      { name: "GigaChat", share: 14, color: "#2563eb" },
      { name: "YandexGPT", share: 9, color: "#f59e0b" },
    ],
    trend: [18, 19, 21, 24, 26, 28, 31, 33, 35, 37, 39, 42],
    rivals: [
      { name: "Лидер ниши", score: 68 },
      { name: "Второй", score: 54 },
      { name: "Вы", score: 42, you: true },
      { name: "Третий", score: 39 },
    ],
    prompts: [
      {
        q: "главный коммерческий запрос ниши",
        you: 8,
        leader: "Лидер ниши",
        vol: "Высокая",
        platforms: { ChatGPT: false, "Google AI": true, Gemini: false, GigaChat: true, YandexGPT: false },
      },
      {
        q: "сравнительный запрос",
        you: 22,
        leader: "Второй",
        vol: "Высокая",
        platforms: { ChatGPT: true, "Google AI": true, Gemini: false, GigaChat: true, YandexGPT: true },
      },
      {
        q: "информационный запрос с датой",
        you: 51,
        leader: "Вы",
        vol: "Средняя",
        platforms: { ChatGPT: true, "Google AI": true, Gemini: true, GigaChat: true, YandexGPT: false },
      },
    ],
  },
};

export function geoFor(project: Project): GeoSnapshot {
  return geoFromProject(project);
}

export type BotRow = {
  bot: string;
  hits: number;
  blocked: number;
  pages: number;
  last: string;
  status: "ок" | "блок" | "редко";
};

export type AuditIssue = {
  id: string;
  severity: "ошибка" | "предупреждение" | "совет";
  area: string;
  title: string;
  pages: number;
  fixable: boolean;
};

export type AuditSnapshot = {
  score: number;
  crawled: number;
  indexed: number;
  blocked: number;
  health: { label: string; value: number }[];
  issues: AuditIssue[];
  structure: { path: string; pages: number; score: number }[];
  bots: BotRow[];
  botTrend: { label: string; yandex: number; google: number; bing: number }[];
};

export const AUDIT: Record<string, AuditSnapshot> = {
  default: {
    score: 64,
    crawled: 1840,
    indexed: 1212,
    blocked: 214,
    health: [
      { label: "Краулинг", value: 58 },
      { label: "Индексация", value: 71 },
      { label: "On-page", value: 66 },
      { label: "Разметка", value: 44 },
      { label: "Скорость", value: 52 },
      { label: "Готовность к ИИ", value: 49 },
    ],
    issues: [
      { id: "i1", severity: "ошибка", area: "robots", title: "GPTBot закрыт на /catalog и /product", pages: 612, fixable: true },
      { id: "i2", severity: "ошибка", area: "schema", title: "Нет Product + Offer на карточках", pages: 408, fixable: true },
      { id: "i3", severity: "предупреждение", area: "index", title: "Дубли title в фильтрах каталога", pages: 96, fixable: false },
      { id: "i4", severity: "предупреждение", area: "cwv", title: "LCP > 3.2 с на мобильной карточке", pages: 54, fixable: false },
      { id: "i5", severity: "совет", area: "content", title: "Нет FAQPage на коммерческих посадочных", pages: 18, fixable: true },
      { id: "i6", severity: "совет", area: "llms", title: "Нет /llms.txt и чистого HTML для цитат", pages: 1, fixable: true },
    ],
    structure: [
      { path: "/", pages: 1, score: 82 },
      { path: "/catalog", pages: 640, score: 51 },
      { path: "/product", pages: 980, score: 48 },
      { path: "/blog", pages: 42, score: 77 },
      { path: "/delivery", pages: 6, score: 69 },
    ],
    bots: [
      { bot: "YandexBot", hits: 7100, blocked: 8, pages: 1188, last: "сегодня, 11:48", status: "ок" },
      { bot: "Googlebot", hits: 9400, blocked: 12, pages: 1210, last: "сегодня, 12:01", status: "ок" },
      { bot: "bingbot", hits: 1840, blocked: 40, pages: 228, last: "вчера", status: "ок" },
    ],
    botTrend: [
      { label: "Пн", yandex: 610, google: 820, bing: 180 },
      { label: "Вт", yandex: 640, google: 790, bing: 210 },
      { label: "Ср", yandex: 700, google: 860, bing: 240 },
      { label: "Чт", yandex: 680, google: 910, bing: 190 },
      { label: "Пт", yandex: 720, google: 940, bing: 280 },
      { label: "Сб", yandex: 410, google: 520, bing: 160 },
      { label: "Вс", yandex: 390, google: 480, bing: 140 },
    ],
  },
};

export function auditFor(project: Project): AuditSnapshot {
  return auditFromProject(project);
}

export function strategyFor(project: Project): StrategyCluster[] {
  return strategyFromProject(project);
}

export type StrategyCluster = {
  topic: string;
  volume: "Высокая" | "Средняя" | "Низкая";
  gap: number;
  intent: string;
  action: string;
};

export const STRATEGY: Record<string, StrategyCluster[]> = {
  default: [
    { topic: "главный коммерческий запрос", volume: "Высокая", gap: 72, intent: "покупка / заявка", action: "Посадочная + таблица + FAQ" },
    { topic: "сравнение с альтернативой", volume: "Средняя", gap: 48, intent: "сравнение", action: "Статья с критериями" },
    { topic: "как выбрать в этом году", volume: "Высокая", gap: 61, intent: "подбор", action: "Гайд с датой обновления" },
  ],
};
