"use client";

import { useId } from "react";

interface MotifProps {
  className?: string;
  color?: string;
  opacity?: number;
  size?: number;
}

const useSafeId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

/** P_01: DOT GRID — precision equidistant matrix for AI scanning surfaces. */
export function DotGrid({ className = "", color = "#1C2219", opacity = 0.22, size = 18 }: MotifProps) {
  const id = useSafeId("p01");
  return (
    <svg aria-hidden="true" data-motif="P_01" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={size / 2} cy={size / 2} r={1} fill={color} fillOpacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** P_02: LINEAR SHIFT — diagonal architectural parallels. */
export function LinearShift({ className = "", color = "#F4F1E6", opacity = 0.18, size = 14 }: MotifProps) {
  const id = useSafeId("p02");
  return (
    <svg aria-hidden="true" data-motif="P_02" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2={size} stroke={color} strokeOpacity={opacity} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** P_03: TECH GRID — fine engineering blueprint wireframe. */
export function TechGrid({ className = "", color = "#1C2219", opacity = 0.08, size = 24 }: MotifProps) {
  const id = useSafeId("p03");
  const major = size * 5;
  return (
    <svg aria-hidden="true" data-motif="P_03" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={`${id}-m`} width={size} height={size} patternUnits="userSpaceOnUse">
          <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="0.6" />
        </pattern>
        <pattern id={id} width={major} height={major} patternUnits="userSpaceOnUse">
          <rect width={major} height={major} fill={`url(#${id}-m)`} />
          <path d={`M ${major} 0 L 0 0 0 ${major}`} fill="none" stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" />
          <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke={color} strokeOpacity={opacity * 4} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** P_04: LIQUID FLORA — organic leaf-vein line art. */
export function LiquidFlora({ className = "", color = "#7D946F", opacity = 0.55 }: MotifProps) {
  const id = useSafeId("p04");
  return (
    <svg aria-hidden="true" data-motif="P_04" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1" strokeLinecap="round">
            <path d="M20 200 C 60 140, 90 90, 170 30" />
            <path d="M20 200 C 80 190, 150 130, 170 30" />
            <path d="M20 200 C 40 130, 110 60, 170 30" />
            <path d="M60 150 C 70 135, 92 128, 110 130" />
            <path d="M82 118 C 92 100, 112 92, 132 92" />
            <path d="M108 86 C 118 72, 136 64, 150 62" />
            <path d="M62 150 C 56 132, 60 112, 72 98" />
            <path d="M90 116 C 86 98, 92 80, 104 70" />
            <path d="M200 120 C 190 150, 196 180, 214 210" />
            <path d="M200 120 C 214 146, 220 176, 214 210" />
            <path d="M204 150 L 212 162 M 206 176 L 216 184" />
          </g>
          <circle cx="170" cy="30" r="2" fill={color} fillOpacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export const MOTIF_LEGEND = [
  { code: "P_01", name: "Dot Grid" },
  { code: "P_02", name: "Linear Shift" },
  { code: "P_03", name: "Tech Grid" },
  { code: "P_04", name: "Liquid Flora" },
] as const;
