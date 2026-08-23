export type SphereId =
  | "electronics"
  | "seo"
  | "clinics"
  | "banks"
  | "edu"
  | "estate"
  | "auto"
  | "custom";

export type Competitor = {
  name: string;
  host: string;
  landings: { title: string; path: string; keys: string[] }[];
};

export type Sphere = {
  id: SphereId;
  label: string;
  hint: string;
  seeds: string[];
  competitors: Competitor[];
};

export const SPHERES: Sphere[] = [
  {
    id: "electronics",
    label: "Электроника и ноутбуки",
    hint: "Витрина техники, игровые и рабочие ноутбуки",
    seeds: ["игровой ноутбук", "ноутбук для работы", "ультрабук", "rtx 4070 ноутбук"],
    competitors: [
      {
        name: "DNS",
        host: "www.dns-shop.ru",
        landings: [
          { title: "Ноутбуки", path: "/catalog/17a8a01d16404e77/noutbuki/", keys: ["ноутбук", "игровой"] },
          { title: "Игровые ноутбуки", path: "/catalog/recipe/9ef9de6e3da00b3d/igrovye/", keys: ["игровой ноутбук"] },
          { title: "MacBook", path: "/catalog/17a8a01d16404e77/noutbuki/?brand=apple", keys: ["macbook"] },
        ],
      },
      {
        name: "М.Видео",
        host: "www.mvideo.ru",
        landings: [
          { title: "Ноутбуки", path: "/noutbuki-118", keys: ["ноутбук"] },
          { title: "Игровые ноутбуки", path: "/igrovye-noutbuki-195", keys: ["игровой ноутбук"] },
        ],
      },
      {
        name: "Ситилинк",
        host: "www.citilink.ru",
        landings: [
          { title: "Ноутбуки", path: "/catalog/noutbuki/", keys: ["ноутбук"] },
          { title: "Игровые", path: "/catalog/noutbuki-igrovye/", keys: ["игровой"] },
        ],
      },
    ],
  },
  {
    id: "seo",
    label: "SEO и продвижение",
    hint: "Агентства, GEO, видимость в поиске и нейросетях",
    seeds: ["продвижение сайта", "seo агентство москва", "видимость в gigachat", "семантика wordstat"],
    competitors: [
      {
        name: "Ашманов и партнёры",
        host: "www.ashmanov.com",
        landings: [
          { title: "Продвижение сайтов", path: "/services/prodvizhenie/", keys: ["продвижение сайта"] },
          { title: "SEO", path: "/services/seo/", keys: ["seo"] },
        ],
      },
      {
        name: "Пиксель Плюс",
        host: "pixelplus.ru",
        landings: [
          { title: "Продвижение", path: "/prodvizhenie-sajtov/", keys: ["продвижение"] },
        ],
      },
      {
        name: "Текстерра",
        host: "texterra.ru",
        landings: [
          { title: "SEO-продвижение", path: "/uslugi/prodvizhenie-sajtov/", keys: ["продвижение", "seo"] },
        ],
      },
    ],
  },
  {
    id: "clinics",
    label: "Клиники и медицина",
    hint: "Запись, УЗИ, терапия, стоматология",
    seeds: ["узи москва", "запись к терапевту", "стоматология недорого"],
    competitors: [
      {
        name: "Инвитро",
        host: "www.invitro.ru",
        landings: [{ title: "Анализы", path: "/analizes/for-doctors/", keys: ["анализ", "узи"] }],
      },
      {
        name: "Хеликс",
        host: "helix.ru",
        landings: [{ title: "Лаборатория", path: "/", keys: ["анализ"] }],
      },
    ],
  },
  {
    id: "banks",
    label: "Банки и вклады",
    hint: "Вклады, накопительные, ИИС",
    seeds: ["вклад 2026", "накопительный счет", "иис для новичка"],
    competitors: [
      {
        name: "Тинькофф",
        host: "www.tbank.ru",
        landings: [{ title: "Вклады", path: "/deposit/", keys: ["вклад"] }],
      },
      {
        name: "Сбер",
        host: "www.sberbank.ru",
        landings: [{ title: "Вклады", path: "/ru/person/contributions/depositsmore", keys: ["вклад"] }],
      },
    ],
  },
  {
    id: "edu",
    label: "Образование",
    hint: "Курсы, ЕГЭ, онлайн-школы",
    seeds: ["курсы егэ", "онлайн школа 2026", "репетитор математика"],
    competitors: [
      {
        name: "Фоксфорд",
        host: "foxford.ru",
        landings: [{ title: "ЕГЭ", path: "/ege/", keys: ["егэ"] }],
      },
      {
        name: "Нетология",
        host: "netology.ru",
        landings: [{ title: "Курсы", path: "/", keys: ["курс"] }],
      },
    ],
  },
  {
    id: "estate",
    label: "Недвижимость",
    hint: "Квартиры, новостройки, ипотека",
    seeds: ["квартира в новостройке", "ипотека 2026", "студия москва"],
    competitors: [
      {
        name: "ЦИАН",
        host: "www.cian.ru",
        landings: [{ title: "Квартиры", path: "/kupit-kvartiru/", keys: ["квартира"] }],
      },
      {
        name: "Домклик",
        host: "domclick.ru",
        landings: [{ title: "Ипотека", path: "/ipoteka/", keys: ["ипотека"] }],
      },
    ],
  },
  {
    id: "auto",
    label: "Авто",
    hint: "Салоны, подбор, кредит",
    seeds: ["купить авто с пробегом", "автокредит 2026", "новый кроссовер"],
    competitors: [
      {
        name: "Авто.ру",
        host: "auto.ru",
        landings: [{ title: "Легковые", path: "/moskva/cars/all/", keys: ["авто", "купить"] }],
      },
      {
        name: "Дром",
        host: "www.drom.ru",
        landings: [{ title: "Авто", path: "/", keys: ["авто"] }],
      },
    ],
  },
  {
    id: "custom",
    label: "Свои конкуренты",
    hint: "Укажите домены вручную",
    seeds: [],
    competitors: [],
  },
];

