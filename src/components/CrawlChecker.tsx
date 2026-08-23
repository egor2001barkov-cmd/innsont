"use client";

import { useState, type FormEvent } from "react";

type Row = { bot: string; ok: boolean; note: string };

export function CrawlChecker() {
  const [url, setUrl] = useState("https://example.ru");
  const [empty, setEmpty] = useState(true);
  const [rows, setRows] = useState<Row[] | null>(null);

  function check(e: FormEvent) {
    e.preventDefault();
    const host = url.toLowerCase();
    const spa =
      host.includes("spa") ||
      host.includes("app.") ||
      host.includes("tilda") ||
      host.includes("block");
    setEmpty(spa);
    setRows([
      {
        bot: "YandexBot",
        ok: !host.includes("block"),
        note: "Индекс и Алиса. Смотрит HTML, регион и карточку.",
      },
      {
        bot: "Googlebot",
        ok: !host.includes("block"),
        note: "Индекс и иногда отрисовывает JS. Не считайте, что все роботы так умеют.",
      },
      {
        bot: "GPTBot",
        ok: !host.includes("block") && !spa,
        note: spa
          ? "В ответе пустой #root. Текста в первом HTML нет."
          : "Читает исходный HTML, JavaScript не запускает.",
      },
      {
        bot: "Робот GigaChat",
        ok: !host.includes("block") && !spa,
        note: spa
          ? "Скорее всего увидит оболочку, не карточку."
          : "Нужен текст в HTML, не только после скрипта.",
      },
      {
        bot: "ChatGPT-User",
        ok: host.startsWith("https") && !host.includes("block"),
        note: "Заходит, когда человек открыл ссылку из ответа. Только HTTPS.",
      },
    ]);
  }

  const host = url.replace(/^https?:\/\//, "").split("/")[0] || "example.ru";

  return (
    <div>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={check}>
        <input
          className="input flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yoursite.ru/usluga"
        />
        <button className="btn-primary shrink-0" type="submit">
          Проверить обход
        </button>
      </form>
      <p className="mt-2 text-xs text-muted">
        Без почты. Это демо-срез: robots и «пустой HTML» угадываем по адресу. Для
        лога на своём хостинге —{" "}
        <a href="/platforma/analitika-agentov" className="font-semibold text-orange">
          аналитика роботов
        </a>
        .
      </p>

      <p className="mx-auto mt-12 max-w-3xl text-center text-[16px] leading-relaxed text-[#3a3632]">
        Браузер сначала выполняет JavaScript и только потом показывает страницу.
        Робот GigaChat или GPTBot часто читает только первый HTML. Разница важна
        и для Яндекса, если текст живёт только в скрипте.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-paper p-6 shadow-[0_20px_50px_rgba(40,24,8,0.06)]">
          <p className="text-sm font-semibold text-good">В браузере</p>
          <h3 className="mt-3 text-3xl">Готовая страница</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Браузер запускает скрипты и рисует то, что видит человек после
            загрузки.
          </p>
          <div className="mt-5 rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e85d4c]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#e6c04a]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5bbd6b]" />
              <span className="ml-2 rounded-full bg-[#f3eee6] px-2 py-0.5 text-[11px] text-muted">
                {host}
              </span>
            </div>
            <div className="mt-4 h-16 rounded-xl bg-[#fff1e8]" />
            <div className="mt-3 h-2.5 w-3/4 rounded-full bg-ink" />
            <div className="mt-2 h-2 w-full rounded-full bg-[#e6ddd0]" />
            <div className="mt-2 h-2 w-5/6 rounded-full bg-[#e6ddd0]" />
          </div>
        </div>

        <div className="rounded-[28px] bg-[#1a1916] p-6 text-[#e8e0d6] shadow-[0_20px_50px_rgba(40,24,8,0.12)]">
          <p className="text-sm font-semibold text-orange">{"{}"} Сырой HTML</p>
          <h3 className="mt-3 text-3xl text-white">Первый ответ сервера</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Робот читает то, что пришло до JavaScript. Если текст рисуется только
            в браузере — в ответе его нет.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-[#111] p-4 font-mono text-[12px] leading-6">
            {empty
              ? `GET ${url || "https://example.ru"}
User-Agent: GPTBot

<body>
  <div id="root"></div>
</body>`
              : `GET ${url}
User-Agent: YandexBot

<h1>Услуга</h1>
<p>Цена, срок, запись…</p>`}
          </pre>
          <p className={`mt-3 text-sm font-semibold ${empty ? "text-orange" : "text-[#9ee0b0]"}`}>
            {empty ? "0 читаемых слов" : "Текст есть в первом HTML"}
          </p>
        </div>
      </div>

      {rows && (
        <ul className="card mt-8 divide-y divide-line">
          {rows.map((r) => (
            <li key={r.bot} className="flex items-start justify-between gap-4 px-5 py-3">
              <div>
                <div className="font-semibold">{r.bot}</div>
                <div className="text-sm text-muted">{r.note}</div>
              </div>
              <span className={r.ok ? "text-good" : "text-bad"}>{r.ok ? "Открыто" : "Риск"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
