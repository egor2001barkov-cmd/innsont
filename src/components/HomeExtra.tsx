import Link from "next/link";
import {
  LandingsLinksMock,
  LandingsListMock,
  RobotsBotsMock,
  RobotsFileMock,
} from "@/components/TechMocks";

export function HomeStayShot() {
  const ranks = [
    ["узи москва цена", "3", "5", "назвали"],
    ["узи на дому", "8", "11", "нет"],
    ["узи рядом с метро", "14", "9", "назвали"],
  ];
  const tasks = [
    ["Цена на /uzi", "сегодня"],
    ["Регион в Вебмастере", "завтра"],
    ["Открыть /vrachi роботу", "чт"],
    ["Title без капслока", "пт"],
  ];
  return (
    <figure>
      <div className="min-w-0 overflow-x-auto border border-line bg-paper text-left shadow-[0_18px_40px_rgba(40,24,8,0.08)]">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-bg px-3 py-2">
          <span className="wordmark text-[10px] text-orange">INSONT</span>
          <span className="truncate text-[11px] text-muted">СМ-Клиника · неделя 12–18 авг</span>
        </div>
        <div className="p-3">
          <div className="text-[13px] font-semibold">Одна строка, не три сервиса</div>
          <p className="mt-0.5 text-[11px] text-muted">Яндекс, Google и назвали ли в GigaChat</p>
          <div className="table-wrap mt-2">
            <table className="data min-w-[16rem]">
              <thead>
                <tr>
                  <th>Запрос</th>
                  <th>Я</th>
                  <th>G</th>
                  <th>GigaChat</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((r) => (
                  <tr key={r[0]}>
                    <td className="font-medium">{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td className={r[3] === "назвали" ? "text-good" : "text-muted"}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 border border-line bg-bg px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] font-semibold">Черновик title</div>
              <span className="text-[11px] font-semibold text-orange">ждёт вашего ок</span>
            </div>
            <p className="mt-2 text-[13px] leading-snug">УЗИ в Москве: цена, запись, без очереди</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              На сайт не уедет, пока не подтвердите. Можно вернуть на правку.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-sm border border-line bg-paper px-2.5 py-1 text-[11px] font-semibold">
                Отклонить
              </span>
              <span className="rounded-sm bg-orange px-2.5 py-1 text-[11px] font-semibold text-white">
                Ок, публиковать
              </span>
            </div>
          </div>

          <div className="mt-3 text-[13px] font-semibold">На эту неделю · 4 дела</div>
          <p className="mt-0.5 text-[11px] text-muted">Не аудит на 80 страниц</p>
          <ul className="mt-2 border-t border-line text-[12px]">
            {tasks.map((t) => (
              <li
                key={t[0]}
                className="flex min-w-0 items-baseline justify-between gap-2 border-b border-line py-2"
              >
                <span className="min-w-0 break-words font-medium">{t[0]}</span>
                <span className="shrink-0 text-muted">{t[1]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        Кабинет: место в поиске, цитата модели и очередь на неделю. Публикация только после вашего согласия.
      </figcaption>
    </figure>
  );
}

function ValueIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-6 w-6",
  };
  switch (name) {
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12z" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M8 7h12M8 12h12M8 17h8" />
          <circle cx="4.2" cy="7" r="1" />
          <circle cx="4.2" cy="12" r="1" />
          <circle cx="4.2" cy="17" r="1" />
        </svg>
      );
    case "two":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="12" r="5" />
          <circle cx="15.5" cy="12" r="5" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M3 12V4h8l10 10-8 8L3 12z" />
          <circle cx="8" cy="8" r="1.2" />
        </svg>
      );
    case "unlink":
      return (
        <svg {...common}>
          <path d="M9 11H6a4 4 0 0 0 0 8h4M15 13h3a4 4 0 0 0 0-8h-4" />
          <path d="M8 8l8 8" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case "pen":
      return (
        <svg {...common}>
          <path d="M4 20h4l11-11-4-4L4 16v4z" />
          <path d="M13 7l4 4" />
        </svg>
      );
    case "gap":
      return (
        <svg {...common}>
          <path d="M4 8h6M14 8h6M4 16h6M14 16h6M10 8v8M14 8v8" />
        </svg>
      );
    case "cal":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M8 3.5V7M16 3.5V7M3.5 10h17" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M6 12l4 4 8-9" />
        </svg>
      );
  }
}

const VALUES = [
  {
    icon: "eye",
    t: "Смотрим сайт так, как его открывает человек и как его читает робот",
    d: "Владелец видит макет. Поиск видит код, регион и пустую карточку. Мы кладём оба взгляда в одну очередь работ.",
  },
  {
    icon: "list",
    t: "На неделю оставляем пять–десять задач, а не простыню аудита",
    d: "Триста пунктов никто не закрывает. Сначала делаем то, что двигает заявки: ставим цену, проверяем регион, открываем закрытый раздел.",
  },
  {
    icon: "two",
    t: "Яндекс и Google ведём вместе",
    d: "В коммерции чаще кормит Яндекс. В B2B и справочных запросах сильнее Google. Bing подхватывает те же страницы. Мы не выбираем «один поисковик навсегда».",
  },
  {
    icon: "tag",
    t: "Цифры берём с вашей витрины, а не придумываем",
    d: "Ставка, цена приёма и срок доставки должны быть такими же, как в отделении или на складе. Иначе юрист не согласует текст, а модель процитирует чужой сайт.",
  },
  {
    icon: "unlink",
    t: "Ссылки не покупаем",
    d: "Не работаем с биржами, сетками сайтов и «разгоном ИКС». Если нужна цитата, несём факт туда, откуда модели уже читают.",
  },
  {
    icon: "pin",
    t: "Регион пишем как есть, без выдуманных офисов",
    d: "Город в Вебмастере, карточка в Яндекс Бизнесе и адрес на сайте совпадают. Посадочную делаем только там, где вы реально работаете.",
  },
  {
    icon: "pen",
    t: "Текст можно прочитать вслух коллеге",
    d: "Без «комплексного подхода» и простыни ключей. Если фразу стыдно сказать человеку, её не публикуем.",
  },
  {
    icon: "gap",
    t: "Сначала чиним то, без чего сайт не работает. Статью пишем потом",
    d: "Если на карточке услуги нет цены, гид «как выбрать» никому не поможет: человек и поиск уйдут к тому, у кого цифра на виду. Если робот не может открыть страницу, GigaChat оттуда ничего не процитирует. Сначала ставим цену, открываем доступ, потом пишем текст.",
  },
  {
    icon: "cal",
    t: "Сроки спокойные: смотрим результат через две и четыре недели",
    d: "Топ за неделю не обещаем. Если позиции не выросли, переписываем смысл страницы, а не докупаем ссылки.",
  },
  {
    icon: "ok",
    t: "Ничего не уезжает на сайт без вашего согласия",
    d: "Черновик заголовка, блок вопросов и файл robots смотрите вы. Можно отклонить. Кабинет не публикует правки сам.",
  },
];

export function HomeValues() {
  return (
    <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Как работаем
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
        Что делаем на неделе и чего не обещаем
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Пять-десять задач, публикация только после вашего согласия, замер через
        две и четыре недели. Ниже по пунктам: кто смотрит сайт, как ведём Яндекс
        и Google, откуда берём цифры.
      </p>
      <ol className="reveal-stagger mt-10 grid gap-4 sm:grid-cols-2">
        {VALUES.map((v, i) => (
          <li key={v.t} className="tile flex gap-4 p-5">
            <span className="tile-icon icon-sheen flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[#b4531e]">
              <ValueIcon name={v.icon} />
            </span>
            <div>
              <div className="text-xs font-bold tabular-nums text-orange">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-1 text-lg leading-snug">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const FINDS = [
  { where: "/blog", what: "Закрыт в robots. Владелец думал, что «блог для людей». Робот GigaChat туда не заходит.", who: "Не видит владелец" },
  { where: "/uzi", what: "Нет цены и врача. SEO писал ещё один текст «что такое УЗИ».", who: "Не видит подрядчик" },
  { where: "Вебмастер", what: "Регион «вся Россия», заявки из Казани. Локальные запросы уезжают.", who: "Не видит отчёт Keys.so" },
  { where: "14 услуг", what: "Один и тот же title. В выдаче строки слипаются.", who: "Не видит макет в Figma" },
  { where: "/vrachi/ivanov", what: "Человеку 200, роботу 403. Карточку не индексируют.", who: "Не видит Метрика" },
];

const COMPARE = [
  {
    icon: "list",
    other: "Аудит на триста пунктов. Закрывают десять, остальное лежит в PDF.",
    us: "На неделю пять–десять задач: цена, регион, закрытый раздел.",
  },
  {
    icon: "two",
    other: "Ведут «только Яндекс» или «только Google» и спорят, чей отчёт главный.",
    us: "Яндекс и Google в одной очереди. Bing подхватывает те же страницы.",
  },
  {
    icon: "unlink",
    other: "Пакет ссылок, сетка сайтов, разгон ИКС. Потом фильтр.",
    us: "Ссылки не покупаем. Если нужна цитата, несём факт туда, откуда уже читают.",
  },
  {
    icon: "tag",
    other: "Цифры «для сниппета». Юрист потом неделю снимает текст.",
    us: "Ставка и срок как в отделении. Иначе модель процитирует чужой сайт.",
  },
  {
    icon: "pin",
    other: "Регион «вся Россия» и посадочные-клоны под каждый город.",
    us: "Город в Вебмастере, карточке и на сайте совпадают. Клонов нет.",
  },
  {
    icon: "pen",
    other: "Простыня ключей и «комплексный подход» в каждом абзаце.",
    us: "Текст можно прочитать вслух коллеге. Если стыдно сказать, не публикуем.",
  },
  {
    icon: "gap",
    other: "Сначала сто статей в блог. Витрина пустая.",
    us: "Сначала цена и доступ роботу. Статью пишем потом.",
  },
  {
    icon: "ok",
    other: "Генератор заливает текст сам. Кабинет живёт без вас.",
    us: "Черновик заголовка и robots смотрите вы. Можно отклонить.",
  },
];

export function HomeCompare() {
  return (
    <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Сравнение
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">У других и у нас</h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Не слайд «чем мы лучше рынка». Обычные развилки, которые всплывают на
        старте: ссылки, регион, кто жмёт «опубликовать».
      </p>
      <div className="compare-wrap mt-8">
        <div className="hidden grid-cols-[auto_1fr_1fr] sm:grid">
          <div className="bg-bg px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Развилка
          </div>
          <div className="bg-bg px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            У других
          </div>
          <div className="bg-bg px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-orange">
            У INSONT
          </div>
        </div>
        <ul className="list-none">
          {COMPARE.map((row) => (
            <li
              key={row.us}
              className="compare-row grid gap-3 border-t border-line p-4 sm:grid-cols-[auto_1fr_1fr] sm:items-start sm:gap-6"
            >
              <span className="tile-icon icon-sheen flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#b4531e]">
                <ValueIcon name={row.icon} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted sm:hidden">
                  У других
                </div>
                <p className="mt-1 text-[15px] font-semibold leading-relaxed text-muted sm:mt-0">
                  {row.other}
                </p>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-orange sm:hidden">
                  У INSONT
                </div>
                <p className="mt-1 text-[15px] font-bold leading-relaxed sm:mt-0">{row.us}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeRobots() {
  return (
    <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        robots.txt
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
        Знаем, кого пускает файл — и кого зря закрыли
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Яндекс, Google и робот GigaChat читают robots.txt до страницы. Если блог
        или услуга закрыты «для людей», индекс пустой, а модель берёт агрегатор.
        Смотрим строки по роботу, не одним запретом на всех. Черновик файла
        подтверждаете вы.
      </p>
      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2">
        <RobotsFileMock />
        <RobotsBotsMock />
      </div>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed">
        Это не «валидный синтаксис». Это очередь: открыть /uzi, оставить
        закрытым /kabinet, прописать Sitemap. Дальше —{" "}
        <Link href="/seo/robots-txt" className="font-semibold text-orange">
          как мы читаем robots.txt
        </Link>
        ,{" "}
        <Link href="/seo/tekhnicheskiy-audit" className="font-semibold text-orange">
          технический аудит
        </Link>{" "}
        и{" "}
        <Link href="/instrumenty/proverka-krawlerov" className="font-semibold text-orange">
          проверка роботов
        </Link>
        .
      </p>
    </section>
  );
}

export function HomeLandings() {
  return (
    <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Посадочные страницы
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
        Один вопрос — один URL. Город только свой
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Кластер из Wordstat без страницы ничего не двигает. Страница без цены и
        города проигрывает витрине в топе. Клоны на все метро не делаем:
        посадочная там, куда можно приехать. Статья тянет услугу живым анкором.
      </p>
      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2">
        <LandingsListMock />
        <LandingsLinksMock />
      </div>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed">
        Как собираем список и связываем страницы — в разделе{" "}
        <Link href="/seo/posadochnye" className="font-semibold text-orange">
          посадочных
        </Link>
        . Ядро берём из{" "}
        <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
          семантики Wordstat
        </Link>
        , доступ роботу проверяем в{" "}
        <Link href="/seo/robots-txt" className="font-semibold text-orange">
          robots.txt
        </Link>
        .
      </p>
    </section>
  );
}

export function HomeScanner() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Агент проверяет сайт
          </p>
          <h2 className="mt-3 text-4xl leading-tight md:text-5xl">
            Находит то, что не видит владелец и часто пропускает SEO
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#3a3632]">
            Владелец смотрит красивую вёрстку. Подрядчик смотрит позиции и
            просит ещё семантики. Агент заходит на сайт так же, как Яндекс,
            Google, GPTBot и GigaChat: читает robots, коды ответа, пустые
            карточки, одинаковые заголовки и регион в Вебмастере.
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-[#3a3632]">
            Чаще всего дело не в том, что мало статей. Закрыт раздел, цена
            лежит только в PDF, страница врача открывается человеку и отдаёт
            роботу ошибку. Это чинят раньше, чем пишут новый длинный текст.
            Разбор уходит в{" "}
            <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
              очередь на неделю
            </Link>
            , а не в отчёт на восемьдесят страниц.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/platforma/ii-agenty" className="btn-primary">
              Как устроен агент
            </Link>
            <Link href="/instrumenty/proverka-krawlerov" className="btn-outline">
              Проверить, видят ли роботы сайт
            </Link>
          </div>
        </div>
        <div className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Проверка sm-clinic.example</div>
              <p className="text-xs text-muted">Яндекс, Google, GPTBot и GigaChat, около четырёх минут</p>
            </div>
            <span className="rounded-full bg-[#fff1e8] px-2.5 py-0.5 text-[11px] font-semibold text-orange">
              5 находок
            </span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {FINDS.map((f) => (
              <li key={f.where} className="rounded-2xl bg-[#fbf7f0] px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[12px]">{f.where}</span>
                  <span className="text-[11px] text-muted">{f.who}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[#3a3632]">{f.what}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Пример. На вашем домене список будет другим. Публиковать ничего не
            будем, пока не скажете.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeStrategies() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Как расти, а не плодить страницы
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
        Две стратегии и одна очередь на неделю
      </h2>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        Поиск без нормальных текстов оставляет пустые заголовки на мёртвых
        страницах. Тексты без спроса превращаются в блог, который никто не
        ищет. Ниже два плана. Их можно читать отдельно, а работы они ставят
        в один список.
      </p>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <article className="card flex flex-col p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange">Для роста в поиске</p>
          <h3 className="mt-2 text-3xl">SEO-стратегия</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#3a3632]">
            Спрос в Wordstat и Google, витрина, регион, техника, замер. Сначала
            закрываем то, без чего Яндекс не пускает коммерцию. Потом тексты.
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm leading-relaxed">
            <li>Ядро и кластеры режем по смыслу, а не сваливаем всё на одну страницу</li>
            <li>Ставим цены, контакты, доставку и регион в Вебмастере</li>
            <li>Пишем честные заголовки, без капслока</li>
            <li>Яндекс и Google ведём в одном цикле</li>
          </ul>
          <Link href="/strategiya/seo" className="mt-6 text-sm font-semibold text-orange">
            Открыть SEO-стратегию →
          </Link>
        </article>
        <article className="card flex flex-col p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange">Для смысла на сайте</p>
          <h3 className="mt-2 text-3xl">Контент-стратегия</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#3a3632]">
            Какие страницы писать, какие не писать и каким голосом. Чтобы модель
            могла взять абзац, а человек записался, не читая «пользу».
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm leading-relaxed">
            <li>Сначала карточка услуги и ответы на вопросы, потом длинный гид</li>
            <li>Темы берём из спроса, а не из календаря «на всякий случай»</li>
            <li>Один голос на сайте, в Дзене и в ответе на VC</li>
            <li>Снять дубли важнее, чем написать десятую статью</li>
          </ul>
          <Link href="/strategiya/kontent" className="mt-6 text-sm font-semibold text-orange">
            Открыть контент-стратегию →
          </Link>
        </article>
      </div>
      <p className="mt-6 text-sm text-muted">
        Обе стратегии сходятся в{" "}
        <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
          Центре действий
        </Link>
        . Общий вход —{" "}
        <Link href="/strategiya" className="font-semibold text-orange">
          раздел «Стратегии»
        </Link>
        .
      </p>
    </section>
  );
}
