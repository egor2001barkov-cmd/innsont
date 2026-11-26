import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация — 5 запросов бесплатно",
  description:
    "Создайте кабинет INSONT без карты: аудит страницы, статья по ключу, подбор ключей и перелинковка. 5 запросов бесплатно, дальше — тариф.",
  alternates: { canonical: "/registratsiya" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
