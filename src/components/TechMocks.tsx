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
    <figure className="mt-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line bg-bg px-4 py-2.5">
          <span className="wordmark text-[10px] text-orange">INNSONT</span>
          <span className="text-[12px] text-muted">{title}</span>
        </div>
        <div className="p-4 md:p-5">{children}</div>
      </div>
      <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export function RobotsFileMock() {
  const lines = [
    ["User-agent: Yandex", "ok"],
    ["Allow: /", "ok"],
    ["Disallow: /kabinet", "ok"],
    ["User-agent: Googlebot", "ok"],
    ["Allow: /", "ok"],
    ["User-agent: *", "warn"],
    ["Disallow: /blog", "warn"],
    ["Sitemap: https://clinic.ru/sitemap.xml", "ok"],
  ];
  return (
    <Frame
      title="robots.txt · черновик"
      caption="Кабинет: что сейчас на сайте и что предлагаем поменять. Файл не уезжает на хостинг без вашего «ок»."
    >
      <div className="text-[14px] font-semibold">clinic.ru/robots.txt</div>
      <p className="mt-1 text-[12px] text-muted">
        Строка с /blog закрывает людям справку и роботу GigaChat. Яндекс туда тоже не зайдёт.
      </p>
      <ol className="mt-3 border border-line bg-bg font-mono text-[12px] leading-6">
        {lines.map(([line, kind], i) => (
          <li
            key={i}
            className={`flex gap-3 px-3 py-0.5 ${
              kind === "warn" ? "bg-[#fff1e8] font-semibold text-orange" : ""
            }`}
          >
            <span className="w-6 shrink-0 text-muted">{i + 1}</span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] text-muted">
        Оранжевым — то, что режем. Черновик правите вы. Автоматически не публикуем.
      </p>
    </Frame>
  );
}

export function RobotsBotsMock() {
  const rows = [
    ["YandexBot", "200", "открыт", "/uzi, /vrachi"],
    ["Googlebot", "200", "открыт", "/uzi, /blog"],
    ["Bingbot", "200", "открыт", "те же URL"],
    ["GigaChat", "403", "режет robots", "/blog"],
    ["GPTBot", "403", "режет robots", "/blog"],
  ];
  return (
    <Frame
      title="Кто ходит и куда упирается"
      caption="Один проход: поисковики и роботы моделей. Не отдельный «аудит нейросетей»."
    >
      <div className="table-wrap">
        <table className="data min-w-[32rem]">
          <thead>
            <tr>
              <th>Робот</th>
              <th>Код</th>
              <th>robots</th>
              <th>Что смотрел</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td className="font-semibold">{r[0]}</td>
                <td>{r[1]}</td>
                <td className={r[2] === "открыт" ? "text-good" : "font-semibold text-orange"}>
                  {r[2]}
                </td>
                <td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

export function LandingsListMock() {
  const rows = [
    ["/uzi", "узи цена", "Москва", "цена есть", "в работе"],
    ["/uzi/sokol", "узи метро сокол", "Сокол", "нет цены", "очередь"],
    ["/stati/podgotovka", "как готовиться", "—", "статья", "опубликовано"],
    ["/okna/zao", "окна зао сроки", "ЗАО", "срок есть", "опубликовано"],
  ];
  return (
    <Frame
      title="Посадочные · список"
      caption="Кластер, город, что уже на странице. Клон «для всех районов» сюда не попадает."
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[14px] font-semibold">СМ-Клиника · 18 URL</div>
        <span className="text-[12px] text-muted">только где есть точка или выезд</span>
      </div>
      <div className="table-wrap mt-3">
        <table className="data min-w-[36rem]">
          <thead>
            <tr>
              <th>Адрес</th>
              <th>Кластер</th>
              <th>Город</th>
              <th>На странице</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td className="font-semibold">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

export function LandingsLinksMock() {
  return (
    <Frame
      title="Перелинковка кластера"
      caption="Статья тянет услугу. Услуга не кормит архив. Анкор — как говорят люди, не «купить купить»."
    >
      <div className="grid gap-3 text-[13px] md:grid-cols-3">
        <div className="rounded-xl border border-line bg-bg p-3">
          <div className="font-semibold">/stati/podgotovka</div>
          <p className="mt-1 text-muted">как готовиться к узи</p>
          <p className="mt-3 font-semibold text-orange">ведёт на → /uzi</p>
        </div>
        <div className="rounded-xl border border-orange bg-orange-soft p-3">
          <div className="font-semibold">/uzi</div>
          <p className="mt-1 text-muted">цена, врач, запись</p>
          <p className="mt-3 font-semibold">коммерция кластера</p>
        </div>
        <div className="rounded-xl border border-line bg-bg p-3">
          <div className="font-semibold">/uzi/sokol</div>
          <p className="mt-1 text-muted">филиал, метро Сокол</p>
          <p className="mt-3 font-semibold text-orange">← с /uzi, не клон</p>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-muted">
        Информационный URL не конкурирует с карточкой услуги. Районная страница
        только если туда можно приехать.
      </p>
    </Frame>
  );
}
