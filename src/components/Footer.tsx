"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM, RESOURCES, SITE, SOLUTIONS } from "@/lib/site";
import { LogoMark, MaxMark, TelegramMark } from "./Icons";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/kabinet")) return null;
  return (
    <footer className="mt-20 border-t border-line bg-bg-deep text-ink">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-ink">
            <LogoMark className="h-8 w-8" />
            <Wordmark className="text-[14px] text-ink" />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {SITE.tagline}. ООО «Иннсонт», Москва. Рубли, 152-ФЗ, Wordstat и Яндекс
            рядом с Google.
          </p>
          <p className="mt-4 text-sm text-muted">
            {SITE.address}
            <br />
            {SITE.email}
          </p>
          <p className="mt-3 flex items-center gap-2">
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full"
              aria-label={`Telegram ${SITE.telegramHandle}`}
            >
              <TelegramMark className="h-8 w-8" />
            </a>
            <a
              href={SITE.max}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full"
              aria-label="MAX"
            >
              <MaxMark className="h-8 w-8" />
            </a>
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Платформа</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {PLATFORM.flatMap((g) => g.items).map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-ink">
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Решения</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {SOLUTIONS.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-ink">
                  {i.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tseny" className="hover:text-ink">
                Тарифы
              </Link>
            </li>
            <li>
              <Link href="/demo" className="hover:text-ink">
                Демо
              </Link>
            </li>
            <li>
              <Link href="/seo" className="hover:text-ink">
                Продвижение в поиске
              </Link>
            </li>
            <li>
              <Link href="/geo" className="hover:text-ink">
                Продвижение в нейросетях
              </Link>
            </li>
            <li>
              <Link href="/seo/moskva" className="hover:text-ink">
                SEO в Москве
              </Link>
            </li>
            <li>
              <Link href="/priorizirovat" className="hover:text-ink">
                Центр действий
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Ресурсы</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {RESOURCES.flatMap((g) => g.items).map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-ink">
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Компания</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/kompaniya" className="hover:text-ink">
                О компании
              </Link>
            </li>
            <li>
              <Link href="/politika" className="hover:text-ink">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/oferta" className="hover:text-ink">
                Публичная оферта
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-ink">
                Политика cookies
              </Link>
            </li>
            <li>
              <Link href="/resursy/pomoshch" className="hover:text-ink">
                Помощь
              </Link>
            </li>
            <li>
              <Link href="/keysy" className="hover:text-ink">
                Кейсы
              </Link>
            </li>
            <li>
              <Link href="/karta-sayta" className="hover:text-ink">
                Карта сайта
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/80">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-5 text-xs text-muted md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} {SITE.legalName}. ИНН {SITE.inn}
          </span>
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/politika" className="hover:text-ink">
              Конфиденциальность
            </Link>
            <Link href="/oferta" className="hover:text-ink">
              Оферта
            </Link>
            <Link href="/cookies" className="hover:text-ink">
              Cookies
            </Link>
            <span>152-ФЗ · оплата в рублях</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
