/**
 * Недельный отчёт по методике seo-weekly-report: 28 дней против предыдущих 28,
 * снимок, тренд, топ-страницы/источники, тревоги при падении >20% и рекомендация к каждой.
 * Дополняет аудит по seo-ru: аудит находит проблемы точечно, отчёт следит за динамикой.
 */

import type { MetrikaWindow } from "@/lib/yandex-api";

export type ReportAlert = {
  severity: "тревога" | "внимание";
  title: string;
  detail: string;
  recommendation: string;
};

export type WeeklyReport = {
  generatedAt: string;
  projectId: string;
  hasMetrika: boolean;
  metrikaErrors: string[];
  snapshot: { metric: string; prev: string; last: string; deltaPct: number | null; good: boolean | null }[];
  byDay: { date: string; visits: number }[];
  sources: { name: string; prev: number; last: number; deltaPct: number | null }[];
  topPages: { path: string; prev: number; last: number; deltaPct: number | null }[];
  alerts: ReportAlert[];
  wins: string[];
  contentActivity: {
    articlesLast28: number;
    articlesPrev28: number;
    lastAuditAt: string | null;
    lastAuditScores: { google: number; yandex: number } | null;
  };
  note: string;
}

function delta(prev: number, last: number): number | null {
  if (prev <= 0) return null;
  return Math.round(((last - prev) / prev) * 100);
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export function buildWeeklyReport(input: {
  projectId: string;
  metrika?: MetrikaWindow;
  articles: { updated: string }[];
  lastAuditAt: string | null;
  lastAuditScores: { google: number; yandex: number } | null;
}): WeeklyReport {
  const { metrika, articles, lastAuditAt, lastAuditScores } = input;
  const alerts: ReportAlert[] = [];
  const wins: string[] = [];
  const hasMetrika = Boolean(metrika?.last && metrika?.prev);

  const snapshot: WeeklyReport["snapshot"] = [];
  const sources: WeeklyReport["sources"] = [];
  const topPages: WeeklyReport["topPages"] = [];
  let byDay: { date: string; visits: number }[] = [];

  if (metrika?.prev && metrika.last) {
    const dVisits = delta(metrika.prev.visits, metrika.last.visits);
    const dUsers = delta(metrika.prev.users, metrika.last.users);
    const dBounce = metrika.last.bounceRate - metrika.prev.bounceRate;
    snapshot.push(
      { metric: "Визиты", prev: fmt(metrika.prev.visits), last: fmt(metrika.last.visits), deltaPct: dVisits, good: dVisits === null ? null : dVisits >= 0 },
      { metric: "Посетители", prev: fmt(metrika.prev.users), last: fmt(metrika.last.users), deltaPct: dUsers, good: dUsers === null ? null : dUsers >= 0 },
      { metric: "Отказы", prev: `${metrika.prev.bounceRate}%`, last: `${metrika.last.bounceRate}%`, deltaPct: metrika.prev.bounceRate > 0 ? Math.round((dBounce / metrika.prev.bounceRate) * 100) : null, good: dBounce <= 0 }
    );
    byDay = metrika.byDay;

    // Тревога/победа: визиты (порог >20% из методики скилла)
    if (dVisits !== null) {
      if (dVisits <= -20) {
        alerts.push({
          severity: "тревога",
          title: `Визиты упали на ${Math.abs(dVisits)}%`,
          detail: `${fmt(metrika.prev.visits)} → ${fmt(metrika.last.visits)} за 28 дней`,
          recommendation: "Сверьте спрос в Wordstat: если это не сезон — запустите аудит сайта и проверьте позиции ключевых страниц.",
        });
      } else if (dVisits >= 20) {
        wins.push(`Визиты выросли на ${dVisits}% — зафиксируйте, что сработало, и повторите.`);
      }
    }

    if (dBounce >= 5) {
      alerts.push({
        severity: "внимание",
        title: `Отказы выросли на ${dBounce} п.п.`,
        detail: `${metrika.prev.bounceRate}% → ${metrika.last.bounceRate}%`,
        recommendation: "Проверьте первые экраны посадочных: контент должен отвечать на запрос сразу, без пустых вступлений.",
      });
    }

    for (const s of metrika.sources) {
      const d = delta(s.prev, s.last);
      sources.push({ ...s, deltaPct: d });
    }
    const searchSrc = sources.find((s) => s.name === "Поиск" || s.name === "Органический поиск");
    if (searchSrc && searchSrc.deltaPct !== null && searchSrc.deltaPct <= -20) {
      alerts.push({
        severity: "тревога",
        title: `Поисковый трафик упал на ${Math.abs(searchSrc.deltaPct)}%`,
        detail: `${fmt(searchSrc.prev)} → ${fmt(searchSrc.last)} визитов из поиска`,
        recommendation: "Проверьте индексацию в Вебмастере и запустите аудит: падение поиска чаще всего = техника или конкуренция, а не контент.",
      });
    }

    for (const p of metrika.topPages) {
      const d = delta(p.prev, p.last);
      topPages.push({ ...p, deltaPct: d });
      if (p.prev >= 50 && d !== null && d <= -30) {
        alerts.push({
          severity: "внимание",
          title: `Страница ${p.path} потеряла ${Math.abs(d)}% трафика`,
          detail: `${fmt(p.prev)} → ${fmt(p.last)} визитов`,
          recommendation: "Обновите контент и дату на странице, проверьте конкурентов в выдаче по её запросам.",
        });
      }
      if (p.prev > 0 && p.last > 0 && d !== null && d >= 50 && wins.length < 4) {
        wins.push(`${p.path}: +${d}% визитов — кандидат на усиление внутренними ссылками.`);
      }
    }
    if (alerts.filter((a) => a.title.includes("потеряла")).length > 3) {
      // не засоряем отчёт: оставляем три самые крупные просадки страниц
      const pageAlerts = alerts.filter((a) => a.title.includes("потеряла"));
      alerts.splice(alerts.indexOf(pageAlerts[3]), pageAlerts.length - 3);
    }
  }

  // Внутренняя активность INSONT (доступна без интеграций)
  const cut = new Date(Date.now() - 28 * 86400_000).toISOString().slice(0, 10);
  const cutPrev = new Date(Date.now() - 56 * 86400_000).toISOString().slice(0, 10);
  const articlesLast28 = articles.filter((a) => a.updated >= cut).length;
  const articlesPrev28 = articles.filter((a) => a.updated >= cutPrev && a.updated < cut).length;

  if (articlesLast28 === 0) {
    alerts.push({
      severity: "внимание",
      title: "За 28 дней не опубликовано ни одной статьи",
      detail: "Контент-конвейер стоит: поиск не получает поводов переобходить и ранжировать вас выше",
      recommendation: "Возьмите 2–3 кластера из «Стратегии» и сгенерируйте статьи; свежий контент — самый быстрый рычаг.",
    });
  } else if (articlesLast28 > articlesPrev28 && articlesPrev28 > 0) {
    wins.push(`Конвейер ускорился: ${articlesPrev28} → ${articlesLast28} статей за 28 дней.`);
  }

  const auditAgeDays = lastAuditAt
    ? Math.floor((Date.now() - new Date(lastAuditAt).getTime()) / 86400_000)
    : null;
  if (auditAgeDays === null || auditAgeDays > 28) {
    alerts.push({
      severity: "внимание",
      title: auditAgeDays === null ? "Аудит сайта ещё не запускался" : `Последний аудит — ${auditAgeDays} дней назад`,
      detail: "Недельный отчёт следит за динамикой, но не заменяет проверку здоровья сайта",
      recommendation: "Запустите «Аудит сайта» (методика seo-ru): двойной скор Google/Яндекс и находки с приоритетами.",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    projectId: input.projectId,
    hasMetrika,
    metrikaErrors: metrika?.errors || [],
    snapshot,
    byDay,
    sources,
    topPages,
    alerts,
    wins,
    contentActivity: { articlesLast28, articlesPrev28, lastAuditAt, lastAuditScores },
    note: hasMetrika
      ? "Методика seo-weekly-report: 28 дней против предыдущих 28; тревога — падение >20%."
      : "Подключите Яндекс.Метрику в «Интеграциях» — отчёт наполнится трафиком. Пока показана внутренняя активность.",
  };
}
