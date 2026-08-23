import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Руководство AEO и GEO — как попасть в ответы нейросетей",
  description:
    "Как сайт попадает в ответы GigaChat, ChatGPT и Алисы. Структура страницы, обход роботов, цитаты, замер. Рядом с продвижением в Яндексе и Google. Только Россия.",
  alternates: { canonical: "/resursy/rukovodstvo-geo" },
  openGraph: {
    title: "Руководство AEO / GEO — INSONT",
    description:
      "Практический гайд: чем GEO отличается от SEO, какую страницу цитируют модели и как это мерить без сказки про миллиарды диалогов.",
    url: "/resursy/rukovodstvo-geo",
    locale: "ru_RU",
  },
};

function Shot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="card my-8 overflow-hidden p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-2xl" />
      <figcaption className="px-2 py-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

function Sub({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="card p-5">
      <div className="text-xs font-bold tabular-nums text-orange">{n}</div>
      <h3 className="mt-1 text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#3a3632]">{children}</p>
    </article>
  );
}

export default function Page() {
  return (
    <div className="rays">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Руководство AEO / GEO",
          description:
            "Как сайт попадает в ответы GigaChat, ChatGPT и Алисы рядом с поиском в Яндексе и Google.",
          author: { "@type": "Organization", name: SITE.name },
          inLanguage: "ru-RU",
        }}
      />
      <article className="mx-auto max-w-[1000px] px-5 py-14">
        <Breadcrumbs path="/resursy/rukovodstvo-geo" lastName="Руководство AEO / GEO" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Учиться
        </p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
          Как сайт попадает в ответ нейросети — и не выпадает из поиска
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3a3632]">
          Коротко: человек в Яндексе смотрит список сайтов. В GigaChat спрашивает,
          кого выбрать. Это разные окна. Руководство — про второе, не вместо
          первого. Страна одна: Россия.
        </p>

        <nav className="card mt-8 grid gap-2 p-5 text-sm sm:grid-cols-2">
          {[
            ["#sloi", "Три слоя: поиск, блок, модель"],
            ["#stranica", "Какую страницу цитируют"],
            ["#roboty", "Пустить робота"],
            ["#vne", "Откуда модели берут факты"],
            ["#ochered", "Очередь, не отчёт"],
            ["#zamer", "Что мерить на 14 и 28 день"],
          ].map(([href, t]) => (
            <a key={href} href={href} className="font-semibold text-orange">
              {t} →
            </a>
          ))}
        </nav>

        <section id="sloi" className="mt-16">
          <h2 className="text-3xl">Три слоя. Их путают чаще, чем хочется.</h2>
          <p className="mt-4 leading-relaxed text-[#3a3632]">
            SEO — индекс и выдача{" "}
            <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
              Яндекса
            </Link>{" "}
            и{" "}
            <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
              Google
            </Link>
            . AEO — короткий блок ответа над выдачей, если он вообще есть. GEO —
            ответ генеративной модели: GigaChat, Алиса, YandexGPT, ChatGPT,
            Gemini. Мы смотрим все три в одном кабинете, потому что иначе
            команда чинит одно и пропускает заявки из другого.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Sub n="01" title="Поиск">
              Список сайтов. Регион, витрина, title, Вебмастер и Search Console.
              Сюда по-прежнему приходит основная коммерция в РФ.
            </Sub>
            <Sub n="02" title="Блок ответа">
              Иногда Яндекс или Google отвечают сами, без клика. Тогда важны
              первый абзац, таблица и дата, а не простыня текста.
            </Sub>
            <Sub n="03" title="Модель">
              Человек спрашивает «какой вклад открыть». Модель называет два-три
              имени. Вас нет — если на сайте нечего взять одним абзацем.
            </Sub>
          </div>
          <Shot
            src="/ui/ui-seo.png"
            alt="Скриншот кабинета INSONT: позиции в топ-10 Яндекса, ошибки Вебмастера, страницы без title"
            caption="Слой поиска. Регион Москва, зеркало, коммерческие факторы. Без этого GEO не с чего начинать."
          />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Люди спрашивают модель иначе, чем ищут</h2>
          <p className="mt-4 leading-relaxed text-[#3a3632]">
            В{" "}
            <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
              Wordstat
            </Link>{" "}
            часто «вклад калькулятор». У модели — «какой вклад открыть, если
            боюсь курса». Это не повод выкинуть семантику. Это повод положить
            рядом{" "}
            <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
              объём ИИ-поиска
            </Link>
            : как часто формулировку вообще задают на русском. Цифры скромные.
            Десятки вопросов в месяц по узкой теме уже повод писать FAQ, не
            роман.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Sub n="Поиск" title="Как пишут в строке">
              Коротко, с городом, иногда с ценой. «УЗИ Сокольники», «окна Казань
              цена». Нужна посадочная, не гид.
            </Sub>
            <Sub n="Модель" title="Как спрашивают в чате">
              Предложением. «Какую клинику выбрать, если нужен терапевт вечером».
              Нужен абзац с фактом: цена, метро, запись.
            </Sub>
          </div>
        </section>

        <section id="stranica" className="mt-16">
          <h2 className="text-3xl">Какую страницу вообще можно процитировать</h2>
          <p className="mt-4 leading-relaxed text-[#3a3632]">
            Модель не читает ваш «комплексный подход». Она выдёргивает кусок.
            Если куска нет — берёт чужой. Так устроены рабочие страницы{" "}
            <Link href="/keysy/moysklad" className="font-semibold text-orange">
              МойСклада
            </Link>{" "}
            и{" "}
            <Link href="/keysy/centr-invest" className="font-semibold text-orange">
              «Центр-инвеста»
            </Link>
            : таблица, дата, первый абзац отвечает.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Sub n="1" title="Ответ в первом абзаце">
              Не слоган. Одно-два предложения, которые можно вставить в чат без
              правки.
            </Sub>
            <Sub n="2" title="Таблица или вилка">
              Ставка, цена приёма, срок доставки. С датой «обновлено». Вечный
              лендинг модели не любят.
            </Sub>
            <Sub n="3" title="Вопросы, которые уже задают">
              FAQ из живых формулировок, не из головы копирайтера. Их же
              спрашивают у Алисы.
            </Sub>
            <Sub n="4" title="Автор и дата">
              Кто отвечает и когда цифра свежая. Google это любит. Яндекс — тоже,
              если коммерция не врёт.
            </Sub>
            <Sub n="5" title="Чистый HTML">
              Текст в коде, не только после скрипта. Иначе робот модели видит
              пусто.
            </Sub>
            <Sub n="6" title="Одна тема на URL">
              Не каша «вклад + ИИС + ипотека». Кластер из{" "}
              <Link href="/strategiya/kontent" className="font-semibold text-orange">
                контент-стратегии
              </Link>
              .
            </Sub>
          </div>
          <Shot
            src="/ui/ui-statyi.png"
            alt="Скриншот кабинета INSONT: автор статей, бриф про вклад 2026 и короткий ответ в первом абзаце"
            caption="Так выглядит черновик, который потом можно цитировать: короткий ответ, дальше таблица и FAQ."
          />
          <p className="leading-relaxed text-[#3a3632]">
            Длинные страницы пишет{" "}
            <Link href="/platforma/avtor-statey" className="font-semibold text-orange">
              Автор
            </Link>
            . Карточку и короткий FAQ —{" "}
            <Link href="/platforma/kontent-agent" className="font-semibold text-orange">
              контент-агент
            </Link>
            . Голос один. Иначе сайт звучит как три подрядчика.
          </p>
        </section>

        <section id="roboty" className="mt-16">
          <h2 className="text-3xl">Если робот не заходит, цитировать нечего</h2>
          <p className="mt-4 leading-relaxed text-[#3a3632]">
            Половина «нас нет в GigaChat» — закрытый blog, 403 на справке,
            карточка врача за скриптом. Владелец видит красивый макет.{" "}
            <Link href="/platforma/ii-agenty" className="font-semibold text-orange">
              Агент
            </Link>{" "}
            ходит как Яндекс, Google, GPTBot и робот GigaChat. Метрика этих
            заходов не считает.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Sub n="A" title="robots.txt">
              Disallow «на всякий случай» часто режет как раз то, откуда модели
              берут FAQ. Проверка —{" "}
              <Link href="/instrumenty/proverka-krawlerov" className="font-semibold text-orange">
                здесь
              </Link>
              .
            </Sub>
            <Sub n="B" title="Код ответа">
              Человеку 200, роботу 403. Типично для фильтров и «записи». Смотрим
              в{" "}
              <Link href="/platforma/analitika-agentov" className="font-semibold text-orange">
                логе
              </Link>
              .
            </Sub>
            <Sub n="C" title="llms.txt">
              Короткий файл, который модели иногда читают. Не замена витрине.
              Генератор — в{" "}
              <Link href="/instrumenty/llms-txt" className="font-semibold text-orange">
                инструментах
              </Link>
              .
            </Sub>
          </div>
        </section>

        <section id="vne" className="mt-16">
          <h2 className="text-3xl">Большая часть цитат — не с вашего домена</h2>
          <p className="mt-4 leading-relaxed text-[#3a3632]">
            В России это VC, Дзен, Telegram, ПроДокторов, Банки.ру, отраслевые
            СМИ. Не Reddit и не Wikipedia в каждом ответе.{" "}
            <Link href="/platforma/issledovatel-brendov" className="font-semibold text-orange">
              Исследователь брендов
            </Link>{" "}
            показывает, кого называют вместо вас и откуда берут факт. Ссылки не
            покупаем. Несём цифру туда, откуда текст уже берут.
          </p>
          <Shot
            src="/ui/ui-vidimost.png"
            alt="Скриншот кабинета INSONT: позиция в Яндексе и упоминание бренда в GigaChat и ChatGPT"
            caption="Одна строка: место в поиске и назвали ли в ответе. Регион — Россия, не «десять рынков мира»."
          />
        </section>

        <section id="ochered" className="mt-16">
          <h2 className="text-3xl">Дальше очередь, не слайд для совета</h2>
          <p className="mt-4 leading-relaxed text-[#3a3632]">
            Трекер без работ — дорогое любопытство. После прогона оставляем 5–10
            задач: открыть раздел роботу, вернуть цену, написать FAQ, дать факт
            в подборку. Это{" "}
            <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
              Центр действий
            </Link>
            , с тарифа Рост. На Старте очередь смотрите сами по строкам
            мониторинга.
          </p>
          <Shot
            src="/ui/ui-deystviya.png"
            alt="Скриншот кабинета INSONT: очередь работ, открыть blog роботу, цены, FAQ, регион в Вебмастере"
            caption="Сначала то, что двигает заявки. Не «ещё двадцать статей в блог»."
          />
          <p className="leading-relaxed text-[#3a3632]">
            Каркас поиска — в{" "}
            <Link href="/strategiya/seo" className="font-semibold text-orange">
              SEO-стратегии
            </Link>
            . Что писать и что снять — в{" "}
            <Link href="/strategiya/kontent" className="font-semibold text-orange">
              контент-стратегии
            </Link>
            . GEO без витрины и региона не взлетает: Яндекс просто не пускает
            коммерцию.
          </p>
        </section>

        <section id="zamer" className="mt-16">
          <h2 className="text-3xl">Что мерить. Без «видимость +400%»</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Sub n="14 день" title="Сдвинулась ли строка">
              Позиция в Яндексе и Google по вашему региону. Есть ли имя в ответе
              GigaChat и ChatGPT по тем же формулировкам.
            </Sub>
            <Sub n="28 день" title="Пошли ли заявки">
              Запись, демо, КП с органики. Не «трафик». Если цитата есть, а
              заявок нет — на странице по-прежнему нельзя действовать.
            </Sub>
            <Sub n="Не мерим" title="Долю голоса на весь интернет">
              Считаем узкий список формулировок. Сорок промптов, не два
              миллиарда диалогов.
            </Sub>
            <Sub n="Не мерим" title="Топ за неделю">
              Если не выросло — переписываем смысл. Ссылки не докупаем. Правила
              — на странице{" "}
              <Link href="/seo/pravila-poiska" className="font-semibold text-orange">
                как не нарушать
              </Link>
              .
            </Sub>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Живые сайты, не теория</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
                СМ-Клиника
              </Link>
              <span className="text-[#3a3632]">
                {" "}
                — агрегатор забирал ответы, пока на услуге не было цены и врача.
              </span>
            </li>
            <li>
              <Link href="/keysy/moysklad" className="font-semibold text-orange">
                МойСклад
              </Link>
              <span className="text-[#3a3632]">
                {" "}
                — модели начали брать таблицу тарифов, не пресс-релиз.
              </span>
            </li>
            <li>
              <Link href="/keysy/centr-invest" className="font-semibold text-orange">
                Центр-инвест
              </Link>
              <span className="text-[#3a3632]">
                {" "}
                — ставка на сайте совпала с отделением, GigaChat перестал врать
                процентом.
              </span>
            </li>
          </ul>
        </section>

        <FaqList
          title="Коротко по вопросам"
          items={[
            {
              q: "GEO заменяет SEO?",
              a: "Нет. В коммерции РФ заявки чаще идут из поиска. GEO — второй слой: назвали ли вас, когда спросили «кого выбрать».",
            },
            {
              q: "С чего начать, если бюджет маленький?",
              a: "Витрина, регион, открытый robots. Потом 10–25 формулировок в мониторинге. Статьи — когда на карточке уже есть цена.",
            },
            {
              q: "Нужно ли llms.txt?",
              a: "Можно. Это не волшебство. Без цены и доступа роботу файл ничего не чинит.",
            },
            {
              q: "Это белый метод?",
              a: "Да. Читаем публичные ответы и выдачу. Не накручиваем поведение и не покупаем ссылки.",
            },
          ]}
        />

        <PageAdvantages path="/resursy/rukovodstvo-geo" />
        <SeeAlso
          title="Дальше по делу"
          links={[
            { href: "/strategiya", title: "Стратегии роста", desc: "Поиск и тексты в одной очереди" },
            { href: "/platforma/monitoring-vidimosti", title: "Мониторинг видимости", desc: "Яндекс, Google и модели в одной строке" },
            { href: "/platforma/obem-ii-poiska", title: "Объём ИИ-поиска", desc: "Как часто формулировку задают на русском" },
            { href: "/seo", title: "Продвижение в поиске", desc: "Слой, без которого GEO пустой" },
            { href: "/blog/issledovanie-ii-vidimosti-rf", title: "Исследование по РФ", desc: "Как модели отвечают на русском" },
            { href: "/tseny", title: "Тарифы", desc: "С чего можно начать смотреть свои формулировки" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала пустить робота и закрыть витрину."
        text="Покажем, что мешает вашему сайту попасть в ответ GigaChat — и что при этом не так в Яндексе."
      />
    </div>
  );
}
