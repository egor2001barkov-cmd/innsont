/**
 * llms.txt (короткая карта) и llms-full.txt (полная) — из одних и тех же локальных данных,
 * что и sitemap. Без сетевых запросов; адреса, ушедшие в редирект, не попадают.
 *
 * Короткая версия кладётся в public/llms.txt скриптом scripts/gen-llms.mjs
 * (Caddy отдаёт её как статический файл), полная отдаётся маршрутом /llms-full.txt.
 */
import { POSTS } from "@/lib/blog";
import { CASES } from "@/lib/cases";
import { FEATURES, SOLUTIONS_PAGES } from "@/lib/features";
import { allLongPages } from "@/lib/geo-pages";
import { TERMS } from "@/lib/slovar";
import { PLANS, SITE } from "@/lib/site";
import { REDIRECTED_PATHS } from "@/lib/redirected";
import { seoOf } from "@/lib/seo-overrides";
import { SITE_TOOLS } from "@/lib/tools-registry";

type Entry = { path: string; title: string; description: string };

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();
const url = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;
/** Строка карты с заголовком и описанием для выдачи (с правками из SEO_OVERRIDES). */
const entry = (path: string, base: { title: string; description: string }): Entry => ({
  path,
  ...seoOf(path, base),
});

/** Инструменты — из единого реестра (src/lib/tools-registry.ts), как на хабе /instrumenty. */
export const TOOLS: Entry[] = SITE_TOOLS.map((t) => ({
  path: t.path,
  title: t.name,
  description: `${t.short}. Без регистрации.`,
}));

const STATIC_PAGES: Entry[] = [
  { path: "/", title: "INSONT — продвижение сайта в поиске и нейросетях", description: SITE.description },
  { path: "/tseny", title: "Тарифы INSONT", description: "Старт, Базовый и Рост: лимиты статей, аудитов и промптов, месяц или год." },
  { path: "/seo", title: "Продвижение в поиске — Яндекс и Google", description: "Семантика, витрина, регион, Вебмастер и Search Console, тексты." },
  { path: "/geo", title: "Продвижение в нейросетях (GEO и AEO)", description: "Как сайт попадает в ответы GigaChat, ChatGPT, Алисы и YandexGPT." },
  { path: "/platforma", title: "Платформа INSONT", description: "Аудит, ключи, статьи, перелинковка, очеловечиватель, отчёты." },
  { path: "/instrumenty", title: "Бесплатные инструменты", description: "Проверки без регистрации." },
  { path: "/resheniya", title: "Решения по отраслям", description: "Клиники, магазины, банки, SaaS, образование, рестораны и другие." },
  { path: "/strategiya", title: "Стратегия роста сайта", description: "Поиск и тексты в одной очереди работ." },
  { path: "/strategiya/seo", title: "SEO-стратегия", description: "Спрос, витрина, регион, техника, замер." },
  { path: "/strategiya/kontent", title: "Контент-стратегия", description: "Какие страницы нужны и в каком порядке." },
  { path: "/keysy", title: "Кейсы INSONT", description: "Что сделали на сайте и что изменилось." },
  { path: "/resursy", title: "Ресурсы", description: "Руководство AEO и GEO, интеграции, API, партнёрская программа, помощь." },
  { path: "/resursy/rukovodstvo-geo", title: "Руководство AEO и GEO", description: "Как сайт попадает в ответы нейросетей и не выпадает из поиска." },
  { path: "/resursy/partnerskaya", title: "Партнёрская программа", description: "20% с оплат приведённого клиента в течение 12 месяцев." },
  { path: "/resursy/integratsii", title: "Интеграции", description: "Метрика, Вебмастер, Search Console, WordPress, API." },
  { path: "/resursy/pomoshch", title: "Центр помощи", description: "Как пользоваться кабинетом, тарифами, статьями и API." },
  { path: "/resursy/api", title: "Документация API", description: "Методы, лимиты и коды ошибок API INSONT. Доступ по ключу на тарифе «Рост»." },
  { path: "/resursy/indeks-reklamy", title: "Индекс рекламы в ответах ChatGPT", description: "Ежедневный срез по России: выборка, не весь рынок." },
  { path: "/blog", title: "Блог INSONT", description: "Статьи о Яндексе, Google, нейросетях и технике сайта." },
  { path: "/slovar", title: "Словарь SEO и GEO", description: "Термины простыми словами: определение, пример, проверка, ошибки." },
  { path: "/karta-sayta", title: "Карта сайта", description: "Все страницы INSONT." },
  { path: "/kompaniya", title: "О компании", description: SITE.description },
  { path: "/pochemu-insont", title: "Зачем INSONT, если уже есть SEO-сервис", description: "Поиск и ответы моделей в одном кабинете." },
  { path: "/dlya-komand", title: "INSONT для команд", description: "Один кабинет для агентств, команд роста и магазинов." },
  { path: "/deystvovat", title: "Что делать на сайте", description: "Очередь работ: тексты, упоминания, доступ роботам." },
  { path: "/priorizirovat", title: "Центр действий", description: "Что чинить первым на этой неделе." },
  { path: "/demo", title: "Демо", description: "Разбор сайта в поиске и нейросетях." },
  { path: "/registratsiya", title: "Регистрация", description: "Создание кабинета." },
  { path: "/oferta", title: "Публичная оферта", description: "Условия использования сервиса." },
  { path: "/politika", title: "Политика конфиденциальности", description: "Обработка персональных данных." },
  { path: "/cookies", title: "Политика cookies", description: "Какие файлы cookie использует сайт." },
];

