"use client";

import { useMemo, useState } from "react";

type Point = { label: string; value: number };

function niceMax(n: number) {
  if (n <= 10) return 10;
  const p = Math.pow(10, Math.floor(Math.log10(n)));
  const m = n / p;
  const step = m <= 2 ? 2 : m <= 5 ? 5 : 10;
  return step * p;
}

export function LineChart({
  points,
  color = "#ea580c",
  unit = "",
  height = 240,
}: {
  points: Point[];
  color?: string;
  unit?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 640;
  const h = height;
  const pad = { l: 40, r: 16, t: 16, b: 32 };
  const max = niceMax(Math.max(...points.map((p) => p.value), 1));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const xs = points.map((_, i) => pad.l + (i * (w - pad.l - pad.r)) / Math.max(points.length - 1, 1));
  const ys = points.map((p) => pad.t + (1 - p.value / max) * (h - pad.t - pad.b));
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");
  const area = `${line} L${xs[xs.length - 1]},${h - pad.b} L${xs[0]},${h - pad.b} Z`;
  const id = useMemo(() => "ln-" + color.replace("#", ""), [color]);
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));
  const hi = hover ?? points.length - 1;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - box.left) / box.width) * w;
          let best = 0;
          let dist = Infinity;
          xs.forEach((px, i) => {
            const d = Math.abs(px - x);
            if (d < dist) {
              dist = d;
              best = i;
            }
          });
          setHover(best);
        }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => {
          const y = pad.t + (1 - t / max) * (h - pad.t - pad.b);
          return (
            <g key={t}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="currentColor" className="text-[#e5e7eb] dark:text-[#2a2e36]" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                {t}
                {unit && t === max ? unit : ""}
              </text>
            </g>
          );
        })}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
        {hover !== null && (
          <>
            <line x1={xs[hi]} y1={pad.t} x2={xs[hi]} y2={h - pad.b} stroke={color} strokeDasharray="4 4" opacity="0.45" />
            <circle cx={xs[hi]} cy={ys[hi]} r="4.5" fill="#fff" stroke={color} strokeWidth="2.5" />
          </>
        )}
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <text key={p.label + i} x={xs[i]} y={h - 10} textAnchor="middle" fontSize="11" fill="#9ca3af">
              {p.label}
            </text>
          ) : null
        )}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute left-12 top-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-[12px] shadow-sm">
          <span className="text-[#6b7280]">{points[hi].label}</span>
          <span className="ml-2 font-semibold">
            {points[hi].value}
            {unit}
          </span>
        </div>
      )}
    </div>
  );
}

export function ColumnChart({
  points,
  color = "#0f766e",
  height = 240,
}: {
  points: Point[];
  color?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 640;
  const h = height;
  const pad = { l: 40, r: 12, t: 16, b: 32 };
  const max = niceMax(Math.max(...points.map((p) => p.value), 1));
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  const slot = (w - pad.l - pad.r) / points.length;
  const bw = Math.max(4, Math.min(28, slot * 0.55));
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => {
          const y = pad.t + (1 - t / max) * (h - pad.t - pad.b);
          return (
            <g key={t}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#e5e7eb" />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                {t}
              </text>
            </g>
          );
        })}
        {points.map((p, i) => {
          const bh = ((h - pad.t - pad.b) * p.value) / max;
          const x = pad.l + i * slot + (slot - bw) / 2;
          const y = h - pad.b - bh;
          return (
            <g key={p.label + i} onMouseEnter={() => setHover(i)}>
              <rect
                x={x}
                y={y}
                width={bw}
                height={bh}
                rx="4"
                fill={color}
                opacity={hover === null || hover === i ? 1 : 0.35}
              />
              {(i % labelEvery === 0 || i === points.length - 1) && (
                <text x={x + bw / 2} y={h - 10} textAnchor="middle" fontSize="11" fill="#9ca3af">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute left-12 top-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-[12px] shadow-sm">
          <span className="text-[#6b7280]">{points[hover].label}</span>
          <span className="ml-2 font-semibold">{points[hover].value}</span>
        </div>
      )}
    </div>
  );
}

export function SparkLine({ values, color = "#ea580c" }: { values: number[]; color?: string }) {
  const w = 120;
  const h = 36;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const d = values
    .map((v, i) => {
      const x = (i * w) / Math.max(values.length - 1, 1);
      const y = 4 + (1 - (v - min) / span) * (h - 8);
      return `${i ? "L" : "M"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