export const REGIONS = [
  { id: 225, label: "Россия" },
  { id: 213, label: "Москва" },
  { id: 2, label: "Санкт-Петербург" },
  { id: 54, label: "Екатеринбург" },
  { id: 43, label: "Казань" },
  { id: 65, label: "Новосибирск" },
];

export function sphereById(id: string): Sphere {
  return SPHERES.find((s) => s.id === id) || SPHERES[0];
}

export function guessSphere(host: string, name: string): SphereId {
  const h = (host + " " + name).toLowerCase();
  if (/dns|mvideo|citilink|ноут|laptop|tech|электрон/.test(h)) return "electronics";
  if (/seo|pixel|ashmanov|продвиж|гео|geo/.test(h)) return "seo";
  if (/clinic|мед|узи|стомат/.test(h)) return "clinics";
  if (/bank|вклад|tinkoff|sber/.test(h)) return "banks";
  return "custom";
}

const MAP: [RegExp, string][] = [
  [/а/g, "a"],
  [/б/g, "b"],
  [/в/g, "v"],
  [/г/g, "g"],
  [/д/g, "d"],
  [/е|ё/g, "e"],
  [/ж/g, "zh"],
  [/з/g, "z"],
  [/и/g, "i"],
  [/й/g, "y"],
  [/к/g, "k"],
  [/л/g, "l"],
  [/м/g, "m"],
  [/н/g, "n"],
  [/о/g, "o"],
  [/п/g, "p"],
  [/р/g, "r"],
  [/с/g, "s"],
  [/т/g, "t"],
  [/у/g, "u"],
  [/ф/g, "f"],
  [/х/g, "h"],
  [/ц/g, "ts"],
  [/ч/g, "ch"],
  [/ш/g, "sh"],
  [/щ/g, "sch"],
  [/ъ|ь/g, ""],
  [/ы/g, "y"],
  [/э/g, "e"],
  [/ю/g, "yu"],
  [/я/g, "ya"],
];

export function slugify(input: string) {
  let s = input.toLowerCase().trim();
  for (const [re, to] of MAP) s = s.replace(re, to);
  return s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function landingCandidates(host: string, phrase: string) {
  const slug = slugify(phrase);
  const paths = [
    `/${slug}`,
    `/${slug}/`,
    `/catalog/${slug}/`,
    `/uslugi/${slug}/`,
    `/services/${slug}/`,
    `/blog/${slug}/`,
    `/category/${slug}/`,
  ];
  return paths.map((path) => `https://${host}${path}`);
}
