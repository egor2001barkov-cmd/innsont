import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TERMS, getTerm } from "@/lib/slovar";
import { TermPage, termMetadata } from "@/components/TermPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  return termMetadata(term);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();
  return <TermPage term={term} />;
}
