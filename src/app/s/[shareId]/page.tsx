import { notFound } from "next/navigation";
import { findSharedArticle } from "@/lib/store/accounts";
import { mdToHtmlBody } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Материал INSONT",
  description: "Публичная ссылка только для чтения",
  robots: { index: false, follow: false },
};

/** Публичная страница материала по share-ссылке: только чтение, без индексации. */
export default async function SharedPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const article = findSharedArticle(shareId);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-[760px] px-5 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
        INSONT · общий доступ · только чтение
      </p>
      <h1 className="mt-3 text-3xl leading-tight">{article.title}</h1>
      <p className="mt-2 text-sm text-[#9ca3af]">
        {article.type} · {article.words} слов · {article.updated}
      </p>
      <div
        className="prose-ru mt-8"
        dangerouslySetInnerHTML={{ __html: mdToHtmlBody(article.body) }}
      />
      <footer className="mt-12 border-t border-[#f3f4f6] pt-4 text-[13px] text-[#9ca3af]">
        Создано в{" "}
        <a href="/" className="underline hover:text-[#7c3aed]">
          INSONT
        </a>{" "}
        — SEO и GEO-платформа для российского рынка
      </footer>
    </article>
  );
}
