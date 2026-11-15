export const PLAN_STATUSES = ["идея", "бриф", "черновик", "ревью", "опубликовано", "измерено"] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export type PlanItem = {
  id: string;
  key: string;
  intent: "коммерческий" | "информационный" | "смешанный";
  targetUrl: string;
  status: PlanStatus;
  priority: number;
  source: "вручную" | "список" | "ключи" | "каннибализация" | "аудит";
  createdAt: string;
  updatedAt: string;
};

const COMMERCIAL = /(купить|цена|стоимость|заказать|под ключ|услуг|тариф|сколько стоит|заказать|аренда|продажа)/i;
const INFORMATIONAL = /(как |что |почему|чем |когда |руководство|инструкция|примеры|разбор|сравнение|чек-лист|гайд)/i;

/** Грубая, но полезная сортировка интента: без неё очередь выглядит как список слов. */
export function detectIntent(key: string): PlanItem["intent"] {
  const commercial = COMMERCIAL.test(key);
  const informational = INFORMATIONAL.test(key);
  if (commercial && informational) return "смешанный";
  if (commercial) return "коммерческий";
  return informational ? "информационный" : "смешанный";
}

export function normalizeKey(key: string) {
  return key.trim().replace(/\s+/g, " ").slice(0, 160);
}

export function emptyStats() {
  return PLAN_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<PlanStatus, number>,
  );
}
