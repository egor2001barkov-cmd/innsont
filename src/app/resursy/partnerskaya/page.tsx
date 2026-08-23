import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";
import { PageAdvantages } from "@/components/Advantages";
import { FaqList } from "@/components/FaqList";

function TrafficIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };
  switch (name) {
    case "groups":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.4" />
          <path d="M4.5 18c.4-2.6 2.2-4 4.5-4s4.1 1.4 4.5 4" />
          <circle cx="16" cy="8.4" r="2" />
          <path d="M15.2 14c1.8.3 3.2 1.5 3.8 4" />
        </svg>
      );
    case "banner":
      return (
        <svg {...common}>
          <rect x="3.5" y="6" width="17" height="12" rx="2" />
          <path d="M7 10h10M7 13.5h6" />
        </svg>
      );
    case "shop":
      return (
        <svg {...common}>
          <path d="M4 10h16l-1 10H5L4 10z" />
          <path d="M4 10l1.5-4h13L20 10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "video":
      return (
        <svg {...common}>
          <rect x="3.5" y="6" width="13" height="12" rx="2" />
          <path d="M16.5 10l4-2.5v9l-4-2.5" />
        </svg>
      );
    case "person":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5.5 19c.6-3.2 3-5 6.5-5s5.9 1.8 6.5 5" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v4h4M9 12h6M9 16h4" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
}

export const metadata: Metadata = {
  title: "Партнёрская программа — 20% год с оплаты клиента",
  description:
    "Привели компанию в INNSONT — 20% с её оплат 12 месяцев. Выплата от 1 000 ₽ на расчётный счёт. Для агентств и фрилансеров. Без саморефералов.",
  alternates: { canonical: "/resursy/partnerskaya" },
  openGraph: {
    title: "Партнёрская программа INNSONT",
    description:
      "20% с оплаты приведённого аккаунта год. Минимум к переводу 1 000 ₽. Окно ссылки 90 дней.",
    url: "/resursy/partnerskaya",
    locale: "ru_RU",
  },
};

const faqs = [
  {
    q: "Когда приходит первая выплата?",
    a: "Раз в месяц, после 10-го числа, за предыдущий календарный месяц. Если насчиталось меньше 1 000 ₽ — сумма переносится. Как накопится минимум, переведём всё сразу.",
  },
  {
    q: "Что если клиент ушёл и вернулся?",
    a: "12 месяцев считаем с его первой оплаты по вашей ссылке. Ушёл и оплатил снова в этом окне — процент ваш. После года — нет, если он не пришёл по новой ссылке как новый аккаунт.",
  },
  {
    q: "Можно ли вести клиента под своим брендом?",
    a: "Да. Клиент платит вам, вы платите нам. Кабинет без нашего логотипа. Процент считается от того, что вы переводите нам по тарифу Старт, Базовый или Рост.",
  },
  {
    q: "Почему нельзя привести свой же аккаунт?",
    a: "Иначе все оформят «скидку 20%» через себя. Программа для тех, кто приводит чужие компании, а не субсидирует свою подписку.",
  },
];

