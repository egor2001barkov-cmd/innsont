export const metadata = { robots: { index: false, follow: false } };

export default function UiMock() {
  return (
    <div className="space-y-16 bg-[#f3eee6] p-8">
      <Screen id="ui-vidimost" title="Мониторинг видимости">
        <div className="flex items-center justify-between text-sm">
          <b>Промпты · регион Россия</b>
          <span className="text-muted">обновлено сегодня 07:10</span>
        </div>
        <table className="data mt-4">
          <thead>
            <tr>
              <th>Промпт</th>
              <th>Яндекс</th>
              <th>GigaChat</th>
              <th>ChatGPT</th>
              <th>Доля</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["вклад в рублях 2026", "3", "есть", "нет", "21%"],
              ["открыть ИИС", "6", "есть", "есть", "38%"],
              ["накопительный счёт", "2", "есть", "есть", "44%"],
              ["брокер дивиденды", "8", "нет", "нет", "9%"],
            ].map((r) => (
              <tr key={r[0]}>
                {r.map((c) => (
                  <td key={c}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Screen>
      <Screen id="ui-statyi" title="Автор статей">
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <div className="space-y-2 text-sm">
            <div className="font-semibold">Бриф</div>
            <div className="rounded-xl bg-[#f6f1e8] p-3">Тема: вклад 2026</div>
            <div className="rounded-xl bg-[#f6f1e8] p-3">Голос: экспертный</div>
            <div className="rounded-xl bg-[#fff1e8] p-3 text-orange">Шаг 9/14 · FAQ</div>
          </div>
          <div className="rounded-xl bg-[#f6f1e8] p-4 text-sm leading-relaxed">
            <b>Короткий ответ.</b> Если выбирать вклад в 2026, смотрите ставку, срок
            и страховку АСВ. Таблица сравнения и дата обновления — ниже.
          </div>
        </div>
      </Screen>
      <Screen id="ui-deystviya" title="Центр действий">
        <div className="space-y-2 text-sm">
          {[
            ["Высокий", "Открыть /blog для GPTBot"],
            ["Высокий", "Добавить цены и оплату на /vklady"],
            ["Средний", "FAQ: чем ИИС отличается от вклада"],
            ["Средний", "Регион Москва в Вебмастере"],
          ].map(([l, t]) => (
            <div key={t} className="flex items-center justify-between rounded-xl bg-[#f6f1e8] px-4 py-3">
              <span>{t}</span>
              <span className="text-xs font-bold uppercase text-orange">{l}</span>
            </div>
          ))}
        </div>
      </Screen>
      <Screen id="ui-seo" title="SEO-контур Яндекс">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {[
            ["Позиции в топ-10", "18"],
            ["Ошибки Вебмастера", "2"],
            ["Страниц без title", "0"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-[#f6f1e8] p-4">
              <div className="text-2xl font-semibold">{v}</div>
              <div className="mt-1 text-muted">{k}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Регион: Москва · зеркало: www · коммерческие факторы: 7/10
        </p>
      </Screen>
    </div>
  );
}

function Screen({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="card mx-auto max-w-[920px] p-6">
      <div className="wordmark mb-4 text-[11px] text-orange">INSONT</div>
      <div className="mb-4 text-lg font-semibold">{title}</div>
      {children}
    </section>
  );
}
