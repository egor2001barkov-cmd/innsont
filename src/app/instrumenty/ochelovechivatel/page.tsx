import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HumanizerTool } from "@/components/tools/HumanizerTool";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Очеловечиватель текста: проверить текст на ИИ-паттерны",
  description:
    "Бесплатный онлайн-инструмент: вставьте текст — найдём 18 ИИ-паттернов («не X, а Y», «Мораль:», «Давайте», «стоит отметить», триады). Скор, автоочистка, без регистрации.",
  alternates: { canonical: "/instrumenty/ochelovechivatel" },
};

const FAQ = [
  { q: "Что такое ИИ-паттерны в тексте?", a: "Это формулы, по которым генеративные модели пишут текст: контрасты «не X, а Y», финальные «морали», заходы «Давайте разберёмся». Человек так не пишет — и поисковики это замечают." },
  { q: "Зачем их убирать?", a: "Поисковики (Яндекс, Google) понижают страницы с шаблонным контентом. Читатели меньше доверяют «ИИ-тексту». Убрав паттерны, вы не меняете факты — только подачу." },
  { q: "Что именно находит инструмент?", a: "18 паттернов: «не X, а Y», «Мораль:», «Давайте разберём», «стоит отметить», «в современном мире», «играет ключевую роль», «инновационный», триады-перечисления, чат-хвосты и другие." },
  { q: "Автоочистка удаляет что-то важное?", a: "Нет. Автоочистка удаляет только безопасные паттерны: запятые-связки («стоит отметить,»), целые фразы-хвосты («Надеюсь, этот материал помог»). Факты, цифры и ссылки не трогаются." },
  { q: "Нужна ли регистрация?", a: "Нет, инструмент бесплатный и работает без регистрации. Лимит: 10 проверок в 10 минут с одного IP." },
];

export default function HumanizerPage() {
  return (
    <div className="mx-auto max-w-[860px] px-5 py-14">
      <Breadcrumbs path="/instrumenty/ochelovechivatel" />
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-orange">Инструменты</p>
      <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
        Очеловечиватель текста
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Вставьте текст — покажем, какие ИИ-паттерны в нём есть, где именно и как убрать.
        18 правил, скор «человечности», автоочистка. Без регистрации.
      </p>

      {/* Перелинковка: связанные инструменты */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href="/instrumenty" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Все инструменты
        </Link>
        <Link href="/instrumenty/llms-txt" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Генератор llms.txt
        </Link>
        <Link href="/instrumenty/proverka-krawlerov" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Проверка ИИ-ботов
        </Link>
        <Link href="/instrumenty/kanibalizatsiya" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Проверка каннибализации
        </Link>
        <Link href="/blog/ii-kontent-i-pravila-poiska" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Гайд: ИИ-контент и правила поиска →
        </Link>
      </div>

      {/* Инструмент */}
      <div className="mt-8">
        <HumanizerTool />
      </div>

      {/* Как это работает */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Как читать результат</h2>
        <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-[#3a3632]">
          <p>
            <b>Скор 0–100</b> — доля «человечности» текста. 80+ — чисто, 50–79 — есть что убрать,
            ниже 50 — текст читается как сгенерированный.
          </p>
          <p>
            Каждый паттерн помечен серьёзностью: <b>высокая</b> — «не X, а Y», «Мораль:», «Давайте»
            (одно вхождение уже сигнал); <b>средняя</b> — «стоит отметить», «В заключение»,
            «инновационный»; <b>низкая</b> — триады, «свидетельствует».
          </p>
          <p>
            Фразы в кавычках (цитаты, примеры плохих фраз) не считаются — инструмент отличает
            использование паттерна от его упоминания.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Частые вопросы</h2>
        <div className="mt-4 space-y-5">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="text-[17px] font-semibold">{f.q}</h3>
              <p className="mt-1 text-[15px] leading-[1.7] text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Перелинковка: статьи по теме */}
      <div className="mt-12 rounded-2xl bg-bg p-6">
        <h3 className="text-lg font-semibold">Почитать по теме</h3>
        <ul className="mt-3 space-y-2 text-[15px]">
          <li>
            <Link href="/blog/ii-kontent-i-pravila-poiska" className="text-orange hover:underline">
              ИИ-контент и поиск: что разрешено Яндексу и Google в 2026 году →
            </Link>
          </li>
          <li>
            <Link href="/blog/title-i-description-normy-dliny-primery" className="text-orange hover:underline">
              Title и description: нормы длины и живые примеры →
            </Link>
          </li>
          <li>
            <Link href="/blog/kak-vybrat-seo-podryadchika" className="text-orange hover:underline">
              Как выбрать SEO-подрядчика: 20 вопросов →
            </Link>
          </li>
        </ul>
      </div>

      {/* CTA в кабинет */}
      <div className="mt-8 rounded-2xl border-2 border-orange bg-gradient-to-br from-orange-50 to-white p-6 text-center">
        <p className="text-lg font-semibold">Нужна проверка статей целого сайта?</p>
        <p className="mt-1 text-sm text-muted">
          В кабинете INSONT очеловечиватель работает с библиотекой контента: скан после каждой генерации.
        </p>
        <Link href="/registratsiya" className="btn-primary mt-4">
          Попробовать бесплатно →
        </Link>
      </div>

      <PageAdvantages path="/instrumenty/ochelovechivatel" />
    </div>
  );
}
