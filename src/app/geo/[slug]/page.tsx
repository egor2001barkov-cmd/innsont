import { notFound } from "next/navigation";
import { RichPage, richMetadata } from "@/components/RichPage";
import { KEYWORD_PAGES } from "@/lib/keyword-pages";
import { getLongPage } from "@/lib/geo-pages";

export function generateStaticParams() {
  return KEYWORD_PAGES.filter((p) => p.path.startsWith("/geo/")).map((p) => ({
    slug: p.path.slice("/geo/".length),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLongPage(`/geo/${slug}`);
  if (!page) return {};
  return richMetadata(page);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLongPage(`/geo/${slug}`);
  if (!page) notFound();
  return <RichPage page={page} />;
}
