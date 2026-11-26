import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost, relatedPosts } from "@/lib/blog";
import { JsonLd } from "@/components/SiteChrome";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SeeAlso } from "@/components/SeeAlso";
import { PageAdvantages } from "@/components/Advantages";
import { SITE } from "@/lib/site";
import { mdToHtmlBody } from "@/lib/markdown";
import { seoOf } from "@/lib/seo-overrides";
import type { Metadata } from "next";

const CUSTOM_SLUGS = new Set(["issledovanie-ii-vidimosti-rf"]);

/** Русская форма слова по числу: 1 материал, 2 материала, 5 материалов. */
function plural(n: number, one: string, few: string, many: string) {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}

export function generateStaticParams() {
  return POSTS.filter((p) => !CUSTOM_SLUGS.has(p.slug)).map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  // заголовок и описание для выдачи — с правками из SEO_OVERRIDES (аудит 26.11.2026)
  const { title, description } = seoOf(`/blog/${post.slug}`, {
    title: post.metaTitle ?? post.title,
    description: post.description,
  });
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      locale: "ru_RU",
      images: post.cover ? [{ url: `${SITE.url}${post.cover}`, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-[760px] px-5 py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          datePublished: post.date,
          dateModified: post.date,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: SITE.name },
          description: post.description,
          ...(post.cover ? { image: [`${SITE.url}${post.cover}`] } : {}),
        }}
      />
      <Breadcrumbs path={`/blog/${post.slug}`} lastName={post.title} />
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-orange">
        {post.tag}
      </p>
      <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-muted">
        {post.author} · {post.date} · {post.read}
      </p>
      <p className="mt-6 text-lg text-[#3a3632]">{post.excerpt}</p>
      {post.cover && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={post.cover}
          alt={`Обложка: ${post.title}`}
          width={1200}
          height={630}
          className="mt-6 w-full rounded-2xl"
        />
      )}
      <div className="prose-ru mt-8" dangerouslySetInnerHTML={{ __html: mdToHtmlBody(post.body) }} />
      <PageAdvantages path={`/blog/${post.slug}`} />
      <SeeAlso
        links={[
          ...relatedPosts(post.slug).map((r) => ({
            href: `/blog/${r.slug}`,
            title: r.title,
            desc: r.excerpt.slice(0, 90) + (r.excerpt.length > 90 ? "…" : ""),
          })),
          {
            href: "/blog",
            title: "Все статьи",
            // число считается по массиву статей, чтобы подпись не отставала от блога
            desc: `${POSTS.length} ${plural(POSTS.length, "материал", "материала", "материалов")} о поиске, Вебмастере и ИИ-видимости`,
          },
        ]}
      />
    </article>
  );
}
