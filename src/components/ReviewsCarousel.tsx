"use client";

import { useState } from "react";
import { Icon } from "./Icons";

export const REVIEWS: {
  text: string;
  name: string;
  role: string;
  photo: string;
  stars: 4 | 5;
}[] = [
  {
    text: "Думали, будет ещё один дашборд. По факту получили список: регион в Вебмастере, цены на карточках, три title. За месяц коммерция по Москве стала ровнее. Про GigaChat пока скромно — нас начали упоминать в двух ответах из десяти. Для старта хватило.",
    name: "Марина Соколова",
    role: "SEO, сеть клиник «Северный свет», Москва",
    photo: "/reviews/marina.jpg",
    stars: 5,
  },
  {
    text: "Не миллионы из нейросети. Просто перестали спорить, с чего начать неделю. Открыли /blog для ботов, переписали FAQ. Из органики плюс 15–20 заявок. Два человека написали: «увидела вас в ответе Алисы».",
    name: "Игорь Панков",
    role: "маркетолог, «ЛавкаМаркет», Санкт-Петербург",
    photo: "/reviews/igor.jpg",
    stars: 4,
  },
  {
    text: "Держали Keys.so и копирайтера на полставки. Не хватало очереди «что чинить сегодня». Теперь не размазываем бюджет на двадцатую статью в блог, пока на витрине нет доставки.",
    name: "Анна Белова",
    role: "контент, агентство, Екатеринбург",
    photo: "/reviews/anna.jpg",
    stars: 5,
  },
  {
    text: "Прошлый подрядчик лил простыни. 15 старых текстов сняли, услуги переписали коротко. Трафик не упал, «окна Казань» подтянулись в топ-10. Ссылки не покупали.",
    name: "Дмитрий Орлов",
    role: "владелец, «Окно.ру», Казань",
    photo: "/reviews/dmitry.jpg",
    stars: 4,
  },
  {
    text: "Свой сайт был для галочки, продажи шли с WB. Поставили сроки «до Новосибирска» и нормальные title. Часть запросов «купить + город» ожила. Не сказка, но сайт перестал быть мёртвым.",
    name: "Ольга Ким",
    role: "ecom, Новосибирск",
    photo: "/reviews/olga.jpg",
    stars: 5,
  },
  {
    text: "Базовый окупается тем, что не теряем запросы, где нас нет, а конкурент есть. Раз в неделю смотрим очередь и закрываем по две-три задачи. Это спокойнее, чем «давайте ещё контент».",
    name: "Павел Чернов",
    role: "продуктовый маркетолог, SaaS, Москва",
    photo: "/reviews/pavel.jpg",
    stars: 4,
  },
];

function Stars({ n }: { n: 4 | 5 }) {
  return (
    <span className="text-[15px] tracking-tight text-orange" aria-label={`${n} из 5`}>
      {"★★★★★".slice(0, n)}
      <span className="text-[#d9d0c3]">{"★★★★★".slice(n)}</span>
    </span>
  );
}

export function ReviewsCarousel() {
  const [i, setI] = useState(0);
  const prev = () => setI((v) => (v === 0 ? REVIEWS.length - 1 : v - 1));
  const next = () => setI((v) => (v === REVIEWS.length - 1 ? 0 : v + 1));
  const visible = [REVIEWS[i], REVIEWS[(i + 1) % REVIEWS.length]];

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">Что говорят после пары месяцев</h3>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper"
            onClick={prev}
            aria-label="Предыдущие отзывы"
          >
            <span className="rotate-90 inline-flex">
              <Icon name="chevron" className="h-5 w-5" />
            </span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper"
            onClick={next}
            aria-label="Следующие отзывы"
          >
            <span className="-rotate-90 inline-flex">
              <Icon name="chevron" className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {visible.map((r) => (
          <blockquote key={r.name} className="card flex flex-col p-5">
            <Stars n={r.stars} />
            <p className="mt-3 flex-1 text-[15px] leading-relaxed">«{r.text}»</p>
            <footer className="mt-4 flex items-center gap-3">
              <img
                src={r.photo}
                alt={`${r.name}, ${r.role}`}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted">{r.role}</div>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {REVIEWS.map((r, idx) => (
          <button
            key={r.name}
            type="button"
            aria-label={`Отзыв ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-6 bg-orange" : "w-2 bg-[#d9d0c3]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
