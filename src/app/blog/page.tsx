import Link from "next/link";
import { POSTS } from "@/lib/blog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageAdvantages } from "@/components/Advantages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Блог: продвижение в Яндексе, Google и нейросетях",
  description:
    "Статьи INSONT: как расти в Яндексе и Google, как попасть в ответы GigaChat и ChatGPT, техника и тексты без воды.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14">
      <Breadcrumbs path="/blog" />
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">Блог</p>
      <h1 className="mt-3 text-4xl md:text-6xl">ИИ-поиск, AEO и видимость</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Разборы данных, плейбуки и исследования для команд, которые хотят
        попадать в ответы, а не только в выдачу.
      </p>
      <ul className="mt-10 max-w-[720px] border-t border-line">
        {POSTS.map((p) => (
          <li key={p.slug} className="border-b border-line py-6">
            <Link href={`/blog/${p.slug}`} className="group block">
              <div className="text-sm text-muted">
                {p.tag} · {p.date} · {p.read}
              </div>
              <h2 className="mt-1 text-xl leading-snug group-hover:underline">{p.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
      <PageAdvantages path="/blog" />
    </div>
  );
}
