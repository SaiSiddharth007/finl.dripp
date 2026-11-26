"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Factory, Palette, ScanLine } from "lucide-react";
import { useState } from "react";
import { Reveal, SectionHeader } from "../ui";
import { DotGrid } from "../motifs/Motifs";

const STEPS = [
  {
    code: "01 // PRECISION AI SCAN",
    title: "Precision AI Scan",
    body: "No sizes, just shapes. Your unique proportions and skin undertones mapped via smartphone camera.",
    icon: ScanLine,
    specs: ["412K point cloud", "±0.4 cm tolerance", "Undertone LAB match"],
  },
  {
    code: "02 // CUSTOMIZATION STUDIO",
    title: "Customization Studio",
    body: "Drape, detail, and tone under your absolute control.",
    icon: Palette,
    specs: ["3 silhouettes", "4 mineral dyes", "Live cutting file"],
  },
  {
    code: "03 // SOCIAL WARDROBE & LOCAL MSME MATERIALIZE",
    title: "Social Wardrobe & Local MSME Materialize",
    body: "Share configurations. Tweak designs. Claim ownership. Routed directly to verified Tirupur MSME knitters.",
    icon: Factory,
    specs: ["Verified Tirupur nodes", "7-day turnaround", "On-chain fibre passport"],
  },
];

function StepVisual({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.g key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <rect x="110" y="20" width="100" height="200" rx="18" fill="none" stroke="#1C2219" strokeOpacity="0.5" />
            <path d="M160 52 a14 14 0 1 1 0.1 0 M160 80 C 136 86 132 110 134 140 L 136 196 M160 80 C 184 86 188 110 186 140 L 184 196" fill="none" stroke="#7D946F" strokeWidth="2" />
            <motion.rect x="114" width="92" height="2" fill="#7D946F" initial={{ y: 30 }} animate={{ y: [30, 210, 30] }} transition={{ duration: 3, repeat: Infinity }} />
            {[60, 100, 140, 180].map((y) => (
              <g key={y}>
                <line x1="210" x2="270" y1={y} y2={y} stroke="#1C2219" strokeOpacity="0.25" strokeDasharray="2 3" />
                <circle cx="272" cy={y} r="3" fill="#7D946F" />
              </g>
            ))}
          </motion.g>
        )}
        {step === 1 && (
          <motion.g key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <path d="M120 40 L100 60 L70 150 L92 156 L108 110 L108 210 L212 210 L212 110 L228 156 L250 150 L220 60 L200 40 Q160 60 120 40 Z" fill="#7D946F" stroke="#1C2219" strokeOpacity="0.6" />
            {["#7D946F", "#F4F1E6", "#2C3627", "#B88B72"].map((c, i) => (
              <motion.circle key={c} cx={40} cy={50 + i * 40} r="12" fill={c} stroke="#1C2219" strokeOpacity="0.3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }} />
            ))}
            <path d="M160 52 L160 210" stroke="#1C2219" strokeOpacity="0.3" strokeDasharray="3 3" />
          </motion.g>
        )}
        {step === 2 && (
          <motion.g key="msme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[
              [60, 70],
              [160, 40],
              [260, 80],
              [100, 170],
              [220, 180],
            ].map(([x, y], i) => (
              <g key={i}>
                <motion.line x1="160" y1="120" x2={x} y2={y} stroke="#7D946F" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.12, duration: 0.6 }} />
                <rect x={x - 14} y={y - 10} width="28" height="20" rx="4" fill="#fff" stroke="#1C2219" strokeOpacity="0.4" />
                <path d={`M${x - 8} ${y + 4} l5 -6 l5 6 l5 -6`} fill="none" stroke="#5E7352" />
              </g>
            ))}
            <circle cx="160" cy="120" r="20" fill="#1C2219" />
            <text x="160" y="124" textAnchor="middle" fontSize="9" fill="#F4F1E6" fontFamily="var(--font-mono), monospace">
              TPR
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

export default function Flow() {
  const [active, setActive] = useState(0);
  return (
    <section id="flow" className="relative border-t hairline bg-white/40 py-24 sm:py-32" data-testid="section-flow">
      <div className="container-edge">
        <SectionHeader
          index="02"
          eyebrow="3-Step Flow"
          title={
            <>
              Three Steps to <span className="text-sage">Architectural Drape.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <ol className="flex flex-col gap-3" role="tablist" aria-label="Dripmint workflow steps">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.code}>
                  <Reveal delay={i * 0.08}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      data-testid={`flow-step-${i + 1}`}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className={`group w-full rounded-[24px] border p-6 text-left transition-all duration-500 sm:p-8 ${
                        on ? "border-forest bg-forest text-ivory" : "hairline bg-white text-forest hover:border-forest/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${on ? "text-sage" : "text-sage-dark"}`}>{s.code}</span>
                        <s.icon className={`h-5 w-5 shrink-0 ${on ? "text-sage" : "text-forest/40"}`} aria-hidden />
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{s.title}</h3>
                      <p className={`mt-3 max-w-lg leading-relaxed ${on ? "text-ivory/75" : "text-forest/65"}`}>{s.body}</p>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-wrap gap-2 overflow-hidden pt-5"
                          >
                            {s.specs.map((sp) => (
                              <li key={sp} className="chip border-ivory/20 text-ivory/80">
                                {sp}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </button>
                  </Reveal>
                </li>
              );
            })}
          </ol>
          <Reveal className="relative min-h-[320px] overflow-hidden rounded-[28px] border hairline bg-ivory" delay={0.15}>
            <DotGrid opacity={0.2} />
            <div className="absolute left-6 top-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-forest/50">
              STAGE {String(active + 1).padStart(2, "0")} / 03
            </div>
            <div className="absolute inset-0 p-10 pt-14">
              <StepVisual step={active} />
            </div>
            <div className="absolute bottom-6 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-forest/10">
              <motion.div className="h-full bg-sage" animate={{ width: `${((active + 1) / 3) * 100}%` }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
