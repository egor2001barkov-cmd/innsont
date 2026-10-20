/**
 * Запросы к открытым API Яндекса: Метрика (stat/v1) и Вебмастер (v4).
 * Оборонительный стиль: таймауты, обработка ошибок, деградация по частям.
 */

export type MetrikaStats = {
  totals?: { visits: number; users: number; bounceRate: number; avgDurationSec: number };
  byDay?: { date: string; visits: number }[];
  sources?: { name: string; visits: number }[];
  topPages?: { path: string; visits: number }[];
  errors: string[];
};

const METRIKA = "https://api-metrika.yandex.ru/stat/v1/data";

function dimLabel(name: string) {
  const map: Record<string, string> = {
    direct: "Прямые заходы",
    internal: "Внутренние переходы",
    link: "Переходы по ссылкам",
    search: "Поиск",
    ad: "Реклама",
    mmap: "Карты и справочники",
    news: "Новости",
    email: "Почта",
    social: "Соцсети",
    advert: "Реклама",
    organic: "Органический поиск",
  };
  return map[name] || name;
}

async function metrikaCall(
  token: string,
  params: Record<string, string>
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: string }> {
  const qs = new URLSearchParams({ lang: "ru", ...params }).toString();
  const res = await fetch(`${METRIKA}?${qs}`, {
    headers: { Authorization: `OAuth ${token}` },
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
  if (!res) return { ok: false, error: "сеть" };
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return { ok: false, error: "пустой ответ" };
  return { ok: true, data };
}

type MetrikaResponse = {
  totals?: number[];
  data?: { dimensions: { name?: string; id?: string }[]; metrics: number[] }[];
};

export async function metrikaStats(token: string, counterId: number, days = 30): Promise<MetrikaStats> {
  const errors: string[] = [];
  const date2 = new Date();
  const date1 = new Date(Date.now() - days * 86400_000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const base = { id: String(counterId), date1: fmt(date1), date2: fmt(date2), accuracy: "1" };

  const out: MetrikaStats = { errors };

  const totals = await metrikaCall(token, {
    ...base,
    metrics: "ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:avgVisitDurationSeconds",
  });
  if (totals.ok) {
    const t = (totals.data as unknown as MetrikaResponse).totals || [];
    out.totals = {
      visits: Math.round(t[0] || 0),
      users: Math.round(t[1] || 0),
      bounceRate: Math.round((t[2] || 0) * 100),
      avgDurationSec: Math.round(t[3] || 0),
    };
  } else {
    errors.push(`Сводка: ${totals.error}`);
  }

  const byDay = await metrikaCall(token, {
    ...base,
    dimensions: "ym:s:date",
    metrics: "ym:s:visits",
    sort: "ym:s:date",
    limit: "62",
  });
  if (byDay.ok) {
    const rows = (byDay.data as unknown as MetrikaResponse).data || [];
    out.byDay = rows.map((r) => ({ date: r.dimensions?.[0]?.name || "", visits: Math.round(r.metrics[0] || 0) }));
  } else {
    errors.push(`По дням: ${byDay.error}`);
  }

  const sources = await metrikaCall(token, {
    ...base,
    dimensions: "ym:s:lastTrafficSource",
    metrics: "ym:s:visits",
    limit: "20",
  });
  if (sources.ok) {
    const rows = (sources.data as unknown as MetrikaResponse).data || [];
    out.sources = rows.map((r) => ({
      name: dimLabel(r.dimensions?.[0]?.name || r.dimensions?.[0]?.id || "—"),
      visits: Math.round(r.metrics[0] || 0),
    }));
  } else {
    errors.push(`Источники: ${sources.error}`);
  }

  const pages = await metrikaCall(token, {
    ...base,
    dimensions: "ym:s:URLPath",
    metrics: "ym:s:visits",
    limit: "10",
    sort: "-ym:s:visits",
  });
  if (pages.ok) {
    const rows = (pages.data as unknown as MetrikaResponse).data || [];
    out.topPages = rows.map((r) => ({ path: r.dimensions?.[0]?.name || "", visits: Math.round(r.metrics[0] || 0) }));
  } else {
    errors.push(`Страницы: ${pages.error}`);
  }

  return out;
}

export type WebmasterSummary = {
  hosts?: { host_id: string; host: string; verified: boolean }[];
  indexStats?: { date: string; indexed: number; crawled: number }[];
  errors: string[];
};

const WEBMASTER = "https://api.webmaster.yandex.net/v4/user";

async function wmCall(
  token: string,
  path: string
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const res = await fetch(`${WEBMASTER}${path}`, {
    headers: { Authorization: `OAuth ${token}` },
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
  if (!res) return { ok: false, error: "сеть" };
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  return { ok: true, data: await res.json().catch(() => null) };
}

export async function webmasterSummary(
  token: string,
  uid: number,
  hostId: string
): Promise<WebmasterSummary> {
  const errors: string[] = [];
  const out: WebmasterSummary = { errors };

  const stats = await wmCall(token, `/${uid}/hosts/${hostId}/stats/summary`);
  if (stats.ok) {
    const arr = (stats.data as { history?: { date: string; indexed?: number; crawled?: number }[] })?.history || [];
    out.indexStats = arr.slice(-14).map((h) => ({
      date: h.date?.slice(0, 10) || "",
      indexed: h.indexed || 0,
      crawled: h.crawled || 0,
    }));
  } else {
    errors.push(`Индексация: ${stats.error}`);
  }

  return out;
}

export async function webmasterHosts(
  token: string,
  uid: number
): Promise<{ host_id: string; host: string; verified: boolean }[]> {
  const res = await wmCall(token, `/${uid}/hosts`);
  if (!res.ok) return [];
  const data = res.data as { hosts?: { host_id: string; host: string; verified: boolean }[] };
  return (data.hosts || []).map((h) => ({ host_id: h.host_id, host: h.host, verified: Boolean(h.verified) }));
}

export type MetrikaWindowTotals = {
  visits: number;
  users: number;
  bounceRate: number;
  avgDurationSec: number;
};

export type MetrikaWindow = {
  prev?: MetrikaWindowTotals;
  last?: MetrikaWindowTotals;
  byDay: { date: string; visits: number }[];
  sources: { name: string; prev: number; last: number }[];
  topPages: { path: string; prev: number; last: number }[];
  errors: string[];
};

/**
 * Окно для недельного отчёта: последние `days` дней против предыдущих `days`
 * (методика seo-weekly-report: сравнение периодов + тренд по дням + топы).
 */
export async function metrikaWindow(
  token: string,
  counterId: number,
  days = 28
): Promise<MetrikaWindow> {
  const errors: string[] = [];
  const out: MetrikaWindow = { byDay: [], sources: [], topPages: [], errors };
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const endLast = new Date();
  const startLast = new Date(Date.now() - days * 86400_000);
  const endPrev = new Date(Date.now() - (days + 1) * 86400_000);
  const startPrev = new Date(Date.now() - 2 * days * 86400_000);

  async function totals(date1: Date, date2: Date): Promise<MetrikaWindowTotals | undefined> {
    const r = await metrikaCall(token, {
      id: String(counterId),
      date1: fmt(date1),
      date2: fmt(date2),
      accuracy: "1",
      metrics: "ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:avgVisitDurationSeconds",
    });
    if (!r.ok) {
      errors.push(`Сводка ${fmt(date1)}: ${r.error}`);
      return undefined;
    }
    const t = (r.data as unknown as MetrikaResponse).totals || [];
    return {
      visits: Math.round(t[0] || 0),
      users: Math.round(t[1] || 0),
      bounceRate: Math.round((t[2] || 0) * 100),
      avgDurationSec: Math.round(t[3] || 0),
    };
  }

  async function byDim(dimension: string, date1: Date, date2: Date) {
    const r = await metrikaCall(token, {
      id: String(counterId),
      date1: fmt(date1),
      date2: fmt(date2),
      accuracy: "1",
      dimensions: dimension,
      metrics: "ym:s:visits",
      limit: "15",
      sort: "-ym:s:visits",
    });
    if (!r.ok) return null;
    const rows = (r.data as unknown as MetrikaResponse).data || [];
    return rows.map((row) => ({
      name: row.dimensions?.[0]?.name || row.dimensions?.[0]?.id || "—",
      visits: Math.round(row.metrics[0] || 0),
    }));
  }

  const [prevT, lastT] = await Promise.all([totals(startPrev, endPrev), totals(startLast, endLast)]);
  out.prev = prevT;
  out.last = lastT;

  const [prevSrc, lastSrc] = await Promise.all([
    byDim("ym:s:lastTrafficSource", startPrev, endPrev),
    byDim("ym:s:lastTrafficSource", startLast, endLast),
  ]);
  if (prevSrc && lastSrc) {
    const names = new Set([...prevSrc.map((s) => s.name), ...lastSrc.map((s) => s.name)]);
    for (const name of names) {
      const prev = prevSrc.find((s) => s.name === name)?.visits || 0;
      const last = lastSrc.find((s) => s.name === name)?.visits || 0;
      if (prev + last > 0) out.sources.push({ name, prev, last });
    }
    out.sources.sort((a, b) => b.last + b.prev - (a.last + a.prev));
  } else {
    errors.push("Источники: не получены");
  }

  const [prevPages, lastPages] = await Promise.all([
    byDim("ym:s:URLPath", startPrev, endPrev),
    byDim("ym:s:URLPath", startLast, endLast),
  ]);
  if (prevPages && lastPages) {
    const paths = new Set([...prevPages.map((p) => p.name), ...lastPages.map((p) => p.name)]);
    for (const path of paths) {
      const prev = prevPages.find((p) => p.name === path)?.visits || 0;
      const last = lastPages.find((p) => p.name === path)?.visits || 0;
      if (prev + last > 0) out.topPages.push({ path, prev, last });
    }
    out.topPages.sort((a, b) => b.last + b.prev - (a.last + a.prev));
    out.topPages = out.topPages.slice(0, 10);
  } else {
    errors.push("Страницы: не получены");
  }

  const trend = await metrikaCall(token, {
    id: String(counterId),
    date1: fmt(startLast),
    date2: fmt(endLast),
    accuracy: "1",
    dimensions: "ym:s:date",
    metrics: "ym:s:visits",
    sort: "ym:s:date",
    limit: "40",
  });
  if (trend.ok) {
    const rows = (trend.data as unknown as MetrikaResponse).data || [];
    out.byDay = rows.map((r2) => ({
      date: r2.dimensions?.[0]?.name || "",
      visits: Math.round(r2.metrics[0] || 0),
    }));
  } else {
    errors.push(`По дням: ${trend.error}`);
  }

  return out;
}
