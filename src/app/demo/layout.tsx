import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Демо INNSONT — разбор сайта в поиске и нейросетях",
  description:
    "30 минут: где вас нет в Яндексе, Google, GigaChat и ChatGPT, что чинить первым и как считать заявки. Без обязательства.",
  alternates: { canonical: "/demo" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
