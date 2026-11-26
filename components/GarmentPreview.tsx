"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId } from "react";
import { getDye, getGarment, luminance, type StudioConfig } from "@/lib/data";

const W_FACTOR = { relaxed: 1, tailored: 0.9, boxy: 1.12 } as const;
const EASE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

interface Shape {
  body: string;
  details: { d: string; dashed?: boolean; heavy?: boolean }[];
  dots: { cx: number; cy: number }[];
  dims: { y: number; x1: number; x2: number; label: string };
  height: { x: number; y1: number; y2: number; label: string };
}

const r = (n: number) => Math.round(n * 10) / 10;

function overshirt(c: StudioConfig): Shape {
  const w = W_FACTOR[c.fit];
  const s = 96 * w;
  const b = 86 * w * (c.fit === "boxy" ? 1.08 : 1);
  const hy = c.fit === "boxy" ? 382 : 404;
  const long = c.length === "full";
  const cy = long ? 352 : 198;
  const coX = long ? s + 44 : s + 30;
  const ciX = long ? s + 12 : b + 8;
  const ciy = long ? 364 : 210;
  const ay = 176;
  const L = (x: number) => r(200 - x);
  const R = (x: number) => r(200 + x);
  const body = [
    `M 168 66`,
    `L ${L(s)} 90`,
    `L ${L(coX)} ${cy}`,
    `L ${L(ciX)} ${ciy}`,
    `L ${L(b)} ${ay}`,
    `L ${L(b)} ${hy}`,
    `Q 200 ${hy + 16} ${R(b)} ${hy}`,
    `L ${R(b)} ${ay}`,
    `L ${R(ciX)} ${ciy}`,
    `L ${R(coX)} ${cy}`,
    `L ${R(s)} 90`,
    `L 232 66`,
    `Q 200 84 168 66 Z`,
  ].join(" ");
  const buttons = [];
  for (let y = 116; y < hy - 10; y += 46) buttons.push({ cx: 200, cy: y });
  const cuffT = long ? 0.86 : 0.7;
  const lerp = (a: number, bb: number, t: number) => a + (bb - a) * t;
  return {
    body,
    details: [
      { d: `M 168 66 L 186 100 L 200 86 L 214 100 L 232 66`, heavy: true },
      { d: `M 200 86 L 200 ${hy + 14}` },
      { d: `M ${L(s - 6)} 100 Q 200 120 ${R(s - 6)} 100`, dashed: true },
      { d: `M ${L(s)} 90 L ${L(b)} ${ay}`, dashed: true },
      { d: `M ${R(s)} 90 L ${R(b)} ${ay}`, dashed: true },
      {
        d: `M ${r(lerp(200 - s, 200 - coX, cuffT))} ${r(lerp(90, cy, cuffT))} L ${r(lerp(200 - b, 200 - ciX, long ? cuffT : 1))} ${r(lerp(ay, ciy, long ? cuffT : 1))}`,
      },
      {
        d: `M ${r(lerp(200 + s, 200 + coX, cuffT))} ${r(lerp(90, cy, cuffT))} L ${r(lerp(200 + b, 200 + ciX, long ? cuffT : 1))} ${r(lerp(ay, ciy, long ? cuffT : 1))}`,
      },
      { d: `M 216 134 L 252 134 L 252 174 L 234 182 L 216 174 Z` },
      { d: `M 216 144 L 252 144`, dashed: true },
      { d: `M ${L(b - 6)} ${hy - 6} Q 200 ${hy + 8} ${R(b - 6)} ${hy - 6}`, dashed: true },
    ],
    dots: buttons,
    dims: { y: 54, x1: L(s), x2: R(s), label: `SHOULDER ${Math.round(s * 0.48)} CM` },
    height: { x: R(coX) + 22, y1: 66, y2: hy + 8, label: `L ${Math.round((hy - 66) * 0.22)}` },
  };
}

