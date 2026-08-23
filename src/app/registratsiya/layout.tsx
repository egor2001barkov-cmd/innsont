import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация — 5 запросов бесплатно",
  description:
    "Создайте кабинет INSONT без карты. 5 бесплатных запросов: видимость, исследование, статьи. Дальше — тариф.",
  alternates: { canonical: "/registratsiya" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
