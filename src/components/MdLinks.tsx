import Link from "next/link";

const LINK_SPLIT = /(\[[^\]]+\]\(\/[^)\s]*\))/;
const LINK_PARTS = /\[([^\]]+)\]\((\/[^)\s]*)\)/;

/**
 * Строка с разметкой вида [текст](/адрес): такие пары становятся ссылками Next,
 * остальной текст выводится как есть. Для полей, которые рендерятся простым текстом
 * (истории кейсов, разделы страниц) — чтобы ставить контекстную ссылку, не меняя данные на JSX.
 */
export function MdLinks({ text }: { text: string }) {
  const parts = text.split(LINK_SPLIT);
  return (
    <>
      {parts.map((part, i) => {
        const m = i % 2 === 1 ? LINK_PARTS.exec(part) : null;
        if (!m) return <span key={i}>{part}</span>;
        return (
          <Link key={i} href={m[2]} className="font-semibold text-orange hover:underline">
            {m[1]}
          </Link>
        );
      })}
    </>
  );
}
