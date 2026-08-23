export type WordstatPhrase = { phrase: string; count: number };
export type WordstatDynamics = { date: string; count: number; share?: number };
export type WordstatRegion = { name: string; count: number; share?: number };

export type WordstatBundle = {
  source: "wordstat" | "suggest";
  phrase: string;
  totalCount: number | null;
  top: WordstatPhrase[];
  associations: WordstatPhrase[];
  dynamics: WordstatDynamics[];
  regions: WordstatRegion[];
  error?: string;
};

const API = "https://api.wordstat.yandex.net";

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function post<T>(path: string, token: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: headers(token),
    body: body ? JSON.stringify(body) : "{}",
    signal: AbortSignal.timeout(12000),
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "message" in json
        ? String((json as { message: unknown }).message)
        : `Wordstat ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}

export async function wordstatTop(
  token: string,
  phrase: string,
  region?: number
): Promise<{ totalCount: number; topRequests: WordstatPhrase[]; associations?: WordstatPhrase[] }> {
  return post("/v1/topRequests", token, {
    phrase,
    numPhrases: 80,
    ...(region ? { regions: [region] } : {}),
  });
}

export async function wordstatDynamics(token: string, phrase: string, region?: number) {
  const from = new Date();
  from.setMonth(from.getMonth() - 11);
  const fromDate = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-01`;
  return post<{ dynamics: WordstatDynamics[] }>("/v1/dynamics", token, {
    phrase,
    period: "monthly",
    fromDate,
    ...(region ? { regions: [region] } : {}),
  });
}

export async function wordstatRegions(token: string, phrase: string) {
  const raw = await post<{
    regions?: Array<{ name?: string; region?: string; regionName?: string; count?: number; share?: number }>;
  }>("/v1/regions", token, {
    phrase,
    regions: "regions",
  });
  return {
    regions: (raw.regions || []).map((r) => ({
      name: r.name || r.regionName || r.region || "регион",
      count: r.count || 0,
      share: r.share,
    })),
  };
}

export async function fetchWordstat(token: string, phrase: string, region?: number): Promise<WordstatBundle> {
  const top = await wordstatTop(token, phrase, region);
  let dynamics: WordstatDynamics[] = [];
  let regions: WordstatRegion[] = [];
  try {
    const d = await wordstatDynamics(token, phrase, region);
    dynamics = d.dynamics || [];
  } catch {
    /* dynamics optional */
  }
  try {
    const r = await wordstatRegions(token, phrase);
    regions = (r.regions || []).slice(0, 8);
  } catch {
    /* regions optional */
  }
  const associations = (top.associations || []).filter(
    (a) => !top.topRequests.some((t) => t.phrase === a.phrase)
  );
  return {
    source: "wordstat",
    phrase,
    totalCount: top.totalCount ?? null,
    top: top.topRequests || [],
    associations,
    dynamics,
    regions,
  };
}

export async function yandexSuggest(phrase: string): Promise<string[]> {
  const url = `https://suggest.yandex.ru/suggest-ya.cgi?uil=ru&v=4&part=${encodeURIComponent(phrase)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Insont/1.0", Accept: "application/json" },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[1])) return [];
  return (data[1] as unknown[]).map(String).filter(Boolean);
}

function estimateCount(seed: string, phrase: string, index: number) {
  const base = 4200 - index * 280 + seed.length * 40;
  const bonus = phrase.split(" ").length === 2 ? 900 : 0;
  return Math.max(80, Math.round((base + bonus) / 10) * 10);
}

export function suggestAsWordstat(seed: string, suggests: string[]): WordstatBundle {
  const phrases = [seed, ...suggests.filter((s) => s.toLowerCase() !== seed.toLowerCase())].slice(0, 24);
  const top = phrases.map((phrase, i) => ({ phrase, count: estimateCount(seed, phrase, i) }));
  return {
    source: "suggest",
    phrase: seed,
    totalCount: top[0]?.count ?? null,
    top,
    associations: top.slice(1, 10),
    dynamics: fakeTrend(top[0]?.count || 1000),
    regions: [
      { name: "Москва", count: Math.round((top[0]?.count || 0) * 0.28) },
      { name: "Санкт-Петербург", count: Math.round((top[0]?.count || 0) * 0.12) },
      { name: "Екатеринбург", count: Math.round((top[0]?.count || 0) * 0.05) },
    ],
  };
}

function fakeTrend(last: number): WordstatDynamics[] {
  const out: WordstatDynamics[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const wave = 0.78 + 0.22 * Math.sin(i / 2.2);
    out.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`,
      count: Math.round(last * wave),
    });
  }
  return out;
}

export function resolveWordstatToken(requestToken?: string | null) {
  return (requestToken || process.env.YANDEX_WORDSTAT_TOKEN || "").trim();
}
