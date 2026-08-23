function uid(prefix: string) {
  return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

export function Bars3D({
  values,
  labels,
  color = "#ea580c",
  height = 220,
}: {
  values: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) {
  const w = 720;
  const h = height;
  const padL = 28;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const max = Math.max(...values, 1);
  const n = Math.max(values.length, 1);
  const gap = n > 20 ? 2 : n > 12 ? 4 : 8;
  const depth = n > 20 ? 5 : 10;
  const slot = (w - padL - padR) / n;
  const bw = Math.max(4, slot - gap - depth);
  const id = uid("b3");
  const dark = shade(color, -28);
  const mid = shade(color, -12);
  const light = shade(color, 22);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
      <defs>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="40%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#e5e7eb" />
      {values.map((v, i) => {
        const bh = ((h - padT - padB - depth) * v) / max;
        const x = padL + i * slot + (slot - bw - depth) / 2;
        const y = h - padB - bh;
        const top = [
          [x, y],
          [x + depth, y - depth],
          [x + bw + depth, y - depth],
          [x + bw, y],
        ];
        const side = [
          [x + bw, y],
          [x + bw + depth, y - depth],
          [x + bw + depth, h - padB - depth],
          [x + bw, h - padB],
        ];
        return (
          <g key={i}>
            <polygon points={side.map((p) => p.join(",")).join(" ")} fill={`url(#${id}-side)`} />
            <rect x={x} y={y} width={bw} height={bh} fill={`url(#${id}-front)`} />
            <polygon points={top.map((p) => p.join(",")).join(" ")} fill={`url(#${id}-top)`} />
            {labels && (n <= 14 || i % Math.ceil(n / 12) === 0) && (
              <text x={x + bw / 2} y={h - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Ribbon3D({
  values,
  labels,
  color = "#ea580c",
  height = 220,
}: {
  values: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) {
  const w = 720;
  const h = height;
  const pad = { l: 12, r: 18, t: 20, b: 28 };
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const depth = 14;
  const xs = values.map((_, i) => pad.l + (i * (w - pad.l - pad.r - depth)) / Math.max(values.length - 1, 1));
  const ys = values.map((v) => pad.t + depth + (1 - (v - min) / span) * (h - pad.t - pad.b - depth));
  const front = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");
  const back = xs.map((x, i) => `${x + depth},${ys[i] - depth}`);
  const id = uid("r3");
  const dark = shade(color, -30);
  const light = shade(color, 18);

  const sidePath = [
    `M${xs[0]},${ys[0]}`,
    ...xs.map((x, i) => `L${x},${ys[i]}`),
    `L${xs[xs.length - 1] + depth},${ys[ys.length - 1] - depth}`,
    ...[...back].reverse().map((p) => `L${p}`),
    "Z",
  ].join(" ");

  const topFill = [
    front,
    `L${xs[xs.length - 1] + depth},${h - pad.b - depth}`,
    `L${xs[0] + depth},${h - pad.b - depth}`,
    "Z",
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} stopOpacity="0.95" />
          <stop offset="70%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={dark} stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <path d={sidePath} fill={`url(#${id}-edge)`} opacity="0.45" />
      <path d={topFill} fill={`url(#${id}-face)`} />
      <path d={front} fill="none" stroke={color} strokeWidth="2.4" />
      <path
        d={back.map((p, i) => `${i ? "L" : "M"}${p}`).join(" ")}
        fill="none"
        stroke={dark}
        strokeWidth="1.2"
        opacity="0.7"
      />
      {xs.map((x, i) =>
        i % Math.max(1, Math.ceil(xs.length / 10)) === 0 ? (
          <line
            key={i}
            x1={x}
            y1={ys[i]}
            x2={x + depth}
            y2={ys[i] - depth}
            stroke={dark}
            strokeWidth="1"
            opacity="0.35"
          />
        ) : null
      )}
      {labels?.map((l, i) =>
        i % Math.max(1, Math.ceil(labels.length / 12)) === 0 ? (
          <text key={`${l}-${i}`} x={xs[i]} y={h - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {l}
          </text>
        ) : null
      )}
    </svg>
  );
}

export function MiniBars3D({ values, color = "#ea580c" }: { values: number[]; color?: string }) {
  const slice = values.length > 14 ? values.filter((_, i) => i % Math.ceil(values.length / 12) === 0) : values;
  return <Bars3D values={slice} color={color} height={72} />;
}

function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (num & 255) + amt));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
