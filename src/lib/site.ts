export const SITE = {
  name: "INSONT",
  legalName: "INSONT",
  domain: "insont.ru",
  url: "https://insont.ru",
  email: "support@insont.ru",
  salesEmail: "sales@insont.ru",
  telegram: "https://t.me/egorconsult",
  telegramHandle: "@egorconsult",
  max: "https://max.ru/u/f9LHodD0cOLokrK3yJtWfpkCG_GAlpt4msSkWHp4JR6tI2ahGXrLjBI0Fj4",
  address: "ул. Академика Королёва, 5, Москва",
  inn: "773104369017",
  tagline: "Продвижение в Яндексе, Google и нейросетях",
  description:
    "Продвигаем сайт в Яндексе, Google и ответах нейросетей. Чтобы вас находили, когда человек ищет услугу или спрашивает, кого выбрать.",
  /** Last real content edit. Sitemap lastmod — only this or a page date, never Date.now(). */
  contentUpdated: "2026-08-23",
};

export const EXTRA_USER = 1490;
export const ARTICLE_PACK = 2490;

export const PLANS = [
  {
    id: "starter",
    name: "Старт",
    audience: "Соло и пилот",
    job: "Увидеть, упоминает ли ИИ вас",
    forWho: "Один маркетолог или владелец сайта. Первый заход в GEO, без агентства и без штата.",
    priceMonthly: 4990,
    priceAnnual: 4490,
    saveYear: 6000,
    popular: false,
    blurb:
      "Мониторинг в двух главных моделях и несколько статей, чтобы проверить гипотезу. Не полный контур — разведка.",
    visibility: [
      "Яндекс, Google, Bing",
      "50 промптов в месяц",
      "Исследователь брендов: 3 прогона",
      "Объём ИИ-поиска: 3 прогона",
    ],
    content: ["5 ИИ-статей в месяц", "3 аудита сайта (до 50 страниц)", "1 голос бренда"],
    agents: ["3 пробных запуска агента", "Без Центра действий", "Без трекера рекламы и покупок"],
    team: ["1 пользователь, 1 проект", "Почта, ответ в 1–2 дня"],
    notIncluded: [
      "Тональность",
      "API",
      "Кабинет под своим брендом",
    ],
    limits: {
      users: 1,
      projects: 1,
      articles: 5,
      audits: 3,
      prompts: 50,
      answers: 50,
      agentRuns: 3,
      actionItems: false,
      styles: 1,
    },
  },
  {
    id: "basic",
    name: "Базовый",
    audience: "In-house команда",
    job: "Писать контент, который цитирует ИИ",
    forWho: "SEO и контент 2–5 человек. Нужны статьи и регулярный трекинг, ещё не нужен отдел «чинить всё».",
    priceMonthly: 11990,
    priceAnnual: 10790,
    saveYear: 14400,
    popular: true,
    blurb:
      "SEO + GEO в одном кабинете: видимость по РФ-контуру и конвейер статей. Основной тариф для штатной команды.",
    visibility: [
      "Яндекс, Google, Bing",
      "100 промптов в месяц",
      "Трекер ИИ-рекламы (обзор)",
      "Исследователь и объём поиска: 20 прогонов",
    ],
    content: [
      "20 ИИ-статей в месяц",
      "12 аудитов (до 400 страниц)",
      "Автор статей + контент-агент",
      "5 голосов бренда",
    ],
    agents: ["20 запусков агентов", "Без Центра действий", "Без тональности"],
    team: ["2 пользователя, 1 проект", "Доп. место — 1 490 ₽/мес", "Почта"],
    notIncluded: ["Центр действий", "Трекер покупок", "API и кабинет под своим брендом"],
    limits: {
      users: 2,
      projects: 1,
      articles: 20,
      audits: 12,
      prompts: 100,
      answers: 150,
      agentRuns: 20,
      actionItems: false,
      styles: 3,
    },
  },
  {
    id: "growth",
    name: "Рост",
    audience: "Агентство и ecom",
    job: "Чинить видимость и закрывать бэклог",
    forWho: "Агентство с клиентами, интернет-магазин или команда роста. Нужно не смотреть дашборд, а отрабатывать очередь.",
    priceMonthly: 24990,
    priceAnnual: 22490,
    saveYear: 30000,
    popular: false,
    blurb:
      "Полный цикл: увидели разрыв → приоритет в Центре действий → агенты и статьи → замер на 14 и 28 день.",
    visibility: [
      "Яндекс, Google, Bing",
      "200 промптов в месяц",
      "Тональность упоминаний",
      "Трекер рекламы и ИИ-покупок",
    ],
    content: [
      "40 ИИ-статей в месяц",
      "25 аудитов (до 1 500 страниц)",
      "Пакет +15 статей — 2 490 ₽",
      "10 голосов бренда",
    ],
    agents: [
      "60 запусков агентов",
      "Центр действий: 10 внешних + 10 внутренних / мес",
      "API и выгрузки",
    ],
    team: ["4 пользователя, 2 проекта", "Доп. место — 1 490 ₽/мес", "Приоритетная почта"],
    notIncluded: ["Кабинет под своим брендом и выделенный стратег — в корпоративном тарифе"],
    limits: {
      users: 4,
      projects: 2,
      articles: 40,
      audits: 25,
      prompts: 200,
      answers: 400,
      agentRuns: 60,
      actionItems: true,
      styles: 10,
    },
  },
] as const;

