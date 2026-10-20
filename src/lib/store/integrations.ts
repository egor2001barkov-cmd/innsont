import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Интеграционные токены Яндекса: Метрика и Вебмастер.
 * Хранятся только на сервере (data/accounts/{id}/integrations.json),
 * в браузер не отдаём никогда — только маскированные статусы.
 */

export type Integrations = {
  metrika?: {
    token: string;
    login?: string;
    counters: { id: number; name: string; site: string }[];
    /** привязка счётчика к проекту кабинета */
    counterByProject: Record<string, number>;
  };
  webmaster?: {
    token: string;
    login?: string;
    uid?: number;
    /** привязка host_id Вебмастера к проекту */
    hostByProject: Record<string, string>;
  };
};

function path(accountId: string) {
  return join(process.cwd(), "data", "accounts", accountId, "integrations.json");
}

export function loadIntegrations(accountId: string): Integrations {
  try {
    return JSON.parse(readFileSync(path(accountId), "utf8")) as Integrations;
  } catch {
    return {};
  }
}

function save(accountId: string, data: Integrations) {
  mkdirSync(join(path(accountId), ".."), { recursive: true });
  writeFileSync(path(accountId), JSON.stringify(data, null, 2), "utf8");
}

/** Статус для UI: без секретов. */
export function integrationsStatus(accountId: string) {
  const raw = loadIntegrations(accountId);
  return {
    metrika: raw.metrika
      ? { connected: true, login: raw.metrika.login || "", counters: raw.metrika.counters }
      : { connected: false },
    webmaster: raw.webmaster
      ? { connected: true, login: raw.webmaster.login || "" }
      : { connected: false },
  };
}

export async function connectMetrika(
  accountId: string,
  token: string
): Promise<{ ok: true; counters: { id: number; name: string; site: string }[]; login: string } | { ok: false; error: string }> {
  const res = await fetch("https://api-metrika.yandex.ru/management/v1/counters", {
    headers: { Authorization: `OAuth ${token}` },
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  if (!res) return { ok: false, error: "api-metrika.yandex.ru недоступен" };
  if (res.status === 403 || res.status === 401) {
    return { ok: false, error: "Токен не принят (403). Проверьте, что токен получен на oauth.yandex.ru с правами на Метрику." };
  }
  if (!res.ok) return { ok: false, error: `Метрика ответила ${res.status}` };
  const data = (await res.json().catch(() => null)) as {
    rows?: { id: number; name: string; site: string; status: string }[];
  } | null;
  const counters = (data?.rows || [])
    .filter((c) => c.status !== "Deleted")
    .map((c) => ({ id: c.id, name: c.name || String(c.id), site: c.site || "" }));
  const raw = loadIntegrations(accountId);
  save(accountId, { ...raw, metrika: { token, counters, counterByProject: raw.metrika?.counterByProject || {} } });
  return { ok: true, counters, login: "" };
}

export function disconnectMetrika(accountId: string) {
  const raw = loadIntegrations(accountId);
  delete raw.metrika;
  save(accountId, raw);
}

export function bindCounter(accountId: string, projectId: string, counterId: number) {
  const raw = loadIntegrations(accountId);
  if (!raw.metrika) return;
  raw.metrika.counterByProject[projectId] = counterId;
  save(accountId, raw);
}

export async function connectWebmaster(
  accountId: string,
  token: string
): Promise<{ ok: true; uid: number; hosts: { host_id: string; host: string; verified: boolean }[] } | { ok: false; error: string }> {
  // кто владелец токена
  const info = await fetch("https://login.yandex.ru/info?format=json", {
    headers: { Authorization: `OAuth ${token}` },
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  if (!info || !info.ok) return { ok: false, error: "Токен не принят Яндексом" };
  const user = (await info.json().catch(() => ({}))) as { id?: number; login?: string };
  if (!user.id) return { ok: false, error: "Яндекс не вернул id пользователя для токена" };

  const res = await fetch(`https://api.webmaster.yandex.net/v4/user/${user.id}/hosts`, {
    headers: { Authorization: `OAuth ${token}` },
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  if (!res) return { ok: false, error: "api.webmaster.yandex.net недоступен" };
  if (res.status === 403) {
    return {
      ok: false,
      error: "Вебмастер API не пускает (403). Доступ к API открывается по заявке: webmaster.yandex.ru → API. Пока можно пользоваться аудитом сайта без Вебмастера.",
    };
  }
  if (!res.ok) return { ok: false, error: `Вебмастер ответил ${res.status}` };
  const data = (await res.json().catch(() => null)) as {
    hosts?: { host_id: string; host: string; verified: boolean }[];
  } | null;
  const hosts = (data?.hosts || []).map((h) => ({ host_id: h.host_id, host: h.host, verified: Boolean(h.verified) }));
  const raw = loadIntegrations(accountId);
  save(accountId, {
    ...raw,
    webmaster: { token, uid: user.id, login: user.login || "", hostByProject: raw.webmaster?.hostByProject || {} },
  });
  return { ok: true, uid: user.id, hosts };
}

export function disconnectWebmaster(accountId: string) {
  const raw = loadIntegrations(accountId);
  delete raw.webmaster;
  save(accountId, raw);
}

export function bindHost(accountId: string, projectId: string, hostId: string) {
  const raw = loadIntegrations(accountId);
  if (!raw.webmaster) return;
  raw.webmaster.hostByProject[projectId] = hostId;
  save(accountId, raw);
}

export function deleteIntegrationsFile(accountId: string) {
  rmSync(path(accountId), { force: true });
}