export default function Page() {
  return (
    <div className="rays">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Партнёрская программа INNSONT",
            url: `${SITE.url}/resursy/partnerskaya`,
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
      <article className="mx-auto max-w-[900px] px-5 py-14">
        <Breadcrumbs path="/resursy/partnerskaya" lastName="Партнёрская программа" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Партнёрам
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">Привели клиента — получаете 20% с его оплаты год</h1>
        <p className="mt-4 text-lg text-muted">
          Не «баллы» и не промокод на скидку. Живые деньги на расчётный счёт.
          Подходит агентству, фрилансеру и тому, кто уже ведёт SEO-клиентов и
          не хочет сам писать тексты и смотреть Вебмастер по ночам.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            ["20%", "с каждого платежа 12 месяцев с первой оплаты"],
            ["от 1 000 ₽", "минимум к переводу. 20% с оплаты, не с регистрации"],
            ["90 дней", "зарегистрировался по ссылке в этом окне — ваш"],
            ["Свой бренд", "клиент может платить вам, вы — нам"],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <div className="text-2xl font-semibold">{t}</div>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>

        <section className="card mt-12 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
            Пригласи друга
          </p>
          <h2 className="mt-2 text-3xl">Друг по ссылке — ваши лимиты +20%</h2>
          <p className="mt-3 text-muted">
            Отдельная реферальная программа для пользователей кабинета. Вы
            отправляете персональную ссылку. Друг регистрируется — у вас
            вырастают лимиты тарифа на 20%: промпты, статьи, аудиты, проекты.
            За второго друга ещё +20%, и так до восьми приглашений.
          </p>
          <ol className="mt-5 space-y-3 text-sm text-muted">
            <li>1. В кабинете откройте «Пригласить друга» и скопируйте ссылку вида /registratsiya?ref=ВАШКОД.</li>
            <li>2. Друг заходит по ссылке и создаёт аккаунт на свою почту — не на вашу.</li>
            <li>3. Лимиты пересчитываются сразу. Свой аккаунт по своей ссылке не считается.</li>
          </ol>
          <Link href="/kabinet/druzia" className="btn-primary mt-6 inline-flex">
            Получить ссылку в кабинете
          </Link>
        </section>

        <h2 className="mt-14 text-3xl">Как это работает простыми словами</h2>
        <ol className="mt-6 space-y-5">
          {[
            [
              "Берёте ссылку",
              "В кабинете партнёра есть персональная ссылка и UTM. Её можно поставить на сайт, в коммерческое предложение или отправить письмом.",
            ],
            [
              "Компания регистрируется",
              "Если человек зашёл по ссылке и зарегистрировался в течение 90 дней — аккаунт закреплён за вами. Потом купил Старт, Базовый или Рост.",
            ],
            [
              "Клиент платит нам (или вам)",
              "Обычный путь: клиент платит INNSONT, мы отдаём вам 20% с каждого счёта год. Путь агентства: клиент платит вам, вы нам — процент тот же, от нашей части.",
            ],
            [
              "Раз в месяц считаем и переводим",
              "После 10-го числа смотрим оплаты за прошлый месяц. Накопилось от 1 000 ₽ — перевод на расчётный счёт по договору. Меньше — ждём следующий месяц.",
            ],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1e8] text-sm font-bold text-orange">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold">{t}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 text-3xl">Сколько это в деньгах</h2>
        <p className="mt-4 leading-relaxed">
          Считаем от оплаты тарифа, без доп. мест и пакетов статей. Год — это 12
          счетов, если клиент не ушёл. При годовой оплате процент берём с суммы,
          которую клиент заплатил сразу.
        </p>
        <div className="table-wrap mt-6">
          <table className="data">
            <thead>
              <tr>
                <th>Тариф клиента</th>
                <th>Он платит в месяц</th>
                <th>Вам в месяц</th>
                <th>Вам за 12 месяцев</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Старт</td>
                <td>4 990 ₽</td>
                <td>998 ₽</td>
                <td>11 976 ₽</td>
              </tr>
              <tr>
                <td>Базовый</td>
                <td>11 990 ₽</td>
                <td>2 398 ₽</td>
                <td>28 776 ₽</td>
              </tr>
              <tr>
                <td>Рост</td>
                <td>24 990 ₽</td>
                <td>4 998 ₽</td>
                <td>59 976 ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Три клиента на Базовом — уже около 7 200 ₽ в месяц, или 86 000 ₽ за
          год. Enterprise считаем отдельно, если сделка прошла через вас: там
          чек другой, ставка договорная.
        </p>
        <p className="mt-3 text-sm">
          Какие тарифы что умеют — на странице{" "}
          <Link href="/tseny" className="font-semibold text-orange">
            цен
          </Link>
          .
        </p>

        <h2 className="mt-14 text-3xl">Кому это имеет смысл</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            [
              "SEO-агентство",
              "Клиенту нужен кабинет, а вам не хочется держать ещё двух копирайтеров. Ставите кабинет под своим брендом, ведёте стратегию, тексты и очередь делает INNSONT.",
            ],
            [
              "Фрилансер",
              "Ведете три сайта. Четвёртому продаёте подписку вместо того, чтобы брать ещё один абонент на себя.",
            ],
            [
              "Консультант по маркетингу",
              "Разово настроили воронку — оставили ссылку. Если компания останется в кабинете, процент идёт год без вашей еженедельной работы.",
            ],
            [
              "Студия на Тильде или Битриксе",
              "Сдали сайт и предлагаете продвижение. Не надо собирать «сеошный» отдел с нуля.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <h3 className="text-lg">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-3xl">Разрешённые виды трафика</h2>
        <p className="mt-4 leading-relaxed">
          Ссылку можно ставить там, где человек сам решает перейти. Серый
          закуп, дорвеи и накрутка регистраций — кабинет отключаем.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "groups",
              t: "Группы в соцсетях",
              d: "Реклама на страницах групп и в Telegram-каналах, где вас читают живые люди.",
            },
            {
              icon: "banner",
              t: "Баннерная реклама",
              d: "Статичные и анимированные баннеры на сайтах. Не сети с автокликом.",
            },
            {
              icon: "shop",
              t: "Витрина и сравнение цен",
              d: "Партнёрские ссылки на витринах товаров и в сервисах сравнения.",
            },
            {
              icon: "video",
              t: "Видеоблог",
              d: "Ролик, где видно продукт, а не пятисекундная врезка без смысла.",
            },
            {
              icon: "person",
              t: "Блогеры и влогеры",
              d: "Размещение у авторов, которым аудитория и так верит. Не накрученные охваты.",
            },
            {
              icon: "doc",
              t: "Контентный сайт",
              d: "Ссылка или баннер в статье, если тема уместна. Не простыня с анкорами.",
            },
            {
              icon: "target",
              t: "Таргет в соцсетях",
              d: "Объявления в соцсетях с понятным оффером. Без накрутки переходов.",
            },
            {
              icon: "plus",
              t: "Другие типы трафика",
              d: "Напишите при регистрации, откуда ведёте людей. Посмотрим, можно ли подключить.",
            },
          ].map((item) => (
            <div key={item.t} className="tile flex gap-3 p-4">
              <span className="tile-icon icon-sheen flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#b4531e]">
                <TrafficIcon name={item.icon} />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold leading-snug">{item.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-3xl">Что можно рассказывать клиенту</h2>
        <p className="mt-4 leading-relaxed">
          Не надо продавать «магию ИИ». Говорите так: сервис смотрит Яндекс и
          то, советуют ли компанию в GigaChat. Потом чинит витрину, метатеги и
          тексты. Без покупки ссылок. Как это выглядит на живых сайтах — в{" "}
          <Link href="/keysy" className="font-semibold text-orange">
            кейсах
          </Link>
          : СМ-Клиника, МойСклад, Фабрика Окон, Фоксфорд.
        </p>
        <p className="mt-3 leading-relaxed">
          Если клиент спрашивает «а это вообще работает на рынке» — дайте{" "}
          <Link href="/blog/issledovanie-ii-vidimosti-rf" className="font-semibold text-orange">
            исследование по России
          </Link>
          : там не обещания, а что двигалось вместе с видимостью в нейросетях.
        </p>

        <h2 className="mt-14 text-3xl">Правила — коротко и без мелкого шрифта</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-lg">Можно</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              <li>Своя ссылка на сайте, в КП, в рассылке</li>
              <li>Кабинет под вашим брендом: клиент не видит INNSONT</li>
              <li>Несколько клиентов на одном партнёрском кабинете</li>
              <li>Счёт юрлица, закрывающие через ЭДО</li>
            </ul>
          </div>
          <div className="card border-[#e8c4c0] bg-[#fff8f6] p-5">
            <h3 className="text-lg">Нельзя</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              <li>Привести себя, своё ИП и «дружественные» юрлица</li>
              <li>Покупать регистрации и накручивать лендинг</li>
              <li>Обещать клиенту топ за неделю от нашего имени</li>
              <li>Лить серый трафик и дорвеи на партнёрскую ссылку</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Нарушение — кабинет отключаем, невыплаченный процент сгорает. Спорить
          по почте {SITE.email} можно, но самореферал не согласуем.
        </p>

        <h2 className="mt-14 text-3xl">Как закрепить клиента</h2>
        <p className="mt-4 leading-relaxed">
          Только по cookie и ссылке. Сказал менеджеру «это я привёл» после
          регистрации — уже поздно. Окно 90 дней: человек перешёл, ушёл думать,
          вернулся и зарегистрировался — всё ещё ваш. Потом ссылка «протухает».
        </p>
        <p className="mt-3 leading-relaxed">
          Если два партнёра привели одного и того же — засчитываем того, по чьей
          ссылке была последняя переходка перед регистрацией.
        </p>

        <FaqList items={faqs} />

        <div className="card mt-14 p-6">
          <h2 className="text-2xl">Как начать</h2>
          <p className="mt-3 text-muted">
            Зарегистрируйтесь, напишите на {SITE.salesEmail} тему «партнёрка».
            Пришлём договор, реквизиты и ссылку. Для агентства сразу включим
            кабинет под вашим брендом.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/registratsiya" className="btn-primary">
              Открыть кабинет
            </Link>
            <Link href="/keysy" className="btn-outline">
              Показать клиенту кейсы
            </Link>
          </div>
        </div>
        <PageAdvantages path="/resursy/partnerskaya" />
      </article>
      <CtaBand />
    </div>
  );
}
