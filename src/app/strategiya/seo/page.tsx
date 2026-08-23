import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand } from "@/components/SiteChrome";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "SEO-стратегия роста сайта в Яндексе и Google",
  description:
    "Как расти в поиске без покупки ссылок: спрос, витрина, регион, техника, замер. Яндекс и Google в одном цикле, не вместо друг друга.",
  alternates: { canonical: "/strategiya/seo" },
};

export default function Page() {
  return (
    <div className="rays">
      <article className="mx-auto max-w-[800px] px-5 py-14">
        <Breadcrumbs path="/strategiya/seo" lastName="SEO-стратегия" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Стратегия
        </p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
          SEO-стратегия: сначала то, без чего поиск не пускает
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#3a3632]">
          Стратегия не про «набрать 200 статей». Про порядок работ. Если на
          карточке нет цены, новый гид не спасёт. Если регион в Вебмастере
          «вся Россия», локальные запросы уедут к тем, у кого город проставлен.
        </p>

        <h2 className="mt-12 text-2xl">1. Спрос, который можно посчитать</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Ядро снимаем в{" "}
          <Link href="/seo/semantika-wordstat" className="font-semibold text-orange">
            Wordstat
          </Link>{" "}
          и смотрим подсказки Google. Кластеры режем по интенту: «что такое»
          отдельно от «записаться / купить / открыть». На одну URL — один
          кластер. Редкие хвосты не делаем посадочными, если нет спроса в вашем
          городе.
        </p>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Рядом кладём{" "}
          <Link href="/platforma/obem-ii-poiska" className="font-semibold text-orange">
            формулировки к нейросетям
          </Link>
          . Часто это другой язык: не «вклад калькулятор», а «какой вклад
          открыть, если боюсь курса». Оба ядра смотрим, одно другим не
          подменяем.
        </p>

        <h2 className="mt-10 text-2xl">2. Витрина важнее блога</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Яндекс в коммерции смотрит цены, контакты, оплату, доставку, регион.
          Google — то же плюс ясный заголовок и карточку организации. Это{" "}
          <Link href="/seo/kommercheskie-faktory" className="font-semibold text-orange">
            коммерческие факторы
          </Link>
          , не «красивый лендинг». Пока их нет, статьи в блог почти не двигают
          заявки. Так было у клиник и окон — см.{" "}
          <Link href="/keysy/sm-klinika" className="font-semibold text-orange">
            СМ-Клинику
          </Link>{" "}
          и{" "}
          <Link href="/keysy/fabrika-okon" className="font-semibold text-orange">
            Фабрику Окон
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl">3. Регион как есть</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Вебмастер, Яндекс Бизнес, Google Профиль, текст на странице — один
          город. Посадочные только там, где выезжаете или есть филиал. Клоны
          «услуга + 80 городов» не делаем. Подробнее —{" "}
          <Link href="/seo/regionalnoe-prodvizhenie" className="font-semibold text-orange">
            региональное продвижение
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl">4. Два кабинета поиска</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          <Link href="/seo/prodvizhenie-v-yandekse" className="font-semibold text-orange">
            Яндекс
          </Link>{" "}
          и{" "}
          <Link href="/seo/prodvizhenie-v-google" className="font-semibold text-orange">
            Google
          </Link>{" "}
          в одном цикле. Вебмастер и Search Console. Bing обычно подтягивается
          сам. Не ведём «только Яндекс, Google потом». Часть людей ищет только
          там.
        </p>

        <h2 className="mt-10 text-2xl">5. Техника, которую видит робот</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          robots, карта сайта, 404, скорость, мобильная версия. Агент часто
          находит закрытый blog или 403 на карточке, которые не видны в
          Метрике. Это{" "}
          <Link href="/seo/tekhnicheskiy-audit" className="font-semibold text-orange">
            аудит
          </Link>{" "}
          и{" "}
          <Link href="/platforma/analitika-agentov" className="font-semibold text-orange">
            лог роботов
          </Link>
          , не отдельный театр.
        </p>

        <h2 className="mt-10 text-2xl">6. Замер, не «топ за неделю»</h2>
        <p className="mt-3 leading-relaxed text-[#3a3632]">
          Позиции и заявки смотрим на 14 и 28 день. Что не выросло —
          переписываем смысл. Ссылки не докупаем. Сроки и цифры по рынку — на
          странице{" "}
          <Link href="/seo/skolko-stoit" className="font-semibold text-orange">
            сколько стоит
          </Link>
          .
        </p>

        <p className="mt-10 leading-relaxed text-[#3a3632]">
          Тексты под этот каркас — в{" "}
          <Link href="/strategiya/kontent" className="font-semibold text-orange">
            контент-стратегии
          </Link>
          . Работы на неделю — в{" "}
          <Link href="/platforma/tsentr-deystviy" className="font-semibold text-orange">
            Центре действий
          </Link>
          .
        </p>

        <PageAdvantages path="/strategiya/seo" />
        <SeeAlso
          links={[
            { href: "/strategiya/kontent", title: "Контент-стратегия" },
            { href: "/seo", title: "Все страницы про поиск" },
            { href: "/seo/pochemu-net-v-tope", title: "Почему сайта нет в топе" },
            { href: "/keysy", title: "Кейсы" },
          ]}
        />
      </article>
      <CtaBand
        title="Сначала витрина и регион."
        text="Покажем, чего не хватает вашему сайту в Яндексе и Google. Без биржи ссылок."
      />
    </div>
  );
}