/** Статьи для короткой карты: по темам инструментов и коммерческих страниц. */
const FEATURED_POSTS = [
  "wordstat-instrukciya-s-chastotoy",
  "kak-proverit-i-uvelichit-indeksaciyu-sayta",
  "kak-proverit-zakryat-li-sayt-ot-indeksacii",
  "kak-otkryt-sayt-ii-krawleram",
  "llms-txt-zachem-i-kak",
  "robots-txt-dlya-yandex-i-google-primery",
  "clean-param-chto-eto-i-kak-napisat",
  "kanibalizaciya-klyuchevyh-zaprosov",
  "vnutrennyaya-perelinkovka-metodika",
  "ii-kontent-i-pravila-poiska",
  "tehnicheskiy-audit-saita-samostoyatelno",
  "title-i-description-normy-dliny-primery",
  "kak-popast-v-otvety-gigachat",
  "kak-popast-v-chatgpt-search",
  "yandeks-neyro-kak-popast-v-otvety",
  "kak-izmerit-roi-ii-vidimosti",
  "geo-dlya-uslug-b2b",
  "skolko-stoit-seo-v-2026",
  "kommercheskie-faktory-chek-list",
  "indexnow-kak-podklyuchit",
];

function section(entries: Entry[], title: string, lines: string[], maxDesc = 200) {
  if (!entries.length) return;
  lines.push(`## ${title}`, "");
  for (const e of entries) {
    const desc = e.description && e.description !== e.title ? `: ${clean(e.description).slice(0, maxDesc)}` : "";
    lines.push(`- [${clean(e.title)}](${url(e.path)})${desc}`);
  }
  lines.push("");
}

function plansLines(lines: string[]) {
  lines.push("## Тарифы", "");
  for (const p of PLANS) {
    lines.push(`- ${p.name}: ${p.priceAnnual} ₽/мес при оплате за год (помесячно — ${p.priceMonthly} ₽)`);
  }
  lines.push(`- Страница тарифов: ${url("/tseny")}`, "");
}

function factsLines(lines: string[]) {
  lines.push("## Факты", "");
  lines.push(`- Сайт: ${SITE.url}, язык — русский, регион — Россия.`);
  lines.push("- Контент отдаётся в HTML без выполнения JavaScript; robots.txt открыт для поисковых и ИИ-роботов.");
  lines.push(`- Бесплатные инструменты без регистрации: ${TOOLS.map((t) => t.title.toLowerCase()).join(", ")}.`);
  lines.push("- Данные о спросе и позициях по конкретным запросам на сайте не публикуются.");
  lines.push("");
}

/** Короткая карта: public/llms.txt. */
export function llmsShortText(): string {
  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.tagline}. Кабинет для аудита сайта, подбора ключей, статей и перелинковки — и бесплатные инструменты без регистрации.`);
  lines.push(`> Полная карта сайта: ${url("/llms-full.txt")}`);
  lines.push("");

  lines.push("## Главное", "");
  for (const p of ["/", "/seo", "/geo", "/platforma", "/tseny", "/demo"]) {
    const e = STATIC_PAGES.find((x) => x.path === p);
    if (e) lines.push(`- [${e.title}](${url(e.path)}): ${clean(e.description)}`);
  }
  lines.push("");

  plansLines(lines);
  section(TOOLS, "Бесплатные инструменты", lines, 160);

  const featured = FEATURED_POSTS.map((slug) => POSTS.find((p) => p.slug === slug)).filter((p): p is (typeof POSTS)[number] => Boolean(p));
  section(
    featured.map((p) => entry(`/blog/${p.slug}`, { title: p.title, description: p.description })),
    "Статьи по темам",
    lines,
    160
  );
  lines.push(`- [Все статьи блога](${url("/blog")})`);
  lines.push("");

  section(
    TERMS.map((t) => entry(`/slovar/${t.slug}`, { title: t.term, description: t.description })),
    "Словарь",
    lines,
    160
  );
  factsLines(lines);
  return lines.join("\n");
}

/** Полная карта: маршрут /llms-full.txt. */
export function llmsFullText(): string {
  const longPages = allLongPages().filter((p) => p.path !== "/seo" && !REDIRECTED_PATHS.has(p.path));
  const total = STATIC_PAGES.length + TOOLS.length + FEATURES.length + SOLUTIONS_PAGES.length + longPages.length + CASES.length + POSTS.length + TERMS.length;
  const lines: string[] = [];

  lines.push(`# ${SITE.name} — полная карта сайта`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push(`> ${total} страниц с описаниями. Короткая версия: ${url("/llms.txt")}`);
  lines.push("");

  plansLines(lines);
  section(STATIC_PAGES, "Главное и разделы", lines);
  section(TOOLS, "Бесплатные инструменты", lines);
  section(
    FEATURES.map((f) => entry(f.path, { title: f.title, description: f.description })),
    "Платформа",
    lines
  );
  section(
    SOLUTIONS_PAGES.map((f) => entry(f.path, { title: f.title, description: f.description })),
    "Решения",
    lines
  );
  section(
    longPages.map((p) => entry(p.path, { title: p.title, description: p.description })),
    "Услуги, города и отраслевые страницы",
    lines
  );
  section(
    TERMS.map((t) => entry(`/slovar/${t.slug}`, { title: t.term, description: t.description })),
    "Словарь",
    lines
  );
  section(
    CASES.map((c) => ({ path: `/keysy/${c.slug}`, title: `Кейс: ${c.company} — ${c.industry}${c.city ? `, ${c.city}` : ""}`, description: c.description })),
    "Кейсы",
    lines
  );
  section(
    POSTS.map((p) => entry(`/blog/${p.slug}`, { title: p.title, description: p.description })),
    "Блог",
    lines
  );
  factsLines(lines);
  lines.push(`<!-- Собрано из данных сайта ${new Date().toISOString().slice(0, 10)} -->`);
  return lines.join("\n");
}
