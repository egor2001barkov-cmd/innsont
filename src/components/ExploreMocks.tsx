import type { ReactNode } from "react";

export function FeatureSplit({
  kicker,
  title,
  children,
  mock,
  flip,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  mock: ReactNode;
  flip?: boolean;
}) {
  return (
    <section className="mt-16 grid min-w-0 items-start gap-8 border-t border-line pt-10 lg:grid-cols-2 lg:gap-14">
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        {kicker ? <p className="text-sm text-muted">{kicker}</p> : null}
        <h2 className="mt-1 text-2xl leading-snug md:text-[28px]">{title}</h2>
        <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-[#3a3632]">{children}</div>
      </div>
      <div className={`min-w-0 overflow-x-auto ${flip ? "lg:order-1" : ""}`}>{mock}</div>
    </section>
  );
}

export function MockShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-3 text-sm text-muted">
        {label}
        {hint ? ` · ${hint}` : ""}
      </figcaption>
      {children}
    </figure>
  );
}

function Sheet({
  caption,
  note,
  headers,
  rows,
}: {
  caption?: string;
  note?: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <figure className="min-w-0">
      {caption ? <figcaption className="mb-2 text-sm text-muted">{caption}</figcaption> : null}
      <div className="table-wrap">
        <table className="sheet">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={h} className={i === headers.length - 1 ? "num" : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === row.length - 1 ? "num" : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="mt-2 text-sm leading-relaxed text-muted">{note}</p> : null}
    </figure>
  );
}

export function MockFrequency() {
  return (
    <Sheet
      caption="Как часто спрашивают, Россия"
      headers={["Формулировка", "Частота"]}
      rows={[
        ["какой вклад открыть в 2026", "средняя"],
        ["вклад в рублях или валюте", "низкая"],
        ["клиника узи рядом с метро", "средняя"],
        ["пластиковые окна казань цена", "высокая"],
      ]}
    />
  );
}

