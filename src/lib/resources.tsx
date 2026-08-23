import type { Metadata } from "next";
import { Breadcrumbs, CtaBand, JsonLd } from "@/components/SiteChrome";
import { PageAdvantages } from "@/components/Advantages";

export function resourceMeta(
  title: string,
  description: string,
  path: string
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, locale: "ru_RU" },
  };
}

export function ResourceShell({
  eyebrow,
  h1,
  lead,
  children,
  path,
}: {
  eyebrow: string;
  h1: string;
  lead: string;
  children: React.ReactNode;
  path: string;
}) {
  return (
    <div className="rays">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: h1,
          description: lead,
          url: path,
        }}
      />
      <article className="mx-auto max-w-[900px] px-5 py-14">
        <Breadcrumbs path={path} lastName={h1} />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">{h1}</h1>
        <p className="mt-4 text-lg text-muted">{lead}</p>
        <div className="prose-ru mt-8">{children}</div>
        <PageAdvantages path={path} />
      </article>
      <CtaBand />
    </div>
  );
}
