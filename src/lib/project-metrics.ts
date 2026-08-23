import { hostOf, splitLines, type GoalId } from "@/lib/profile";
import type { AuditSnapshot, GeoSnapshot, Project, StrategyCluster } from "@/lib/workspace";

export function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function n(h: number, i: number, min: number, max: number) {
  const x = (h + i * 9973) % 10007;
  return min + (x % (max - min + 1));
}

export type Period = "day" | "week" | "month" | "quarter" | "year";

export const PERIODS: { id: Period; label: string }[] = [
  { id: "day", label: "День" },
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
  { id: "quarter", label: "Квартал" },
  { id: "year", label: "Год" },
];

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

export type PeriodStats = {
  period: Period;
  labels: string[];
  visibility: number[];
  answers: number[];
  prompts: number[];
  visibilityNow: number;
  visibilityDelta: number;
  answersNow: number;
  answersDelta: number;
  promptsNow: number;
  promptsDelta: number;
};

export function statsForPeriod(project: Project, period: Period): PeriodStats {
  const host = hostOf(project.url) || project.id;
  const h = hashStr(host + ":" + period);
  const baseVis = Math.min(88, n(hashStr(host), 1, 16, 72) + (project.sitemapUrl ? 4 : 0) + (project.blogUrl ? 3 : 0));
  const count =
    period === "day" ? 24 : period === "week" ? 7 : period === "month" ? 30 : period === "quarter" ? 13 : 12;
  const now = new Date();
  const labels =
    period === "day"
      ? Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`)
      : period === "week"
        ? WEEKDAYS.map((d, i) => {
            const dt = new Date(now);
            dt.setDate(now.getDate() - 6 + i);
            return `${d} ${dt.getDate()}`;
          })
        : period === "month"
          ? Array.from({ length: 30 }, (_, i) => {
              const dt = new Date(now);
              dt.setDate(now.getDate() - 29 + i);
              return `${dt.getDate()} ${MONTHS_SHORT[dt.getMonth()]}`;
            })
          : period === "quarter"
            ? Array.from({ length: 13 }, (_, i) => {
                const dt = new Date(now);
                dt.setDate(now.getDate() - (12 - i) * 7);
                return `${dt.getDate()} ${MONTHS_SHORT[dt.getMonth()]}`;
              })
            : MONTHS_SHORT.map((_, i) => {
                const dt = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                return MONTHS_SHORT[dt.getMonth()];
              });
  const scale =
    period === "day" ? 0.04 : period === "week" ? 0.22 : period === "month" ? 1 : period === "quarter" ? 3.1 : 12;
  const monthAnswers = n(hashStr(host), 3, 40, 520);
  const visibility = Array.from({ length: count }, (_, i) => {
    const wave = Math.sin((i / count) * Math.PI * 2 + (h % 7)) * (period === "day" ? 3 : 6);
    return Math.min(92, Math.max(8, Math.round(baseVis + wave + n(h, i, 0, 5) - 3)));
  });
  const answers = Array.from({ length: count }, (_, i) => {
    const unit = Math.max(1, Math.round((monthAnswers * scale) / count));
    return Math.max(1, unit + n(h, 80 + i, 0, Math.max(2, unit)) - Math.round(unit * 0.3));
  });
  const prompts = Array.from({ length: count }, (_, i) => n(h, 200 + i, 1, period === "day" ? 18 : period === "year" ? 80 : 36));
  const visibilityNow = visibility[visibility.length - 1];
  const visibilityPrev = visibility[0] || visibilityNow;
  const answersNow = answers.reduce((a, b) => a + b, 0);
  const answersDelta = Math.max(1, Math.round(answers.slice(-Math.max(1, Math.floor(count / 4))).reduce((a, b) => a + b, 0) * 0.35));
  const promptsNow = prompts.reduce((a, b) => a + b, 0);
  return {
    period,
    labels,
    visibility,
    answers,
    prompts,
    visibilityNow,
    visibilityDelta: visibilityNow - visibilityPrev,
    answersNow,
    answersDelta,
    promptsNow,
    promptsDelta: Math.max(1, Math.round(promptsNow * 0.12)),
  };
}

const PLATFORMS = [
  { name: "Яндекс", color: "#fc3f1d" },
  { name: "Google", color: "#4285f4" },
  { name: "Bing", color: "#00809d" },
];

export function geoFromProject(project: Project): GeoSnapshot {
  const host = hostOf(project.url) || project.id;
  const h = hashStr(host);
  const visibility = n(h, 1, 16, 72) + (project.sitemapUrl ? 4 : 0) + (project.blogUrl ? 3 : 0);
  const vis = Math.min(88, visibility);
  const trend = Array.from({ length: 12 }, (_, i) => Math.min(90, Math.max(8, vis - 18 + n(h, 20 + i, 0, 14) - 4)));
  const you = vis;
  const r1 = Math.min(92, you + n(h, 4, 8, 22));
  const r2 = Math.max(10, you - n(h, 5, 4, 16));
  const r3 = Math.max(8, you - n(h, 6, 14, 28));
  const shares = PLATFORMS.map((p, i) => n(h, 30 + i, 8, 34));
  const sum = shares.reduce((a, b) => a + b, 0);
  return {
    visibility: vis,
    visibilityDelta: n(h, 2, 1, 8),
    answers: n(h, 3, 40, 520),
    answersDelta: n(h, 7, 4, 40),
    pagesCited: n(h, 8, 12, 140),
    ownPages: n(h, 9, 3, 36),
    sentiment: {
      pos: n(h, 10, 48, 78),
      neu: n(h, 11, 14, 32),
      neg: n(h, 12, 5, 16),
    },
    platforms: PLATFORMS.map((p, i) => ({
      ...p,
      share: Math.max(4, Math.round((shares[i] / sum) * 100)),
    })),
    trend,
    rivals: [
      { name: "Лидер ниши", score: r1 },
      { name: "Конкурент A", score: Math.max(you, r2) === you ? r2 + 6 : r2 },
      { name: project.name || host, score: you, you: true },
      { name: "Конкурент B", score: r3 },
    ],
    prompts: [
      {
        q: `бренд ${host.replace(/\.\w+$/, "")} отзывы`,
        you: n(h, 40, 0, 38),
        leader: "Лидер ниши",
        vol: "Высокая",
        platforms: { Яндекс: true, Google: n(h, 41, 0, 1) === 1, Bing: n(h, 42, 0, 1) === 1 },
      },
      {
        q: `сравнить ${host.replace(/\.\w+$/, "")} с альтернативой`,
        you: n(h, 43, 5, 55),
        leader: you > 40 ? project.name : "Конкурент A",
        vol: "Средняя",
        platforms: { Яндекс: n(h, 44, 0, 1) === 1, Google: true, Bing: true },
      },
      {
        q: `как выбрать в 2026`,
        you: n(h, 45, 0, 48),
        leader: "Лидер ниши",
        vol: "Высокая",
        platforms: { Яндекс: true, Google: true, Bing: n(h, 46, 0, 1) === 1 },
      },
    ],
  };
}

export function auditFromProject(project: Project): AuditSnapshot {
  const host = hostOf(project.url) || project.id;
  const h = hashStr(host + ":audit");
  const bonus =
    (project.sitemapUrl ? 8 : 0) +
    (project.robotsUrl ? 6 : 0) +
    (project.blogUrl ? 5 : 0) +
    (project.casesUrl ? 4 : 0) +
    (project.formsUrl ? 3 : 0) +
    (splitLines(project.mainPages).length ? 5 : 0);
  const score = Math.min(92, n(h, 1, 38, 68) + bonus);
  const pages = splitLines(project.mainPages);
  const structure = [
    { path: "/", pages: 1, score: Math.min(95, score + 8) },
    ...pages.slice(0, 5).map((p, i) => ({
      path: pathOf(p),
      pages: n(h, 50 + i, 1, 24),
      score: n(h, 60 + i, 40, 88),
    })),
    ...(project.blogUrl ? [{ path: pathOf(project.blogUrl), pages: n(h, 70, 4, 80), score: n(h, 71, 50, 86) }] : []),
    ...(project.casesUrl ? [{ path: pathOf(project.casesUrl), pages: n(h, 72, 2, 24), score: n(h, 73, 48, 84) }] : []),
    ...(project.formsUrl ? [{ path: pathOf(project.formsUrl), pages: 1, score: n(h, 74, 42, 80) }] : []),
  ];

  const issues: AuditSnapshot["issues"] = [];
  if (!project.robotsUrl) {
    issues.push({
      id: "no-robots",
      severity: "ошибка",
      area: "robots",
      title: "Не указан robots.txt — не видно, открыт ли сайт ботам",
      pages: 1,
      fixable: true,
    });
  }
  if (!project.sitemapUrl) {
    issues.push({
      id: "no-sitemap",
      severity: "ошибка",
      area: "index",
      title: "Нет ссылки на карту сайта",
      pages: 1,
      fixable: true,
    });
  }
  if (!project.blogUrl) {
    issues.push({
      id: "no-blog",
      severity: "предупреждение",
      area: "content",
      title: "Блог не указан — мало цитат для ИИ",
      pages: 0,
      fixable: true,
    });
  }
  if (!project.casesUrl) {
    issues.push({
      id: "no-cases",
      severity: "совет",
      area: "content",
      title: "Нет страницы кейсов — слабый коммерческий фактор",
      pages: 0,
      fixable: true,
    });
  }
  if (!project.formsUrl) {
    issues.push({
      id: "no-forms",
      severity: "совет",
      area: "conv",
      title: "Форма заявки не указана — не проверим конверсионный URL",
      pages: 1,
      fixable: true,
    });
  }
  if (pages.length < 3) {
    issues.push({
      id: "few-pages",
      severity: "предупреждение",
      area: "content",
      title: "Мало ключевых страниц в анкете — аудит узкий",
      pages: pages.length,
      fixable: false,
    });
  }
  issues.push({
    id: "llms",
    severity: "совет",
    area: "llms",
    title: `Проверить индексацию ${host} в Яндексе, Google и Bing`,
    pages: 1,
    fixable: true,
  });

  const crawled = n(h, 2, 40, 1800);
  return {
    score,
    crawled,
    indexed: Math.round(crawled * (0.55 + (project.sitemapUrl ? 0.2 : 0))),
    blocked: project.robotsUrl ? n(h, 3, 4, 80) : n(h, 3, 80, 400),
    health: [
      { label: "Краулинг", value: Math.min(94, n(h, 4, 40, 70) + (project.robotsUrl ? 12 : 0)) },
      { label: "Индексация", value: Math.min(94, n(h, 5, 42, 72) + (project.sitemapUrl ? 14 : 0)) },
      { label: "On-page", value: n(h, 6, 44, 78) },
      { label: "Разметка", value: n(h, 7, 30, 70) },
      { label: "Скорость", value: n(h, 8, 38, 76) },
      { label: "Готовность к ИИ", value: Math.min(92, n(h, 9, 32, 62) + (project.blogUrl ? 8 : 0) + (project.casesUrl ? 6 : 0)) },
    ],
    issues,
    structure,
    bots: [
      { bot: "YandexBot", hits: n(h, 86, 200, 4000), blocked: n(h, 87, 0, 20), pages: n(h, 88, 30, 500), last: "сегодня", status: "ок" },
      { bot: "Googlebot", hits: n(h, 83, 80, 2200), blocked: n(h, 84, 0, 30), pages: n(h, 85, 20, 400), last: "сегодня", status: "ок" },
      { bot: "bingbot", hits: n(h, 80, 40, 900), blocked: project.robotsUrl ? n(h, 81, 0, 40) : n(h, 81, 20, 120), pages: n(h, 82, 10, 200), last: "вчера", status: project.robotsUrl ? "ок" : "редко" },
    ],
    botTrend: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((label, i) => ({
      label,
      yandex: n(h, 120 + i, 60, 800),
      google: n(h, 110 + i, 80, 900),
      bing: n(h, 100 + i, 20, 280),
    })),
  };
}

export function strategyFromProject(project: Project): StrategyCluster[] {
  const host = hostOf(project.url);
  const goals = new Set(project.goals as GoalId[]);
  const rows: StrategyCluster[] = [
    { topic: `бренд ${host}`, volume: "Средняя", gap: 40, intent: "бренд", action: "Главная и сниппет" },
  ];
  if (goals.has("sales") || goals.has("leads")) {
    rows.push({ topic: "коммерческий запрос с городом", volume: "Высокая", gap: 74, intent: "заявка", action: "Посадочная + форма" });
  }
  if (goals.has("content") || goals.has("marketing")) {
    rows.push({ topic: "как выбрать в этом году", volume: "Высокая", gap: 58, intent: "подбор", action: "Гайд в блоге" });
  }
  if (goals.has("visibility") || goals.has("seo")) {
    rows.push({ topic: "сравнение с конкурентом", volume: "Средняя", gap: 62, intent: "сравнение", action: "Таблица и FAQ" });
  }
  if (goals.has("compete")) {
    rows.push({ topic: "альтернатива лидеру ниши", volume: "Средняя", gap: 80, intent: "выбор", action: "Страница vs" });
  }
  if (rows.length < 3) {
    rows.push({ topic: "информационный кластер", volume: "Низкая", gap: 45, intent: "обучение", action: "Статья + внутренние ссылки" });
  }
  return rows;
}

function pathOf(url: string) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.pathname || "/";
  } catch {
    return url.startsWith("/") ? url : "/" + url;
  }
}
