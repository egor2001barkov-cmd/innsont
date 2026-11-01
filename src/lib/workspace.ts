import { hostOf, type GoalId, type RevenueId, type RoleId, type TeamSizeId } from "@/lib/profile";

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
  // Writesonic-уровень параметров
  pov?: "я" | "мы" | "вы" | "они" | "нейтральный";
  goal?: "информировать" | "продавать" | "сравнивать" | "обучать";
  readingLevel?: "новичок" | "средний" | "эксперт";
  bannedWords?: string[];
  preferredPhrases?: string[];
  exampleText?: string; // пример «живого» текста для калибровки
};

/** Пресеты стилей — готовые шаблоны как у Writesonic (Brand Voice). */
export const STYLE_PRESETS: { id: string; name: string; desc: string; style: Omit<WritingStyle, "id" | "projectId"> }[] = [
  {
    id: "copywriter",
    name: "Копирайтер",
    desc: "Продающий текст с выгодами и цифрами",
    style: {
      name: "Копирайтер",
      tone: "энергичный, прямой, с цифрами",
      audience: "решающие покупатели, читающие по диагонали",
      rules: "Каждый абзац начинается с выгоды. Цифры вместо прилагательных. Никаких «уникальный» и «инновационный».",
      pov: "вы",
      goal: "продавать",
      readingLevel: "средний",
      bannedWords: ["уникальный", "инновационный", "непревзойдённый", "идеальный"],
      preferredPhrases: ["вот что вы получите", "проверено", "по нашим данным"],
    },
  },
  {
    id: "expert",
    name: "Эксперт-технарь",
    desc: "Глубокий технический разбор для специалистов",
    style: {
      name: "Эксперт-технарь",
      tone: "точный, техничный, без воды",
      audience: "профессионалы, знающие предмет",
      rules: "Точные термины, конкретные спецификации, таблицы характеристик. Аббревиатуры без расшифровки.",
      pov: "нейтральный",
      goal: "обучать",
      readingLevel: "эксперт",
      bannedWords: ["просто", "легко", "всего лишь"],
      preferredPhrases: ["по спецификации", "в тестах показал", "на практике"],
    },
  },
  {
    id: "journalist",
    name: "Журналист",
    desc: "Фактчекинг, цитаты, нейтральный тон",
    style: {
      name: "Журналист",
      tone: "нейтральный, фактологичный",
      audience: "широкая аудитория, читающая новости",
      rules: "Кто-что-когда-где в первом абзаце. Цитаты с атрибуцией. Нет мнений без источника.",
      pov: "нейтральный",
      goal: "информировать",
      readingLevel: "средний",
      bannedWords: ["потрясающий", "шокирующий", "невероятный"],
      preferredPhrases: ["по данным", "сообщается", "по мнению экспертов"],
    },
  },
  {
    id: "blogger",
    name: "Блогер-практик",
    desc: "Живой личный опыт, «я попробовал»",
    style: {
      name: "Блогер-практик",
      tone: "разговорный, с личным опытом",
      audience: "люди, ищущие практический опыт",
      rules: "Личные истории, «я попробовал и вот что вышло». Простой язык. Можно юмор. Без пафоса.",
      pov: "я",
      goal: "обучать",
      readingLevel: "новичок",
      bannedWords: ["оптимальный", "данный", "осуществлять"],
      preferredPhrases: ["я попробовал", "мне понравилось", "не советую"],
    },
  },
  {
    id: "analyst",
    name: "Аналитик",
    desc: "Данные, таблицы, сравнения, методология",
    style: {
      name: "Аналитик",
      tone: "структурированный, аналитический",
      audience: "менеджеры, принимающие решения на данных",
      rules: "Каждый вывод подтверждён цифрой. Таблицы для сравнения. Методология указана. Оценки с диапазонами.",
      pov: "мы",
      goal: "сравнивать",
      readingLevel: "эксперт",
      bannedWords: ["впечатляющий", "замечательный"],
      preferredPhrases: ["по нашим замерам", "выборка", "статистически значимо"],
    },
  },
  {
    id: "storyteller",
    name: "Рассказчик",
    desc: "История, интрига, эмоции — для соцсетей",
    style: {
      name: "Рассказчик",
      tone: "тёплый, вовлекающий, с интригой",
      audience: "читатели соцсетей и рассылок",
      rules: "Начало с истории или вопроса. Короткие предложения. Эмоции через детали, не через восклицания.",
      pov: "вы",
      goal: "информировать",
      readingLevel: "новичок",
      bannedWords: ["важно отметить", "следует подчеркнуть"],
      preferredPhrases: ["представьте", "оказалось", "а дальше"],
    },
  },
];

const PROJECTS = "insont.projects.v3";
const ACTIVE = "insont.activeProject.v3";
const CONTENT = "insont.content.v3";
const STYLES = "insont.styles.v3";
const ACTIONS = "insont.actions.v3";

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
  window.dispatchEvent(new Event("insont-workspace"));
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
  window.dispatchEvent(new Event("insont-workspace"));
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
  window.dispatchEvent(new Event("insont-workspace"));
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
  window.dispatchEvent(new Event("insont-workspace"));
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

