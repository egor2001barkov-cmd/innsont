import type { ReactNode } from "react";
import { Icon } from "./Icons";

function Shot({
  title,
  caption,
  active,
  children,
}: {
  title: string;
  caption: string;
  active: string;
  children: ReactNode;
}) {
  const nav = [
    { icon: "book" as const, t: "Справка" },
    { icon: "search" as const, t: "Спрос" },
    { icon: "pages" as const, t: "Сравнения" },
    { icon: "chat" as const, t: "Ответы" },
    { icon: "bolt" as const, t: "Очередь" },
  ];
  return (
    <figure className="mt-8 min-w-0">
      <div className="min-w-0 overflow-x-auto border border-line bg-paper shadow-[0_18px_40px_rgba(40,24,8,0.08)]">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-bg px-4 py-2.5">
          <span className="wordmark text-[10px] text-orange">INSONT</span>
          <span className="min-w-0 truncate text-[12px] text-muted">{title}</span>
        </div>
        <div className="flex min-h-[280px]">
          <aside className="hidden w-[148px] shrink-0 flex-col gap-0.5 border-r border-line bg-bg px-2 py-3 md:flex">
            <span className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Склад.учёт
            </span>
            {nav.map((it) => (
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
      <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export function SaasDemandMock() {
  const rows = [
    ["складской учёт для магазина", "8 400", "6 100", "сравнение"],
    ["интеграция с 1С облако", "5 200", "4 800", "справка"],
    ["мойсклад или excel", "2 900", "3 400", "сравнение"],
    ["тарифы по обороту склад", "1 600", "2 200", "витрина"],
    ["api вебхуки заказы", "980", "1 700", "справка"],
  ];
  return (
    <Shot
      title="Спрос · Россия, не «весь мир»"
      caption="Кабинет: как ищут в Wordstat, как в Google, какую страницу это должно закрыть. Без ядра на 50 тысяч строк."
      active="Спрос"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[15px] font-semibold">Кластеры, с которых просят демо</div>
        <div className="text-[12px] text-muted">август 2026 · регион Россия</div>
      </div>
      <p className="mt-1 text-[12px] text-muted">
        Бренд продукта почти не ищут. Ищут задачу, интеграцию и «чем лучше 1С».
      </p>
      <div className="table-wrap mt-3">
        <table className="data min-w-[36rem]">
          <thead>
            <tr>
              <th>Как спрашивают</th>
              <th>Wordstat</th>
              <th>Google</th>
              <th>Куда кладём</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td className="font-medium">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shot>
  );
}

export function SaasDocsWallMock() {
  const rows: [string, string, string, "ok" | "wall" | "none"][] = [
    ["/help/ostatki", "открыто", "200", "ok"],
    ["/help/1c", "логин", "302", "wall"],
    ["/help/api-token", "логин", "403", "wall"],
    ["/tariffs", "открыто", "200", "ok"],
    ["/vs-1c", "нет URL", "—", "none"],
  ];
  return (
    <Shot
      title="Справка · что видит человек и что видит робот"
      caption="Один и тот же URL. Человек после логина читает инструкцию. Яндекс и GPTBot упираются в форму входа."
      active="Справка"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="border border-line bg-bg">
          <div className="flex items-center justify-between border-b border-line px-3 py-1.5 text-[11px] text-muted">
            <span>help.sklad.ru/1c</span>
            <span className="text-good">человек · вошёл</span>
          </div>
          <div className="px-3 py-3">
            <div className="text-[14px] font-semibold">Как связать со складом 1С</div>
            <p className="mt-2 text-[12px] leading-relaxed text-[#3a3632]">
              Откройте синхронизацию в настройках. Выберите базу, укажите склады
              и сохраните. Первая выгрузка занимает около часа.
            </p>
            <ol className="mt-2 space-y-1 text-[12px] text-muted">
              <li>1. Раздел «Интеграции»</li>
              <li>2. Токен из 1С:Предприятие</li>
              <li>3. Сопоставить номенклатуру</li>
            </ol>
          </div>
        </div>
        <div className="border border-line bg-[#fff8f4]">
          <div className="flex items-center justify-between border-b border-line px-3 py-1.5 text-[11px] text-muted">
            <span>тот же URL</span>
            <span className="font-semibold text-orange">робот · 302</span>
          </div>
          <div className="px-3 py-4">
            <div className="text-[14px] font-semibold">Войдите, чтобы читать справку</div>
            <div className="mt-3 space-y-2">
              <div className="h-8 border border-line bg-paper px-2 text-[12px] leading-8 text-muted">
                почта
              </div>
              <div className="h-8 border border-line bg-paper px-2 text-[12px] leading-8 text-muted">
                пароль
              </div>
              <div className="h-8 bg-orange text-center text-[12px] font-semibold leading-8 text-white">
                Войти
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              YandexBot, GPTBot и GigaChat здесь ничего не прочитают. Цитировать
              нечего — модель возьмёт конкурента.
            </p>
          </div>
        </div>
      </div>
      <div className="table-wrap mt-4">
        <table className="data min-w-[32rem]">
          <thead>
            <tr>
              <th>Страница</th>
              <th>Человек</th>
              <th>Робот</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className={r[3] === "wall" ? "bg-[#fff1e8]" : undefined}>
                <td className="font-medium">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td className={r[3] === "ok" ? "text-good" : "font-semibold text-orange"}>
                  {r[3] === "ok" ? "можно цитировать" : r[3] === "wall" ? "стена входа" : "страницы нет"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shot>
  );
}

export function SaasCompareMock() {
  const rows = [
    ["складской учёт для магазина", "нет URL", "3", "2", "конкурент"],
    ["мойсклад или 1с", "нет URL", "—", "8", "1С"],
    ["тарифы склад облако", "есть, без даты", "11", "9", "не называют"],
    ["интеграция 1с инструкция", "за логином", "—", "—", "конкурент"],
  ];
  return (
    <Shot
      title="Сравнения · кто отвечает на «чем лучше»"
      caption="По запросу выбора смотрим Яндекс, Google и ответ модели. Если своей страницы нет — в ответе почти всегда сосед."
      active="Сравнения"
    >
      <div className="text-[15px] font-semibold">Контрольный кластер · Склад.учёт</div>
      <p className="mt-0.5 text-[12px] text-muted">
        Не «все конкуренты мира». Три формулировки, которые уже живут в поиске.
      </p>
      <div className="table-wrap mt-3">
        <table className="data min-w-[38rem]">
          <thead>
            <tr>
              <th>Запрос</th>
              <th>Ваша страница</th>
              <th>Яндекс</th>
              <th>Google</th>
              <th>ChatGPT / GigaChat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td className="font-medium">{r[0]}</td>
                <td className={r[1].startsWith("есть") ? "" : "font-semibold text-orange"}>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="border border-line bg-bg px-3 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Черновик сравнения
          </div>
          <div className="mt-2 text-[14px] font-semibold">Склад.учёт и 1С: кому что</div>
          <p className="mt-2 text-[12px] leading-relaxed">
            1С сильнее в производстве и регламентированном учёте. Облачный склад
            быстрее поднимается в интернет-магазине без своего 1С-специалиста.
            Excel хватает, пока один человек и нет ячеек.
          </p>
        </div>
        <div className="border border-line bg-bg px-3 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Что не пишем
          </div>
          <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed">
            <li>Не «убийца 1С». Это стыдно и неправда.</li>
            <li>Не вечная цена без даты. Модель такое пропускает.</li>
            <li>Не «революция учёта» в первом абзаце.</li>
            <li>Не сравнение с теми, кого никто не ищет.</li>
          </ul>
        </div>
      </div>
    </Shot>
  );
}

export function SaasAnswersMock() {
  const cards = [
    {
      q: "Какой складской учёт взять интернет-магазину?",
      who: "называют конкурента",
      src: "обзор на VC, таблица тарифов",
      note: "У вас на сайте слоган и форма «оставьте заявку». Цитировать нечего.",
    },
    {
      q: "Как связать облачный склад с 1С?",
      who: "называют 1С и соседа",
      src: "открытая справка конкурента",
      note: "Ваша инструкция за логином. Робот её не видел.",
    },
    {
      q: "Склад.учёт тарифы 2026",
      who: "бренд есть, цифр нет",
      src: "старый пост в блоге без суммы",
      note: "Страница тарифов без даты. Модель не любит вечный лендинг.",
    },
  ];
  return (
    <Shot
      title="Ответы · кого называют по вашим темам"
      caption="Один прогон: GigaChat, ChatGPT, Алиса. Не отдельный «аудит нейросетей», тот же кабинет, что и поиск."
      active="Ответы"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[15px] font-semibold">Цитаты за последнюю неделю</div>
        <div className="text-[12px] text-muted">12 контрольных формулировок</div>
      </div>
      <ul className="mt-3 space-y-3">
        {cards.map((c) => (
          <li key={c.q} className="border border-line bg-bg px-3 py-3">
            <div className="text-[12px] text-muted">Спросили у модели</div>
            <div className="mt-1 text-[14px] font-semibold">{c.q}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
              <span>
                В ответе: <span className="font-semibold text-orange">{c.who}</span>
              </span>
              <span className="text-muted">Откуда взяли: {c.src}</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-[#3a3632]">{c.note}</p>
          </li>
        ))}
      </ul>
    </Shot>
  );
}

export function SaasQueueMock() {
  const tasks = [
    ["Открыть /help/1c без логина", "Справка", "сегодня", "стенка"],
    ["Дата и вилка на /tariffs", "Витрина", "завтра", "цитата"],
    ["Страница «Склад.учёт и 1С»", "Сравнение", "чт", "выдача"],
    ["Title без «революция учёта»", "Сниппет", "пт", "клик"],
    ["FAQ «кому не подойдём»", "Сравнение", "след. нед.", "доверие"],
  ];
  return (
    <Shot
      title="Очередь · неделя, не контент-план на год"
      caption="Пять–десять дел. Сначала доступ роботу и витрина. Десятую «пользу» в блог не ставим в начало."
      active="Очередь"
    >
      <div className="text-[15px] font-semibold">На эту неделю · Склад.учёт</div>
      <p className="mt-0.5 text-[12px] text-muted">
        Черновик смотрите вы. Кабинет сам на сайт не заливает.
      </p>
      <ul className="mt-3 border-t border-line text-[13px]">
        {tasks.map((t) => (
          <li
            key={t[0]}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-2.5"
          >
            <span className="font-medium">{t[0]}</span>
            <span className="text-muted">
              {t[1]} · {t[2]} · {t[3]}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        Если формулировку стыдно показать продакту и юристу — её нет в очереди
        и нет на сайте.
      </p>
    </Shot>
  );
}
