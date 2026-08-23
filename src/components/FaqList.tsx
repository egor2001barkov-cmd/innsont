export function FaqList({
  title = "Частые вопросы",
  items,
}: {
  title?: string;
  items: { q: string; a: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-16 max-w-[720px]">
      <h2 className="text-2xl md:text-[28px]">{title}</h2>
      <dl className="mt-6">
        {items.map((f) => (
          <div key={f.q} className="border-t border-line py-6 last:border-b">
            <dt className="text-[17px] font-semibold leading-snug">{f.q}</dt>
            <dd className="mt-2 text-[16px] leading-[1.7]">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
