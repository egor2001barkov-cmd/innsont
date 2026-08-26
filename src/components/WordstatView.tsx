import type { ReactNode } from "react";

function Frame({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="mt-8 min-w-0">
      <div className="min-w-0 overflow-x-auto border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line bg-bg px-4 py-2.5">
          <span className="wordmark text-[10px] text-orange">INSONT</span>
          <span className="text-[12px] text-muted">{title}</span>
        </div>
        <div className="p-4 md:p-5">{children}</div>
      </div>
      <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export function WordstatDemandMock() {
  const rows = [
    ["узи москва цена", "14 800", "12 400", "карточка услуги"],
    ["узи на дому москва", "3 200", "2 100", "карточка услуги"],
    ["узи брюшной полости что показывает", "5 400", "6 800", "статья"],
    ["узи или мрт что лучше", "1 900", "2 400", "статья"],
    ["узи рядом с метро", "2 900", "1 100", "карточка + район"],
  ];
  return (
    <Frame
      title="Wordstat · регион Москва"
      caption="Кабинет: частота в Wordstat, как часто ту же мысль ищут в Google, и какая страница должна это закрыть."
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[15px] font-semibold">Спрос по услуге «УЗИ»</div>
        <div className="text-[12px] text-muted">август 2026 · не «вся Россия»</div>
      </div>
      <div className="table-wrap mt-4">
        <table className="data min-w-[34rem]">
          <thead>
            <tr>
              <th>Запрос</th>
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
      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        Правая колонка Wordstat подсказывает хвосты. Search Console часто даёт
        другие формулировки: «reviews», сравнение, латиница. Оба слоя нужны.
      </p>
    </Frame>
  );
}

export function WordstatClusterMock() {
  return (
    <Frame
      title="Кластеры по интенту"
      caption="Одна мысль — одна страница. Коммерцию не мешаем с гидом «что это такое»."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="border-b border-line pb-2 text-[13px] font-semibold">
            Коммерция · /uzi
          </div>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed">
            <li>узи москва цена</li>
            <li>узи записаться онлайн</li>
            <li>узи на дому</li>
            <li>узи рядом с метро сокол</li>
          </ul>
          <p className="mt-3 text-[12px] text-muted">
            В топе витрины с ценой и слотом. Это карточка услуги, не блог.
          </p>
        </div>
        <div>
          <div className="border-b border-line pb-2 text-[13px] font-semibold">
            Информация · /stati/chto-pokazyvaet-uzi
          </div>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed">
            <li>что показывает узи брюшной полости</li>
            <li>как готовиться к узи</li>
            <li>узи или мрт что лучше</li>
            <li>можно ли делать узи при беременности</li>
          </ul>
          <p className="mt-3 text-[12px] text-muted">
            В топе гиды и справка. С статьи ведём на запись, не наоборот.
          </p>
        </div>
      </div>
    </Frame>
  );
}

export function WordstatSeasonMock() {
  const months = [
    ["янв", 22],
    ["фев", 24],
    ["мар", 31],
    ["апр", 38],
    ["май", 44],
    ["июн", 28],
    ["июл", 21],
    ["авг", 26],
    ["сен", 48],
    ["окт", 52],
    ["ноя", 41],
    ["дек", 33],
  ];
  const related = [
    ["узи щитовидной железы цена", "4 100"],
    ["узи малого таза подготовка", "2 600"],
    ["узи сердца москва", "1 800"],
    ["узи вен нижних конечностей", "1 200"],
  ];
  return (
    <Frame
      title="Сезон и «с чем ещё ищут»"
      caption="Пик в сентябре–октябре. Страницу услуги лучше закрыть летом, а не когда спрос уже орёт."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="text-[13px] font-semibold">Частота «узи москва» за год</div>
          <svg viewBox="0 0 360 120" className="mt-3 h-28 w-full" aria-hidden>
            {months.map(([m, v], i) => {
              const h = (Number(v) / 52) * 88;
              const x = 8 + i * 29;
              return (
                <g key={m}>
                  <rect
                    x={x}
                    y={96 - h}
                    width="18"
                    height={h}
                    fill={Number(v) >= 44 ? "#ff6a2b" : "currentColor"}
                    className="text-ink/70"
                  />
                  <text
                    x={x + 9}
                    y="112"
                    textAnchor="middle"
                    fontSize="8"
                    fill="currentColor"
                    className="text-muted"
                  >
                    {m}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Ещё ищут вместе с этим</div>
          <ul className="mt-3 border-t border-line text-[13px]">
            {related.map(([q, n]) => (
              <li
                key={q}
                className="flex items-baseline justify-between gap-3 border-b border-line py-2"
              >
                <span>{q}</span>
                <span className="tabular-nums text-muted">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}
