import { advantagesFor, type AdvIconName } from "@/lib/advantages";
import { HomeStayShot } from "@/components/HomeExtra";

function AdvMark({ name }: { name: AdvIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };
  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case "queue":
      return (
        <svg {...common}>
          <path d="M8 7h12M8 12h12M8 17h8" />
          <circle cx="4.2" cy="7" r="1" />
          <circle cx="4.2" cy="12" r="1" />
          <circle cx="4.2" cy="17" r="1" />
        </svg>
      );
    case "two":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="12" r="5" />
          <circle cx="15.5" cy="12" r="5" />
        </svg>
      );
    case "unlink":
      return (
        <svg {...common}>
          <path d="M9 11H6a4 4 0 0 0 0 8h4M15 13h3a4 4 0 0 0 0-8h-4" />
          <path d="M8 8l8 8" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...common}>
          <path d="M8 13l2.5 2.5L16 10" />
          <path d="M4 12l4-4 3 3M20 12l-4-4-2 2" />
        </svg>
      );
    case "storefront":
      return (
        <svg {...common}>
          <path d="M4 10h16l-1 10H5L4 10z" />
          <path d="M4 10l1.5-5h13L20 10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16l4 4" />
        </svg>
      );
    case "pen":
      return (
        <svg {...common}>
          <path d="M4 20h4l11-11-4-4L4 16v4z" />
          <path d="M13 7l4 4" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12z" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
      );
    case "scan":
      return (
        <svg {...common}>
          <path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M4 12h16" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14 7a4 4 0 0 0-5.6 5.6L4 17l3 3 4.4-4.4A4 4 0 0 0 17 10l-3 3" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l3-4 3 2 4-6" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M8 7h12M8 12h12M8 17h8" />
          <path d="M4 7h.01M4 12h.01M4 17h.01" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M3 12V4h8l10 10-8 8L3 12z" />
          <circle cx="8" cy="8" r="1.2" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 1 0 7 7l1-1" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12l5 5 9-10" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4l6 2 5-2v16l-5 2-6-2-5 2V6l5-2z" />
          <path d="M9 4v16M15 6v16" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
        </svg>
      );
  }
}

export function PageAdvantages({
  path,
  compact = false,
}: {
  path: string;
  compact?: boolean;
}) {
  const copy = advantagesFor(path);
  if (!copy) return null;
  const shot = path === "/" && !compact ? <HomeStayShot /> : null;

  const list = (
    <ol className={`${shot ? "" : "max-w-3xl"} border-t border-line`}>
      {copy.items.map((item) => (
        <li key={item.title} className="adv-row -mx-3 flex gap-3 border-b border-line px-3 py-6">
          <span className="adv-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <AdvMark name={item.icon} />
          </span>
          <div>
            <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed">
              {item.why} {item.value}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );

  return (
    <section className={compact ? "mt-10" : "mt-16"} aria-labelledby="advantages-heading">
      {shot ? (
        <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]">
          <div>
            <p className="text-sm text-muted">{copy.eyebrow}</p>
            <h2 id="advantages-heading" className="mt-2 max-w-3xl text-2xl leading-snug md:text-[28px]">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">{copy.lead}</p>
          </div>
          <div className="min-w-0 lg:sticky lg:top-24 lg:row-span-2">{shot}</div>
          <div>{list}</div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted">{copy.eyebrow}</p>
          <h2 id="advantages-heading" className="mt-2 max-w-3xl text-2xl leading-snug md:text-[28px]">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">{copy.lead}</p>
          <div className="mt-8">{list}</div>
        </>
      )}
    </section>
  );
}
