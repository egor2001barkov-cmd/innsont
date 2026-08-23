import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { FaqList } from "@/components/FaqList";
import { PageAdvantages } from "@/components/Advantages";
import {
  SeoActionMock,
  SeoBeforeAfter,
  SeoFactorsMock,
  SeoKicker,
  SeoSerpMock,
  SeoStage,
  SeoWordstatMock,
} from "@/components/SeoPlay";
import { SITE } from "@/lib/site";

const faqs = [
  {
    q: "Вы работаете только с Яндексом?",
    a: "Нет. В коммерции РФ заявки чаще идут из Яндекса, поэтому регион, витрина и Вебмастер — в начале очереди. Google всё равно ведём: B2B, бренд, справка, часть людей туда просто привыкла. Bing обычно подхватывает те же страницы.",
  },
  {
    q: "Сколько стоит продвижение сайта?",
    a: "Кабинет от 4 990 ₽ в месяц, год на 10% дешевле. Это не «агентство под ключ за 150 тысяч»: вы видите очередь работ и подтверждаете публикацию. Подряд с людьми обычно дороже — сравнивайте не логотипы, а что входит в месяц.",
  },
  {
    q: "Гарантируете первую строчку?",
    a: "Нет. Кто обещает топ за неделю, чаще крутит поведение или покупает ссылки — потом сайт проседает. Мы обещаем понятную работу, замер на 14 и 28 день и то, что не полезем в серые схемы.",
  },
  {
    q: "Нужен ли Google, если клиенты из России?",
    a: "Да. Даже если Яндекс даёт основной поток, часть запросов живёт только там: бренд, сравнения, «отзывы», англоязычные формулировки. Search Console рядом с Вебмастером — не роскошь.",
  },
  {
    q: "Почему сайта нет в топе, хотя тексты написаны?",
    a: "Чаще всего нет цены, региона, нормального сниппета или робот не видит нужные URL. Статьи поверх дырявой витрины почти ничего не двигают. Сначала коммерция и техника, потом объём.",
  },
  {
    q: "Покупаете ссылки?",
    a: "Нет. Редакционные упоминания — да, если материал уместен. Биржи, сетки и накрутка ИКС в продукт не входят. Это прямо написано в оферте, не в мелком шрифте презентации.",
  },
];

