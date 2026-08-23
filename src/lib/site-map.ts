import { keywordNav } from "@/lib/keyword-pages";

export type SiteLink = { href: string; name: string; desc?: string };
export type SiteSection = {
  title: string;
  href?: string;
  items: SiteLink[];
};

export const SITE_SECTIONS: SiteSection[] = [
  {
    title: "Главное",
    items: [
      { href: "/", name: "Главная", desc: "Продвижение в Яндексе, Google и нейросетях" },
      { href: "/tseny", name: "Тарифы", desc: "Старт, Базовый, Рост" },
      { href: "/demo", name: "Заказать демо" },
      { href: "/registratsiya", name: "Регистрация — 5 запросов" },
      { href: "/vhod", name: "Вход" },
      { href: "/karta-sayta", name: "Карта сайта" },
      { href: "/priorizirovat", name: "Приоритизировать" },
      { href: "/deystvovat", name: "Действовать" },
      { href: "/pochemu-insont", name: "Почему INSONT" },
      { href: "/strategiya", name: "Стратегии роста" },
      { href: "/strategiya/seo", name: "SEO-стратегия" },
      { href: "/strategiya/kontent", name: "Контент-стратегия" },
      { href: "/dlya-komand", name: "Для команд" },
    ],
  },
  {
    title: "Платформа",
    href: "/platforma",
    items: [
      {
        href: "/platforma/obem-ii-poiska",
        name: "Объём ИИ-поиска",
        desc: "Частота, тренд и города России. Это не Wordstat",
      },
      {
        href: "/platforma/issledovatel-brendov",
        name: "Исследователь брендов",
        desc: "Разовая сводка: кого советуют вместо вас",
      },
      {
        href: "/platforma/monitoring-vidimosti",
        name: "Мониторинг видимости",
        desc: "Поиск и модели в одной строке каждый день",
      },
      {
        href: "/platforma/analitika-agentov",
        name: "Аналитика роботов",
        desc: "Заходы Яндекса, Google, GPTBot и GigaChat",
      },
      {
        href: "/platforma/treker-pokupok",
        name: "Трекер покупок",
        desc: "Артикул в ответе и ссылка на Ozon или сайт",
      },
      {
        href: "/platforma/treker-reklamy",
        name: "Трекер рекламы",
        desc: "Директ, Ads и редкие блоки в ответах",
      },
      {
        href: "/platforma/tsentr-deystviy",
        name: "Центр действий",
        desc: "Что чинить на этой неделе",
      },
      { href: "/platforma/ii-agenty", name: "ИИ-агенты" },
      { href: "/platforma/avtor-statey", name: "Автор статей" },
      { href: "/platforma/kontent-agent", name: "Контент-агент" },
    ],
  },
  {
    title: "Решения",
    href: "/resheniya",
    items: [
      { href: "/resheniya/krupnyy-biznes", name: "Крупный бизнес" },
      { href: "/resheniya/agentstva", name: "Агентства" },
      { href: "/resheniya/komandy-rosta", name: "Команды роста" },
      { href: "/resheniya/internet-magaziny", name: "Интернет-магазины" },
      { href: "/resheniya/kliniki", name: "Клиники" },
      { href: "/resheniya/zastroyshchiki", name: "Застройщики" },
      { href: "/resheniya/banki", name: "Банки и финтех" },
      { href: "/resheniya/saas", name: "SaaS и IT" },
      { href: "/resheniya/obrazovanie", name: "Образование" },
      { href: "/resheniya/restorany", name: "Рестораны" },
      { href: "/resheniya/avtoservisy", name: "Автосервисы" },
      { href: "/resheniya/yuristy", name: "Юристы" },
      { href: "/resheniya/turizm", name: "Туризм" },
    ],
  },
  {
    title: "Продвижение в поиске",
    href: "/seo",
    items: [
      { href: "/seo/prodvizhenie-v-yandekse", name: "Продвижение в Яндексе" },
      { href: "/seo/prodvizhenie-v-google", name: "Продвижение в Google" },
      { href: "/seo/semantika-wordstat", name: "Семантика Wordstat" },
      { href: "/seo/tekhnicheskiy-audit", name: "Технический аудит" },
      { href: "/seo/kommercheskie-faktory", name: "Коммерческие факторы" },
      { href: "/seo/regionalnoe-prodvizhenie", name: "Региональное SEO" },
      { href: "/seo/metategi", name: "Title и description" },
      { href: "/seo/kontent", name: "Полезные тексты" },
      { href: "/seo/pravila-poiska", name: "Как не нарушать правила" },
      { href: "/seo/skolko-stoit", name: "Сколько стоит SEO" },
      { href: "/seo/pochemu-net-v-tope", name: "Почему нет в топе" },
      { href: "/seo/vs-agentstvo", name: "INSONT или агентство" },
      { href: "/seo/vs-keys-so", name: "INSONT и Keys.so" },
      { href: "/seo/vebmaster", name: "Яндекс Вебмастер" },
      { href: "/seo/yandex-biznes", name: "Яндекс Бизнес" },
      { href: "/seo/search-console", name: "Google Search Console" },
      { href: "/seo/google-profil", name: "Google Профиль компании" },
      { href: "/seo/mikrorazmetka", name: "Микроразметка" },
      { href: "/seo/vs-writesonic", name: "INSONT и Writesonic" },
      { href: "/seo/vs-semrush", name: "INSONT и Semrush" },
      { href: "/seo/glossariy", name: "Глоссарий" },
    ],
  },
  {
    title: "Нейросети",
    href: "/geo",
    items: [
      { href: "/geo/gigachat", name: "GigaChat", desc: "Ответы Сбера на русском" },
      { href: "/geo/chatgpt", name: "ChatGPT" },
      { href: "/geo/alisa", name: "Алиса и YandexGPT" },
      { href: "/geo/vs-seo", name: "GEO и SEO" },
    ],
  },
  {
    title: "Города",
    items: [
      { href: "/seo/moskva", name: "Москва" },
      { href: "/seo/sankt-peterburg", name: "Санкт-Петербург" },
      { href: "/seo/ekaterinburg", name: "Екатеринбург" },
      { href: "/seo/kazan", name: "Казань" },
      { href: "/seo/novosibirsk", name: "Новосибирск" },
      { href: "/seo/krasnodar", name: "Краснодар" },
      { href: "/seo/nizhniy-novgorod", name: "Нижний Новгород" },
      { href: "/seo/rostov-na-donu", name: "Ростов-на-Дону" },
      { href: "/seo/samara", name: "Самара" },
      { href: "/seo/sochi", name: "Сочи" },
      { href: "/seo/chelyabinsk", name: "Челябинск" },
      { href: "/seo/ufa", name: "Уфа" },
      { href: "/seo/perm", name: "Пермь" },
    ],
  },
  {
    title: "Ресурсы",
    href: "/resursy",
    items: [
      { href: "/blog", name: "Блог" },
      { href: "/keysy", name: "Кейсы" },
      { href: "/resursy/rukovodstvo-geo", name: "Руководство AEO/GEO" },
      { href: "/resursy/indeks-reklamy", name: "Индекс ИИ-рекламы" },
      { href: "/resursy/pomoshch", name: "Центр помощи" },
      { href: "/resursy/api", name: "Документация API" },
      { href: "/resursy/partnerskaya", name: "Партнёрская программа" },
      { href: "/resursy/integratsii", name: "Интеграции" },
    ],
  },
  {
    title: "Инструменты",
    href: "/instrumenty",
    items: [
      { href: "/instrumenty/llms-txt", name: "Генератор llms.txt" },
      { href: "/instrumenty/proverka-krawlerov", name: "Проверка ИИ-краулеров" },
    ],
  },
  {
    title: "Компания",
    items: [
      { href: "/kompaniya", name: "О компании" },
      { href: "/politika", name: "Политика конфиденциальности" },
      { href: "/oferta", name: "Публичная оферта" },
      { href: "/cookies", name: "Политика cookies" },
    ],
  },
];

