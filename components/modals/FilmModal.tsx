"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, ScanLine } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext";
import { TechGrid } from "../motifs/Motifs";
import Modal from "./Modal";

const CHAPTER_MS = 5200;

const CHAPTERS = [
  {
    code: "01",
    title: "Scan",
    head: "Your body, as a 412K-point cloud.",
    body: "A 20-second smartphone capture maps proportions to ±0.4 cm and reads skin undertone for a personal mineral palette.",
  },
  {
    code: "02",
    title: "Studio",
    head: "Drape, detail and tone — generated.",
    body: "The generative engine drafts a parametric pattern from your cloud. You steer silhouette, dye and length in real time.",
  },
  {
    code: "03",
    title: "Tirupur MSME",
    head: "A digital cutting file, not a warehouse.",
    body: "Your file routes to the nearest verified Tirupur micro-factory. Knit, cut and finished on demand in 7 days. Zero inventory.",
  },
  {
    code: "04",
    title: "Circular Refresh",
    head: "Return. Re-dye. Re-knit. Up to 7 lives.",
    body: "Lyocell keeps its integrity for 5–7 cycles. Every return earns a Mineral-Dye Refresh Credit of up to 65%.",
  },
];

function Scene({ i }: { i: number }) {
  const common = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4 } };
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden data-testid={`film-scene-${i + 1}`}>
      <AnimatePresence mode="wait">
        {i === 0 && (
          <motion.g key="a" {...common}>
            <rect x="190" y="30" width="100" height="240" rx="20" fill="none" stroke="#F4F1E6" strokeOpacity="0.4" />
            {Array.from({ length: 90 }).map((_, k) => {
              const y = 60 + ((k * 41) % 190);
              const x = 240 + (((k * 29) % 50) - 25) * (0.5 + y / 300);
              return (
                <motion.circle key={k} cx={x} cy={y} r="1.6" fill="#B9CBA9" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ delay: (k % 30) * 0.05, duration: 1.4 }} />
              );
            })}
            <motion.rect x="194" width="92" height="2" fill="#7D946F" animate={{ y: [40, 260, 40] }} transition={{ duration: 2.6, repeat: Infinity }} />
          </motion.g>
        )}
        {i === 1 && (
          <motion.g key="b" {...common}>
            <motion.path
              d="M200 60 L170 80 L130 190 L156 198 L176 140 L176 260 L304 260 L304 140 L324 198 L350 190 L310 80 L280 60 Q240 84 200 60 Z"
              fill="none"
              stroke="#7D946F"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, fill: ["rgba(125,148,111,0)", "rgba(125,148,111,0.9)"] }}
              transition={{ duration: 2.2 }}
            />
            {[0, 1, 2, 3].map((k) => (
              <motion.circle key={k} cx={80} cy={90 + k * 40} r="12" fill={["#7D946F", "#F4F1E6", "#2C3627", "#B88B72"][k]} stroke="#F4F1E6" strokeOpacity="0.3" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + k * 0.15 }} />
            ))}
          </motion.g>
        )}
        {i === 2 && (
          <motion.g key="c" {...common}>
            <motion.path d="M60 150 C 160 60, 320 240, 420 150" fill="none" stroke="#7D946F" strokeWidth="2" strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8 }} />
            <rect x="30" y="126" width="60" height="48" rx="10" fill="#F4F1E6" />
            <text x="60" y="155" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono), monospace" fill="#1C2219">
              .DXF
            </text>
            <g transform="translate(380 110)">
              <rect width="80" height="80" rx="12" fill="#7D946F" />
              <path d="M16 60 L16 34 L32 44 L32 30 L48 40 L48 26 L64 36 L64 60 Z" fill="#1C2219" />
            </g>
            <text x="420" y="214" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono), monospace" fill="#F4F1E6" opacity="0.7">
              TIRUPUR #04
            </text>
          </motion.g>
        )}
        {i === 3 && (
          <motion.g key="d" {...common}>
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "240px 150px" }}>
              <circle cx="240" cy="150" r="90" fill="none" stroke="#7D946F" strokeWidth="2" strokeDasharray="4 10" />
              {Array.from({ length: 7 }).map((_, k) => {
                const a = (k / 7) * Math.PI * 2;
                return <circle key={k} cx={240 + 90 * Math.cos(a)} cy={150 + 90 * Math.sin(a)} r="9" fill={k === 0 ? "#F4F1E6" : "#7D946F"} />;
              })}
            </motion.g>
            <text x="240" y="160" textAnchor="middle" fontSize="34" fontWeight="800" fontFamily="var(--font-syne), sans-serif" fill="#F4F1E6">
              5–7X
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

