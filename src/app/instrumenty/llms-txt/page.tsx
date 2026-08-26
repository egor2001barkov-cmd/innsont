import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";
import { CompareTable } from "@/components/ExploreMocks";
import { LlmsGenerator } from "@/components/LlmsGenerator";
import { SITE } from "@/lib/site";
import { FaqList } from "@/components/FaqList";

const faqs = [
  {
    q: "Это официальный стандарт?",
    a: "Нет. Предложение с llmstxt.org. Яндекс и Google его не требуют. Модели могут прочитать — или пройти мимо. Файл стоит минут, не бюджет.",
  },
  {
    q: "От него вырастет цитирование в ChatGPT?",
    a: "Само по себе — нет. Он помогает понять сайт, если робот уже дошёл. Если /blog закрыт или на карточке нет цены, файл ничего не чинит.",
  },
  {
    q: "Google и Яндекс смотрят llms.txt в поиске?",
    a: "Нет. На позиции в выдаче он не влияет. Для поиска по-прежнему robots, карта сайта, Вебмастер и Search Console.",
  },
  {
    q: "Сколько страниц класть?",
    a: "Короткий список: главное, тарифы, справка, две-три сильные посадочные. Не весь каталог. Архив — это sitemap.xml.",
  },
  {
    q: "Куда класть файл?",
    a: "В корень: vash-site.ru/llms.txt. WordPress — в корень сайта, не в wp-content. Битрикс и Тильда — в корень хостинга или редирект. Next — public/llms.txt.",
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
            name: "Генератор llms.txt",
            url: `${SITE.url}/instrumenty/llms-txt`,
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
        <Breadcrumbs path="/instrumenty/llms-txt" lastName="Генератор llms.txt" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Бесплатно
        </p>
        <div className="mt-4 grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl leading-[1.08] md:text-6xl">
              Свободный генератор llms.txt для любого сайта
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#3a3632]">
              Введите домен и список страниц. Получите markdown, который можно
              положить в корень рядом с robots.txt. Весь файл сразу, без почты и
              без нашего имени внутри.
            </p>
            <p className="mt-3 text-sm text-muted">
              Это не замена витрине и не билет в ответ GigaChat. Короткий
              указатель: что модели читать первым.
            </p>
          </div>
          <LlmsGenerator />
        </div>

        <section className="mt-20">
          <h2 className="text-3xl md:text-4xl">Что такое llms.txt</h2>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Один markdown в корне домена: заголовок, одна строка «о чём сайт»,
            потом главные страницы с короткой пометкой. Когда модель хочет
            понять, что вы публикуете, ей проще прочитать этот список, чем
            гадать по меню.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                "Это текст, не конфиг",
                "Никаких Allow и Disallow. Заголовки и ссылки, которые можно прочитать за один проход.",
              ],
              [
                "Это короткий список, не архив",
                "Важные страницы. Свалка всех URL — уже есть sitemap.xml, модели его и так знают.",
              ],
              [
                "Это предложение, не стандарт",
                "Никто не обязан его читать. Стоит минуты. Если не поможет — не навредит поиску.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="card p-5">
                <h3 className="text-lg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card mt-16 p-7 md:p-10">
          <h2 className="text-3xl">Три файла, три работы</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#3a3632]">
            Они не заменяют друг друга. На нормальном сайте обычно есть все три.
          </p>
          <CompareTable
            leftTitle="robots.txt / sitemap"
            rightTitle="llms.txt"
            rows={[
              ["Для кого", "Роботы поиска: Яндекс, Google", "Языковые модели"],
              ["Что говорит", "Что можно обходить / какие URL есть", "Какие страницы главные и о чём они"],
              ["Формат", "Директивы и XML", "Обычный markdown"],
              ["Описания", "Нет", "Да, коротко"],
              ["Обязателен", "Нет, но без robots легко закрыть лишнее", "Нет"],
            ]}
          />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Три шага</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Страницы", "Берёте то, что человек должен увидеть первым: о компании, услуги, цены, справка. Не корзину и не личный кабинет."],
              ["2", "Пометки", "К каждой ссылке — зачем она. «Тарифы с датой», не «page»."],
              ["3", "В корень", "Кладёте файл на /llms.txt и открываете в браузере: должен быть простой текст."],
            ].map(([n, t, d]) => (
              <li key={n} className="card p-5">
                <div className="text-sm font-bold text-orange">{n}</div>
                <h3 className="mt-2 text-lg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Куда положить на хостинге</h2>
          <div className="table-wrap card mt-6">
            <table className="w-full min-w-[520px] text-left text-sm">
              <tbody>
                {[
                  ["Next.js", "public/llms.txt"],
                  ["WordPress", "Корень сайта, не wp-content"],
                  ["Битрикс", "Корень сайта или редирект с /llms.txt"],
                  ["Тильда", "Файл в корне или редирект с системного URL"],
                  ["Обычный хостинг", "public_html/llms.txt"],
                ].map(([a, b]) => (
                  <tr key={a} className="border-b border-line">
                    <td className="px-5 py-3 font-medium">{a}</td>
                    <td className="px-5 py-3 text-muted">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <FaqList items={faqs} />

        <p className="mt-12 max-w-2xl text-[16px] leading-relaxed text-[#3a3632]">
          Файл положили — легко. Понять, назвали ли вас в ответе, сложнее. Это{" "}
          <Link href="/platforma/monitoring-vidimosti" className="font-semibold text-orange">
            мониторинг видимости
          </Link>
          . Проверить, пускаете ли вы робота —{" "}
          <Link href="/instrumenty/proverka-krawlerov" className="font-semibold text-orange">
            проверка обхода
          </Link>
          .
        </p>

        <PageAdvantages path="/instrumenty/llms-txt" />
        <SeeAlso
          links={[
            {
              href: "/instrumenty/proverka-krawlerov",
              title: "Проверка роботов",
              desc: "GPTBot, GigaChat, Яндекс — пускаете или нет",
            },
            {
              href: "/resursy/rukovodstvo-geo",
              title: "Руководство AEO / GEO",
              desc: "Файл — мелочь. Сначала витрина и доступ",
            },
            { href: "/platforma/analitika-agentov", title: "Аналитика роботов", desc: "Кто реально ходил на сайт" },
            { href: "/tseny", title: "Тарифы" },
          ]}
        />
      </article>
      <CtaBand
        title="Файл — минута. Цитата — если есть что взять."
        text="Соберём llms.txt и заодно посмотрим, не закрыт ли сайт роботу. Без обещания, что ChatGPT сразу начнёт вас советовать."
      />
    </div>
  );
}
