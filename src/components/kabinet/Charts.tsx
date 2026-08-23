export function AreaChart({
  values,
  labels,
  color = "#ea580c",
  height = 160,
}: {
  values: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) {
  const w = 560;
  const h = height;
  const pad = 16;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(values.length - 1, 1);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const fill = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
      <defs>
        <linearGradient id={`ag-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#ag-${color.replace("#", "")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill={color} />
      ))}
      {labels?.map((l, i) => (
        <text key={l} x={pts[i][0]} y={h - 2} textAnchor="middle" fontSize="10" fill="#9ca3af">
          {l}
        </text>
      ))}
    </svg>
  );
}

export function BarGroup({
  series,
  height = 180,
}: {
  series: { label: string; values: { key: string; value: number; color: string }[] }[];
  height?: number;
}) {
  const w = 560;
  const h = height;
  const pad = { l: 8, r: 8, t: 8, b: 22 };
  const max = Math.max(...series.flatMap((s) => s.values.map((v) => v.value)), 1);
  const groupW = (w - pad.l - pad.r) / series.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
      {series.map((s, i) => {
        const bw = (groupW - 10) / s.values.length;
        return (
          <g key={s.label}>
            {s.values.map((v, j) => {
              const bh = ((h - pad.t - pad.b) * v.value) / max;
              const x = pad.l + i * groupW + 6 + j * bw;
              const y = h - pad.b - bh;
              return <rect key={v.key} x={x} y={y} width={Math.max(bw - 2, 3)} height={bh} rx="2" fill={v.color} />;
            })}
            <text x={pad.l + i * groupW + groupW / 2} y={h - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HBars({
  items,
}: {
  items: { label: string; value: number; color?: string; you?: boolean }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className={i.you ? "font-semibold text-[#ea580c]" : "text-[#374151]"}>{i.label}</span>
            <span className="tabular-nums text-[#6b7280]">{i.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(i.value / max) * 100}%`,
                background: i.color || (i.you ? "#ea580c" : "#d1d5db"),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  items,
  size = 160,
}: {
  items: { name: string; share: number; color: string }[];
  size?: number;
}) {
  const r = 56;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 160 160">
        <g transform="translate(80 80) rotate(-90)">
          {items.map((it) => {
            const len = (it.share / 100) * c;
            const el = (
              <circle
                key={it.name}
                r={r}
                fill="none"
                stroke={it.color}
                strokeWidth="16"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <ul className="space-y-1.5 text-[13px]">
        {items.map((it) => (
          <li key={it.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            <span className="text-[#374151]">{it.name}</span>
            <span className="ml-auto tabular-nums text-[#6b7280]">{it.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Gauge({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 70;
  const c = Math.PI * r;
  const dash = (clamped / 100) * c;
  const color = clamped >= 75 ? "#16a34a" : clamped >= 50 ? "#ea580c" : "#dc2626";
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <g transform="translate(100 100)">
          <path d="M -70 0 A 70 70 0 0 1 70 0" fill="none" stroke="#f3f4f6" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M -70 0 A 70 70 0 0 1 70 0"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </g>
        <text x="100" y="88" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">
          {Math.round(clamped)}
        </text>
      </svg>
      {label && <div className="-mt-2 text-sm text-[#6b7280]">{label}</div>}
    </div>
  );
}

export function Spark({ values, color = "#ea580c" }: { values: number[]; color?: string }) {
  const w = 88;
  const h = 28;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const pts = values
    .map((v, i) => {
      const x = (i * w) / Math.max(values.length - 1, 1);
      const y = h - ((v - min) / Math.max(max - min, 1)) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={pts} />
    </svg>
  );
}

export const MONTHS = ["сен", "окт", "ноя", "дек", "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг"];
