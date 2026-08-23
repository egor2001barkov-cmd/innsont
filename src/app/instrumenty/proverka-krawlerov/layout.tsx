import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проверка обхода — что видят Яндекс, GPTBot и GigaChat",
  description:
    "Сравните страницу в браузере и сырой HTML. Робот часто читает только первый ответ, без JavaScript. Бесплатно, без почты.",
  alternates: { canonical: "/instrumenty/proverka-krawlerov" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
