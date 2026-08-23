import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { RobotsBotsMock, RobotsFileMock } from "@/components/TechMocks";
import { SITE } from "@/lib/site";

const faqs = [
  {
    q: "Вы сами правите robots.txt на хостинге?",
    a: "Нет. Готовим черновик: что закрыто зря, кого пустить, какая строка Sitemap. Вы смотрите и подтверждаете. Кабинет сам файл не заливает.",
  },
  {
    q: "Если закрыть блог «для людей», поиск всё равно найдёт?",
    a: "Нет. Яндекс и Google читают тот же robots. GigaChat тоже. Закрытый «блог для людей» — частая причина, почему справку не индексируют, а модель берёт агрегатор.",
  },
  {
    q: "Нужны отдельные правила для каждого робота?",
    a: "Иногда да. Disallow для GPTBot не обязан совпадать с YandexBot. Мы показываем, кто упирается куда, и не копируем один запрет на всех «на всякий случай».",
  },
  {
    q: "llms.txt заменяет robots?",
    a: "Нет. robots решает, зайдёт ли робот. llms.txt — короткий указатель, если робот уже внутри. Без открытого доступа файл в корне ничего не чинит.",
  },
];

export const metadata: Metadata = {
  title: "robots.txt: кого пускаем на сайт — Яндекс, Google, GigaChat",
  description:
    "Как INNSONT читает robots.txt: Яндекс, Google, Bing, роботы моделей. Черновик правок без автопубликации. Закрытый блог «для людей» ломает индекс.",
  keywords: [
    "robots.txt",
    "robots txt Яндекс",
    "закрыть сайт от роботов",
    "User-agent Yandex",
    "Allow Disallow SEO",
  ],
  alternates: { canonical: "/seo/robots-txt" },
  openGraph: {
    title: "robots.txt — INNSONT",
    description:
      "Смотрим, кого пускает файл и куда робот упирается. Правка только после вашего согласия.",
    url: "/seo/robots-txt",
    locale: "ru_RU",
    type: "website",
  },
};

export default function Page() {
  return (
    <div>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "robots.txt",
            description: metadata.description,
            url: `${SITE.url}/seo/robots-txt`,
            inLanguage: "ru-RU",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <article className="mx-auto max-w-[800px] px-5 py-14">
        <Breadcrumbs path="/seo/robots-txt" lastName="robots.txt" />
        <p className="text-sm text-muted">SEO · техника</p>
        <h1 className="mt-3 text-4xl leading-[1.12] md:text-5xl">
          robots.txt мы читаем так же, как Яндекс и робот модели
        </h1>
        <p className="mt-5 text-lg leading-relaxed">
          Владелец открывает сайт в браузере и видит меню. Поиск открывает
          robots.txt и решает, заходить ли дальше. Если блог или карточки услуг
          закрыты «на всякий случай», ни статья, ни цена не попадут в индекс.
          Мы это видим в той же очереди, что витрина и семантика — не отдельным
          «техническим аудитом на 80 страниц».
        </p>
        <p className="mt-4 leading-relaxed">
          Знаем типичные дыры: Disallow: / на User-agent: *, закрытый /blog при
          живых статьях, нет строки Sitemap, разные правила для Yandex и
          Googlebot скопированы слепо, GPTBot и робот GigaChat режутся тем же
          запретом, что служебный /kabinet. Каждую строку разбираем по роботу,
          не одним запретом на всех.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Показать ваш robots
          </Link>
          <Link href="/seo/tekhnicheskiy-audit" className="btn-outline">
            Технический аудит
          </Link>
        </div>

        <RobotsFileMock />

        <h2 className="mt-14 text-2xl md:text-[28px]">Что мы смотрим, чего не делает чекер из интернета</h2>
        <p className="mt-4 leading-relaxed">
          Онлайн-проверка «robots валиден» скажет, что синтаксис живой. Нам
          нужно другое: какие URL из ядра Wordstat закрыты, видит ли их Яндекс,
          видит ли Google, дойдёт ли GigaChat до абзаца с ценой. Один и тот же
          Disallow для человека в браузере ничего не значит — он файл не читает.
        </p>
        <p className="mt-4 leading-relaxed">
          Host и Clean-param — про Яндекс. Sitemap — про обоих. Allow/Disallow
          для Googlebot не обязан совпадать с Yandex. Если закрыли фильтры
          каталога, это нормально. Если закрыли /uzi, потому что «там форма» —
          робот не увидит услугу, а статья в блоге будет висеть в пустоте.
        </p>

        <RobotsBotsMock />

        <h2 className="mt-14 text-2xl md:text-[28px]">Чем это сильнее «отдать программисту»</h2>
        <p className="mt-4 leading-relaxed">
          Программист правит файл, когда приходит тикет «откройте блог». Мы
          кладём конкретную строку в очередь недели: зачем открыть, кого это
          пустит, что случится с индексом. Черновик смотрите вы. Если строка
          спорная — оставляем как есть. Кабинет не живёт на FTP без человека.
        </p>
        <p className="mt-4 leading-relaxed">
          Связка дальше простая. Открыли карточку —{" "}
          <Link href="/seo/kommercheskie-faktory" className="font-semibold text-orange">
            ставим цену
          </Link>
          . Есть спрос в{" "}
          <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
            Wordstat
          </Link>
          {" "}и нет URL —{" "}
          <Link href="/seo/posadochnye" className="font-semibold text-orange">
            посадочная
          </Link>
          . Робот ходит, а регион «вся Россия» —{" "}
          <Link href="/seo/vebmaster" className="font-semibold text-orange">
            Вебмастер
          </Link>
          . Файл robots сам по себе топ не двигает. Без него остальное часто
          бесполезно.
        </p>

        <PageAdvantages path="/seo/robots-txt" />
        <FaqList items={faqs} />
        <SeeAlso
          links={[
            { href: "/seo/tekhnicheskiy-audit", title: "Технический аудит" },
            { href: "/seo/posadochnye", title: "Посадочные страницы" },
            { href: "/seo/vebmaster", title: "Яндекс Вебмастер" },
            { href: "/seo/search-console", title: "Search Console" },
            { href: "/instrumenty/proverka-krawlerov", title: "Проверка роботов" },
            { href: "/instrumenty/llms-txt", title: "Генератор llms.txt" },
          ]}
        />
      </article>
      <CtaBand
        title="Проверим, кого пускает ваш robots.txt"
        text="Яндекс, Google и робот GigaChat. Строки, которые закрывают витрину, покажем до того, как писать новую статью."
      />
    </div>
  );
}
