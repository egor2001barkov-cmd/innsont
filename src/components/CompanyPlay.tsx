"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

const points = [
  {
    icon: "building",
    t: "Можно проверить, кто вы",
    a: "ИНН, телефон, офис на Пресненской. Договор и счёт проходят закупку. Можно приехать, не только писать в чат. У многих «ИИ-сервисов» на сайте нет даже лица.",
  },
  {
    icon: "search",
    t: "Сразу про Россию, не перевод с английского",
    a: "Wordstat, Вебмастер, коммерческие факторы, рубли, 152-ФЗ. Не регион Worldwide и не десять американских моделей, которых у нас почти не спрашивают.",
  },
  {
    icon: "check",
    t: "Белое — потому что так в оферте",
    a: "Не «пока менеджер не предложит ссылки». На сайте и в договоре одно и то же. Если через год сменим правила, это будет видно, а не тихий апдейт тарифа.",
  },
  {
    icon: "users",
    t: "Кабинет не забирает сайт",
    a: "Мы не агентство, которое просит доступы к CMS «навсегда». И не бот, который публикует ночью. Черновик готовим мы, «ок» нажимаете вы.",
  },
];

export function CompanyPoints() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`company-play seo-play mt-12 ${on ? "is-on" : ""}`}>
      <ol className="max-w-3xl divide-y divide-line border-y border-line">
        {points.map((p, i) => (
          <li
            key={p.t}
            className="seo-row flex gap-4 py-6"
            style={{ animationDelay: `${80 + i * 90}ms` }}
          >
            <span className="seo-check mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center text-orange">
              <Icon name={p.icon} className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed">{p.a}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
