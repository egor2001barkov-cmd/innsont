import { POSTS } from "@/lib/blog";
import { CASES } from "@/lib/cases";
import { FEATURES, SOLUTIONS_PAGES } from "@/lib/features";
import { allLongPages } from "@/lib/geo-pages";
import { SITE, PLANS } from "@/lib/site";

export const runtime = "nodejs";
/** Пересборка раз в сутки; содержимое собирается из локальных данных, без сетевых запросов. */
export const revalidate = 86400;

/**
 * llms-full.txt — полная карта сайта для ИИ-краулеров и ответных движков
 * (GigaChat, ChatGPT, Perplexity). Собирается из локальных источников
 * (те же, что питают sitemap), поэтому быстрая и без self-fetch.
 */

type Entry = { path: string; title: string; description: string };

const STATIC_PAGES: Entry[] = [
  { path: "/", title: "INSONT — продвижение сайта в Яндексе, Google и нейросетях", description: SITE.description },
  { path: "/tseny", title: "Тарифы INSONT", description: "Старт от 4 490 ₽/мес при годе, Базовый 10 790 ₽, Рост 22 490 ₽. Для агентств — питч 8 910 ₽ и корпоративный от 59 900 ₽. Оплата в рублях по 152-ФЗ." },
  { path: "/seo", title: "Продвижение в поиске — Яндекс, Google, витрина", description: "Комплексное SEO: технический аудит, семантика, посадочные, Вебмастер и Search Console, регионы." },
  { path: "/geo", title: "Продвижение в нейросетях (GEO/AEO)", description: "GigaChat, ChatGPT, Perplexity и Алиса рядом с поиском: цитируемость, llms.txt, ИИ-видимость бренда." },
  { path: "/platforma", title: "Платформа INSONT", description: "Кабинет: подбор ключей, генерация статей, аудит сайта, очеловечиватель, каннибализация, отчёты." },
  { path: "/resheniya", title: "Решения под задачи", description: "Лендинги, интернет-магазины, услуги, контент-проекты — сценарии под тип бизнеса." },
  { path: "/strategiya", title: "Стратегия продвижения", description: "Последовательность работ: от техники до контента и внешних сигналов." },
  { path: "/strategiya/seo", title: "Стратегия SEO", description: "Что делаем в каком порядке и как измеряем эффект." },
  { path: "/strategiya/kontent", title: "Стратегия контента", description: "Кластеры статей, частота, перелинковка, обновления." },
  { path: "/instrumenty", title: "Бесплатные инструменты", description: "Генератор llms.txt, проверка ИИ-краулеров, очеловечиватель текста, проверка каннибализации." },
  { path: "/instrumenty/llms-txt", title: "Генератор llms.txt", description: "Бесплатно создаёт llms.txt по живому обходу вашего сайта — без регистрации." },
  { path: "/instrumenty/proverka-krawlerov", title: "Проверка ИИ-краулеров", description: "Проверяет, открывает ли ваш сайт GPTBot, ClaudeBot, PerplexityBot и других." },
  { path: "/instrumenty/ochelovechivatel", title: "Очеловечиватель текста", description: "Находит и вычищает 18 шаблонных ИИ-оборотов в тексте." },
  { path: "/instrumenty/kanibalizatsiya", title: "Проверка каннибализации", description: "Находит страницы, конкурирующие за один запрос." },
  { path: "/keysy", title: "Кейсы INSONT", description: "Истории клиентов с цифрами: клиники, производство, окна, ритейл." },
  { path: "/resursy", title: "Ресурсы и руководства", description: "Руководство по AEO и GEO, интеграции, партнёрская программа." },
  { path: "/resursy/rukovodstvo-geo", title: "Руководство AEO и GEO", description: "Длинный разбор метода: как сайт попадает в ответы нейросетей." },
  { path: "/resursy/indeks-reklamy", title: "Индекс рекламы", description: "Что изменилось в рекламных форматах и как это касается поиска." },
  { path: "/resursy/partnerskaya", title: "Партнёрская программа", description: "10% с платежей приглашённых клиентов." },
  { path: "/resursy/integratsii", title: "Интеграции", description: "WordPress, Яндекс.Метрика, Вебмастер, Search Console." },
  { path: "/resursy/pomoshch", title: "Помощь", description: "Ответы на частые вопросы по платформе." },
  { path: "/resursy/api", title: "API", description: "Программный доступ к проверкам и генерации." },
  { path: "/blog", title: "Блог INSONT", description: "38 практических материалов о поиске, Вебмастере и ИИ-видимости." },
  { path: "/karta-sayta", title: "Карта сайта", description: "Все страницы INSONT." },
  { path: "/kompaniya", title: "О компании", description: SITE.description },
  { path: "/pochemu-insont", title: "Почему INSONT", description: "Принципы работы и отличия от агентств." },
  { path: "/dlya-komand", title: "Для команд", description: "Совместная работа над контентом и задачами." },
  { path: "/deystvovat", title: "С чего начать", description: "Три шага запуска." },
  { path: "/priorizirovat", title: "Приоритеты", description: "Что делать в первую очередь." },
  { path: "/demo", title: "Демо", description: "Демонстрация платформы." },
  { path: "/registratsiya", title: "Регистрация", description: "Бесплатный старт в кабинете INSONT." },
  { path: "/politika", title: "Политика конфиденциальности", description: "Обработка персональных данных." },
  { path: "/oferta", title: "Оферта", description: "Условия использования сервиса." },
  { path: "/cookies", title: "Cookie", description: "Использование cookie-файлов." },
];