export default function FilmModal() {
  const { modal, closeModal, openModal } = useApp();
  const open = modal === "film";
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const last = useRef<number | null>(null);
  const done = chapter === CHAPTERS.length - 1 && elapsed >= CHAPTER_MS;

  useEffect(() => {
    if (open) {
      setChapter(0);
      setElapsed(0);
      setPlaying(true);
    }
  }, [open]);

  // rAF-driven playhead.
  useEffect(() => {
    if (!open || !playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (t: number) => {
      if (last.current != null) {
        const dt = t - last.current;
        setElapsed((e) => e + dt);
      }
      last.current = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, playing]);

  useEffect(() => {
    if (elapsed < CHAPTER_MS) return;
    if (chapter < CHAPTERS.length - 1) {
      setChapter((c) => c + 1);
      setElapsed(0);
    } else {
      setPlaying(false);
      setElapsed(CHAPTER_MS);
    }
  }, [elapsed, chapter]);

  const go = useCallback((i: number) => {
    setChapter(Math.max(0, Math.min(CHAPTERS.length - 1, i)));
    setElapsed(0);
  }, []);

  const c = CHAPTERS[chapter];

  return (
    <Modal open={open} onClose={closeModal} label="Dripmint Framework Film" testId="film-modal" dark>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest sm:aspect-[16/8]">
        <TechGrid color="#F4F1E6" opacity={0.05} size={24} />
        <div className="absolute inset-0 p-6 sm:p-10">
          <Scene i={chapter} />
        </div>
        <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          Framework Film · Chapter {c.code}/04
        </div>
      </div>

      {/* chapter progress */}
      <div className="flex gap-1.5 px-6 pt-5 sm:px-10">
        {CHAPTERS.map((ch, i) => (
          <button key={ch.code} type="button" onClick={() => go(i)} className="group flex-1 py-2" aria-label={`Chapter ${ch.code}: ${ch.title}`} data-testid={`film-chapter-${i + 1}`}>
            <span className="block h-[3px] overflow-hidden rounded-full bg-ivory/15">
              <span
                className="block h-full bg-sage"
                style={{ width: i < chapter ? "100%" : i === chapter ? `${Math.min(100, (elapsed / CHAPTER_MS) * 100)}%` : "0%" }}
              />
            </span>
            <span className={`mt-2 block text-left font-mono text-[9.5px] uppercase tracking-[0.14em] ${i === chapter ? "text-ivory" : "text-ivory/40 group-hover:text-ivory/70"}`}>
              {ch.code} {ch.title}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 px-6 pb-8 pt-4 sm:grid-cols-[1fr_auto] sm:items-end sm:px-10 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div key={chapter} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} data-testid="film-chapter-copy">
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">{c.head}</h3>
            <p className="mt-2 max-w-xl text-ivory/65">{c.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => go(chapter - 1)} disabled={chapter === 0} aria-label="Previous chapter" data-testid="film-prev" className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {done ? (
            <button type="button" onClick={() => { go(0); setPlaying(true); }} aria-label="Replay" data-testid="film-replay" className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest">
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} data-testid="film-toggle" className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
          <button type="button" onClick={() => go(chapter + 1)} disabled={chapter === CHAPTERS.length - 1} aria-label="Next chapter" data-testid="film-next" className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
          {chapter === CHAPTERS.length - 1 && (
            <button type="button" onClick={() => openModal("scan")} className="btn-primary ml-2 whitespace-nowrap px-4 py-2.5 text-[13px]" data-testid="film-scan-cta">
              <ScanLine className="h-4 w-4" /> Start Your Scan
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