export function MockTrend() {
  const bars = [28, 42, 68, 72, 45, 32, 30, 28, 22, 18, 16, 20];
  const labels = ["сен", "окт", "ноя", "дек", "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг"];
  const max = Math.max(...bars);
  const w = 420;
  const h = 168;
  const bottom = 22;
  const innerH = h - bottom;
  const gap = 7;
  const barW = (w - gap * (bars.length - 1)) / bars.length;

  return (
    <figure className="min-w-0">
      <figcaption className="mb-3 text-sm text-muted">
        Спрос за год · «какой вклад открыть»
      </figcaption>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label="Спрос по месяцам: пик в ноябре и декабре, спад летом"
      >
        {bars.map((n, i) => {
          const bh = Math.max(6, (n / max) * (innerH - 4));
          const x = i * (barW + gap);
          const y = innerH - bh;
          return (
            <g key={labels[i]}>
              <rect x={x} y={y} width={barW} height={bh} fill="var(--orange)" />
              <text
                x={x + barW / 2}
                y={h - 6}
                textAnchor="middle"
                fontSize="11"
                fill="var(--muted)"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Пик в ноябре–декабре. Летом проседает. Это не «рост рынка», это сезон вкладов.
      </p>
    </figure>
  );
}

export function MockCities() {
  return (
    <Sheet
      caption="Где спрашивают за месяц"
      headers={["Город", "Оценка"]}
      rows={[
        ["Москва", 142],
        ["Санкт-Петербург", 68],
        ["Казань", 24],
        ["Екатеринбург", 21],
        ["Новосибирск", 18],
        ["Краснодар", 15],
      ]}
    />
  );
}

export function MockAudience() {
  return (
    <Sheet
      caption="Кто спрашивает — оценка, не паспорт"
      headers={["Возраст", "Доля"]}
      rows={[
        ["18–24", "14%"],
        ["25–34", "38%"],
        ["35–44", "31%"],
        ["45+", "17%"],
      ]}
      note="Корзина по тому, как формулируют вопрос. Для тона статьи хватает, для медиаплана — нет."
    />
  );
}

export function MockRelated() {
  return (
    <Sheet
      caption="Рядом с «какой вклад открыть»"
      headers={["Формулировка", "Оценка"]}
      rows={[
        ["вклад в рублях на год", 41],
        ["иис или вклад что выгоднее", 27],
        ["накопительный счёт или вклад", 19],
      ]}
    />
  );
}

export function MockTrackQueue() {
  return (
    <Sheet
      caption="Что ставить на трекинг"
      headers={["Формулировка", "Статус"]}
      rows={[
        ["какой вклад открыть в 2026", "в трекере"],
        ["вклад в рублях на год", "в трекере"],
        ["накопительный счёт или вклад", "позже"],
      ]}
    />
  );
}

export function MockContentGaps() {
  return (
    <Sheet
      caption="Где бренда нет в ответе"
      headers={["Формулировка", "В ответе"]}
      rows={[
        ["какой вклад открыть в 2026", "нет вас"],
        ["иис или вклад что выгоднее", "нет вас"],
        ["вклад в рублях на год", "есть"],
      ]}
    />
  );
}

export function MockShare() {
  return (
    <Sheet
      caption="Доля упоминаний · 4 бренда, Россия"
      headers={["Бренд", "Доля"]}
      rows={[
        ["Инвитро", "28%"],
        ["Хеликс", "16%"],
        ["СМ-Клиника", "11%"],
        ["Медси", "9%"],
      ]}
      note="Остальное — агрегаторы и «зависит от района»."
    />
  );
}

export function MockPromptRanks() {
  return (
    <Sheet
      caption="Где бренд вообще всплывает"
      headers={["Формулировка", "Место"]}
      rows={[
        ["какую клинику выбрать в москве", "#4"],
        ["узи у метро без очереди", "#6"],
        ["запись к терапевту онлайн", "#3"],
        ["клиника рядом с работой", "#8"],
      ]}
    />
  );
}

export function MockCitations() {
  return (
    <Sheet
      caption="Откуда модели берут факты"
      headers={["Источник", "Доля"]}
      rows={[
        ["prodoctorov.ru", "22%"],
        ["napopravku.ru", "14%"],
        ["dzen.ru", "11%"],
        ["smclinic.ru", "7%"],
      ]}
    />
  );
}

export function MockHeat() {
  return (
    <Sheet
      caption="Видимость по темам, оценка 0–100"
      headers={["Бренд", "УЗИ", "Терапевт", "Стоматология"]}
      rows={[
        ["Инвитро", 64, 41, 22],
        ["Хеликс", 48, 33, 18],
        ["СМ-Клиника", 29, 38, 14],
      ]}
    />
  );
}

export function CompareTable({
  leftTitle,
  rightTitle,
  rows,
}: {
  leftTitle: string;
  rightTitle: string;
  rows: [string, string, string][];
}) {
  return (
    <div className="table-wrap mt-6">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-muted">
            <th className="py-3 pr-4 font-medium" />
            <th className="py-3 pr-4 font-semibold text-ink">{leftTitle}</th>
            <th className="py-3 font-semibold text-ink">{rightTitle}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, a, b]) => (
            <tr key={k} className="border-b border-line/70 align-top">
              <td className="py-3 pr-4 text-muted">{k}</td>
              <td className="py-3 pr-4">{a}</td>
              <td className="py-3">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UseCase({
  title,
  children,
  mock,
}: {
  title: string;
  children: ReactNode;
  mock: ReactNode;
}) {
  return (
    <article className="border-t border-line pt-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-[#3a3632]">{children}</div>
      {mock ? <div className="mt-4">{mock}</div> : null}
    </article>
  );
}

export function StatStrip({
  items,
}: {
  items: { k: string; v: string }[];
}) {
  return (
    <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4">
      {items.map((it) => (
        <div key={it.k} className="flex min-w-0 items-baseline gap-2">
          <dt className="text-sm text-muted">{it.k}</dt>
          <dd className="text-sm font-semibold">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}