export const metadata: Metadata = {
  title: "Продвижение сайта в Яндексе и Google — белое SEO",
  description:
    "Продвижение сайтов в Яндексе и Google: Wordstat, коммерческие факторы, Вебмастер, Search Console, полезные тексты. Без покупки ссылок и накрутки поведения. Россия.",
  keywords: [
    "продвижение сайта",
    "продвижение сайта в Яндексе",
    "продвижение сайта в Google",
    "SEO продвижение",
    "белое SEO",
    "Яндекс Вебмастер",
    "Wordstat",
    "коммерческие факторы",
    "вывод сайта в топ",
  ],
  alternates: { canonical: "/seo" },
  openGraph: {
    title: "Продвижение сайта в Яндексе и Google — INSONT",
    description:
      "Семантика, витрина, техника, тексты. Яндекс, Google и Bing в одном цикле. Без ссылок с бирж.",
    url: "/seo",
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
            "@type": "Service",
            name: "Продвижение сайта в Яндексе и Google",
            provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
            areaServed: "RU",
            serviceType: "SEO",
            description:
              "Белое продвижение сайтов в Яндексе, Google и Bing: семантика Wordstat, коммерческие факторы, техника, тексты. Без покупки ссылок.",
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
        <Breadcrumbs path="/seo" lastName="Продвижение в поиске" />
        <p className="text-sm text-muted">Яндекс · Google · Bing</p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.08] md:text-6xl">
          Продвижение сайта в Яндексе и Google — без покупки ссылок
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed">
          В России человека всё ещё чаще приводит поиск, не «узнаваемость в
          нейросети». Яндекс смотрит регион и витрину. Google — покрытие,
          скорость и страницу, на которой есть ответ. Мы закрываем оба кабинета
          и не имитируем спрос кликами.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Разобрать ваш сайт
          </Link>
          <Link href="/seo/skolko-stoit" className="btn-outline">
            Сколько это стоит
          </Link>
        </div>
        <p className="mt-8 max-w-3xl text-[17px] leading-[1.7]">
          Типичный разговор на старте: «нам написали 40 статей, позиций нет».
          Смотрим сайт — цены спрятаны, регион «вся Россия», карточки услуг
          закрыты в robots, title кричит КАПСЛОКОМ. Пока это так, объём текста
          почти не важен.{" "}
          <Link href="/seo/pochemu-net-v-tope" className="font-semibold hover:underline">
            Почему сайта нет в топе
          </Link>{" "}
          почти никогда не сводится к «мало ключей».
        </p>
        <p className="mt-4 max-w-3xl text-[17px] leading-[1.7]">
          Google в этом разговоре не приложение. Search Console показывает
          покрытие и запросы, которых нет в Wordstat: бренд, сравнения, отзывы,
          латиница. Если есть точка,{" "}
          <Link href="/seo/google-profil" className="font-semibold hover:underline">
            Google Профиль компании
          </Link>{" "}
          должен совпадать с сайтом так же, как карточка в Яндекс Бизнесе. С
          телефона страница должна открываться без мучений, иначе часть людей
          из Google просто не дождётся. Как ведём этот слой отдельно, написано
          в{" "}
          <Link href="/seo/prodvizhenie-v-google" className="font-semibold hover:underline">
            продвижении в Google
          </Link>{" "}
          и в{" "}
          <Link href="/seo/search-console" className="font-semibold hover:underline">
            Search Console
          </Link>
          .
        </p>

        <SeoStage
          n="01"
          label="Смотреть"
          title="Сначала видно, где вы стоите. Не «охват по РФ»."
          mock={<SeoSerpMock />}
        >
          <p>
            Снимаем позиции по вашему городу в Яндексе и Google. Не средний
            балл «по России»: клиника в Москве и та же клиника в выдаче
            Новосибирска — разные рынки. Регион в{" "}
            <Link href="/seo/vebmaster" className="font-semibold hover:underline">
              Вебмастере
            </Link>{" "}
            должен совпадать с тем, откуда вообще заявки.
          </p>
          <p>
            На графике не тысяча ключей. Три–пять URL, с которых люди
            записываются или оставляют заявку. Если растёт информационная
            статья, а карточка услуги стоит на 19-м — очередь неправильная.
          </p>
        </SeoStage>

        <SeoStage
          n="02"
          label="Чинить первым"
          title="Не триста пунктов. Пять–десять дел на неделю."
          mock={<SeoActionMock />}
          flip
        >
          <h3 className="text-2xl">Центр действий</h3>
          <p>
            После прогона видно, что двигает выдачу сильнее: цена на витрине,
            регион, сниппет, индекс. Статью «про пользу УЗИ» можно написать
            потом. Сначала то, без чего Яндекс в коммерции вас просто не
            пускает —{" "}
            <Link href="/seo/kommercheskie-faktory" className="font-semibold hover:underline">
              коммерческие факторы
            </Link>
            .
          </p>
          <p>
            Google здесь не другой вид спорта. Ему тоже нужна понятная
            страница услуги, живой Search Console и скорость с телефона. Разница
            в акценте: в Яндексе без витрины вы стоите в стороне, в Google без
            покрытия и нормального title — тоже.
          </p>
          <Link href="/priorizirovat" className="btn-primary mt-2 inline-flex bg-[#2b2118]">
            Как устроена очередь
          </Link>
        </SeoStage>

        <section className="mt-24">
          <SeoKicker n="03" label="До и после" />
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-3xl leading-[1.12] md:text-5xl">
            До и после. Не «нас везде знают» — страница, с которой записываются.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-[17px] leading-[1.7]">
            У{" "}
            <Link href="/keysy/sm-klinika" className="font-semibold hover:underline">
              СМ-Клиники
            </Link>{" "}
            на услугах не было цены и врача. Человек уходил в агрегатор, GigaChat
            называл агрегатор. Поставили витрину, открыли карточки. За 10 недель
            «услуга + Москва» в топ-10: 11 → 29. Заявки с поиска +19%. Ссылок не
            покупали.
          </p>
          <div className="mt-10">
            <SeoBeforeAfter />
          </div>
        </section>

        <SeoStage
          n="04"
          label="Витрина"
          title="Яндекс пускает в коммерцию тех, у кого видно, как купить."
          mock={<SeoFactorsMock />}
        >
          <p>
            Цена, наличие, контакты, оплата, доставка, отзывы, город на странице.
            Это скучно писать в ТЗ и именно это отделяет сайт, который продаёт,
            от сайта, который «хорошо написан». Агентство из Google-школы часто
            начинает с метатегов и ссылок. В Яндексе вы так стоите рядом с
            выдачей, не в ней.
          </p>
          <p>
            Для сети — только честные города. Посадочная «на Казань», если вы
            туда не возите, потом всплывает в жалобах и в Вебмастере. Как делать
            города правильно — в{" "}
            <Link href="/seo/regionalnoe-prodvizhenie" className="font-semibold hover:underline">
              региональном SEO
            </Link>
            .
          </p>
        </SeoStage>

        <SeoStage
          n="05"
          label="Спрос"
          title="Wordstat показывает, как ищут. Выдача — куда это класть."
          mock={<SeoWordstatMock />}
          flip
        >
          <p>
            <Link href="/seo/semantika-wordstat" className="font-semibold hover:underline">
              Wordstat
            </Link>{" "}
            — спрос в Яндексе. Подсказки и Search Console — как формулируют в
            Google. Часто это разные фразы: «узи москва цена» и «ultrasound near
            me» сюда не при чем, но «узи или мрт что лучше» точно не должна
            висеть на той же URL, что запись на приём.
          </p>
          <p>
            Кластер без посадочной — это работа, не строка в Excel на 20 тысяч
            ключей. Коммерцию отделяем от гайдов. ИИ-формулировки («какую
            клинику выбрать, если боюсь наркоза») смотрим отдельно, в{" "}
            <Link href="/platforma/obem-ii-poiska" className="font-semibold hover:underline">
              объёме ИИ-поиска
            </Link>
            . Их нет в Вордстате, и это нормально.
          </p>
        </SeoStage>

        <section className="mt-24 border-t border-line pt-12">
          <h2 className="max-w-3xl text-3xl leading-snug md:text-4xl">
            Как не нарушать правила и зачем вообще ждать 14 и 28 день
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-[17px] leading-[1.7]">
            <p>
              Накрутка поведения, покупка ссылок, скрытый текст, разные сайты
              для робота и человека, пустые городские копии — это не «серый
              рост». Это риск фильтра, после которого вы чинитесь месяцами. Мы
              так не работаем. Что можно, а что нет — коротко в{" "}
              <Link href="/seo/pravila-poiska" className="font-semibold hover:underline">
                правилах поиска
              </Link>
              .
            </p>
            <p>
              Срок спокойный, потому что индекс и пересчёт коммерции не живут в
              календарном «до пятницы». На 14 день обычно видно технику и
              сниппет. На 28 — сдвиг по запросам, где витрина уже была в порядке.
              Если не сдвинулось — меняем смысл страницы, не докупаем ссылки.
            </p>
            <p>
              Тексты пишем как для человека, который пришёл с телефона: зачем
              услуга, сколько стоит, чем отличаетесь, как записаться. Простыня
              с ключами в 2026 году не ранжируется и не читается. Об этом —{" "}
              <Link href="/seo/kontent" className="font-semibold hover:underline">
                полезные тексты
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">Поисковики и города</h2>
          <ul className="mt-6 max-w-[720px] border-t border-line">
            {[
              {
                href: "/seo/prodvizhenie-v-yandekse",
                name: "Яндекс",
                desc: "Регион, витрина, Вебмастер, сниппет",
              },
              {
                href: "/seo/prodvizhenie-v-google",
                name: "Google",
                desc: "Search Console, покрытие, скорость",
              },
              { href: "/seo/moskva", name: "Москва", desc: "Плотная выдача, районы без клонов" },
              {
                href: "/seo/sankt-peterburg",
                name: "Санкт-Петербург",
                desc: "Свои и гости — разные страницы",
              },
              { href: "/seo/kazan", name: "Казань", desc: "Регион в Вебмастере, не «вся Россия»" },
              {
                href: "/seo/ekaterinburg",
                name: "Екатеринбург",
                desc: "Локальная коммерция и карты",
              },
              { href: "/seo/novosibirsk", name: "Новосибирск", desc: "Доставка, слоты, честный город" },
              { href: "/seo/krasnodar", name: "Краснодар", desc: "Сезон, край и точка в городе" },
              { href: "/seo/nizhniy-novgorod", name: "Нижний Новгород", desc: "Не копия московского текста" },
              { href: "/seo/rostov-na-donu", name: "Ростов-на-Дону", desc: "Город отдельно от области" },
              { href: "/seo/samara", name: "Самара", desc: "Самара и Тольятти не один сайт" },
              { href: "/seo/sochi", name: "Сочи", desc: "Гости и свои, районы только свои" },
              { href: "/seo/chelyabinsk", name: "Челябинск", desc: "Город, не весь Урал в заголовке" },
              { href: "/seo/ufa", name: "Уфа", desc: "Вебмастер и Google Профиль совпадают" },
              { href: "/seo/perm", name: "Пермь", desc: "Город отдельно от края, два кабинета поиска" },
            ].map((it) => (
              <li key={it.href} className="border-b border-line">
                <Link
                  href={it.href}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                >
                  <span className="font-semibold group-hover:underline">{it.name}</span>
                  <span className="text-sm text-muted sm:text-right">{it.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="text-2xl md:text-[28px]">По темам</h2>
          <ul className="mt-6 max-w-[720px] border-t border-line">
            {[
              { href: "/seo/semantika-wordstat", name: "Семантика Wordstat" },
              { href: "/seo/posadochnye", name: "Посадочные страницы" },
              { href: "/seo/robots-txt", name: "robots.txt" },
              { href: "/seo/tekhnicheskiy-audit", name: "Технический аудит" },
              { href: "/seo/kommercheskie-faktory", name: "Коммерческие факторы" },
              { href: "/seo/metategi", name: "Title и description" },
              { href: "/seo/kontent", name: "Полезные тексты" },
              { href: "/seo/vebmaster", name: "Яндекс Вебмастер" },
              { href: "/seo/yandex-biznes", name: "Яндекс Бизнес" },
              { href: "/seo/search-console", name: "Google Search Console" },
              { href: "/seo/google-profil", name: "Google Профиль компании" },
              { href: "/seo/mikrorazmetka", name: "Микроразметка" },
              { href: "/seo/vs-writesonic", name: "INSONT и Writesonic" },
              { href: "/seo/vs-semrush", name: "INSONT и Semrush" },
              { href: "/seo/skolko-stoit", name: "Сколько стоит SEO" },
              { href: "/seo/vs-agentstvo", name: "Кабинет или агентство" },
              { href: "/seo/vs-keys-so", name: "INSONT и Keys.so" },
              { href: "/seo/glossariy", name: "Глоссарий" },
            ].map((it) => (
              <li key={it.href} className="border-b border-line">
                <Link href={it.href} className="block py-3 font-semibold hover:underline">
                  {it.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <PageAdvantages path="/seo" />
        <FaqList items={faqs} />
        <SeeAlso
          title="С этим обычно открывают"
          links={[
            {
              href: "/geo",
              title: "Продвижение в нейросетях",
              desc: "GigaChat, ChatGPT и Алиса рядом с поиском",
            },
            {
              href: "/keysy/sm-klinika",
              title: "Кейс СМ-Клиника",
              desc: "Цена и врач на услуге, заявки с поиска +19%",
            },
            {
              href: "/seo/kommercheskie-faktory",
              title: "Коммерческие факторы",
              desc: "То, без чего Яндекс не пускает витрину",
            },
            {
              href: "/platforma/monitoring-vidimosti",
              title: "Мониторинг видимости",
              desc: "Яндекс, Google и модели в одной строке",
            },
            { href: "/tseny", title: "Тарифы", desc: "От 4 990 ₽, год на 10% дешевле" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала витрина. Потом статьи. Потом замер."
        text="Покажем, чего не хватает вашему сайту в Яндексе и Google — без пакета ссылок и без обещания топа к пятнице."
      />
    </div>
  );
}
