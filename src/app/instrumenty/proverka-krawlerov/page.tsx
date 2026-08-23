import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";
import { CrawlChecker } from "@/components/CrawlChecker";
import { SITE } from "@/lib/site";
import { FaqList } from "@/components/FaqList";

const faqs = [
  {
    q: "Что значит «робот видит страницу»?",
    a: "Он запросил URL и в первом HTML есть текст, который можно процитировать. Если человеку страница красивая, а в ответе сервера пустой #root — для GPTBot и GigaChat её нет.",
  },
  {
    q: "Яндекс же умеет JavaScript?",
    a: "Частично. Google тоже иногда отрисовывает. Не считайте, что так умеют все. Робот GigaChat и GPTBot чаще читают сырой ответ. Надёжнее отдать текст сразу.",
  },
  {
    q: "Как закрыть сайт от GPTBot и не закрыть Яндекс?",
    a: "В robots.txt правила пишутся на каждого робота отдельно. Disallow для GPTBot не обязан закрывать YandexBot. Проверьте синтаксис, прежде чем выкладывать.",
  },
  {
    q: "Сайт на Тильде / чистом React. Что делать?",
    a: "Вынести цену, заголовок и первый абзац в HTML с сервера. Потом прогнать проверку ещё раз. Если слов в первом ответе ноль — модели цитировать нечего.",
  },
  {
    q: "Это замена Вебмастеру?",
    a: "Нет. Вебмастер и Search Console — про индекс поиска. Здесь — про то, пустой ли HTML для нейросетей. Оба слоя нужны.",
  },
];

export default function Page() {
  return (
    <div className="rays">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Проверка обхода роботами",
            url: `${SITE.url}/instrumenty/proverka-krawlerov`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            isAccessibleForFree: true,
            provider: { "@type": "Organization", name: SITE.name },
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
      <article className="mx-auto max-w-[1100px] px-5 py-12">
        <Breadcrumbs path="/instrumenty/proverka-krawlerov" lastName="Проверка обхода" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Бесплатно
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.08] md:text-6xl">
          Что видит робот. Не то, что видите вы в браузере.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3a3632]">
          Запрашиваем страницу так, как её читают Яндекс, GPTBot и GigaChat: без
          вашего Chrome и без выполнения скриптов. Если в ответе пусто — модели
          цитировать нечего, даже если макет красивый.
        </p>

        <div className="mt-8">
          <CrawlChecker />
        </div>

        <section className="mt-20">
          <h2 className="text-3xl md:text-4xl">Что смотрим в отчёте</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                "Слова в сыром HTML",
                "Есть ли цена, заголовок и абзац до JavaScript. Ноль слов — типичная Тильда или SPA.",
              ],
              [
                "Кого пускает robots",
                "YandexBot, Googlebot, GPTBot, робот GigaChat — по отдельности. Один Disallow не равен всем.",
              ],
              [
                "Как собрана страница",
                "Сервер сразу отдал текст, часть дорисовал скрипт или в ответе только пустой корневой блок.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="card p-5">
                <h3 className="text-lg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Каких роботов отличаем</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            В России важны не шестнадцать американских имён. Важны те, кто
            реально ходит на коммерческий сайт.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["YandexBot", "Индекс и подсказки Алисы. Закрыли его — не будет ни поиска, ни части ответов."],
              ["Googlebot", "Индекс Google. Иногда отрисовывает JS. Не образец для остальных."],
              ["GPTBot", "Читает HTML для обучения и цитат. Скрипты не запускает. Часто упирается в Disallow «на всякий случай»."],
              ["GigaChat", "Нужен открытый текст. Карточка за логином или пустой #root — вас не из чего назвать."],
            ].map(([t, d]) => (
              <div key={t} className="card p-5">
                <h3 className="text-lg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <FaqList items={faqs} />

        <p className="mt-12 max-w-2xl text-[16px] leading-relaxed text-[#3a3632]">
          Проверка говорит, пустой ли первый ответ. Кто ходил на сайт за месяц —
          в{" "}
          <Link href="/platforma/analitika-agentov" className="font-semibold text-orange">
            аналитике роботов
          </Link>
          . Закрытый blog чинится в{" "}
          <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
            очереди
          </Link>
          , не «ещё одной статьёй».
        </p>

        <PageAdvantages path="/instrumenty/proverka-krawlerov" />
        <SeeAlso
          links={[
            {
              href: "/instrumenty/llms-txt",
              title: "Генератор llms.txt",
              desc: "Короткий указатель, если робот уже дошёл",
            },
            {
              href: "/platforma/analitika-agentov",
              title: "Аналитика роботов",
              desc: "Лог: кто стучался и какой код получил",
            },
            { href: "/seo/tekhnicheskiy-audit", title: "Технический аудит", desc: "Если 403 не один, а система" },
            { href: "/resursy/rukovodstvo-geo", title: "Руководство GEO", desc: "Сначала доступ, потом цитата" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала текст в HTML. Потом ждать цитату."
        text="Проверим, не пустой ли первый ответ для Яндекса, GPTBot и GigaChat. Без почты и без обещания топа."
      />
    </div>
  );
}
