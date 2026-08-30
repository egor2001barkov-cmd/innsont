import type { ReactNode } from "react";
import Link from "next/link";

export function OrangeBullets({
  items,
}: {
  items: { title: string; text: ReactNode }[];
}) {
  return (
    <ul className="mt-6 space-y-5">
      {items.map((it) => (
        <li key={it.title}>
          <p className="font-semibold text-orange">{it.title}</p>
          <div className="mt-1 text-[15px] leading-relaxed text-[#3a3632]">{it.text}</div>
        </li>
      ))}
    </ul>
  );
}

export function BigStatGrid({
  items,
}: {
  items: { v: string; k: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
      {items.map((it) => (
        <div key={it.k}>
          <div className="font-display text-5xl font-extrabold tracking-tight text-orange md:text-6xl">
            {it.v}
          </div>
          <p className="mt-2 max-w-[16rem] text-sm leading-snug text-[#3a3632]">{it.k}</p>
        </div>
      ))}
    </div>
  );
}

export function ChatGptAdFrame() {
  return (
    <div className="rounded-[28px] border border-[#ece6dc] bg-white p-5 shadow-[0_24px_60px_rgba(40,24,8,0.08)] md:p-6">
      <div className="flex items-center justify-between text-[13px] text-muted">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10a37f] text-[11px] font-bold text-white">
            ✦
          </span>
          ChatGPT
        </span>
        <span>18:24</span>
      </div>
      <div className="mt-5 flex justify-end">
        <span className="rounded-full bg-[#f3f0ea] px-3 py-1.5 text-[13px]">
          какой вклад открыть в 2026
        </span>
      </div>
      <p className="mt-5 text-[15px] leading-relaxed text-[#3a3632]">
        Обычно смотрят ставку, страховку вкладов и можно ли пополнять. Цифры лучше
        сверять на сайте банка — в ответах они быстро устаревают.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted">
        <span>Органика</span>
        <span className="rounded-full bg-[#f3f0ea] px-2.5 py-1">banki.ru</span>
        <span className="rounded-full bg-[#f3f0ea] px-2.5 py-1">sravni.ru</span>
        <span className="rounded-full bg-[#f3f0ea] px-2.5 py-1">dzen.ru</span>
      </div>
      <div className="relative mt-5 rounded-2xl border border-dashed border-orange/70 bg-[#fffaf6] p-4">
        <span className="absolute -top-2.5 right-4 rounded-full bg-[#fff1e8] px-2.5 py-0.5 text-[11px] font-semibold text-orange">
          Нашёл INSONT
        </span>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Крупный банк · реклама
        </div>
        <div className="mt-1 text-[15px] font-semibold">Вклад «Надёжный»</div>
        <p className="mt-1 text-sm text-muted">16,2% годовых. Пополнение и частичное снятие.</p>
        <p className="mt-2 text-[12px] text-muted">bank-example.ru · условия на сайте</p>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        Объявление не меняет сам ответ модели. Мы просто фиксируем, что блок уже
        висит рядом.
      </p>
    </div>
  );
}

