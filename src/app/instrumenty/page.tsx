import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageAdvantages } from "@/components/Advantages";

export const metadata: Metadata = {
  title: "Бесплатные инструменты: llms.txt и проверка роботов",
  description:
    "Генератор llms.txt и проверка, видят ли страницу роботы Яндекса, Google, GPTBot и GigaChat. Без регистрации.",
  alternates: { canonical: "/instrumenty" },
};

const tools = [
  {
    href: "/instrumenty/llms-txt",
    title: "Генератор llms.txt",
    desc: "Соберите spec-compliant файл для любого сайта за минуту.",
  },
  {
    href: "/instrumenty/proverka-krawlerov",
    title: "Проверка ИИ-краулеров",
    desc: "Что реально читают GPTBot, GigaChat и Yandex на вашей странице.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14">
      <Breadcrumbs path="/instrumenty" />
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        Бесплатно
      </p>
      <h1 className="mt-3 text-4xl md:text-5xl">Инструменты без регистрации</h1>
      <p className="mt-4 text-lg text-muted">
        Полный вывод, без почты и без лимита «оставьте заявку».
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="card p-6">
            <h2 className="text-2xl">{t.title}</h2>
            <p className="mt-2 text-sm text-muted">{t.desc}</p>
          </Link>
        ))}
      </div>
      <PageAdvantages path="/instrumenty" />
    </div>
  );
}
