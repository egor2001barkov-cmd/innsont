import Link from "next/link";

export function SeeAlso({
  title = "Читайте дальше",
  links,
}: {
  title?: string;
  links: { href: string; title: string; desc?: string }[];
}) {
  const uniq = links.filter((l, i, a) => a.findIndex((x) => x.href === l.href) === i);
  if (uniq.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-[28px]">{title}</h2>
      <ul className="mt-6 max-w-[720px] border-t border-line">
        {uniq.map((l) => (
          <li key={l.href} className="border-b border-line">
            <Link href={l.href} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
              <span className="font-semibold group-hover:underline">{l.title}</span>
              {l.desc ? <span className="text-sm leading-relaxed text-muted sm:max-w-[22rem] sm:text-right">{l.desc}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
