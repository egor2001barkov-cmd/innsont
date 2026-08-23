import { MockShell } from "./ExploreMocks";

export function MockActionQueue() {
  const rows = [
    { t: "Внешние упоминания", d: "VC, Дзен, Telegram", n: 4, p: "Высокий" },
    { t: "Новый текст", d: "Темы, которые уже заняли", n: 3, p: "Высокий" },
    { t: "Обновить страницы", d: "FAQ, дата, таблица", n: 5, p: "Средний" },
    { t: "Техника", d: "Обход, схема, индекс", n: 2, p: "Высокий" },
  ];
  return (
    <MockShell label="Очередь на неделю" hint="после вчерашнего прогона">
      <div className="mb-3 grid grid-cols-3 gap-2 border-b border-line pb-3 text-center">
        {[
          ["Открыто", "14"],
          ["В работе", "5"],
          ["Закрыто", "9"],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">{k}</div>
            <div className="text-xl font-bold tabular-nums">{v}</div>
          </div>
        ))}
      </div>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.t}
            className="flex items-center justify-between gap-3 border-b border-line py-2.5"
          >
            <div>
              <div className="text-sm font-semibold">{r.t}</div>
              <div className="text-[11px] text-muted">{r.d}</div>
            </div>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">{r.n}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  r.p === "Высокий" ? "bg-[#eaf6ee] text-good" : "bg-[#fff4e5] text-[#c47a12]"
                }`}
              >
                {r.p}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockPageFix() {
  const rows = [
    ["Нет схемы Product", "Сделали"],
    ["Тонкий FAQ", "Правим"],
    ["Ответ не в первом абзаце", "В очереди"],
    ["Старая цена в таблице", "В очереди"],
  ] as const;
  return (
    <MockShell label="Карточка «Норд Ран 3»" hint="доля цитат 3,4%">
      <ul className="space-y-2">
        {rows.map(([t, s]) => (
          <li
            key={t}
            className="flex items-center justify-between gap-3 border-b border-line py-2.5 text-sm"
          >
            <span>{t}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                s === "Сделали"
                  ? "bg-[#eaf6ee] text-good"
                  : s === "Правим"
                    ? "bg-[#fff1e8] text-orange"
                    : "bg-white text-muted"
              }`}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockOutreach() {
  return (
    <MockShell label="Где вас нет, а конкурент есть" hint="черновик ответа">
      <div className="rounded-2xl bg-[#f6f1e8] px-3 py-2 text-xs text-muted">
        vc.ru · подборка вкладов 2026
      </div>
      <p className="mt-3 text-sm font-medium">Какой вклад открыть, если боюсь курса?</p>
      <p className="mt-2 text-sm text-muted">
        В ответе GigaChat два банка. Вашего нет. На сайте ставка живая — её просто не взяли.
      </p>
      <div className="mt-3 flex justify-between text-xs">
        <span className="text-orange">2 конкурента, вы 0</span>
        <span className="font-semibold text-orange">Черновик →</span>
      </div>
    </MockShell>
  );
}

export function MockRobots() {
  return (
    <MockShell label="/robots.txt" hint="1 закрыт">
      <pre className="overflow-x-auto rounded-2xl bg-[#111] p-4 font-mono text-[12px] leading-6 text-[#d7d0c6]">
        {`User-agent: GPTBot
Allow: /
User-agent: Yandex
Allow: /
- Disallow: /blog
+ Allow: /blog
User-agent: GigaChat
Allow: /`}
      </pre>
      <p className="mt-3 text-xs text-muted">Правка черновиком. На сайт уйдёт после вашего «ок».</p>
    </MockShell>
  );
}