function tunic(c: StudioConfig): Shape {
  const w = W_FACTOR[c.fit];
  const s = 78 * w;
  const h = (c.fit === "boxy" ? 118 : c.fit === "tailored" ? 92 : 112) * w;
  const long = c.length === "full";
  const cy = long ? 318 : 150;
  const coX = long ? s + 72 : s + 28;
  const ciX = long ? s + 22 : s + 10;
  const ciy = long ? 338 : 172;
  const aX = s - 6;
  const hy = 440;
  const L = (x: number) => r(200 - x);
  const R = (x: number) => r(200 + x);
  const body = [
    `M 176 62`,
    `L ${L(s)} 86`,
    `L ${L(coX)} ${cy}`,
    `Q ${L((coX + ciX) / 2)} ${cy + 26} ${L(ciX)} ${ciy}`,
    `L ${L(aX)} 172`,
    `Q ${L(s + 4)} 300 ${L(h)} ${hy}`,
    `C ${L(h / 2)} ${hy + 14} ${L(h / 3)} ${hy - 12} 200 ${hy + 2}`,
    `C ${R(h / 3)} ${hy - 12} ${R(h / 2)} ${hy + 14} ${R(h)} ${hy}`,
    `Q ${R(s + 4)} 300 ${R(aX)} 172`,
    `L ${R(ciX)} ${ciy}`,
    `Q ${R((coX + ciX) / 2)} ${cy + 26} ${R(coX)} ${cy}`,
    `L ${R(s)} 86`,
    `L 224 62`,
    `L 200 120 Z`,
  ].join(" ");
  return {
    body,
    details: [
      { d: `M 176 62 L 200 120 L 224 62`, heavy: true },
      { d: `M 200 120 Q 188 260 ${L(h * 0.55)} ${hy - 2}` },
      { d: `M 200 120 Q 214 270 ${R(h * 0.4)} ${hy - 6}` },
      { d: `M ${L(aX)} 172 Q ${L(aX - 30)} 290 ${L(h * 0.8)} ${hy - 2}`, dashed: true },
      { d: `M ${R(aX)} 172 Q ${R(aX - 34)} 290 ${R(h * 0.78)} ${hy - 2}`, dashed: true },
      { d: `M ${L(s)} 86 L ${L(aX)} 172`, dashed: true },
      { d: `M ${R(s)} 86 L ${R(aX)} 172`, dashed: true },
      { d: `M 182 204 Q 200 214 218 204`, dashed: true },
    ],
    dots: [],
    dims: { y: 50, x1: L(s), x2: R(s), label: `SHOULDER ${Math.round(s * 0.52)} CM` },
    height: { x: R(Math.max(h, coX)) + 20, y1: 62, y2: hy, label: `L ${Math.round((hy - 62) * 0.24)}` },
  };
}

function cargo(c: StudioConfig): Shape {
  const w = W_FACTOR[c.fit] / (c.fit === "boxy" ? 1.06 : 1);
  const spec = {
    relaxed: { hip: 92, outer: 90, inner: 18 },
    tailored: { hip: 86, outer: 66, inner: 22 },
    boxy: { hip: 100, outer: 102, inner: 12 },
  }[c.fit];
  const wb = 74 * w;
  const hip = spec.hip * w;
  const outer = spec.outer * w;
  const inner = spec.inner;
  const hy = c.length === "full" ? 446 : 372;
  const L = (x: number) => r(200 - x);
  const R = (x: number) => r(200 + x);
  const body = [
    `M ${L(wb)} 64`,
    `L ${R(wb)} 64`,
    `L ${R(hip)} 170`,
    `L ${R(outer)} ${hy}`,
    `L ${R(inner)} ${hy}`,
    `L 204 208`,
    `L 196 208`,
    `L ${L(inner)} ${hy}`,
    `L ${L(outer)} ${hy}`,
    `L ${L(hip)} 170 Z`,
  ].join(" ");
  // Point on outer seam at y, used to place cargo pockets on the thigh.
  const outerAt = (y: number) => (y <= 170 ? wb + ((hip - wb) * (y - 64)) / 106 : hip + ((outer - hip) * (y - 170)) / (hy - 170));
  const innerAt = (y: number) => 4 + ((inner - 4) * (y - 208)) / (hy - 208);
  const py = 236;
  const pocketW = 40;
  const pc = (outerAt(py + 30) + innerAt(py + 30)) / 2 + 6;
  const pocket = (side: 1 | -1) => {
    const x0 = 200 + side * (pc - pocketW / 2);
    const x1 = 200 + side * (pc + pocketW / 2);
    return `M ${r(x0)} ${py} L ${r(x1)} ${py} L ${r(x1)} ${py + 58} L ${r(x0)} ${py + 58} Z`;
  };
  const flap = (side: 1 | -1) => {
    const x0 = 200 + side * (pc - pocketW / 2 - 2);
    const x1 = 200 + side * (pc + pocketW / 2 + 2);
    return `M ${r(x0)} ${py - 2} L ${r(x1)} ${py - 2} L ${r(x1)} ${py + 14} L ${r(x0)} ${py + 14} Z`;
  };
  const kneeY = Math.min(320, hy - 40);
  return {
    body,
    details: [
      { d: `M ${L(wb + 1)} 86 L ${R(wb + 1)} 86`, heavy: true },
      { d: `M 200 86 L 200 158 Q 200 176 216 176`, dashed: true },
      { d: `M ${L(wb - 10)} 90 Q ${L(wb - 30)} 120 ${L(wb + 6)} 132` },
      { d: `M ${R(wb - 10)} 90 Q ${R(wb - 30)} 120 ${R(wb + 6)} 132` },
      { d: pocket(-1) },
      { d: pocket(1) },
      { d: flap(-1), heavy: true },
      { d: flap(1), heavy: true },
      { d: `M ${L(outerAt(kneeY) - 8)} ${kneeY} Q ${L((outerAt(kneeY) + innerAt(kneeY)) / 2)} ${kneeY + 8} ${L(innerAt(kneeY) + 6)} ${kneeY}`, dashed: true },
      { d: `M ${R(outerAt(kneeY) - 8)} ${kneeY} Q ${R((outerAt(kneeY) + innerAt(kneeY)) / 2)} ${kneeY + 8} ${R(innerAt(kneeY) + 6)} ${kneeY}`, dashed: true },
      { d: `M ${L(outer - 2)} ${hy - 14} L ${L(inner + 1)} ${hy - 14}`, dashed: true },
      { d: `M ${R(outer - 2)} ${hy - 14} L ${R(inner + 1)} ${hy - 14}`, dashed: true },
    ],
    dots: [
      { cx: L(wb * 0.7), cy: 75 },
      { cx: R(wb * 0.7), cy: 75 },
      { cx: 200, cy: 75 },
    ],
    dims: { y: 48, x1: L(wb), x2: R(wb), label: `WAIST ${Math.round(wb * 1.1)} CM` },
    height: { x: R(Math.max(outer, hip)) + 22, y1: 64, y2: hy, label: `INSEAM ${Math.round((hy - 208) * 0.33)}` },
  };
}

