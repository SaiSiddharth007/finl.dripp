"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Camera, Check, Loader2, Palette, Ruler, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DYES, getDye, getFit, type DyeId, type FitId, type Undertone } from "@/lib/data";
import { useApp, type BodyMeasurements } from "../AppContext";
import { DotGrid } from "../motifs/Motifs";
import Modal from "./Modal";

type Build = "lean" | "athletic" | "soft";

const UNDERTONES: { id: Undertone; label: string; skin: string; note: string }[] = [
  { id: "warm", label: "Warm", skin: "#C68A62", note: "Golden, peach notes" },
  { id: "cool", label: "Cool", skin: "#B98479", note: "Pink, rosy notes" },
  { id: "neutral", label: "Neutral", skin: "#B88F70", note: "Balanced mix" },
  { id: "olive", label: "Olive", skin: "#9E7D55", note: "Green-grey notes" },
];

const UNDERTONE_DYE: Record<Undertone, DyeId> = {
  warm: "mineral-clay",
  cool: "deep-moss",
  neutral: "raw-ivory",
  olive: "russian-green",
};
const BUILD_FIT: Record<Build, FitId> = { lean: "tailored", athletic: "boxy", soft: "relaxed" };

const STEPS = ["Proportion Calibration", "Skin Undertone & Palette Match", "Custom Measurements Generated"];

function measure(heightCm: number, build: Build, undertone: Undertone): BodyMeasurements {
  const k = { lean: { c: 0.52, w: 0.42, h: 0.53 }, athletic: { c: 0.57, w: 0.45, h: 0.55 }, soft: { c: 0.56, w: 0.5, h: 0.59 } }[build];
  const r = (n: number) => Math.round(n * 10) / 10;
  return {
    heightCm,
    chestCm: r(heightCm * k.c),
    waistCm: r(heightCm * k.w),
    hipCm: r(heightCm * k.h),
    shoulderCm: r(heightCm * (build === "athletic" ? 0.27 : 0.255)),
    sleeveCm: r(heightCm * 0.355),
    inseamCm: r(heightCm * 0.455),
    undertone,
    scanId: `VX-${heightCm}${build[0].toUpperCase()}${undertone[0].toUpperCase()}`,
  };
}

