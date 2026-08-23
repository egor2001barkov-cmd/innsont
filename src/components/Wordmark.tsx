export function Wordmark({
  className = "text-[17px]",
}: {
  className?: string;
}) {
  return (
    <span className={`wordmark text-ink ${className}`} aria-label="INSONT">
      INSONT
    </span>
  );
}
