"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageAdvantages } from "@/components/Advantages";

export default function DemoPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="rays mx-auto max-w-[1100px] px-5 py-14">
      <Breadcrumbs path="/demo" />
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Демо
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">
          Увидите, в каких ответах ИИ рекомендует конкурентов. Не вас.
        </h1>
        <ul className="mt-8 space-y-4">
          {[
            "Слепые зоны: какие платформы советуют не вас — ChatGPT, GigaChat, YandexGPT, Gemini.",
            "Приоритетный план: контент, цитаты, техника. По влиянию на видимость.",
            "Как доказать ROI: бренды привязывают сделки на десятки миллионов к ИИ-видимости.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="text-orange">
                <Icon name="check" />
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <form
        className="card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {sent ? (
          <div>
            <h2 className="text-2xl">Заявка принята</h2>
            <p className="mt-2 text-muted">
              Стратег напишет на почту в течение рабочего дня и пришлёт слот на
              30 минут.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl">Записаться на демо</h2>
            <div className="mt-5 space-y-3">
              <input className="input" required placeholder="Имя" name="name" />
              <input
                className="input"
                required
                type="email"
                placeholder="Рабочая почта"
                name="email"
              />
              <input className="input" placeholder="Компания" name="company" />
              <input className="input" placeholder="Сайт" name="site" />
              <select className="input" name="size" defaultValue="">
                <option value="" disabled>
                  Размер команды
                </option>
                <option>1–5</option>
                <option>6–20</option>
                <option>21–100</option>
                <option>100+</option>
              </select>
              <textarea
                className="input min-h-24"
                placeholder="Что хотите увидеть на демо?"
                name="note"
              />
              <button className="btn-primary w-full" type="submit">
                Заказать демо
              </button>
              <p className="text-xs text-muted">
                Нажимая кнопку, вы соглашаетесь с политикой обработки ПДн.
              </p>
            </div>
          </>
        )}
      </form>
    </div>
    <PageAdvantages path="/demo" />
    </div>
  );
}
