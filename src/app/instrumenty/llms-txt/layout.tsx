import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Генератор llms.txt — бесплатно, без почты",
  description:
    "Введите домен и страницы. Получите markdown для моделей: короткий список, не архив. Яндекс и Google файл не требуют.",
  alternates: { canonical: "/instrumenty/llms-txt" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