export type Crumb = { href: string; name: string };

const NAME_BY_HREF: Record<string, string> = {};
for (const sec of SITE_SECTIONS) {
  if (sec.href) NAME_BY_HREF[sec.href] = sec.title;
  for (const it of sec.items) NAME_BY_HREF[it.href] = it.name;
}

for (const it of keywordNav()) {
  NAME_BY_HREF[it.href] = it.name;
}

const PARENT: Record<string, string> = {
  "/platforma": "/",
  "/resheniya": "/",
  "/resursy": "/",
  "/instrumenty": "/",
  "/blog": "/resursy",
  "/seo": "/",
  "/geo": "/",
  "/tseny": "/",
  "/demo": "/",
  "/vhod": "/",
  "/registratsiya": "/",
  "/karta-sayta": "/",
  "/kompaniya": "/",
  "/politika": "/",
  "/oferta": "/",
  "/cookies": "/",
  "/keysy": "/",
  "/seo/moskva": "/seo",
  "/seo/sankt-peterburg": "/seo",
  "/seo/ekaterinburg": "/seo",
  "/seo/kazan": "/seo",
  "/seo/novosibirsk": "/seo",
  "/seo/krasnodar": "/seo",
  "/seo/nizhniy-novgorod": "/seo",
  "/seo/rostov-na-donu": "/seo",
  "/seo/samara": "/seo",
  "/seo/sochi": "/seo",
  "/seo/chelyabinsk": "/seo",
  "/seo/ufa": "/seo",
  "/seo/perm": "/seo",
};

for (const sec of SITE_SECTIONS) {
  if (!sec.href) continue;
  for (const it of sec.items) {
    if (it.href !== sec.href) PARENT[it.href] = sec.href;
  }
}
for (const it of keywordNav()) {
  PARENT[it.href] = it.href.startsWith("/geo/") ? "/geo" : "/seo";
}

export function crumbsFor(pathname: string, lastName?: string): Crumb[] {
  if (pathname === "/") return [{ href: "/", name: "Главная" }];
  if (pathname.startsWith("/blog/") && pathname !== "/blog") {
    return [...crumbsFor("/blog"), { href: pathname, name: lastName || "Статья" }];
  }
  if (pathname.startsWith("/keysy/") && pathname !== "/keysy") {
    return [...crumbsFor("/keysy"), { href: pathname, name: lastName || "Кейс" }];
  }
  const chain: string[] = [];
  let cur: string | undefined = pathname;
  const guard = new Set<string>();
  while (cur && !guard.has(cur)) {
    guard.add(cur);
    chain.unshift(cur);
    cur = PARENT[cur];
  }
  if (chain[0] !== "/") chain.unshift("/");
  return chain.map((href, i) => ({
    href,
    name:
      i === chain.length - 1 && lastName
        ? lastName
        : href === "/"
          ? "Главная"
          : NAME_BY_HREF[href] || lastName || "Страница",
  }));
}