export function garmentShape(c: StudioConfig): Shape {
  if (c.garment === "liquid-drape-tunic") return tunic(c);
  if (c.garment === "architectural-cargo") return cargo(c);
  return overshirt(c);
}

export default function GarmentPreview({
  config,
  className = "",
  showSpecs = true,
  compact = false,
}: {
  config: StudioConfig;
  className?: string;
  showSpecs?: boolean;
  compact?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dye = getDye(config.dye);
  const garment = getGarment(config.garment);
  const shape = garmentShape(config);
  const light = luminance(dye.hex) > 0.6;
  const dark = luminance(dye.hex) < 0.3;
  const stroke = dark ? "rgba(244,241,230,0.55)" : "rgba(28,34,25,0.55)";
  const detail = dark ? "rgba(244,241,230,0.42)" : "rgba(28,34,25,0.32)";
  const outline = light ? "rgba(28,34,25,0.5)" : "rgba(28,34,25,0.85)";
  const ink = "#1C2219";
  const detailKey = `${config.garment}-${config.fit}-${config.length}`;

  return (
    <svg
      viewBox="0 0 400 480"
      role="img"
      aria-label={`${garment.name} in ${dye.name}`}
      data-testid="garment-preview"
      data-garment={config.garment}
      data-dye={config.dye}
      data-fit={config.fit}
      data-length={config.length}
      data-fill={dye.hex}
      className={className}
    >
      <defs>
        <linearGradient id={`shade-${uid}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`fold-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#1C2219" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx="200" cy="462" rx={compact ? 90 : 120} ry="8" fill={ink} fillOpacity="0.08" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.g
          key={config.garment}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ transformOrigin: "200px 260px" }}
        >
          <g filter={`url(#shadow-${uid})`}>
            <motion.path
              data-testid="garment-body"
              initial={false}
              animate={{ d: shape.body, fill: dye.hex }}
              transition={EASE}
              stroke={outline}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
          <motion.path initial={false} animate={{ d: shape.body }} transition={EASE} fill={`url(#shade-${uid})`} />
          <motion.path initial={false} animate={{ d: shape.body }} transition={EASE} fill={`url(#fold-${uid})`} />
          <motion.g key={detailKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
            {shape.details.map((p, i) => (
              <path
                key={i}
                d={p.d}
                fill="none"
                stroke={p.heavy ? stroke : detail}
                strokeWidth={p.heavy ? 1.4 : 1}
                strokeDasharray={p.dashed ? "3 3" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {shape.dots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r="3.2" fill={dark ? "#F4F1E6" : "#1C2219"} fillOpacity="0.55" />
            ))}
          </motion.g>
        </motion.g>
      </AnimatePresence>

      {showSpecs && (
        <motion.g key={`dims-${detailKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <g stroke={ink} strokeOpacity="0.45" strokeWidth="0.8">
            <line x1={shape.dims.x1} x2={shape.dims.x2} y1={shape.dims.y} y2={shape.dims.y} />
            <line x1={shape.dims.x1} x2={shape.dims.x1} y1={shape.dims.y - 5} y2={shape.dims.y + 5} />
            <line x1={shape.dims.x2} x2={shape.dims.x2} y1={shape.dims.y - 5} y2={shape.dims.y + 5} />
            <line x1={Math.min(shape.height.x, 388)} x2={Math.min(shape.height.x, 388)} y1={shape.height.y1} y2={shape.height.y2} />
            <line x1={Math.min(shape.height.x, 388) - 5} x2={Math.min(shape.height.x, 388) + 5} y1={shape.height.y1} y2={shape.height.y1} />
            <line x1={Math.min(shape.height.x, 388) - 5} x2={Math.min(shape.height.x, 388) + 5} y1={shape.height.y2} y2={shape.height.y2} />
          </g>
          <text
            x="200"
            y={shape.dims.y - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="1.5"
            fill={ink}
            fillOpacity="0.6"
          >
            {shape.dims.label}
          </text>
          <text
            x={Math.min(shape.height.x, 388) - 8}
            y={(shape.height.y1 + shape.height.y2) / 2}
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="1.5"
            fill={ink}
            fillOpacity="0.6"
            transform={`rotate(-90 ${Math.min(shape.height.x, 388) - 8} ${(shape.height.y1 + shape.height.y2) / 2})`}
          >
            {shape.height.label} CM
          </text>
        </motion.g>
      )}
    </svg>
  );
}