function ScanVisual({ progress, height }: { progress: number; height: number }) {
  const scale = 0.82 + ((height - 150) / 50) * 0.18;
  return (
    <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden>
      <rect x="40" y="10" width="160" height="300" rx="26" fill="none" stroke="#1C2219" strokeOpacity="0.4" />
      <g transform={`translate(120 300) scale(${scale}) translate(-120 -300)`}>
        <ellipse cx="120" cy="58" rx="18" ry="22" fill="none" stroke="#7D946F" strokeWidth="1.6" />
        <path
          d="M120 82 C 92 86 82 100 80 130 L 74 200 M120 82 C 148 86 158 100 160 130 L 166 200 M96 140 L 98 296 M144 140 L 142 296 M98 200 L 142 200"
          fill="none"
          stroke="#7D946F"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {Array.from({ length: 40 }).map((_, i) => {
          const y = 60 + ((i * 53) % 236);
          const x = 120 + (((i * 37) % 60) - 30) * (0.6 + (y / 300) * 0.4);
          return <circle key={i} cx={x} cy={y} r="1.4" fill="#1C2219" opacity={(i / 40) * 100 < progress ? 0.7 : 0.08} />;
        })}
      </g>
      <motion.rect
        x="44"
        width="152"
        height="2"
        fill="#7D946F"
        animate={{ y: [20, 300, 20] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="120" y="306" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono), monospace" fill="#1C2219" opacity="0.6">
        {Math.round(progress)}% · {height} CM
      </text>
    </svg>
  );
}

export default function ScanModal() {
  const { modal, closeModal, applyMeasurements } = useApp();
  const open = modal === "scan";
  const [step, setStep] = useState(0);
  const [height, setHeight] = useState(172);
  const [build, setBuild] = useState<Build>("athletic");
  const [progress, setProgress] = useState(0);
  const [calibrating, setCalibrating] = useState(false);
  const [undertone, setUndertone] = useState<Undertone>("olive");
  const [generating, setGenerating] = useState(false);

  // Reset when reopened.
  useEffect(() => {
    if (open) {
      setStep(0);
      setProgress(0);
      setCalibrating(false);
      setGenerating(false);
    }
  }, [open]);

  useEffect(() => {
    if (!calibrating) return;
    const id = window.setInterval(() => setProgress((p) => Math.min(100, p + 7)), 80);
    return () => window.clearInterval(id);
  }, [calibrating]);

  useEffect(() => {
    if (calibrating && progress >= 100) setCalibrating(false);
  }, [calibrating, progress]);

  useEffect(() => {
    if (!generating) return;
    const t = window.setTimeout(() => {
      setGenerating(false);
      setStep(2);
    }, 900);
    return () => window.clearTimeout(t);
  }, [generating]);

  const m = useMemo(() => measure(height, build, undertone), [height, build, undertone]);
  const recDye = getDye(UNDERTONE_DYE[undertone]);
  const recFit = getFit(BUILD_FIT[build]);

  return (
    <Modal open={open} onClose={closeModal} label="AI Body and Skin Scan" testId="scan-modal">
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[260px] overflow-hidden border-b hairline bg-white md:min-h-[540px] md:border-b-0 md:border-r">
          <DotGrid opacity={0.22} />
          <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-forest/50">Volumetric Capture</div>
          <div className="absolute inset-0 p-10 pt-12">
            <ScanVisual progress={step === 0 ? progress : 100} height={height} />
          </div>
        </div>

        <div className="p-6 pt-16 sm:p-10">
          <ol className="flex gap-2 pr-12" aria-label="Scan progress">
            {STEPS.map((s, i) => (
              <li key={s} className="flex-1">
                <div className={`h-1 rounded-full ${i <= step ? "bg-sage" : "bg-forest/10"}`} />
                <p className={`mt-2 hidden font-mono text-[9.5px] uppercase tracking-[0.14em] sm:block ${i === step ? "text-forest" : "text-forest/40"}`}>
                  0{i + 1} {s}
                </p>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} data-testid="scan-step-1">
                <p className="eyebrow mt-8">Step 1 · Proportion Calibration</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em]">No sizes. Just your shape.</h3>
                <p className="mt-3 text-forest/65">Set a reference height and build, then hold your phone at chest level while we calibrate the point cloud.</p>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="scan-height" className="font-medium">
                      Reference height
                    </label>
                    <span className="font-mono">{height} cm</span>
                  </div>
                  <input
                    id="scan-height"
                    type="range"
                    min={150}
                    max={200}
                    value={height}
                    disabled={calibrating}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="range-sage mt-3 w-full"
                    style={{ ["--fill" as string]: `${((height - 150) / 50) * 100}%` }}
                    data-testid="scan-height"
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Build">
                  {(["lean", "athletic", "soft"] as Build[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      role="radio"
                      aria-checked={build === b}
                      onClick={() => setBuild(b)}
                      className={`rounded-full border px-4 py-2 text-sm capitalize transition-colors ${build === b ? "border-forest bg-forest text-ivory" : "hairline bg-white"}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {progress < 100 ? (
                    <button type="button" className="btn-primary" disabled={calibrating} onClick={() => setCalibrating(true)} data-testid="scan-calibrate">
                      {calibrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      {calibrating ? `Calibrating ${progress}%` : "Begin Calibration"}
                    </button>
                  ) : (
                    <button type="button" className="btn-primary" onClick={() => setStep(1)} data-testid="scan-next-1">
                      <Check className="h-4 w-4" /> Calibrated · Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} data-testid="scan-step-2">
                <p className="eyebrow mt-8">Step 2 · Skin Undertone &amp; Palette Match</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em]">Find your mineral tone.</h3>
                <p className="mt-3 text-forest/65">Our camera reads undertone under daylight-balanced exposure. Confirm what we detected:</p>
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Skin undertone">
                  {UNDERTONES.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      role="radio"
                      aria-checked={undertone === u.id}
                      data-testid={`scan-undertone-${u.id}`}
                      onClick={() => setUndertone(u.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-colors ${undertone === u.id ? "border-forest bg-white" : "hairline"}`}
                    >
                      <span className="h-10 w-10 rounded-full border hairline" style={{ background: u.skin }} />
                      <span className="text-sm font-semibold">{u.label}</span>
                      <span className="text-[11px] text-forest/50">{u.note}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border hairline bg-white p-4">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-forest/50">
                    <Palette className="h-3.5 w-3.5 text-sage" /> Palette match
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {DYES.map((d) => {
                      const match = d.undertones.includes(undertone);
                      return (
                        <span key={d.id} className={`flex items-center gap-2 text-sm ${match ? "" : "opacity-35"}`}>
                          <span className="h-5 w-5 rounded-full border hairline" style={{ background: d.hex }} />
                          {d.name}
                          {d.id === recDye.id && <span className="chip border-sage/40 py-0.5 text-sage-dark">Best</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8">
                  <button type="button" className="btn-primary" disabled={generating} onClick={() => setGenerating(true)} data-testid="scan-generate">
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ruler className="h-4 w-4" />}
                    {generating ? "Generating measurements…" : "Generate Measurements"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} data-testid="scan-step-3">
                <p className="eyebrow mt-8">Step 3 · Custom Measurements Generated</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em]">Scan {m.scanId}</h3>
                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-[color:var(--border-subtle)] sm:grid-cols-3" data-testid="scan-measurements">
                  {[
                    ["Chest", m.chestCm],
                    ["Waist", m.waistCm],
                    ["Hip", m.hipCm],
                    ["Shoulder", m.shoulderCm],
                    ["Sleeve", m.sleeveCm],
                    ["Inseam", m.inseamCm],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white p-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest/50">{k}</dt>
                      <dd className="mt-1 font-display text-2xl font-bold">
                        {v}
                        <span className="ml-1 text-sm font-medium text-forest/45">cm</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm text-forest/65">
                  Recommended: <span className="font-semibold text-forest">{recFit.name}</span> in{" "}
                  <span className="font-semibold text-forest">{recDye.name}</span> for your {undertone} undertone.
                </p>
                <button
                  type="button"
                  className="btn-primary mt-8"
                  data-testid="scan-send"
                  onClick={() => applyMeasurements(m, { dye: recDye.id, fit: recFit.id })}
                >
                  <Send className="h-4 w-4" /> Send Measurements to Studio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