function section(entries: Entry[], title: string, lines: string[]) {
  if (!entries.length) return;
  lines.push(`## ${title}`, "");
  for (const e of entries) {
    const url = `${SITE.url}${e.path === "/" ? "" : e.path}`;
    const desc = e.description && e.description !== e.title ? ` — ${e.description.replace(/\s+/g, " ").slice(0, 200)}` : "";
    lines.push(`- [${e.title.replace(/\s+/g, " ")}](${url})${desc}`);
  }
  lines.push("");
}

export async function GET() {
  const total =
    STATIC_PAGES.length + FEATURES.length + SOLUTIONS_PAGES.length +
    allLongPages().length + CASES.length + POSTS.length;
  const lines: string[] = [];

  lines.push(`# ${SITE.name} — полная карта для ИИ`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push(`> ${total} страниц с описаниями. Краткая версия — ${SITE.url}/llms.txt`);
  lines.push("");

  lines.push("## Тарифы", "");
  for (const p of PLANS) {
    const price = p.priceAnnual ? `${p.priceAnnual} ₽/мес при годе (месяц — ${p.priceMonthly ?? "—"} ₽)` : "по запросу";
    lines.push(`- ${p.name}: ${price} — ${p.job}`);
  }
  lines.push("");

  section(STATIC_PAGES, "Главное и разделы", lines);
  section(
    FEATURES.map((f) => ({ path: f.path, title: f.title, description: f.description })),
    "Платформа: возможности",
    lines
  );
  section(
    SOLUTIONS_PAGES.map((f) => ({ path: f.path, title: f.title, description: f.description })),
    "Решения под задачи",
    lines
  );
  section(
    allLongPages().map((p) => ({ path: p.path, title: p.title, description: p.description })),
    "Города и длинные страницы",
    lines
  );
  section(
    CASES.map((c) => ({
      path: `/keysy/${c.slug}`,
      title: `Кейс: ${c.company} — ${c.industry}${c.city ? `, ${c.city}` : ""}`,
      description: c.description,
    })),
    "Кейсы",
    lines
  );
  section(
    POSTS.map((p) => ({
      path: `/blog/${p.slug}`,
      title: p.title,
      description: p.description,
    })),
    "Блог и гайды",
    lines
  );

  lines.push("## Факты", "");
  lines.push(`- Домен: ${SITE.url}`);
  lines.push("- Оплата в рублях по 152-ФЗ, без НДС");
  lines.push("- Бесплатные инструменты без регистрации: llms.txt, проверка краулеров, очеловечиватель, каннибализация");
  lines.push("- Блог: практические гайды по Вордстат, Вебмастеру, Search Console, robots.txt, GEO/AEO");
  lines.push("");
  lines.push(`<!-- llms-full.txt собран из локальных источников ${new Date().toISOString().slice(0, 10)}; обновляется ежедневно -->`);

  const body = lines.join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
