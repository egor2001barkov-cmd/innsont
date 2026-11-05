import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CannibalizationTool } from "@/components/tools/CannibalizationTool";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Проверка каннибализации: найти страницы, конкурирующие за один запрос",
  description:
    "Бесплатный онлайн-инструмент: вставьте заголовки страниц — найдём пары с пересекающимся интентом. Скор, общие слова, рекомендации. Без регистрации.",
  alternates: { canonical: "/instrumenty/kanibalizatsiya" },
};

const FAQ = [
  { q: "Что такое каннибализация запросов?", a: "Это когда две и более страницы вашего сайта конкурируют за один поисковый запрос. Поисковик выбирает одну, а вторая теряет позиции. Обе проседают." },
  { q: "Как инструмент находит конфликты?", a: "Сравнивает значимые слова в заголовках (title, H1) попарно. Если совпадение ≥50% (Jaccard), или ≥3 общих слова, или ≥2 длинных общих слова — страницы в конфликте." },
  { q: "Что делать с конфликтующими страницами?", a: "Оставить одну (сильнейшую), вторую — 301-редирект или переработать под другой интент. Подробнее — в статье «Каннибализация ключей»." },
  { q: "Какие заголовки вставлять?", a: "Title или H1 каждой страницы, по одному на строку. Можно скопировать из sitemap, CMS или Search Console." },
  { q: "Нужна ли регистрация?", a: "Нет. Лимит: 5 проверок в 10 минут с одного IP." },
];

export default function CannibalizationPage() {
  return (
    <div className="mx-auto max-w-[860px] px-5 py-14">
      <Breadcrumbs path="/instrumenty/kanibalizatsiya" />
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-orange">Инструменты</p>
      <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
        Проверка каннибализации запросов
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Вставьте заголовки страниц — найдём пары с пересекающимся интентом.
        Общие слова, серьёзность, рекомендация по каждой паре. Без регистрации.
      </p>

      {/* Перелинковка */}
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
        <Link href="/instrumenty/ochelovechivatel" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Очеловечиватель текста
        </Link>
        <Link href="/blog/kanibalizaciya-klyuchevyh-zaprosov" className="rounded-full border border-line px-3 py-1 text-muted hover:border-orange hover:text-orange">
          Гайд: каннибализация ключей →
        </Link>
      </div>

      {/* Инструмент */}
      <div className="mt-8">
        <CannibalizationTool />
      </div>

      {/* Как это работает */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Как читать результат</h2>
        <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-[#3a3632]">
          <p>
            <b>Высокая серьёзность</b> — страницы делят ≥4 значимых слова. Скорее всего,
            они уже конкурируют в выдаче. Действие: 301 или переработка.
          </p>
          <p>
            <b>Средняя</b> — 2–3 общих слова. Стоит развести заголовки под разные интенты
            («цена» vs «как выбрать»).
          </p>
          <p>
            <b>Низкая</b> — пересечение в 1 длинном слове. Возможно, случайность,
            но проверьте внутренние ссылки.
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

      {/* Перелинковка: статьи */}
      <div className="mt-12 rounded-2xl bg-bg p-6">
        <h3 className="text-lg font-semibold">Почитать по теме</h3>
        <ul className="mt-3 space-y-2 text-[15px]">
          <li>
            <Link href="/blog/kanibalizaciya-klyuchevyh-zaprosov" className="text-orange hover:underline">
              Каннибализация ключей: как найти и склеить →
            </Link>
          </li>
          <li>
            <Link href="/blog/kak-proverit-i-uvelichit-indeksaciyu-sayta" className="text-orange hover:underline">
              Сколько страниц сайта в индексе и как увеличить →
            </Link>
          </li>
          <li>
            <Link href="/blog/wordstat-instrukciya-s-chastotoy" className="text-orange hover:underline">
              Wordstat: инструкция с операторами →
            </Link>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-2xl border-2 border-orange bg-gradient-to-br from-orange-50 to-white p-6 text-center">
        <p className="text-lg font-semibold">Проверить весь сайт автоматически?</p>
        <p className="mt-1 text-sm text-muted">
          В кабинете INSONT каннибализация проверяется по статьям проекта + даёт 301-рекомендации.
        </p>
        <Link href="/registratsiya" className="btn-primary mt-4">
          Попробовать бесплатно →
        </Link>
      </div>

      <PageAdvantages path="/instrumenty/kanibalizatsiya" />
    </div>
  );
}
