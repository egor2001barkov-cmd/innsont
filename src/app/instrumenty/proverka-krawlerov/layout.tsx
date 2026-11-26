import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проверка обхода — что видят Яндекс, GPTBot и GigaChat",
  description:
    "Сравните, что видят в странице человек и робот: браузер выполняет скрипты, а робот часто читает только первый ответ HTML. Без регистрации.",
  alternates: { canonical: "/instrumenty/proverka-krawlerov" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