export function formatRub(amount: number) {
  return new Intl.NumberFormat("ru-RU").format(amount) + " ₽";
}

export type NavItem = {
  href: string;
  title: string;
  desc: string;
  icon: string;
  highlight?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const PLATFORM: NavGroup[] = [
  {
    label: "Исследовать",
    items: [
      {
        href: "/platforma/obem-ii-poiska",
        title: "Объём ИИ-поиска",
        desc: "Как часто формулировку задают нейросетям в России",
        icon: "search",
        highlight: true,
      },
      {
        href: "/platforma/issledovatel-brendov",
        title: "Исследователь брендов",
        desc: "Как модели в России говорят о любом бренде",
        icon: "radar",
      },
    ],
  },
  {
    label: "Отслеживать",
    items: [
      {
        href: "/platforma/monitoring-vidimosti",
        title: "Мониторинг ИИ-видимости",
        desc: "Яндекс, Google и модели — в одной строке каждый день",
        icon: "eye",
      },
      {
        href: "/platforma/analitika-agentov",
        title: "Аналитика ИИ-агентов",
        desc: "Кто ходит на сайт: Яндекс, Google, GPTBot, GigaChat",
        icon: "pulse",
      },
      {
        href: "/platforma/treker-pokupok",
        title: "Трекер ИИ-покупок",
        desc: "Ваш артикул в ответе — и ссылка на сайт или на Ozon",
        icon: "cart",
      },
      {
        href: "/platforma/treker-reklamy",
        title: "Трекер ИИ-рекламы",
        desc: "Директ, Ads и редкие блоки внутри ответов",
        icon: "megaphone",
      },
    ],
  },
  {
    label: "Приоритизировать",
    items: [
      {
        href: "/platforma/tsentr-deystviy",
        title: "Центр действий",
        desc: "5–10 задач недели, не триста пунктов аудита",
        icon: "bolt",
      },
    ],
  },
  {
    label: "Действовать",
    items: [
      {
        href: "/platforma/ii-agenty",
        title: "ИИ-агенты",
        desc: "Настроили и забыли. Агенты делают работу.",
        icon: "bot",
      },
      {
        href: "/platforma/avtor-statey",
        title: "Автор статей",
        desc: "Страницы под Яндекс, Google и цитату в ответе модели",
        icon: "doc",
      },
      {
        href: "/platforma/kontent-agent",
        title: "Контент-агент",
        desc: "Любой формат, который отгружает команда, экспертным голосом",
        icon: "spark",
      },
    ],
  },
];

export const SOLUTIONS: NavItem[] = [
  {
    href: "/resheniya/krupnyy-biznes",
    title: "Крупный бизнес",
    desc: "Несколько юрлиц, роли, 152-ФЗ, отчёт совету",
    icon: "building",
  },
  {
    href: "/resheniya/agentstva",
    title: "Агентства",
    desc: "Кабинет под своим брендом, портфель клиентов и партнёрские ставки",
    icon: "users",
  },
  {
    href: "/resheniya/komandy-rosta",
    title: "Команды роста",
    desc: "Плейбуки, приоритеты и встроенное исполнение — как штат ×10",
    icon: "rocket",
  },
  {
    href: "/resheniya/internet-magaziny",
    title: "Интернет-магазины",
    desc: "Товары в ChatGPT Shopping, фиды, атрибуция ритейла",
    icon: "bag",
  },
  {
    href: "/resheniya/kliniki",
    title: "Клиники",
    desc: "Страницы услуг и врачей, запись, карточка в Яндекс Бизнесе",
    icon: "clinic",
  },
  {
    href: "/resheniya/zastroyshchiki",
    title: "Застройщики",
    desc: "Посадочные корпусов, районы, сроки сдачи и ипотека",
    icon: "realty",
  },
  {
    href: "/resheniya/banki",
    title: "Банки и финтех",
    desc: "Вклады, ИИС и тарифы без выдуманной доходности",
    icon: "bank",
  },
  {
    href: "/resheniya/saas",
    title: "SaaS и IT",
    desc: "Сравнения, документация и запросы «какой сервис выбрать»",
    icon: "saas",
  },
  {
    href: "/resheniya/obrazovanie",
    title: "Образование",
    desc: "Карточки курсов с программой, ценой и набором",
    icon: "edu",
  },
  {
    href: "/resheniya/restorany",
    title: "Рестораны",
    desc: "Меню с ценами, бронь, район, карточки на картах",
    icon: "restoran",
  },
  {
    href: "/resheniya/avtoservisy",
    title: "Автосервисы",
    desc: "Нормочас, запись на подъёмник, кузовной с вилкой",
    icon: "avto",
  },
  {
    href: "/resheniya/yuristy",
    title: "Юристы",
    desc: "Страницы практики без обещания выиграть дело",
    icon: "yurist",
  },
  {
    href: "/resheniya/turizm",
    title: "Туризм",
    desc: "Туры с датами и ценой «от», сезон заранее",
    icon: "turizm",
  },
];

export const RESOURCES: NavGroup[] = [
  {
    label: "Учиться",
    items: [
      {
        href: "/resursy/indeks-reklamy",
        title: "Индекс ИИ-рекламы",
        desc: "Ежедневный индекс спонсорских объявлений внутри ответов ChatGPT",
        icon: "chart",
      },
      {
        href: "/blog",
        title: "Блог",
        desc: "ИИ-поиск, AEO и стратегия видимости",
        icon: "book",
      },
      {
        href: "/resursy/rukovodstvo-geo",
        title: "Руководство AEO/GEO",
        desc: "Полный гайд по оптимизации под ответы ИИ",
        icon: "guide",
      },
      {
        href: "/resursy/pomoshch",
        title: "Центр помощи",
        desc: "Документация, туториалы и поддержка",
        icon: "help",
      },
    ],
  },
  {
    label: "Разрабатывать",
    items: [
      {
        href: "/resursy/api",
        title: "Документация API",
        desc: "Стройте продукты поверх INSONT",
        icon: "code",
      },
    ],
  },
  {
    label: "Доказывать",
    items: [
      {
        href: "/keysy",
        title: "Кейсы",
        desc: "СМ-Клиника, МойСклад, Фабрика Окон и другие",
        icon: "trophy",
      },
    ],
  },
  {
    label: "Партнёрам",
    items: [
      {
        href: "/resursy/partnerskaya",
        title: "Партнёрская программа",
        desc: "20% с оплаты приведённого клиента 12 месяцев",
        icon: "coin",
      },
    ],
  },
  {
    label: "Бесплатные инструменты",
    items: [
      {
        href: "/instrumenty/llms-txt",
        title: "Генератор llms.txt",
        desc: "Спецификация llms.txt для любого сайта",
        icon: "file",
      },
      {
        href: "/instrumenty/proverka-krawlerov",
        title: "Проверка ИИ-краулеров",
        desc: "Что реально читают ИИ-боты на вашей странице",
        icon: "scan",
      },
      {
        href: "/instrumenty",
        title: "Все бесплатные инструменты",
        desc: "Без регистрации, без почты, полный вывод",
        icon: "wrench",
      },
    ],
  },
  {
    label: "Подключать",
    items: [
      {
        href: "/resursy/integratsii",
        title: "Интеграции",
        desc: "Системы управления сайтом, хостинг, аналитика и агенты",
        icon: "plug",
      },
    ],
  },
];

export const FEATURED = {
  platform: {
    badge: "НОВОЕ",
    title: "Представляем Хаб проектов в INSONT для мультибрендовых команд",
    desc: "Единый вид всех проектов мониторинга брендов в пространстве. ИИ-видимость, доля цитирования и тренды — в одном месте.",
    href: "/platforma/monitoring-vidimosti",
    image: "hub",
  },
  resources: {
    badge: "НОВОЕ ИССЛЕДОВАНИЕ",
    title: "Что растит видимость в нейросетях в России — и что нет",
    desc: "1 240 коммерческих сайтов РФ. Цитаты домена важнее тональности. В Яндексе рядом едет витрина.",
    href: "/blog/issledovanie-ii-vidimosti-rf",
    image: "study",
  },
};

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow?: string;
};

export const PAGE_SEO: PageSeo[] = [
  {
    path: "/",
    title: "INSONT | Продвижение сайта в Яндексе и Google",
    description:
      "Продвигаем сайты в Яндексе, Google и других поисковиках. Семантика Wordstat, витрина, Вебмастер и Search Console. Плюс видимость в GigaChat.",
    h1: "Продвигаем сайт в Яндексе, Google и других поисковиках",
  },
  {
    path: "/tseny",
    title: "Тарифы INSONT | Старт, Базовый, Рост — цены в рублях",
    description:
      "Три подписки INSONT: месяц или год со скидкой 10%. Старт 4 490 ₽, Базовый 10 790 ₽, Рост 22 490 ₽ /мес при годе.",
    h1: "Тарифы и цены",
    eyebrow: "Тарифы",
  },
];
