import { crumbsFor } from "@/lib/site-map";
import { SITE } from "@/lib/site";

export function Breadcrumbs({
  items,
  path,
  lastName,
}: {
  items?: { href: string; name: string }[];
  path?: string;
  lastName?: string;
}) {
  const list = items ?? (path ? crumbsFor(path, lastName) : []);
  if (list.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.href.startsWith("http")
        ? it.href
        : `${SITE.url}${it.href === "/" ? "" : it.href}`,
    })),
  };
  return (
    <nav className="mb-6 text-sm text-muted" aria-label="Хлебные крошки">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      />
      <ol className="flex flex-wrap items-center gap-2">
        {list.map((it, i) => {
          const last = i === list.length - 1;
          return (
            <li key={`${it.href}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {last ? (
                <span className="text-ink" aria-current="page">
                  {it.name}
                </span>
              ) : (
                <a href={it.href} className="hover:text-ink">
                  {it.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
