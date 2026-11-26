"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, ScanLine } from "lucide-react";
import { useApp } from "../AppContext";
import { DotGrid, TechGrid } from "../motifs/Motifs";

// Deterministic pseudo-random point cloud (same on server & client → no hydration drift).
function pointCloud(n: number) {
  const pts: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < n; i++) {
    const y = 110 + rnd() * 380;
    const spread = 40 + (y - 110) * 0.32;
    const x = 180 + (rnd() - 0.5) * 2 * spread;
    pts.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, r: rnd() > 0.85 ? 1.6 : 0.9, o: 0.3 + rnd() * 0.6 });
  }
  return pts;
}
const CLOUD = pointCloud(140);

function CoutureSilhouette() {
  return (
    <svg viewBox="0 0 360 520" className="h-full w-full" role="img" aria-label="Draped couture silhouette rendered from volumetric scan data" data-testid="hero-silhouette">
      <defs>
        <linearGradient id="drape-main" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9DB08F" />
          <stop offset="0.5" stopColor="#7D946F" />
          <stop offset="1" stopColor="#3E4C36" />
        </linearGradient>
        <linearGradient id="drape-scarf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F1E6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C9CDB8" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#7D946F" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7D946F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="180" cy="240" rx="170" ry="230" fill="url(#halo)" />

      {/* scan rings */}
      {[140, 210, 290, 370, 450].map((y, i) => (
        <motion.ellipse
          key={y}
          cx="180"
          cy={y}
          rx={60 + i * 26}
          ry={10 + i * 2}
          fill="none"
          stroke="#7D946F"
          strokeOpacity="0.55"
          strokeDasharray="2 5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.35 }}
        />
      ))}

      {/* point cloud */}
      <g>
        {CLOUD.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#C7D3BC" fillOpacity={p.o * 0.55} />
        ))}
      </g>

      {/* head + neck */}
      <ellipse cx="180" cy="72" rx="25" ry="31" fill="#2A3326" stroke="#9DB08F" strokeOpacity="0.6" />
      <path d="M168 98 L166 122 L194 122 L192 98 Z" fill="#2A3326" />

      {/* main coat */}
      <motion.path
        d="M138 122 C 108 132 92 164 88 214 C 80 304 70 404 58 504 L 302 504 C 290 404 280 304 272 214 C 268 164 252 132 222 122 Q 180 142 138 122 Z"
        fill="url(#drape-main)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />
      {/* folds */}
      <g fill="none" stroke="#1C2219" strokeOpacity="0.28" strokeWidth="1.2" strokeLinecap="round">
        <path d="M120 170 C 116 260 110 380 96 500" />
        <path d="M150 150 C 150 260 140 390 132 500" />
        <path d="M232 160 C 238 270 244 380 252 500" />
        <path d="M256 190 C 262 300 270 400 280 500" />
      </g>
      <g fill="none" stroke="#F4F1E6" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round">
        <path d="M108 210 C 104 300 96 400 84 500" />
        <path d="M244 176 C 250 290 256 390 266 500" />
      </g>

      {/* asymmetric scarf drape */}
      <motion.path
        d="M146 124 C 196 182 236 250 214 352 C 204 400 220 452 244 504 L 206 504 C 186 446 176 400 186 350 C 200 270 176 196 132 150 Z"
        fill="url(#drape-scarf)"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
      <path d="M150 140 C 196 200 222 262 202 352 C 194 400 204 450 224 504" fill="none" stroke="#1C2219" strokeOpacity="0.18" />

      {/* scanning beam */}
      <motion.g initial={{ y: 0 }} animate={{ y: [0, 380, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="20" y="112" width="320" height="1.5" fill="#B9CBA9" />
        <rect x="20" y="100" width="320" height="14" fill="#7D946F" opacity="0.12" />
      </motion.g>

      {/* annotation markers */}
      <g fontFamily="var(--font-mono), monospace" fontSize="8.5" letterSpacing="1.4" fill="#C7D3BC">
        <line x1="88" y1="214" x2="14" y2="214" stroke="#7D946F" strokeOpacity="0.7" />
        <circle cx="88" cy="214" r="2.5" fill="#B9CBA9" />
        <text x="14" y="206">CHEST 98.4</text>
        <line x1="272" y1="300" x2="330" y2="300" stroke="#7D946F" strokeOpacity="0.7" />
        <circle cx="272" cy="300" r="2.5" fill="#B9CBA9" />
        <text x="330" y="292" textAnchor="end">DRAPE 0.82</text>
        <line x1="214" y1="400" x2="330" y2="420" stroke="#7D946F" strokeOpacity="0.7" />
        <circle cx="214" cy="400" r="2.5" fill="#B9CBA9" />
        <text x="330" y="434" textAnchor="end">LYOCELL 210 GSM</text>
      </g>
    </svg>
  );
}

const TICKER = ["0% Deadstock", "50x Less Water", "7-Day Local MSME Delivery", "5–7x Recyclable"];

export default function Hero() {
  const { openModal } = useApp();
  return (
    <section id="top" className="relative pt-[88px]" data-testid="section-hero">
      {/* Architectural showcase card */}
      <div className="container-edge">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[32px] bg-forest text-ivory sm:rounded-[40px]"
          data-testid="hero-showcase"
        >
          <TechGrid color="#F4F1E6" opacity={0.05} size={28} />
          {/* vertical light tubes */}
          {[12, 38, 64, 88].map((left, i) => (
            <div
              key={left}
              aria-hidden
              className="absolute top-0 h-full w-[2px] animate-tube"
              style={{
                left: `${left}%`,
                animationDelay: `${i * 0.9}s`,
                background: "linear-gradient(to bottom, transparent, rgba(157,176,143,0.9) 35%, rgba(125,148,111,0.6) 70%, transparent)",
                boxShadow: "0 0 24px 6px rgba(125,148,111,0.35)",
              }}
            />
          ))}

          <div className="relative grid items-center gap-6 px-6 pb-0 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-16 lg:py-16">
            <div className="max-w-xl">
              <span className="chip border-ivory/20 text-sage">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" /> Collection 01 · Natural Synthesis
              </span>
              <h1 className="mt-6 font-display text-[clamp(2.2rem,4.4vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
                Designed to Refresh. <span className="text-sage">Tailored on Demand.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70 sm:text-lg">
                Each piece is crafted and scaled to your accurate 3D volumetric cloud data. Pure local luxury.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  data-testid="hero-film-cta"
                  onClick={() => openModal("film")}
                  className="btn-ghost border-ivory/25 text-ivory hover:border-ivory/60 hover:bg-ivory/5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ivory text-forest">
                    <Play className="h-3 w-3 translate-x-[1px]" fill="currentColor" />
                  </span>
                  Watch Framework Film
                </button>
                <button type="button" data-testid="hero-scan-cta" onClick={() => openModal("scan")} className="btn-primary">
                  <ScanLine className="h-4 w-4" /> Start Your Scan
                </button>
              </div>
              <dl className="mt-10 hidden grid-cols-3 gap-6 border-t border-ivory/10 pt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/50 sm:grid">
                <div>
                  <dt>Point Cloud</dt>
                  <dd className="mt-1 text-sm text-ivory">412K pts</dd>
                </div>
                <div>
                  <dt>Fit Tolerance</dt>
                  <dd className="mt-1 text-sm text-ivory">±0.4 cm</dd>
                </div>
                <div>
                  <dt>Node</dt>
                  <dd className="mt-1 text-sm text-ivory">TPR-04</dd>
                </div>
              </dl>
            </div>
            <div className="relative mx-auto aspect-[360/520] w-full max-w-[380px] lg:max-w-[420px]">
              <CoutureSilhouette />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main editorial hero */}
      <div className="container-edge relative pb-10 pt-20 sm:pt-28">
        <DotGrid className="[mask-image:linear-gradient(to_bottom,black,transparent)]" opacity={0.18} />
        <div className="relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="eyebrow"
            >
              Dripmint AI · Precision Generative Design Framework
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl mt-6 text-[clamp(2.8rem,9vw,8.6rem)] text-forest"
              data-testid="editorial-headline"
            >
              Fashion That Fits You. <span className="italic text-sage">And the Planet.</span>
            </motion.h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-3">
            <p className="text-base leading-relaxed text-forest/70">
              An end-to-end precision generative design framework bridging AI-powered body scanning with local clean
              manufacturing. Zero overproduction. Infinite reuse.
            </p>
            <a href="#flow" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-forest">
              See the flow <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live micro-ticker */}
      <div className="relative overflow-hidden border-y hairline bg-white/50 py-4" data-testid="hero-ticker" aria-label="Key metrics">
        <div className="flex w-max animate-ticker gap-12 whitespace-nowrap">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-12 font-mono text-[13px] uppercase tracking-[0.18em] text-forest" aria-hidden={i >= TICKER.length}>
              {t}
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