export function PageIssuesCard() {
  const rows = [
    ["Нет схемы Product", "Сделали", "good"],
    ["Тонкий FAQ", "Правим", "orange"],
    ["Ответ не в первом абзаце", "В очереди", "muted"],
    ["Сломана иерархия заголовков", "В очереди", "muted"],
  ] as const;
  return (
    <div className="rounded-[28px] border border-[#ece6dc] bg-[#faf7f2] p-5 shadow-[0_24px_60px_rgba(40,24,8,0.08)] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-snug">Норд Ран 3</div>
          <div className="text-xs text-muted">Карточка товара</div>
        </div>
        <div className="shrink-0 rounded-xl bg-white px-3 py-2 text-right">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
            Доля цитат
          </div>
          <div className="text-sm font-bold whitespace-nowrap">
            3,4% <span className="text-good">+1,8%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted">
        <span className="min-w-0 leading-snug">4 проблемы бьют по видимости</span>
        <span className="shrink-0 rounded-full border border-orange/30 bg-white px-2.5 py-0.5 font-semibold whitespace-nowrap text-orange">
          Агент правит
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {rows.map(([t, s, c]) => (
          <li
            key={t}
            className="flex items-start justify-between gap-3 border-t border-[#ece6dc] pt-2.5 text-sm"
          >
            <span className="flex min-w-0 items-start gap-2 leading-snug">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  c === "good" ? "bg-good" : c === "orange" ? "bg-orange" : "bg-[#d9d0c3]"
                }`}
              />
              {t}
            </span>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                c === "good"
                  ? "bg-[#eaf6ee] text-good"
                  : c === "orange"
                    ? "border border-orange/30 bg-white text-orange"
                    : "bg-white text-muted"
              }`}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StackedMentions() {
  return (
    <div className="relative">
      <div className="absolute inset-x-4 top-0 rounded-2xl bg-[#f3eee6] px-4 py-3 text-[12px] text-muted">
        Дзен · Подборка вкладов 2026
      </div>
      <div className="absolute inset-x-2 top-8 rounded-2xl bg-[#efe8db] px-4 py-3 text-[12px] text-muted">
        YouTube · 18 тыс. · Какие окна ставить в Казани
      </div>
      <div className="relative mt-16 rounded-[28px] border border-[#ece6dc] bg-white p-5 shadow-[0_24px_60px_rgba(40,24,8,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">vc.ru · ветка</div>
            <div className="text-[11px] text-muted">Попало в GigaChat и ChatGPT</div>
          </div>
          <div className="text-[11px] text-muted">↑ 1,2 тыс. · 84</div>
        </div>
        <p className="mt-3 text-[15px] font-medium">
          Какой вклад открыть, если боюсь курса? Бюджет около 400 000 ₽
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          В ответе модели два банка. Вашего нет — хотя ставка на сайте живая и
          регион проставлен.
        </p>
        <div className="mt-4 flex items-center justify-between text-[12px]">
          <span className="font-semibold text-orange">2 конкурента, вы 0</span>
          <Link href="/kabinet/deystviya" className="font-semibold text-orange">
            Черновик ответа →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AgentBoard() {
  const rows = [
    ["Карточка курса /faq", "Автор", "черновик"],
    ["Открыть /blog роботу", "Техника", "ждёт «ок»"],
    ["Ответ на VC", "Упоминания", "в очереди"],
  ];
  return (
    <div className="rounded-[28px] border border-[#ece6dc] bg-white p-5 shadow-[0_24px_60px_rgba(40,24,8,0.08)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Очередь агентов</div>
        <span className="rounded-full bg-[#eaf6ee] px-2.5 py-0.5 text-[11px] font-semibold text-good">
          3 в работе
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map(([t, k, s]) => (
          <li
            key={t}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#fbf7f0] px-3 py-2.5 text-sm"
          >
            <span>
              {t}
              <span className="ml-2 text-[11px] text-muted">{k}</span>
            </span>
            <span className="text-[11px] text-muted">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArticleDraft() {
  return (
    <div className="rounded-[28px] border border-[#ece6dc] bg-white p-5 shadow-[0_24px_60px_rgba(40,24,8,0.08)]">
      <div className="flex items-center justify-between text-[12px] text-muted">
        <span>Черновик · ждёт редактора</span>
        <span>шаг 6 из 8</span>
      </div>
      <h3 className="mt-3 text-lg leading-snug">Какой вклад открыть в 2026: ставка, страховка, срок</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Короткий ответ в первом абзаце. Таблица ставок с датой. Вопросы, которые
        уже задают в GigaChat. Ссылки на свои страницы тарифов, не на агрегатор.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        {[
          ["Wordstat", "есть спрос"],
          ["Выдача Яндекса", "8 страниц сняли"],
          ["Google", "те же кластеры"],
          ["Голос банка", "без «лучший»"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-[#fbf7f0] px-3 py-2">
            <div className="font-semibold text-ink">{k}</div>
            <div className="text-muted">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormatTiles() {
  const items = ["Карточка товара", "FAQ", "Пост в Дзен", "Письмо", "Сравнение", "Telegram"];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((t) => (
        <div
          key={t}
          className="rounded-2xl border border-line bg-paper px-3 py-4 text-center text-sm font-semibold"
        >
          {t}
        </div>
      ))}
    </div>
  );
}
