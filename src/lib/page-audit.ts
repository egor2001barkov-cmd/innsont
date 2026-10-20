/**
 * Серверный аудит одной страницы: метатеги, структура, индексируемость,
 * разметка, скорость ответа. Без headless-браузера: контент, который
 * рендерится только JS, не анализируется (честно помечаем в отчёте).
 */

export type AuditSeverity = "критично" | "важно" | "желательно";

export type AuditFinding = {
  id: string;
  severity: AuditSeverity;
  area: string;
  title: string;
  detail: string;
  fix: string;
};

export type PageAudit = {
  url: string;
  finalUrl: string;
  statusCode: number;
  redirectChain: string[];
  ttfbMs: number;
  https: boolean;
  score: number;
  checks: { id: string; label: string; pass: boolean | null; weight: number }[];
  findings: AuditFinding[];
  facts: {
    title: string;
    titleLen: number;
    description: string;
    descriptionLen: number;
    h1: string[];
    h2: string[];
    canonical: string;
    metaRobots: string;
    viewport: string;
    lang: string;
    schemaTypes: string[];
    images: { total: number; noAlt: number; noDims: number };
    textChars: number;
    keyInLead: boolean | null;
    keyInTitle: boolean | null;
    internalLinks: number;
    externalLinks: number;
    ogTags: number;
  };
  note: string;
};

const UA =
  "Mozilla/5.0 (compatible; InsontAudit/1.0; +https://insont.ru) AppleWebKit/537.36 Chrome/128 Safari/537.36";

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

