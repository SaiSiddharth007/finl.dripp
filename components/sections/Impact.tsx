"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Factory, Hash, Link2, Loader2, MapPin, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Counter, Reveal, SectionHeader } from "../ui";
import { DotGrid, LinearShift } from "../motifs/Motifs";

const TAGS = [
  {
    id: "DM-TAG-0x7d94",
    garment: "Sage Shell V3 · Russian Green",
    node: "Tirupur Cluster #04 · Avinashi Rd",
    fibre: "Lyocell 210 GSM · Cycle 1",
    water: "19,990 L",
    co2: "13.5 kg",
    hash: "0x7d94a1f0c3e2b88b72e5f4f1e61c2219a3b0",
    block: 18_204_311,
  },
  {
    id: "DM-TAG-0xb88b",
    garment: "Liquid Drape Tunic · Mineral Clay",
    node: "Tirupur Cluster #02 · Palladam",
    fibre: "Lyocell 160 GSM · Cycle 3",
    water: "14,393 L",
    co2: "9.7 kg",
    hash: "0xb88b72c4d901e3f2a7d946f5e735202c3627",
    block: 18_201_967,
  },
  {
    id: "DM-TAG-0x2c36",
    garment: "Architectural Cargo · Deep Moss",
    node: "Tirupur Cluster #07 · Tiruppur North",
    fibre: "Lyocell 260 GSM · Cycle 2",
    water: "23,588 L",
    co2: "15.9 kg",
    hash: "0x2c3627f4f1e6a91d7d946fb88b7215e0aa41",
    block: 18_199_402,
  },
];

function TagInspector() {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<"idle" | "verifying" | "verified">("idle");
  const tag = TAGS[idx];

  useEffect(() => setState("idle"), [idx]);
  useEffect(() => {
    if (state !== "verifying") return;
    const t = window.setTimeout(() => setState("verified"), 1100);
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <div className="card relative overflow-hidden p-6 sm:p-8" data-testid="tag-inspector">
      <DotGrid opacity={0.12} />
      <div className="relative">
        <p className="eyebrow">Digital Sustainability Tag Inspector</p>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Sustainability tags">
          {TAGS.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={i === idx}
              data-testid={`tag-tab-${i}`}
              onClick={() => setIdx(i)}
              className={`chip transition-colors ${i === idx ? "border-forest bg-forest text-ivory" : "hairline bg-white text-forest/70 hover:text-forest"}`}
            >
              {t.id}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tag.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {/* Physical tag rendering */}
            <div className="mt-6 grid gap-5 sm:grid-cols-[140px_1fr]">
              <svg viewBox="0 0 140 200" className="mx-auto h-44 w-auto sm:h-full" aria-label="Woven sustainability tag">
                <rect x="10" y="10" width="120" height="180" rx="10" fill="#1C2219" />
                <circle cx="70" cy="30" r="6" fill="#F4F1E6" />
                <text x="70" y="64" textAnchor="middle" fontFamily="var(--font-syne), sans-serif" fontWeight="800" fontSize="15" fill="#F4F1E6">
                  DRIPMINT
                </text>
                {/* deterministic QR-like matrix derived from hash */}
                {Array.from({ length: 64 }).map((_, k) => {
                  const on = parseInt(tag.hash[2 + (k % 36)], 16) % 2 === (k % 3 === 0 ? 0 : 1);
                  return on ? <rect key={k} x={34 + (k % 8) * 9} y={80 + Math.floor(k / 8) * 9} width="8" height="8" fill="#7D946F" /> : null;
                })}
                <text x="70" y="178" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="8" fill="#F4F1E6" opacity="0.7">
                  {tag.id}
                </text>
              </svg>
              <dl className="grid grid-cols-1 gap-y-3 text-sm">
                {[
                  { k: "Garment", v: tag.garment, icon: BadgeCheck },
                  { k: "MSME Node", v: tag.node, icon: MapPin },
                  { k: "Fibre", v: tag.fibre, icon: Factory },
                  { k: "Water Conserved", v: tag.water, icon: ShieldCheck },
                  { k: "CO2 Avoided", v: tag.co2, icon: ShieldCheck },
                  { k: "Ledger Hash", v: `${tag.hash.slice(0, 14)}…${tag.hash.slice(-6)}`, icon: Hash },
                ].map((row) => (
                  <div key={row.k} className="flex items-start justify-between gap-4 border-b hairline pb-2">
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-forest/50">
                      <row.icon className="h-3.5 w-3.5 text-sage" aria-hidden />
                      {row.k}
                    </dt>
                    <dd className="break-all text-right font-medium">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            data-testid="tag-verify"
            onClick={() => setState("verifying")}
            disabled={state === "verifying"}
            className="btn-ghost hairline bg-white text-forest hover:border-forest disabled:opacity-60"
          >
            {state === "verifying" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {state === "verifying" ? "Checking ledger…" : "Verify Ledger Entry"}
          </button>
          <AnimatePresence>
            {state === "verified" && (
              <motion.p
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                data-testid="tag-verified"
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-dark"
              >
                <BadgeCheck className="h-4 w-4" /> Anchored · block #{tag.block.toLocaleString("en-US")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Impact() {
  return (
    <section id="msme" className="relative py-24 sm:py-32" data-testid="section-impact">
      <div className="container-edge">
        {/* MSME banner */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-sage px-6 py-12 text-ivory sm:px-12 sm:py-16" data-testid="msme-banner">
            <LinearShift opacity={0.2} />
            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/80">05 — Local MSME Pipeline</p>
                <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.8rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
                  Supporting regional MSMEs with digital cutting files.
                </h2>
                <p className="mt-5 max-w-xl text-lg text-ivory/85">Local micro-factories, global standards.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-ivory/25 bg-forest/10 p-5 backdrop-blur-sm">
                  <p className="font-display text-5xl font-extrabold">7 Days</p>
                  <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/75">Average local turnaround</p>
                </div>
                <div className="rounded-3xl border border-ivory/25 bg-forest/10 p-5 backdrop-blur-sm">
                  <p className="font-display text-5xl font-extrabold">100%</p>
                  <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/75">On-demand, zero-inventory</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-24">
          <SectionHeader
            index="06"
            eyebrow="Certified On-Chain Impact"
            title={
              <>
                Tangible Numbers. <span className="text-sage">Certified On-Chain.</span>
              </>
            }
            sub="Every garment carries a woven Digital Sustainability Tag linked to an immutable ledger entry — origin node, fibre cycle and impact, verifiable by anyone."
          />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-12 xl:col-span-5 xl:grid-cols-1">
            {[
              { to: 14.2, dec: 1, suffix: "M+", label: "Liters of water conserved", id: "counter-water" },
              { to: 98.4, dec: 1, suffix: "%", label: "First-fit precision score", id: "counter-fit" },
              { to: 10240, dec: 0, suffix: "+", label: "Excess garments prevented from overproduction", id: "counter-garments" },
            ].map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <div className="card flex h-full flex-col justify-between gap-6 p-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-forest/45">LEDGER // 0{i + 1}</p>
                  <div>
                    <p className="font-display text-[clamp(2.4rem,4vw,3.6rem)] font-extrabold leading-none tracking-[-0.03em]">
                      <Counter to={c.to} decimals={c.dec} suffix={c.suffix} testId={c.id} />
                      {c.id === "counter-water" && <span className="ml-2 align-middle text-xl text-forest/50">Liters</span>}
                    </p>
                    <p className="mt-2 text-sm text-forest/60">{c.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="lg:col-span-12 xl:col-span-7" delay={0.1}>
            <TagInspector />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
