import { hostOf, splitLines } from "@/lib/profile";
import { hashStr } from "@/lib/project-metrics";
import type { Project } from "@/lib/workspace";

export const LANDING_TYPES = ["главная", "услуга", "коммерция", "блог", "кейс", "город", "форма"] as const;
export type LandingType = (typeof LANDING_TYPES)[number];

export type LandingPage = {
  id: string;
  projectId: string;
  title: string;
  url: string;
  type: LandingType;
  region: string;
  intent: string;
  status: "черновик" | "в работе" | "готово";
};

export type RegionPref = {
  id: string;
  projectId: string;
  name: string;
  yandexId: number;
  priority: "высокий" | "средний" | "низкий";
  enabled: boolean;
};

export const CITY_CATALOG: { name: string; yandexId: number }[] = [
  { name: "Россия", yandexId: 225 },
  { name: "Москва", yandexId: 213 },
  { name: "Санкт-Петербург", yandexId: 2 },
  { name: "Екатеринбург", yandexId: 54 },
  { name: "Казань", yandexId: 43 },
  { name: "Новосибирск", yandexId: 65 },
  { name: "Краснодар", yandexId: 35 },
  { name: "Нижний Новгород", yandexId: 47 },
  { name: "Самара", yandexId: 51 },
  { name: "Ростов-на-Дону", yandexId: 39 },
  { name: "Челябинск", yandexId: 56 },
  { name: "Воронеж", yandexId: 193 },
  { name: "Пермь", yandexId: 50 },
  { name: "Уфа", yandexId: 172 },
  { name: "Красноярск", yandexId: 62 },
];

const LKEY = "insont.landings.v1";
const RKEY = "insont.regions.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadLandings(): LandingPage[] {
  return read<LandingPage[]>(LKEY, []);
}

export function saveLandings(items: LandingPage[]) {
  localStorage.setItem(LKEY, JSON.stringify(items));
  window.dispatchEvent(new Event("insont-workspace"));
}

export function loadRegions(): RegionPref[] {
  return read<RegionPref[]>(RKEY, []);
}

export function saveRegions(items: RegionPref[]) {
  localStorage.setItem(RKEY, JSON.stringify(items));
  window.dispatchEvent(new Event("insont-workspace"));
}

function titleFromUrl(url: string) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const last = decodeURIComponent(u.pathname.replace(/\/+$/, "").split("/").pop() || "");
    return last ? last.replace(/[-_]+/g, " ") : hostOf(url);
  } catch {
    return url;
  }
}

export function ensureProjectPages(project: Project) {
  const all = loadLandings();
  if (all.some((l) => l.projectId === project.id)) return all.filter((l) => l.projectId === project.id);
  const seed: LandingPage[] = [
    {
      id: `${project.id}-home`,
      projectId: project.id,
      title: "Главная",
      url: project.url,
      type: "главная",
      region: "Россия",
      intent: "бренд",
      status: "готово",
    },
  ];
  splitLines(project.mainPages).forEach((url, i) => {
    seed.push({
      id: `${project.id}-m${i}`,
      projectId: project.id,
      title: titleFromUrl(url),
      url,
      type: "услуга",
      region: "Россия",
      intent: "услуга",
      status: "в работе",
    });
  });
  if (project.blogUrl) {
    seed.push({
      id: `${project.id}-blog`,
      projectId: project.id,
      title: "Блог",
      url: project.blogUrl,
      type: "блог",
      region: "Россия",
      intent: "контент",
      status: "готово",
    });
  }
  if (project.casesUrl) {
    seed.push({
      id: `${project.id}-cases`,
      projectId: project.id,
      title: "Кейсы",
      url: project.casesUrl,
      type: "кейс",
      region: "Россия",
      intent: "доверие",
      status: "готово",
    });
  }
  if (project.formsUrl) {
    seed.push({
      id: `${project.id}-form`,
      projectId: project.id,
      title: "Форма заявки",
      url: project.formsUrl,
      type: "форма",
      region: "Россия",
      intent: "заявка",
      status: "готово",
    });
  }
  saveLandings([...all, ...seed]);
  return seed;
}

export function ensureProjectRegions(project: Project) {
  const all = loadRegions();
  if (all.some((r) => r.projectId === project.id)) return all.filter((r) => r.projectId === project.id);
  const seed: RegionPref[] = [
    { id: `${project.id}-225`, projectId: project.id, name: "Россия", yandexId: 225, priority: "средний", enabled: true },
    { id: `${project.id}-213`, projectId: project.id, name: "Москва", yandexId: 213, priority: "высокий", enabled: true },
    { id: `${project.id}-2`, projectId: project.id, name: "Санкт-Петербург", yandexId: 2, priority: "средний", enabled: false },
  ];
  saveRegions([...all, ...seed]);
  return seed;
}

export function landingScore(url: string) {
  const h = hashStr(url);
  return 38 + (h % 52);
}

export function emptyLanding(projectId: string, url: string): LandingPage {
  return {
    id: "l-" + Date.now().toString(36),
    projectId,
    title: titleFromUrl(url),
    url,
    type: "услуга",
    region: "Россия",
    intent: "",
    status: "черновик",
  };
}