export async function auditPage(rawUrl: string, key?: string): Promise<PageAudit | { error: string }> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim().match(/^https?:\/\//i) ? rawUrl.trim() : `https://${rawUrl.trim()}`);
  } catch {
    return { error: "Некорректный адрес страницы" };
  }

  const started = Date.now();
  const chain: string[] = [];
  let current = url.toString();
  let res: Response | null = null;
  try {
    // ручной обход редиректов (до 5), чтобы записать цепочку
    for (let hop = 0; hop < 6; hop++) {
      const r = await fetch(current, {
        headers: { "User-Agent": UA, Accept: "text/html" },
        redirect: "manual",
        signal: AbortSignal.timeout(20_000),
      });
      if ([301, 302, 303, 307, 308].includes(r.status)) {
        const loc = r.headers.get("location");
        if (!loc) {
          res = r;
          break;
        }
        chain.push(`${r.status} → ${loc}`);
        current = new URL(loc, current).toString();
        continue;
      }
      res = r;
      break;
    }
  } catch (e) {
    return { error: `Страница недоступна: ${e instanceof Error ? e.message : "ошибка сети"}` };
  }
  if (!res) return { error: "Слишком много редиректов (больше 5)" };
  const ttfbMs = Date.now() - started;
  const html = await res.text().catch(() => "");
  if (!html) return { error: "Пустой ответ от сервера" };

  const finalUrl = current;
  const https = finalUrl.startsWith("https://");
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = decodeEntities(
    html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
      html.match(/<meta\s+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] || ""
  );
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decodeEntities(m[1])).filter(Boolean);
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => decodeEntities(m[1])).filter(Boolean);
  const canonical = html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || "";
  const metaRobbots =
    html.match(/<meta\s+name=["']robots["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta\s+http-equiv=["']x-robots-tag["']/i)?.[0] ||
    "";
  const viewport = html.match(/<meta\s+name=["']viewport["'][^>]*content=["']([^"']*)["']/i)?.[1] || "";
  const lang = html.match(/<html[^>]*\blang=["']([^"']+)["']/i)?.[1] || "";
  const schemaTypes = [...new Set([...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]))].slice(0, 12);

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt=/i.test(t)).length;
  const noDims = imgs.filter((t) => !/\swidth=/i.test(t) || !/\sheight=/i.test(t)).length;

  const text = stripTags(html);
  const host = new URL(finalUrl).host;
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)].map((m) => m[1]);
  const internal = links.filter((l) => l.startsWith("/") || l.includes(host)).length;
  const external = links.length - internal;
  const ogTags = (html.match(/<meta\s+property=["']og:/gi) || []).length;

  const keyNorm = (key || "").trim().toLowerCase();
  const keyOk = keyNorm.length > 2;
  const lead = text.slice(0, 700).toLowerCase();
  const keyInLead = keyOk ? lead.includes(keyNorm) : null;
  const keyInTitle = keyOk ? title.toLowerCase().includes(keyNorm) : null;

  const facts: PageAudit["facts"] = {
    title,
    titleLen: title.length,
    description,
    descriptionLen: description.length,
    h1: h1s,
    h2: h2s,
    canonical,
    metaRobots: metaRobbots,
    viewport,
    lang,
    schemaTypes,
    images: { total: imgs.length, noAlt, noDims },
    textChars: text.length,
    keyInLead,
    keyInTitle,
    internalLinks: internal,
    externalLinks: external,
    ogTags,
  };

  const findings: AuditFinding[] = [];
  const checks: PageAudit["checks"] = [];

  function check(id: string, label: string, pass: boolean | null, weight: number) {
    checks.push({ id, label, pass, weight });
  }

  // 1. Доступность и HTTPS
  check("http", `Отвечает ${res.status}, HTTPS`, res.ok && https, 12);
  if (!res.ok) {
    findings.push({
      id: "http",
      severity: "критично",
      area: "Доступность",
      title: `Страница отвечает кодом ${res.status}`,
      detail: `Итоговый адрес: ${finalUrl}`,
      fix: "Страница с ошибкой не индексируется и теряет весь трафик. Проверьте, не сломан ли URL и не удалена ли страница.",
    });
  } else if (!https) {
    findings.push({
      id: "https",
      severity: "критично",
      area: "Доступность",
      title: "Нет HTTPS",
      detail: finalUrl,
      fix: "Установите SSL-сертификат и настройте 301-редирект с http на https. Яндекс и Google помечают незащищённые страницы.",
    });
  }
  if (chain.length > 1) {
    findings.push({
      id: "redirects",
      severity: "желательно",
      area: "Доступность",
      title: `Длинная цепочка редиректов (${chain.length})`,
      detail: chain.join(" → "),
      fix: "Сократите до одного 301-редиректа: каждый лишний переход теряет скорость и вес ссылки.",
    });
  }

  // 2. Скорость ответа
  check("ttfb", `Ответ сервера ${ttfbMs} мс`, ttfbMs < 1200 ? true : ttfbMs < 2500 ? null : false, 8);
  if (ttfbMs >= 1200) {
    findings.push({
      id: "ttfb",
      severity: ttfbMs >= 2500 ? "важно" : "желательно",
      area: "Скорость",
      title: `Медленный ответ сервера: ${ttfbMs} мс`,
      detail: "Первый байт дольше 1,2 с — роботы расходуют краулинговый бюджет, LCP не влезает в 2,5 с.",
      fix: "Включите кэш HTML на стороне сервера (например, page-cache для CMS), проверните тяжёлые плагины, актуален TTFB < 800 мс.",
    });
  }

  // 3. Title
  const titleOkLen = title.length >= 20 && title.length <= 75;
  check("title", `Title ${title.length} симв.`, Boolean(title) && titleOkLen, 10);
  if (!title) {
    findings.push({
      id: "title-missing",
      severity: "критично",
      area: "Мета",
      title: "Нет тега title",
      detail: "Без title страница не имеет сниппета и почти не ранжируется.",
      fix: "Добавьте title с ключевым запросом в начале, 50–70 символов.",
    });
  } else if (!titleOkLen) {
    findings.push({
      id: "title-len",
      severity: title.length < 20 ? "важно" : "желательно",
      area: "Мета",
      title: `Title ${title.length} символов — ${title.length < 20 ? "слишком короткий" : "обрежется в сниппете"}`,
      detail: title,
      fix: "Держите 50–70 символов: ключ в начале, уточнение и выгода в конце.",
    });
  }
  if (keyInTitle === false) {
    check("key-title", "Ключ в title", false, 6);
    findings.push({
      id: "key-title",
      severity: "важно",
      area: "Мета",
      title: "Ключевого запроса нет в title",
      detail: `Искали «${key}»`,
      fix: "Включите точное вхождение ключа в title и в H1 — это базовое соответствие запросу.",
    });
  } else {
    check("key-title", "Ключ в title", keyInTitle, 6);
  }

  // 4. Description
  const descOkLen = description.length >= 70 && description.length <= 165;
  check("desc", `Description ${description.length} симв.`, descOkLen, 6);
  if (!description) {
    findings.push({
      id: "desc-missing",
      severity: "важно",
      area: "Мета",
      title: "Нет meta description",
      detail: "Поиск соберёт описание сам — CTR сниппета падает.",
      fix: "Напишите 140–160 символов с конкретикой и выгодой; это не ранжирование, но CTR.",
    });
  } else if (!descOkLen) {
    findings.push({
      id: "desc-len",
      severity: "желательно",
      area: "Мета",
      title: `Description ${description.length} символов`,
      detail: description.slice(0, 120),
      fix: "Оптимально 140–160 символов.",
    });
  }

  // 5. H1
  const h1Ok = h1s.length === 1;
  check("h1", h1s.length === 1 ? `Один H1: «${h1s[0].slice(0, 50)}»` : `H1: ${h1s.length} шт.`, h1Ok, 10);
  if (h1s.length === 0) {
    findings.push({
      id: "h1-missing",
      severity: "критично",
      area: "Структура",
      title: "Нет H1",
      detail: "H1 — главный заголовок страницы, без него страница «не о чем» для поиска.",
      fix: "Добавьте один H1 с ключом, отличным от title формулировкой.",
    });
  } else if (h1s.length > 1) {
    findings.push({
      id: "h1-many",
      severity: "важно",
      area: "Структура",
      title: `На странице ${h1s.length} заголовков H1`,
      detail: h1s.slice(0, 3).join(" | "),
      fix: "Оставьте один H1, остальные понизьте до H2.",
    });
  }

  // 6. H2-структура
  check("h2", `H2: ${h2s.length} шт.`, h2s.length >= 2 ? true : h2s.length === 1 ? null : false, 6);
  if (h2s.length < 2) {
    findings.push({
      id: "h2",
      severity: "желательно",
      area: "Структура",
      title: "Мало заголовков H2",
      detail: "Модели и поиск опираются на структуру: без разделов текст хуже разбирается и цитируется.",
      fix: "Разбейте текст на 3–6 разделов H2 с вопросными формулировками («Сколько стоит…», «Как выбрать…»).",
    });
  }

  // 7. Canonical
  const canonicalOk = canonical
    ? canonical.replace(/\/$/, "") === finalUrl.replace(/\/$/, "") || canonical === url.toString()
    : false;
  check("canonical", canonical ? (canonicalOk ? "Canonical на себя" : "Canonical на другую страницу") : "Нет canonical", canonical ? canonicalOk : null, 4);
  if (canonical && !canonicalOk) {
    findings.push({
      id: "canonical",
      severity: "критично",
      area: "Индексация",
      title: "Canonical указывает на другую страницу",
      detail: `${canonical} ≠ ${finalUrl}`,
      fix: "Если это самостоятельная страница — canonical должен указывать на себя. Иначе страница выпадет из индекса.",
    });
  }

  // 8. Индексируемость
  const noindex = /noindex/i.test(metaRobbots);
  check("robots", noindex ? "meta robots: noindex!" : "Индексация открыта", !noindex, 10);
  if (noindex) {
    findings.push({
      id: "noindex",
      severity: "критично",
      area: "Индексация",
      title: "Страница закрыта от индексации",
      detail: `meta robots: ${metaRobbots}`,
      fix: "Уберите noindex, если страница должна быть в поиске; проверьте и robots.txt.",
    });
  }

  // 9. Viewport / мобильная
  const viewportOk = /width=device-width/i.test(viewport);
  const zoomBan = /maximum-scale\s*=\s*1/i.test(viewport);
  check("viewport", viewportOk ? (zoomBan ? "Viewport есть, зум запрещён" : "Viewport корректный") : "Нет viewport", viewportOk && !zoomBan, 5);
  if (!viewportOk) {
    findings.push({
      id: "viewport",
      severity: "важно",
      area: "Мобильная",
      title: "Нет мобильного viewport",
      detail: "Без viewport мобильная выдача рендерит страницу как десктоп.",
      fix: "Добавьте <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
    });
  } else if (zoomBan) {
    findings.push({
      id: "zoom",
      severity: "желательно",
      area: "Мобильная",
      title: "Запрещено масштабирование (maximum-scale=1)",
      detail: viewport,
      fix: "Уберите maximum-scale=1 — это минус к доступности и удобству.",
    });
  }

  // 10. Schema
  check("schema", schemaTypes.length ? `Schema: ${schemaTypes.slice(0, 5).join(", ")}` : "Schema.org нет", schemaTypes.length > 0 ? true : null, 5);
  if (!schemaTypes.length) {
    findings.push({
      id: "schema",
      severity: "желательно",
      area: "Разметка",
      title: "Нет микроразметки Schema.org",
      detail: "Organization/Product/Article/BreadcrumbList помогают и поиску, и нейросетям понимать страницу.",
      fix: "Добавьте JSON-LD: Organization на все страницы, Article — на статьи, BreadcrumbList — на внутренние.",
    });
  }

  // 11. Картинки
  check("images", imgs.length ? `Картинки: ${imgs.length}, без alt: ${noAlt}` : "Картинок нет", noAlt === 0 ? true : noAlt <= imgs.length / 3 ? null : false, 4);
  if (imgs.length && noAlt > 0) {
    findings.push({
      id: "alt",
      severity: noAlt > imgs.length / 3 ? "важно" : "желательно",
      area: "Контент",
      title: `У ${noAlt} из ${imgs.length} картинок нет alt`,
      detail: "Alt — источник трафика из поиска по картинкам и сигнал для нейросетей.",
      fix: "Пропишите alt по содержанию картинки с ключом там, где уместно.",
    });
  }
  if (noDims > 0) {
    findings.push({
      id: "dims",
      severity: "желательно",
      area: "Скорость",
      title: `У ${noDims} картинок нет width/height`,
      detail: "Без размеров браузер перестраивает layout — скачет CLS.",
      fix: "Задайте width/height или aspect-ratio для всех img.",
    });
  }

  // 12. Объём текста
  check("text", `Текст: ~${Math.round(text.length / 1000)} тыс. знаков`, text.length >= 800 ? true : null, 4);
  if (text.length < 800) {
    findings.push({
      id: "text",
      severity: text.length < 300 ? "важно" : "желательно",
      area: "Контент",
      title: `Мало текста в HTML: ${text.length} знаков`,
      detail: "Если контент появляется только после JavaScript, роботы и нейросети его не видят.",
      fix: "Держите основной текст в HTML (SSR/кэш). Посадочной — от 1 500 знаков, статье — от 3 000.",
    });
  }

  // 13. Ключ в первом экране
  check("key-lead", keyOk ? (keyInLead ? "Ключ в первых абзацах" : "Ключа нет в первых абзацах") : "Ключ не задан", keyInLead, 6);
  if (keyInLead === false) {
    findings.push({
      id: "key-lead",
      severity: "важно",
      area: "Контент",
      title: "Ключевого запроса нет в первых абзацах",
      detail: `Искали «${key}» в первых ~700 знаках.`,
      fix: "Прямой ответ на запрос в первом абзаце — так пишут и для людей, и для цитирования нейросетями.",
    });
  }

  // 14. Перелинковка
  check("links", `Внутренних ссылок: ${internal}`, internal >= 3 ? true : null, 4);
  if (internal < 3) {
    findings.push({
      id: "links",
      severity: "желательно",
      area: "Структура",
      title: "Мало внутренних ссылок",
      detail: `Найдено внутренних: ${internal}.`,
      fix: "Свяжите страницу с услугами и смежными статьями (3–6 ссылок) — это путь и пользователям, и роботам.",
    });
  }

  // 15. lang
  check("lang", lang ? `lang="${lang}"` : "Нет lang у <html>", lang ? true : null, 2);
  if (!lang) {
    findings.push({
      id: "lang",
      severity: "желательно",
      area: "Разметка",
      title: "Не указан атрибут lang",
      detail: "Помогает определять язык страницы.",
      fix: '<html lang="ru">.',
    });
  }

  // Скоринг: средневзвешенно по проверкам (null не влияет)
  const scored = checks.filter((c) => c.pass !== null);
  const weightSum = scored.reduce((s, c) => s + c.weight, 0);
  const weightGot = scored.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
  const score = weightSum ? Math.round((weightGot / weightSum) * 100) : 0;

  const severityRank: Record<AuditSeverity, number> = { критично: 0, важно: 1, желательно: 2 };
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    url: url.toString(),
    finalUrl,
    statusCode: res.status,
    redirectChain: chain,
    ttfbMs,
    https,
    score,
    checks,
    findings,
    facts,
    note: "Аудит читает HTML без выполнения JavaScript: контент, который появляется только скриптами, помечен как отсутствующий.",
  };
}
