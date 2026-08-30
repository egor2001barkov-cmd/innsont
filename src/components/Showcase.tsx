import type { ReactNode } from "react";
import Link from "next/link";
import { formatRub, PLANS } from "@/lib/site";
import { Icon, IndustryIcon } from "./Icons";
import { ReviewsCarousel } from "./ReviewsCarousel";

export function HeroPlanStrip() {
  return (
    <nav aria-label="Тарифы" className="mx-auto mt-5 w-full min-w-0 max-w-xl md:hidden">
      <p className="mb-2 text-center text-[11px] font-semibold text-muted">
        Подписка · год −10%
      </p>
      <div className="grid grid-cols-3 gap-2">
        {PLANS.map((p) => (
          <Link
            key={p.id}
            href={`/registratsiya?plan=${p.id}&period=annual`}
            className={`min-w-0 overflow-hidden rounded-2xl border px-2 py-2.5 text-left ${
              p.popular
                ? "border-orange bg-orange-soft ring-1 ring-orange/25"
                : "border-line bg-paper"
            }`}
          >
            <span className="block truncate text-[11px] font-extrabold leading-none">
              {p.name}
            </span>
            <span className="mt-1.5 block text-[13px] font-extrabold leading-tight tracking-tight">
              {formatRub(p.priceAnnual)}
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold text-muted">/мес</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function StepBadge({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange/40 text-xs font-bold text-orange">
        {n}
      </span>
      <span className="text-sm font-bold uppercase tracking-[0.16em] text-orange">
        {label}
      </span>
    </div>
  );
}

export function ActionCenterShowcase() {
  return (
    <div className="card p-5 shadow-[0_20px_50px_rgba(40,24,8,0.08)] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Центр действий</div>
          <p className="text-xs text-muted">Рекомендации после последнего прогона видимости</p>
        </div>
        <span className="rounded-full bg-[#eaf6ee] px-3 py-1 text-xs font-medium text-good">
          ● Следующий прогон · 10:51
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-y-4 rounded-2xl bg-[#f6f1e8] px-4 py-4 sm:grid-cols-4 sm:gap-y-0">
        {[
          ["Открыто", "287"],
          ["В работе", "42"],
          ["Закрыто", "156"],
          ["Прирост видимости", "+12,4%"],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col items-center text-center">
            <div className="h-8 max-w-[9.5rem] text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-muted">
              {k}
            </div>
            <div
              className={`font-sans text-[32px] font-bold leading-none tracking-[-0.03em] [font-variant-numeric:tabular-nums] whitespace-nowrap ${
                v.startsWith("+") ? "text-good" : "text-ink"
              }`}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {[
          {
            icon: "chat",
            t: "Внешние упоминания",
            d: "VC, Дзен, Telegram, отраслевые СМИ",
            n: "132",
            prio: "Высокий",
            href: "/deystvovat",
          },
          {
            icon: "doc",
            t: "Новый контент",
            d: "Темы, которые уже заняли конкуренты",
            n: "49",
            prio: "Высокий",
            href: "/platforma/avtor-statey",
          },
          {
            icon: "refresh",
            t: "Обновить страницы",
            d: "Схема, FAQ, свежие цифры",
            n: "75",
            prio: "Средний",
            href: "/seo/kontent",
          },
          {
            icon: "wrench",
            t: "Технические ошибки",
            d: "Обход, схема, индекс Вебмастера",
            n: "36",
            prio: "Высокий",
            href: "/seo/tekhnicheskiy-audit",
          },
        ].map((row) => (
          <div
            key={row.t}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#fbf7f0] px-3 py-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#8a5a38]">
              <Icon name={row.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{row.t}</div>
              <div className="text-xs text-muted">{row.d}</div>
            </div>
            <span className="text-xs text-muted">{row.n} задач</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                row.prio === "Высокий" ? "bg-[#eaf6ee] text-good" : "bg-[#fff4e5] text-[#c47a12]"
              }`}
            >
              {row.prio}
            </span>
            <Link
              href={row.href}
              className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold hover:border-orange"
            >
              Исправить →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActTrio() {
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3">
      <article className="card flex h-full flex-col p-5">
        <div className="min-h-0 flex-1 rounded-2xl bg-[#f6f1e8] p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold">Норд Ран 3</div>
              <div className="text-xs text-muted">Карточка товара</div>
            </div>
            <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase text-muted">
              Доля цитат 3,4% <span className="text-good">+1,8%</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
            <span>4 проблемы бьют по видимости</span>
            <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 font-semibold text-orange">
              Агент правит
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Нет схемы Product", "Исправлено", "good"],
              ["Тонкий FAQ", "Правим", "orange"],
              ["Ответ не в первом абзаце", "В очереди", "muted"],
              ["Сломана иерархия H1–H3", "В очереди", "muted"],
            ].map(([t, s, c]) => (
              <li key={t} className="flex items-center justify-between gap-2">
                <span>{t}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    c === "good"
                      ? "bg-[#eaf6ee] text-good"
                      : c === "orange"
                        ? "bg-[#fff1e8] text-orange"
                        : "bg-white text-muted"
                  }`}
                >
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <h3 className="mt-auto pt-5 text-xl">
          Контент, который <span className="text-orange">цитируют</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Дописываем карточку: вопросы и ответы, таблицу и абзац, который модель
          может взять целиком. Когда цитату берут с вашего сайта, следом растут
          позиции в Яндексе.
        </p>
      </article>

      <article className="card flex h-full flex-col p-5">
        <div className="min-h-0 flex-1 space-y-2">
          <div className="rounded-2xl bg-[#f6f1e8] px-3 py-2 text-xs text-muted">
            Wikipedia · Список беговых брендов
          </div>
          <div className="rounded-2xl bg-[#f6f1e8] px-3 py-2 text-xs text-muted">
            YouTube · 284 тыс. · Топ кроссовок 2026
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-xs font-semibold">vc.ru · подборка</div>
            <div className="mt-1 text-[11px] text-muted">Попало в ChatGPT и GigaChat · 12,4k</div>
            <p className="mt-3 text-sm font-medium">
              Какие кроссовки взять на первый марафон? Бюджет ~15 000 ₽
            </p>
            <p className="mt-2 text-sm text-muted">
              На марафон смотрел бы Hoka Bondi или Asics Nimbus — много отзывов у
              тех, кто бегает каждый день.
            </p>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-orange">2 конкурента, вас 0×</span>
              <Link href="/kabinet/deystviya" className="font-semibold text-orange">
                Черновик ответа →
              </Link>
            </div>
          </div>
        </div>
        <h3 className="mt-auto pt-5 text-xl">
          Внешние <span className="text-orange">цитаты</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          85% цитат ИИ приходят не с вашего домена. Находим VC, Дзен, Telegram и
          обзоры, где есть конкурент — и готовим честный аутрич. Без бирж ссылок.
        </p>
      </article>

      <article className="card flex h-full flex-col p-5">
        <div className="min-h-0 flex-1 rounded-2xl bg-[#111] p-4 font-mono text-[12px] leading-6 text-[#d7d0c6]">
          <div className="mb-2 flex items-center justify-between text-[11px] text-white/60">
            <span>/robots.txt</span>
            <span className="rounded-full bg-[#3a2018] px-2 py-0.5 text-orange">1 закрыт</span>
          </div>
          <div>User-agent: GPTBot</div>
          <div>Allow: /</div>
          <div>User-agent: Yandex</div>
          <div>Allow: /</div>
          <div className="bg-[#4a1f1f] text-[#f0a0a0]">− Disallow: /</div>
          <div className="bg-[#1d3a28] text-[#9ee0b0]">+ Allow: /</div>
          <div>User-agent: GigaChat</div>
          <div>Allow: /</div>
          <div className="mt-2 flex justify-between text-[11px] text-[#9ee0b0]">
            <span>✓ Автофикс готов</span>
            <span>Применить →</span>
          </div>
        </div>
        <h3 className="mt-auto pt-5 text-xl">
          Откройте сайт <span className="text-orange">ИИ-краулерам</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Проверяем robots.txt, схему и индекс. Ловим 404, которые видят GPTBot,
          Yandexbot и краулер GigaChat. Правка — в один клик, после вашего «ок».
        </p>
      </article>
    </div>
  );
}

export function SeoBridge() {
  return (
    <div className="relative mx-auto max-w-3xl py-6">
      <div className="flex justify-between text-xs font-semibold text-muted">
        <span className="rounded-full border border-line bg-paper px-3 py-1">SEO-платформы</span>
        <span className="rounded-full border border-line bg-paper px-3 py-1">ИИ-трекеры</span>
      </div>
      <svg viewBox="0 0 640 180" className="mt-2 w-full" aria-hidden>
        <path
          d="M40 140 C80 140 90 40 160 40 L220 40"
          fill="none"
          stroke="#d9d0c3"
          strokeWidth="10"
        />
        <path
          d="M420 40 L480 40 C550 40 560 140 600 140"
          fill="none"
          stroke="#d9d0c3"
          strokeWidth="10"
        />
        <rect x="210" y="28" width="220" height="90" rx="8" fill="#ff6a2b" />
        <rect x="226" y="118" width="24" height="40" fill="#e45518" />
        <rect x="390" y="118" width="24" height="40" fill="#e45518" />
        <text
          x="320"
          y="82"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontFamily="Onest, sans-serif"
          fontWeight="700"
        >
          INSONT
        </text>
      </svg>
    </div>
  );
}

export function ScaleCards() {
  const cards = [
    {
      href: "/resheniya/krupnyy-biznes",
      title: "Крупный бизнес",
      color: "text-orange",
      text: "Видимость в поиске и нейросетях на масштабе холдинга: несколько брендов, отчёты для совета, выделенный стратег, 152-ФЗ и единый вход.",
      accent: "Клиенты конкурентов уходят к нам уже из-за поддержки.",
      tags: [] as string[],
      tagClass: "",
      cta: "Заказать демо",
    },
    {
      href: "/resheniya/agentstva",
      title: "Агентства",
      color: "text-[#5b4db1]",
      text: "Превратите видимость в новую линию выручки: кабинет под своим брендом, портфель клиентов и партнёрские ставки.",
      accent: "",
      tags: ["Под своим брендом", "Партнёрские ставки", "Презентации"],
      tagClass: "bg-[#ece8fb] text-[#5b4db1]",
      cta: "Заказать демо",
    },
    {
      href: "/resheniya/komandy-rosta",
      title: "Команды роста",
      color: "text-[#1f8a4c]",
      text: "Конкурируйте так, будто штат в десять раз больше: готовые сценарии, приоритеты и очередь работ на неделю.",
      accent: "",
      tags: ["5 запросов бесплатно", "Без карты"],
      tagClass: "bg-[#e7f6ec] text-[#1f8a4c]",
      cta: "Заказать демо",
    },
    {
      href: "/resheniya/internet-magaziny",
      title: "Интернет-магазины",
      color: "text-[#c47a12]",
      text: "Товары попадают в рекомендации ChatGPT и в выдачу Яндекса и Google. Смотрим фиды, артикулы, Ozon и Wildberries.",
      accent: "",
      tags: ["Товарные подборки", "Реклама в ChatGPT и Google"],
      tagClass: "bg-[#fff4d6] text-[#8a5a00]",
      cta: "Заказать демо",
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <article key={c.title} className="card flex flex-col p-6">
          <h3 className={`text-xl font-semibold ${c.color}`}>{c.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.text}</p>
          {c.accent && <p className="mt-4 text-sm font-semibold text-orange">{c.accent}</p>}
          {c.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span key={t} className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${c.tagClass}`}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <Link href={c.href} className="btn-outline mt-6 w-full">
            {c.cta}
          </Link>
        </article>
      ))}
    </div>
  );
}

export function HomeWhatWeDo() {
  const pillars = [
    {
      n: "01",
      title: "Продвигаем сайт в поиске",
      lead: "Чтобы вас находили в Яндексе и Google по тем запросам, с которых приходят заявки.",
      href: "/seo",
      items: [
        "Собираем ядро из Wordstat: частота, регион, «хвосты»",
        "Закрываем витрину: цены, контакты, оплата, доставка",
        "Ставим честные title и description, без переспама",
        "Смотрим Яндекс Вебмастер, не только Search Console",
      ],
    },
    {
      n: "02",
      title: "Поднимаем бренд в нейросетях",
      lead: "Чтобы GigaChat, ChatGPT и Алиса называли вас, а не только конкурента.",
      href: "/platforma/monitoring-vidimosti",
      items: [
        "Следим, в каких ответах вас уже есть и где пока пусто",
        "Открываем сайт краулерам GPTBot, Yandex и GigaChat",
        "Пишем короткие ответы и FAQ, которые модели цитируют",
        "Ищем чужие обзоры, откуда ИИ берёт факты",
      ],
    },
    {
      n: "03",
      title: "Делаем работу, а не копим отчёты",
      lead: "Кабинет ставит очередь на неделю и готовит правки. Вы подтверждаете, затем публикуем.",
      href: "/priorizirovat",
      items: [
        "Центр действий оставляет пять–десять задач с самым сильным эффектом",
        "Агенты пишут тексты, метатеги и чинят техничку",
        "Публикуем на сайт или отдаём черновик на согласование",
        "Смотрим позиции и цитаты на 14-й и 28-й день",
      ],
    },
  ];
  return (
    <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Чем занимается INSONT
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">Три вещи, которые делает сервис</h2>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        Это не биржа ссылок и не «ещё один дашборд». Подключаете сайт — платформа
        чинит выдачу в поиске и упоминания в нейросетях. Только белыми методами.
      </p>
      <div className="reveal-stagger mt-10 grid gap-4 lg:grid-cols-3">
        {pillars.map((p) => (
          <article key={p.n} className="card flex flex-col p-6">
            <div className="text-sm font-bold text-orange">{p.n}</div>
            <h3 className="mt-2 text-2xl">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.lead}</p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm leading-relaxed">
              {p.items.map((it) => (
                <li key={it} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <Link href={p.href} className="mt-6 text-sm font-semibold text-orange">
              Подробнее →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeWho() {
  const items = [
    { href: "/resheniya/internet-magaziny", t: "Интернет-магазины", d: "Карточки с ценой, наличием и доставкой по городам", icon: "shop" },
    { href: "/resheniya/kliniki", t: "Клиники", d: "Страницы услуг и врачей, запись, карточка в Яндекс Бизнесе", icon: "clinic" },
    { href: "/resheniya/stomatologii", t: "Стоматологии", d: "Вилка цен, врачи, карты, запись с поиска", icon: "clinic" },
    { href: "/resheniya/okna", t: "Окна и рольставни", d: "Цена на створку, замер, район только с выездом", icon: "realty" },
    { href: "/resheniya/zastroyshchiki", t: "Застройщики", d: "Посадочные корпусов, районы, сроки сдачи и ипотека", icon: "realty" },
    { href: "/resheniya/banki", t: "Банки и финтех", d: "Вклады, ИИС и тарифы без выдуманной доходности", icon: "bank" },
    { href: "/resheniya/saas", t: "SaaS и IT", d: "Сравнения, документация и запросы «какой сервис выбрать»", icon: "saas" },
    { href: "/resheniya/obrazovanie", t: "Образование", d: "Карточки курсов с программой, ценой и набором", icon: "edu" },
    { href: "/resheniya/agentstva", t: "Агентства", d: "Кабинет под своим брендом и партнёрка 20 процентов", icon: "agency" },
    { href: "/resheniya/komandy-rosta", t: "Команды роста", d: "Один кабинет вместо трёх разрозненных сервисов", icon: "growth" },
  ];
  return (
    <section className="bg-[#111] text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">Для кого</p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">Сайты, у которых заявки идут из поиска</h2>
        <p className="mt-4 max-w-2xl text-white/70">
          Если клиент гуглит услугу или спрашивает нейросеть «что выбрать» — вам сюда.
          Не подходит тем, кому нужен топ за неделю любой ценой.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-orange/50 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange ring-1 ring-white/10">
                <IndustryIcon name={it.icon} className="h-6 w-6" />
              </span>
              <div className="mt-4 text-lg font-semibold">{it.t}</div>
              <p className="mt-2 text-sm text-white/60">{it.d}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCabinet() {
  const blocks = [
    {
      href: "/seo/semantika-wordstat",
      t: "Семантика",
      d: "Запросы из Wordstat, кластеры, регион. Понятно, какие страницы писать.",
    },
    {
      href: "/seo/metategi",
      t: "Метатеги",
      d: "Title и description под сниппет Яндекса. Без капслока и ключей в ряд.",
    },
    {
      href: "/seo/kommercheskie-faktory",
      t: "Витрина",
      d: "Цены, контакты, оплата и доставка: то, без чего коммерция не попадает в топ.",
    },
    {
      href: "/platforma/monitoring-vidimosti",
      t: "ИИ-видимость",
      d: "GigaChat, ChatGPT, YandexGPT, Алиса: где вас советуют, а где нет.",
    },
    {
      href: "/platforma/avtor-statey",
      t: "Статьи и FAQ",
      d: "Тексты для людей. Не простыни с ключами.",
    },
    {
      href: "/seo/tekhnicheskiy-audit",
      t: "Техника",
      d: "Индекс, скорость, robots, схема, ошибки Вебмастера.",
    },
  ];
  return (
    <section className="reveal mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">Что внутри</p>
      <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">В кабинете всё в одном месте</h2>
      <p className="mt-4 max-w-2xl text-muted">
        Не нужно держать отдельно Keys.so, копирайтера и «трекер нейросетей».
        Очередь одна — от семантики до цитаты в GigaChat.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((b) => (
          <Link key={b.href} href={b.href} className="card card-hover p-6">
            <h3 className="text-xl">{b.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{b.d}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomeMidBanner() {
  return (
    <section className="px-5 py-8">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[28px] bg-[#ff6a2b] px-8 py-12 text-white md:px-14">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">
          Коротко
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
          INSONT продвигает сайт в топ Яндекса и в ответы нейросетей
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["5 запросов", "можно попробовать без карты и без звонка менеджера"],
            ["От 4 990 ₽", "Старт. Год дешевле на 10%. Возврат 7 дней"],
            ["Только белое", "без накрутки ПФ, ссылок и обещания топа за неделю"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white/15 px-5 py-4">
              <div className="text-xl font-semibold">{t}</div>
              <p className="mt-1 text-sm text-white/85">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registratsiya"
            className="inline-flex rounded-full bg-white/20 px-6 py-3 font-bold text-white ring-2 ring-white hover:bg-white/30"
          >
            Попробовать 5 запросов
          </Link>
          <Link
            href="/tseny"
            className="inline-flex rounded-full bg-white/20 px-6 py-3 font-bold text-white ring-2 ring-white hover:bg-white/30"
          >
            Смотреть тарифы
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePlansTeaser() {
  const plans = [
    {
      name: "Старт",
      price: "4 990 ₽",
      who: "Один человек, проверка гипотезы",
      items: ["ChatGPT и GigaChat", "5 статей в месяц", "1 проект"],
    },
    {
      name: "Базовый",
      price: "11 990 ₽",
      who: "Штатный SEO и контент",
      items: ["Плюс YandexGPT и Gemini", "20 статей", "Регулярный трекинг"],
      popular: true,
    },
    {
      name: "Рост",
      price: "24 990 ₽",
      who: "Агентство или команда с очередью",
      items: ["Центр действий и агенты", "Алиса, Claude, Perplexity", "API"],
    },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">Тарифы</p>
      <h2 className="mt-3 text-4xl md:text-5xl">Три подписки. Год −10%</h2>
      <p className="mt-4 max-w-2xl text-muted">
        Платите в рублях, картой МИР или по счёту. 5 запросов бесплатно, потом
        выбираете тариф. Возврат 7 дней после оплаты.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`card flex flex-col p-6 ${p.popular ? "ring-1 ring-orange/40" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold">{p.name}</h3>
              {p.popular && (
                <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 text-[11px] font-extrabold text-orange">
                  Чаще берут
                </span>
              )}
            </div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight">{p.price}</div>
            <p className="text-sm font-bold text-muted">в месяц</p>
            <p className="mt-3 text-sm font-semibold text-[#3a3632]">{p.who}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm font-semibold">
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <Link href="/tseny" className="btn-outline mt-6 w-full">
              Сравнить тарифы
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppChrome({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  const items = [
    { icon: "search" as const, t: "Главная" },
    { icon: "doc" as const, t: "Мой контент" },
    { icon: "book" as const, t: "Стили" },
    { icon: "chart" as const, t: "SEO" },
    { icon: "eye" as const, t: "Ответы" },
    { icon: "bolt" as const, t: "Очередь" },
  ];
  return (
    <div className="min-w-0 overflow-x-auto border border-line bg-paper text-left shadow-[0_18px_40px_rgba(40,24,8,0.08)]">
      <div className="flex min-h-[280px]">
        <aside className="hidden w-[158px] shrink-0 flex-col gap-0.5 border-r border-line bg-bg px-2 py-3 md:flex">
          <span className="wordmark mb-3 px-2 text-[9px] text-orange">INSONT</span>
          {items.map((it) => (
            <div
              key={it.t}
              className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-[12px] ${
                it.t === active ? "bg-paper font-semibold ring-1 ring-line" : "text-muted"
              }`}
            >
              <Icon name={it.icon} className="h-3.5 w-3.5 shrink-0" />
              {it.t}
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 p-3 md:p-4">{children}</div>
      </div>
    </div>
  );
}

export function HomeAppShots() {
  const files = [
    ["УЗИ, цена и запись", "СМ-Клиника", "Мария К.", "12 авг, 16:20"],
    ["Вклад в рублях, ставка", "Центр-инвест", "Артём С.", "11 авг, 12:04"],
    ["Окна в ЗАО, сроки", "Фабрика Окон", "Ольга П.", "10 авг, 19:11"],
    ["ИИС открыть онлайн", "МойСклад", "Мария К.", "8 авг, 09:40"],
  ];
  const ranks = [
    ["узи москва цена", "3", "5", "есть"],
    ["вклад в рублях 2026", "6", "4", "есть"],
    ["окна зао сроки", "11", "9", "нет"],
    ["иис открыть онлайн", "2", "7", "есть"],
  ];
  const tasks = [
    ["Цена на /uzi", "Витрина", "сегодня"],
    ["Регион в Вебмастере", "Яндекс", "завтра"],
    ["Title без капслока", "Сниппет", "чт"],
    ["Открыть /vrachi роботу", "Индекс", "пт"],
  ];
  const folders = ["СМ-Клиника", "МойСклад", "Фабрика Окон", "Черновики"];

  return (
    <section className="reveal mx-auto min-w-0 max-w-[1200px] px-5 pb-6 pt-4 text-left">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Как это выглядит
      </p>
      <h2 className="mt-3 max-w-3xl text-3xl md:text-4xl">
        Кабинет, а не слайды раз в месяц
      </h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
        Страницы, которые пишете. Где они стоят в Яндексе и Google. Что чинить
        на этой неделе. Три экрана из одной очереди — контент, выдача, задачи.
      </p>

      <div className="mt-8">
        <AppChrome active="Мой контент">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Поиск по страницам</span>
              <input
                readOnly
                value=""
                placeholder="Поиск по названию страницы"
                className="w-full min-w-0 rounded-sm border border-line bg-bg px-3 py-2 text-sm outline-none placeholder:text-muted"
              />
            </label>
            <span className="w-fit shrink-0 rounded-sm bg-orange px-3 py-2 text-[12px] font-semibold text-white">
              Новая страница
            </span>
          </div>
          <div className="mt-4 text-[12px] font-semibold text-muted">Папки</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {folders.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-2 border border-line bg-bg px-3 py-2 text-[12px]"
              >
                <Icon name="file" className="h-3.5 w-3.5 text-muted" />
                {f}
              </span>
            ))}
          </div>
          <div className="table-wrap mt-4">
            <table className="data min-w-[36rem]">
              <thead>
                <tr>
                  <th>Страница</th>
                  <th>Папка</th>
                  <th>Кто правил</th>
                  <th>Когда</th>
                </tr>
              </thead>
              <tbody>
                {files.map((r) => (
                  <tr key={r[0]}>
                    <td className="font-medium">{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td className="text-muted">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AppChrome>
        <p className="mt-2 text-sm text-muted">
          Мой контент: черновики и опубликованные страницы по проектам. Правка
          уезжает на сайт только после вашего «ок».
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <AppChrome active="SEO">
            <div className="text-[14px] font-semibold">Позиции · Москва</div>
            <p className="mt-0.5 text-[12px] text-muted">Яндекс, Google и назвали ли в GigaChat</p>
            <div className="table-wrap mt-3">
              <table className="data">
                <thead>
                  <tr>
                    <th>Запрос</th>
                    <th>Яндекс</th>
                    <th>Google</th>
                    <th>GigaChat</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((r) => (
                    <tr key={r[0]}>
                      <td className="font-medium">{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td className={r[3] === "есть" ? "text-good" : "text-muted"}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AppChrome>
          <p className="mt-2 text-sm text-muted">
            Выдача по городу, не «по России в среднем». Рядом — есть ли бренд в
            ответе модели.
          </p>
        </div>
        <div>
          <AppChrome active="Очередь">
            <div className="text-[14px] font-semibold">На эту неделю</div>
            <p className="mt-0.5 text-[12px] text-muted">Пять–десять дел, не триста пунктов аудита</p>
            <ul className="mt-3 min-w-0 border-t border-line text-[13px]">
              {tasks.map((t) => (
                <li
                  key={t[0]}
                  className="flex min-w-0 flex-wrap items-baseline justify-between gap-2 border-b border-line py-2.5"
                >
                  <span className="min-w-0 break-words font-medium">{t[0]}</span>
                  <span className="text-muted">
                    {t[1]} · {t[2]}
                  </span>
                </li>
              ))}
            </ul>
          </AppChrome>
          <p className="mt-2 text-sm text-muted">
            Сначала цена, регион, доступ роботу. Статью пишем, когда витрина уже
            не пустая.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeHeroSuite() {
  const nav = [
    { icon: "doc" as const, t: "Писать", on: false },
    { icon: "chart" as const, t: "SEO", on: true },
    { icon: "bot" as const, t: "Ответы", on: false },
  ];
  const tools = [
    {
      icon: "search" as const,
      t: "Исследование ключей",
      d: "Какие запросы в Wordstat и Google реально ищут",
      on: true,
      wide: true,
    },
    {
      icon: "scan" as const,
      t: "Проверка витрины",
      d: "Цена, регион, title. Без этого статья не помогает",
      on: false,
      wide: false,
    },
    {
      icon: "plug" as const,
      t: "Связки страниц",
      d: "С услуги на статью и обратно, без мёртвых разделов",
      on: false,
      wide: false,
    },
    {
      icon: "eye" as const,
      t: "Видимость в ответах",
      d: "Назвали ли вас в GigaChat и ChatGPT по этой теме",
      on: false,
      wide: false,
    },
    {
      icon: "chart" as const,
      t: "Спрос по городам",
      d: "Москва отдельно, Казань отдельно, не «вся Россия»",
      on: false,
      wide: false,
    },
  ];

  return (
    <div className="relative mx-auto mt-12 w-full min-w-0 max-w-[1040px] text-left">
      <div className="min-w-0 overflow-x-auto rounded-2xl border border-line bg-paper shadow-[0_24px_60px_rgba(40,24,8,0.10)]">
        <div className="flex md:min-h-[430px]">
          <aside className="hidden w-[86px] shrink-0 flex-col items-center border-r border-line bg-bg pt-4 md:flex">
            {nav.map((item) => (
              <div
                key={item.t}
                className={`mb-1 flex w-[70px] flex-col items-center rounded-xl px-2 py-2.5 ${
                  item.on ? "bg-paper ring-1 ring-line" : ""
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    item.on ? "bg-orange-soft text-orange" : "text-muted"
                  }`}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="mt-1 text-[11px] font-semibold">{item.t}</span>
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 p-4 md:p-6">
            <p className="text-[13px] leading-snug text-muted">
              Инструменты, чтобы понять, что писать и что чинить на сайте
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => (
                <div
                  key={tool.t}
                  className={`flex min-w-0 gap-3 rounded-2xl px-3 py-3 ${
                    tool.on
                      ? "bg-orange-soft ring-2 ring-orange"
                      : "bg-bg"
                  } ${tool.wide ? "sm:col-span-2" : ""}`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      tool.on ? "bg-orange text-white" : "bg-paper text-orange"
                    }`}
                  >
                    <Icon name={tool.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{tool.t}</div>
                    <p className="mt-0.5 text-[12px] leading-snug break-words text-muted">{tool.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute left-[6%] top-[12%] z-20 hidden h-[42%] w-[36%] overflow-visible md:block"
        viewBox="0 0 280 220"
        fill="none"
        aria-hidden
      >
        <path
          d="M24 18 C 8 92, 40 188, 248 168"
          stroke="#ff6a2b"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M232 156 l22 12 -24 8 z" fill="#ff6a2b" />
      </svg>

      <div className="relative z-10 mx-auto mt-4 w-full min-w-0 max-w-[440px] md:absolute md:right-5 md:top-[6%] md:mt-0 md:w-[min(100%,440px)]">
        <div className="min-w-0 rounded-2xl border border-line bg-paper p-4 text-left shadow-[0_28px_80px_rgba(40,24,8,0.18)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[15px] font-semibold">Исследование ключей</div>
            <div className="flex items-center gap-2 text-muted">
              <Icon name="help" className="h-4 w-4" />
              <Icon name="x" className="h-4 w-4" />
            </div>
          </div>
          <div className="mx-auto mt-5 flex h-[84px] w-[84px] items-center justify-center rounded-[26px] bg-orange-soft">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-paper text-orange shadow-sm">
              <Icon name="search" className="h-7 w-7" />
            </span>
          </div>
          <p className="mt-4 text-center text-[13.5px] leading-relaxed text-ink">
            Смотрим Wordstat и подсказки Google. Рядом — как часто ту же мысль
            задают GigaChat. Чтобы не писать текст, который никто не ищет.
          </p>
          <label className="mt-4 block min-w-0">
            <span className="sr-only">Тема или услуга</span>
            <input
              readOnly
              value=""
              placeholder="Введите услугу, город или тему"
              className="w-full min-w-0 rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm outline-none placeholder:text-muted"
            />
          </label>
          <div className="mt-3 flex flex-col gap-2 text-[12px] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2">
              Результат для
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-ink">
                <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
                  <rect width="16" height="4" fill="#fff" />
                  <rect y="4" width="16" height="4" fill="#0039a6" />
                  <rect y="8" width="16" height="4" fill="#d52b1e" />
                </svg>
                Россия
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="coin" className="h-3.5 w-3.5" />
              1 прогон из 5 бесплатных
            </span>
          </div>
          <div className="mt-4 flex sm:justify-end">
            <Link href="/seo/semantika-wordstat" className="btn-primary w-full px-5 sm:w-auto">
              Собрать ключи
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:h-[110px]" aria-hidden />
    </div>
  );
}

export function ProofCta() {
  return (
    <section className="rays mx-auto max-w-[1100px] px-5 py-16">
      <h2 className="max-w-2xl text-3xl md:text-4xl">
        Закажите демо. Покажем позиции в Яндексе и то, рекомендуют ли вас
        нейросети.
      </h2>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/demo" className="btn-primary px-8 py-3 text-base">
          Заказать демо
        </Link>
        <Link href="/registratsiya" className="btn-outline px-8 py-3 text-base">
          5 запросов бесплатно
        </Link>
      </div>
      <ReviewsCarousel />
    </section>
  );
}
