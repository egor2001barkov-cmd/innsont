export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const c = className;
  switch (name) {
    case "search":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "radar":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 12l6-4" />
        </svg>
      );
    case "eye":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "pulse":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      );
    case "cart":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5h2l2 12h10l2-8H8" />
          <circle cx="10" cy="20" r="1.4" />
          <circle cx="17" cy="20" r="1.4" />
        </svg>
      );
    case "megaphone":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 10v4l10 4V6L4 10zM14 9c2 1 4 2 6 1v4c-2-1-4 0-6 1" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 2L4 14h7l-1 8 10-13h-7l0-7z" />
        </svg>
      );
    case "bot":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="8" width="14" height="11" rx="3" />
          <path d="M12 8V5M9 13h.01M15 13h.01" />
        </svg>
      );
    case "doc":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v6h6M9 13h6M9 17h4" />
        </svg>
      );
    case "spark":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l3-4 3 2 4-6" />
        </svg>
      );
    case "book":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z" />
          <path d="M8 4v16" />
        </svg>
      );
    case "guide":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      );
    case "video":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3" />
        </svg>
      );
    case "help":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-1.2.8-1.2 1.6V14" />
          <circle cx="12" cy="17" r="0.6" fill="currentColor" />
        </svg>
      );
    case "code":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
        </svg>
      );
    case "trophy":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 4h8v4a4 4 0 0 1-8 0V4zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M9 20h6M12 12v8" />
        </svg>
      );
    case "coin":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <ellipse cx="12" cy="8" rx="7" ry="3" />
          <path d="M5 8v8c0 1.7 3.1 3 7 3s7-1.3 7-3V8" />
        </svg>
      );
    case "file":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v5h5" />
        </svg>
      );
    case "scan":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M4 12h16" />
        </svg>
      );
    case "wrench":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 7a4 4 0 0 0-5.6 5.6L4 17l3 3 4.4-4.4A4 4 0 0 0 17 10l-3 3" />
        </svg>
      );
    case "plug":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 7v5M15 7v5M8 12h8v2a4 4 0 0 1-8 0v-2zM12 18v3" />
        </svg>
      );
    case "building":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20V6l8-3 8 3v14H4zM9 20v-6h6v6" />
        </svg>
      );
    case "users":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0M17 8a3 3 0 1 1 0 6 6 6 0 0 1 4 5" />
        </svg>
      );
    case "rocket":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 4c3 1 6 5 6 8-3 0-6 1-8 3s-3 5-3 8c-3-1-6-5-6-8 3 0 6-1 8-3s3-5 3-8z" />
        </svg>
      );
    case "bag":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "chevron":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case "check":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    case "chat":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        </svg>
      );
    case "refresh":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 12a8 8 0 1 1-2.3-5.6M20 5v5h-5" />
        </svg>
      );
    case "menu":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "x":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "telegram":
      return <TelegramMark className={c} />;
    case "max":
      return <MaxMark className={c} />;
    default:
      return <IndustryIcon name={name} className={c} />;
  }
}

export function TelegramMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#2AABEE" />
      <path
        fill="#fff"
        d="M29.6 12.05 11.4 19.1c-1.24.48-1.23 1.15-.22 1.45l4.66 1.45 10.8-6.82c.51-.31.98-.14.6.19l-8.75 7.9-.32 4.78c.47 0 .68-.22.94-.47l2.25-2.18 4.67 3.44c.86.47 1.48.23 1.7-.8l3.07-14.47c.31-1.25-.45-1.82-1.28-1.42z"
      />
    </svg>
  );
}

export function MaxMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="innsont-max-mark" x1="7" y1="32" x2="33" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3EC8FF" />
          <stop offset="0.45" stopColor="#5B68FF" />
          <stop offset="1" stopColor="#C45CFF" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="#0B1026" />
      <g transform="translate(4.6 4.2) scale(0.0314)">
        <path
          fill="url(#innsont-max-mark)"
          fillRule="evenodd"
          d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"
        />
      </g>
    </svg>
  );
}

