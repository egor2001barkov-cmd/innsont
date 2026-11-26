import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Генератор llms.txt онлайн — бесплатно, без регистрации",
  description:
    "Генератор llms.txt по адресу сайта: список страниц и фактов для GPTBot, GigaChat и YandexGPT. Скачать файл, пример и разбор каждой строки.",
  alternates: { canonical: "/instrumenty/llms-txt" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