export function MockDailyVis() {
  const rows = [
    { q: "какой вклад открыть в 2026", y: "8", g: "11", ai: "нет" },
    { q: "вклад в рублях на год", y: "4", g: "6", ai: "3-е" },
    { q: "иис или вклад", y: "14", g: "9", ai: "нет" },
  ];
  return (
    <MockShell label="Вчерашний прогон" hint="Яндекс · Google · ИИ">
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.q} className="border-b border-line py-2.5">
            <div className="text-sm">{r.q}</div>
            <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted">
              <span>Яндекс {r.y}</span>
              <span>Google {r.g}</span>
              <span className={r.ai === "нет" ? "text-bad" : "text-good"}>ИИ {r.ai}</span>
            </div>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockSentiment() {
  return (
    <MockShell label="Как описывают" hint="оценка, не приговор">
      <ul className="space-y-2 text-sm">
        <li className="rounded-2xl bg-[#eaf6ee] px-3 py-2.5">
          «Региональный банк, понятные ставки» · 6 из 10 ответов
        </li>
        <li className="rounded-2xl bg-[#fff4e5] px-3 py-2.5">
          «Мало отделений в Москве» · 2 ответа
        </li>
        <li className="rounded-2xl bg-[#fdecea] px-3 py-2.5">
          Ставка на сайте и в ответе разошлись · 1 ответ
        </li>
      </ul>
    </MockShell>
  );
}

export function MockCiteSources() {
  const rows = [
    ["banki.ru", 18],
    ["sravni.ru", 14],
    ["dzen.ru", 9],
    ["centrinvest.ru", 6],
  ] as const;
  return (
    <MockShell label="Откуда берут цифры" hint="вклады · Россия">
      <ul className="space-y-2.5">
        {rows.map(([d, n]) => (
          <li key={d}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{d}</span>
              <span className="tabular-nums text-muted">{n}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#f0e9dd]">
              <div className="h-full rounded-full bg-orange" style={{ width: `${n * 4}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockBotVisits() {
  const rows = [
    ["YandexBot", "поиск", 86],
    ["Googlebot", "поиск", 54],
    ["GPTBot", "обучение", 21],
    ["GigaChat", "ответ", 12],
    ["ChatGPT-User", "цитата", 7],
  ] as const;
  return (
    <MockShell label="Заходы роботов" hint="30 дней · один сайт">
      <ul className="space-y-2">
        {rows.map(([n, k, v]) => (
          <li
            key={n}
            className="flex items-center justify-between border-b border-line py-2.5 text-sm"
          >
            <span>
              {n}
              <span className="ml-2 text-[11px] text-muted">{k}</span>
            </span>
            <span className="font-semibold tabular-nums">{v}</span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockBotErrors() {
  const rows = [
    ["/blog/vklad-2024", "404", 18],
    ["/spravka/api", "403", 9],
    ["/catalog?sort=price", "500", 4],
  ] as const;
  return (
    <MockShell label="Что видит бот, а Метрика нет" hint="ошибки">
      <ul className="space-y-2">
        {rows.map(([u, c, n]) => (
          <li
            key={u}
            className="flex items-center justify-between border-b border-line py-2.5 text-sm"
          >
            <span className="truncate font-mono text-[12px]">{u}</span>
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-[#fdecea] px-2 py-0.5 text-[11px] font-bold text-bad">
                {c}
              </span>
              <span className="tabular-nums text-muted">{n}</span>
            </span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockBotLog() {
  const rows = [
    ["07:16", "200", "/vklady", "YandexBot"],
    ["07:15", "200", "/vklady", "Googlebot"],
    ["07:14", "403", "/spravka", "GPTBot"],
    ["07:12", "200", "/tarify", "GigaChat"],
  ];
  return (
    <MockShell label="Лог за сегодня" hint="сервер">
      <ul className="space-y-1.5 font-mono text-[12px]">
        {rows.map((r) => (
          <li key={r.join()} className="flex justify-between gap-2 rounded-xl bg-[#fbf7f0] px-3 py-2">
            <span className="text-muted">{r[0]}</span>
            <span className={r[1] === "200" ? "text-good" : "text-bad"}>{r[1]}</span>
            <span className="flex-1 truncate">{r[2]}</span>
            <span className="text-muted">{r[3]}</span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockShelf() {
  const items = [
    { n: "Dyson V15", p: "54 990 ₽ · Ozon", you: false },
    { n: "K5 Pro", p: "28 400 ₽ · свой сайт", you: true },
    { n: "Roborock S8", p: "41 200 ₽ · WB", you: false },
  ];
  return (
    <MockShell label="Какой пылесос до 30 000 ₽" hint="подборка в ответе">
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={it.n}
            className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm ${
              it.you ? "border border-orange/40 bg-[#fff1e8]" : "bg-[#fbf7f0]"
            }`}
          >
            <span>
              <span className="mr-2 text-muted">{i + 1}.</span>
              {it.n}
              <div className="ml-5 text-[11px] text-muted">{it.p}</div>
            </span>
            {it.you && (
              <span className="rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-white">
                вы
              </span>
            )}
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockMerchants() {
  const rows = [
    ["Свой сайт", 18],
    ["Ozon", 41],
    ["Wildberries", 27],
    ["Яндекс Маркет", 14],
  ] as const;
  return (
    <MockShell label="Куда модель отправляет купить" hint="по вашему SKU">
      <ul className="space-y-2.5">
        {rows.map(([d, n]) => (
          <li key={d}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{d}</span>
              <span className="tabular-nums text-muted">{n}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#f0e9dd]">
              <div className="h-full rounded-full bg-orange" style={{ width: `${n * 2}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockSkuTable() {
  const rows = [
    { n: "K5 Pro", vis: "12%", r: "3", shop: "свой / Ozon" },
    { n: "K5 Mini", vis: "4%", r: "6", shop: "WB" },
    { n: "Конкурент X7", vis: "21%", r: "1", shop: "Ozon" },
  ];
  return (
    <MockShell label="По артикулам" hint="неделя">
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.n}
            className="flex items-center justify-between border-b border-line py-2.5 text-sm"
          >
            <span>{r.n}</span>
            <span className="flex gap-3 text-[12px] text-muted">
              <span>{r.vis}</span>
              <span>#{r.r}</span>
              <span>{r.shop}</span>
            </span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}

export function MockAdChat() {
  return (
    <MockShell label="ChatGPT · 18:24" hint="нашлось объявление">
      <p className="text-sm font-medium">какой вклад открыть в 2026</p>
      <p className="mt-2 text-sm text-muted">
        Обычно смотрят ставку, страховку и возможность пополнять. Цифры лучше сверять на сайте банка.
      </p>
      <div className="mt-3 rounded-2xl border border-orange/30 bg-[#fff8f3] px-3 py-3">
        <div className="text-[10px] font-bold uppercase tracking-wide text-orange">Реклама</div>
        <div className="mt-1 text-sm font-semibold">Вклад «Надёжный» · крупный банк</div>
        <div className="text-[12px] text-muted">16,2% · bank.ru</div>
      </div>
    </MockShell>
  );
}

export function MockAdShare() {
  const rows = [
    { q: "какой вклад открыть", ads: "есть", who: "крупный банк" },
    { q: "пылесос до 30 000", ads: "есть", who: "Ozon" },
    { q: "окна казань цена", ads: "нет", who: "—" },
  ];
  return (
    <MockShell label="Где всплыла реклама" hint="80 формулировок">
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.q}
            className="flex items-center justify-between border-b border-line py-2.5 text-sm"
          >
            <span>{r.q}</span>
            <span className="text-[12px] text-muted">
              {r.ads === "есть" ? r.who : "органично"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">За неделю реклама была в 6 из 80. Не в половине.</p>
    </MockShell>
  );
}

export function MockAdPlatforms() {
  const rows = [
    ["ChatGPT", "редко, но бывает"],
    ["Google AI", "иногда"],
    ["GigaChat", "пока нет"],
    ["Алиса", "пока нет"],
    ["Яндекс / Директ", "рядом с выдачей"],
    ["Google Ads", "рядом с выдачей"],
  ] as const;
  return (
    <MockShell label="Где смотрим рекламу" hint="Россия">
      <ul className="space-y-2">
        {rows.map(([p, s]) => (
          <li
            key={p}
            className="flex items-center justify-between border-b border-line py-2.5 text-sm"
          >
            <span>{p}</span>
            <span className="text-[12px] text-muted">{s}</span>
          </li>
        ))}
      </ul>
    </MockShell>
  );
}
