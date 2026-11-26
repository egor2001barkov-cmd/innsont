import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Демо INSONT — разбор сайта в поиске и нейросетях",
  description:
    "Разбор вашего сайта за 30 минут: где вас нет в Яндексе, Google, GigaChat и ChatGPT и что чинить первым. Онлайн, без обязательств.",
  alternates: { canonical: "/demo" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
