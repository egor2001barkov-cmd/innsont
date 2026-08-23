export function Ico({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const p = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };
  switch (name) {
    case "home":
      return (
        <svg {...p}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
          <path d="M14 3.5V9h5" />
        </svg>
      );
    case "pen":
      return (
        <svg {...p}>
          <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M4 19h16M7 16v-5M12 16V8M17 16v-8" />
        </svg>
      );
    case "bot":
      return (
        <svg {...p}>
          <rect x="5" y="8" width="14" height="10" rx="2" />
          <path d="M12 8V5M9 13h.01M15 13h.01" />
        </svg>
      );
    case "zap":
      return (
        <svg {...p}>
          <path d="M13 3 5 14h7l-1 7 8-11h-7z" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "key":
      return (
        <svg {...p}>
          <circle cx="8" cy="14" r="4" />
          <path d="M11.5 12.5 20 4l2 2-2 2h-3v3h-2v2" />
        </svg>
      );
    case "map":
      return (
        <svg {...p}>
          <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
        </svg>
      );
    case "edit":
      return (
        <svg {...p}>
          <path d="M4 20h16M7 16.5 16 7.5l2.5 2.5L9.5 19H7z" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M5 17.5 4 21l3.5-1.2A8.5 8.5 0 1 0 5 17.5z" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...p}>
          <path d="M14.5 6.5a4 4 0 0 0-5.6 5.6L4 17v3h3l4.9-4.9a4 4 0 0 0 5.6-5.6L15 12z" />
        </svg>
      );
    case "recycle":
      return (
        <svg {...p}>
          <path d="M7 8 4.5 12 8 13M17 8l2.5 4-3.5 1M8 18h8" />
          <path d="M8.5 7.5 12 5l2 3M15.5 16.5 12 19l-2-3" />
        </svg>
      );
    case "help":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8V14" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "filter":
      return (
        <svg {...p}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "plus":
      return (
        <svg {...p}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "dots":
      return (
        <svg {...p}>
          <circle cx="12" cy="6" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3.5" y="6" width="17" height="12" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "folder":
      return (
        <svg {...p}>
          <path d="M4 7h6l2 2h8v10H4z" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="m5 12 5 5 9-10" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p}>
          <path d="m8 10 4 4 4-4" />
        </svg>
      );
    case "sun":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg {...p}>
          <path d="M19 13.5A7.5 7.5 0 1 1 10.5 5 6 6 0 0 0 19 13.5z" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#e8590c" />
      <path d="M8 21.5 16 8l8 13.5h-5.2L16 15.2 13.2 21.5H8z" fill="#fff" />
    </svg>
  );
}

export function PlatformDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fc3f1d] text-[10px] font-bold text-white">
        Я
      </span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4285f4] text-[11px] font-bold text-white">
        G
      </span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00809d] text-[10px] font-bold text-white">
        B
      </span>
    </div>
  );
}
