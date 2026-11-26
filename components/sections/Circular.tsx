"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Recycle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CYCLE_STAGES,
  GARMENTS,
  MAX_CYCLES,
  computeCircular,
  formatInr,
  formatNum,
  type GarmentId,
} from "@/lib/data";
import { Reveal, Segmented, SectionHeader } from "../ui";
import { TechGrid } from "../motifs/Motifs";

function LoopDiagram({ cycle }: { cycle: number }) {
  const R = 118;
  const nodes = Array.from({ length: MAX_CYCLES }, (_, i) => {
    const a = (i / MAX_CYCLES) * Math.PI * 2 - Math.PI / 2;
    return { x: 160 + R * Math.cos(a), y: 160 + R * Math.sin(a), i };
  });
  const circumference = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label={`Circular loop at cycle ${cycle} of ${MAX_CYCLES}`} data-testid="circ-loop">
      <circle cx="160" cy="160" r={R} fill="none" stroke="#F4F1E6" strokeOpacity="0.12" strokeWidth="10" />
      <motion.circle
        cx="160"
        cy="160"
        r={R}
        fill="none"
        stroke="#7D946F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        transform="rotate(-90 160 160)"
        initial={false}
        animate={{ strokeDashoffset: circumference * (1 - (cycle - 1) / (MAX_CYCLES - 1 || 1)) }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodes.map((n) => {
        const on = n.i < cycle;
        return (
          <g key={n.i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={on ? 15 : 12}
              fill={on ? "#7D946F" : "#1C2219"}
              stroke={on ? "#F4F1E6" : "#F4F1E6"}
              strokeOpacity={on ? 0.9 : 0.25}
              animate={{ r: n.i === cycle - 1 ? 18 : on ? 14 : 12 }}
            />
            <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono), monospace" fill="#F4F1E6">
              C{n.i + 1}
            </text>
          </g>
        );
      })}
      <text x="160" y="150" textAnchor="middle" fontSize="11" letterSpacing="2" fontFamily="var(--font-mono), monospace" fill="#F4F1E6" fillOpacity="0.55">
        FIBRE LIFE
      </text>
      <text x="160" y="186" textAnchor="middle" fontSize="40" fontWeight="800" fontFamily="var(--font-syne), sans-serif" fill="#F4F1E6">
        {cycle}/{MAX_CYCLES}
      </text>
    </svg>
  );
}

export default function Circular() {
  const [garment, setGarment] = useState<GarmentId>("sage-shell-v3");
  const [cycle, setCycle] = useState(1);
  const res = useMemo(() => computeCircular(garment, cycle), [garment, cycle]);
  const stage = CYCLE_STAGES[cycle - 1];
  const fill = ((cycle - 1) / (MAX_CYCLES - 1)) * 100;

  return (
    <section id="circular" className="relative overflow-hidden bg-forest py-24 text-ivory sm:py-32" data-testid="section-circular">
      <TechGrid color="#F4F1E6" opacity={0.04} size={26} />
      <div className="container-edge relative">
        <SectionHeader
          dark
          index="07"
          eyebrow="The Circular Exchange Model"
          title={
            <>
              One fibre. <span className="whitespace-nowrap text-sage">5–7X lives.</span>
            </>
          }
          sub="Lyocell's long cellulose chains keep their full fibre integrity across 5 to 7 recycling cycles without quality loss. Send a garment back, we strip, re-dye and re-knit it — and you earn a Mineral-Dye Refresh Credit."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <LoopDiagram cycle={cycle} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={cycle}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mx-auto mt-4 max-w-md text-center"
                data-testid="circ-stage"
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-sage">
                  Cycle {cycle} · {stage.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{stage.body}</p>
              </motion.div>
            </AnimatePresence>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="rounded-[28px] border border-ivory/10 bg-ivory/[0.04] p-6 backdrop-blur-sm sm:p-8" data-testid="circ-calculator">
              <div className="flex items-center gap-3">
                <Recycle className="h-5 w-5 text-sage" aria-hidden />
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-sage">Trade-In Credit Calculator</p>
              </div>

              <p className="mt-6 text-sm text-ivory/60">Garment type</p>
              <div className="mt-3">
                <Segmented
                  name="circ-garment"
                  tone="dark"
                  testIdPrefix="circ-garment"
                  options={GARMENTS.map((g) => ({ id: g.id, label: g.name }))}
                  value={garment}
                  onChange={setGarment}
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <label htmlFor="circ-cycle" className="text-sm text-ivory/60">
                  Recycling cycle
                </label>
                <span className="font-mono text-sm text-ivory" data-testid="circ-cycle-label">
                  Cycle {cycle}
                </span>
              </div>
              <input
                id="circ-cycle"
                type="range"
                min={1}
                max={MAX_CYCLES}
                step={1}
                value={cycle}
                onChange={(e) => setCycle(Number(e.target.value))}
                className="range-sage range-dark mt-4 w-full"
                style={{ ["--fill" as string]: `${fill}%` }}
                data-testid="circ-cycle"
                aria-valuetext={`Cycle ${cycle} of ${MAX_CYCLES}`}
              />
              <div className="mt-3 grid grid-cols-7 gap-1">
                {Array.from({ length: MAX_CYCLES }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCycle(i + 1)}
                    data-testid={`circ-cycle-btn-${i + 1}`}
                    aria-label={`Cycle ${i + 1}`}
                    className={`rounded-full py-1.5 font-mono text-[10px] transition-colors ${
                      i + 1 === cycle ? "bg-sage text-forest" : "text-ivory/50 hover:text-ivory"
                    }`}
                  >
                    C{i + 1}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-sage p-6 text-forest sm:row-span-2">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest/70">Mineral-Dye Refresh Credit</p>
                  <p className="mt-3 font-display text-[clamp(3.4rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.03em]" data-testid="circ-credit-pct">
                    {res.creditPct}%
                  </p>
                  <p className="mt-2 text-sm text-forest/75">
                    off your next custom garment · <span className="font-semibold" data-testid="circ-credit-inr">{formatInr(res.creditInr)}</span>
                  </p>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-forest/15">
                    <motion.div className="h-full rounded-full bg-forest" animate={{ width: `${(res.creditPct / 65) * 100}%` }} />
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-forest/60">Max 65% at cycle 7</p>
                </div>
                <div className="rounded-3xl border border-ivory/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/50">Cumulative water saved</p>
                  <p className="mt-2 font-display text-3xl font-bold" data-testid="circ-water">
                    {formatNum(res.cumulativeWaterL)} L
                  </p>
                </div>
                <div className="rounded-3xl border border-ivory/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/50">Cumulative CO2 avoided</p>
                  <p className="mt-2 font-display text-3xl font-bold" data-testid="circ-co2">
                    {res.cumulativeCo2Kg.toFixed(1)} kg
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/40">Fibre integrity {res.fiberIntegrityPct}%</p>
                </div>
              </div>

              <ol className="mt-8 grid gap-3 border-t border-ivory/10 pt-6 sm:grid-cols-3">
                {[
                  ["Strip", "Enzyme bath lifts the old mineral tone"],
                  ["Re-dye", "Fresh botanic mineral bath, closed-loop"],
                  ["Re-knit", "Re-spun & knit to your new cutting file"],
                ].map(([t, b], i) => (
                  <li key={t} className="text-sm">
                    <span className="font-mono text-[10px] text-sage">0{i + 1}</span>
                    <p className="mt-1 font-semibold">{t}</p>
                    <p className="text-ivory/55">{b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