/** Simple geometric marks — SF Symbols weight, no sparkles. */
export function IndustryIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const c = className;
  const common = {
    className: c,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "shop":
      return (
        <svg {...common}>
          <path d="M6.5 8.5h11L16.7 19.2a1.4 1.4 0 0 1-1.4 1.3H8.7a1.4 1.4 0 0 1-1.4-1.3L6.5 8.5z" />
          <path d="M9 8.5V7.2A3 3 0 0 1 12 4.2 3 3 0 0 1 15 7.2v1.3" />
        </svg>
      );
    case "clinic":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "realty":
      return (
        <svg {...common}>
          <path d="M5 20V8.5L12 4l7 4.5V20H5z" />
          <path d="M10 20v-5h4v5" />
          <path d="M8.5 11h1M14.5 11h1M8.5 14.5h1M14.5 14.5h1" />
        </svg>
      );
    case "bank":
      return (
        <svg {...common}>
          <rect x="3.5" y="6" width="17" height="12" rx="2.2" />
          <path d="M3.5 10h17" />
          <path d="M8.2 15.2c.4.7 1.2 1.1 2.2 1.1 1.3 0 2.2-.7 2.2-1.7s-.8-1.5-2.2-1.8c-1.3-.3-2.1-.7-2.1-1.6 0-.9.8-1.6 2-1.6 1 0 1.7.4 2.1 1.1M10.4 9.2v.8M10.4 16.4v.8" />
        </svg>
      );
    case "saas":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="12.5" height="10" rx="2" />
          <path d="M8 16.5h10.5A2 2 0 0 0 20.5 14.5V9" />
          <path d="M6.5 7.5h6.5" />
        </svg>
      );
    case "edu":
      return (
        <svg {...common}>
          <path d="M3.5 10.5 12 6l8.5 4.5L12 15 3.5 10.5z" />
          <path d="M7 12.4v3.4c1.6 1.1 4.2 1.6 5 1.6s3.4-.5 5-1.6v-3.4" />
          <path d="M20.5 10.5v5.2" />
        </svg>
      );
    case "agency":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.6" />
          <path d="M4.2 18.2c.4-2.8 2.3-4.4 4.8-4.4s4.4 1.6 4.8 4.4" />
          <circle cx="16.2" cy="8.6" r="2.2" />
          <path d="M15.2 13.8c2 .2 3.5 1.5 4.2 4.4" />
        </svg>
      );
    case "growth":
      return (
        <svg {...common}>
          <path d="M5 18.5v-4.5M12 18.5v-8M19 18.5V6.5" />
          <path d="M15.5 8.2 19 6.5l1.6 3.4" />
        </svg>
      );
    case "diagnose":
      return (
        <svg {...common}>
          <rect x="6" y="3.5" width="12" height="17" rx="2" />
          <path d="M9 3.5h6v2.2H9z" />
          <path d="M9 10h6M9 13.5h6M9 17h4" />
        </svg>
      );
    case "wordstat":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M14.6 14.6 20 20" />
          <path d="M8.2 10.5h4.6M10.5 8.2v4.6" />
        </svg>
      );
    case "pages":
      return (
        <svg {...common}>
          <path d="M7 6.5h7.5L18 10v9.5H7z" />
          <path d="M14.5 6.5V10H18" />
          <path d="M9.5 13h5M9.5 16h3.5" />
        </svg>
      );
    case "measure":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 5V3.5M16 5V3.5M4 9.5h16" />
          <path d="M8 13.5h.1M12 13.5h.1M16 13.5h.1M8 17h.1M12 17h.1" />
        </svg>
      );
    case "restoran":
      return (
        <svg {...common}>
          <path d="M8 4v8M8 12c0 2-1.2 3-2.5 3" />
          <path d="M8 4c1 2 1 5 0 8" />
          <path d="M16 4v16M14 4h4" />
        </svg>
      );
    case "avto":
      return (
        <svg {...common}>
          <path d="M4 14h16l-1.5-5.5A2 2 0 0 0 16.6 7H7.4A2 2 0 0 0 5.5 8.5L4 14z" />
          <circle cx="7.5" cy="16.5" r="1.8" />
          <circle cx="16.5" cy="16.5" r="1.8" />
        </svg>
      );
    case "yurist":
      return (
        <svg {...common}>
          <path d="M12 4v16" />
          <path d="M6 8h12" />
          <path d="M6 8l-2 6h4L6 8zM18 8l2 6h-4l2-6z" />
        </svg>
      );
    case "turizm":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.2" />
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

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M9 5h23l-7 30H2L9 5z" fill="#FF6A2B" />
      <path d="M19 11h5.2L22 29h-5.2L19 11z" fill="white" />
    </svg>
  );
}
