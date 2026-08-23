import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход в кабинет",
  description: "Войдите в кабинет INNSONT: мониторинг ИИ-видимости, автор статей, тариф.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
