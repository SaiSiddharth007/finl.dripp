"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal, Segmented, SectionHeader } from "../ui";
import { LiquidFlora } from "../motifs/Motifs";

type Metric = "water" | "carbon" | "micro" | "bio";

const ROWS: {
  id: Metric;
  label: string;
  lyocell: string;
  cotton: string;
  verdict: string;
  lyVal: number;
  coVal: number | null;
  unit: string;
  scale: "log" | "linear";
}[] = [
  { id: "water", label: "Water Footprint", lyocell: "10 L/kg", cotton: "20,000 L/kg", verdict: "50x less water", lyVal: 10, coVal: 20000, unit: "L/kg", scale: "log" },
  { id: "carbon", label: "Carbon Emissions", lyocell: "1.5 kg CO2", cotton: "15 kg CO2", verdict: "99% lifecycle reduction", lyVal: 1.5, coVal: 15, unit: "kg CO2/kg", scale: "linear" },
  { id: "micro", label: "Microplastics", lyocell: "0%", cotton: "Blend-dependent", verdict: "0% synthetic shedding", lyVal: 0, coVal: null, unit: "% synthetic fibre shed", scale: "linear" },
  { id: "bio", label: "Biodegradability", lyocell: "100%", cotton: "Slowed by finishes", verdict: "Soil-biodegradable within months", lyVal: 100, coVal: null, unit: "% soil-biodegradable", scale: "linear" },
];

const FEEL = [
  { k: "Silk-like fluid drape", v: 92 },
  { k: "Cotton-soft breathability", v: 88 },
  { k: "Zero chemical toxicity", v: 100 },
];

export default function Lyocell() {
  const [metric, setMetric] = useState<Metric>("water");
  const row = ROWS.find((r) => r.id === metric)!;
  const max = Math.max(row.lyVal, row.coVal ?? 0) || 1;
  const pct = (v: number) =>
    row.scale === "log" ? (v <= 0 ? 0 : (Math.log10(v + 1) / Math.log10(max + 1)) * 100) : (v / max) * 100;

  return (
    <section id="lyocell" className="relative overflow-hidden border-t hairline bg-white py-24 sm:py-32" data-testid="section-lyocell">
      <div className="container-edge">
        <SectionHeader
          index="04"
          eyebrow="Material Intelligence"
          title={
            <>
              Botanic Lyocell <span className="text-forest/35">vs.</span> Standard Cotton.
            </>
          }
          sub="Closed-loop solvent-spun cellulose from FSC eucalyptus. 99.5% of the solvent is recovered and reused — the fibre is soft as cotton and drapes like silk."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="overflow-x-auto rounded-[28px] border hairline">
              <table className="w-full text-left text-sm" data-testid="lyocell-table">
                <thead>
                  <tr className="bg-forest text-ivory">
                    <th className="px-4 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] sm:px-6">Spec</th>
                    <th className="px-4 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-sage sm:px-6">Lyocell Botanic Yarn</th>
                    <th className="px-4 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ivory/60 sm:px-6">Organic / Conventional Cotton Spec</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setMetric(r.id)}
                      className={`cursor-pointer border-t hairline transition-colors ${metric === r.id ? "bg-sage/10" : "hover:bg-ivory/60"}`}
                    >
                      <td className="px-4 py-4 font-semibold sm:px-6">{r.label}</td>
                      <td className="px-4 py-4 font-mono text-sage-dark sm:px-6">{r.lyocell}</td>
                      <td className="px-4 py-4 font-mono text-forest/60 sm:px-6">{r.cotton}</td>
                    </tr>
                  ))}
                  <tr className="border-t hairline">
                    <td className="px-4 py-4 font-semibold sm:px-6">Hand-Feel Spectrum</td>
                    <td className="px-4 py-4 text-sage-dark sm:px-6" colSpan={2}>
                      Silk-like fluid drape, cotton-soft breathability, zero chemical toxicity.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-[28px] bg-forest p-6 text-ivory sm:p-8" data-testid="lyocell-chart">
              <LiquidFlora opacity={0.18} />
              <div className="relative">
                <div>
                  <Segmented
                    name="lyocell-metric"
                    tone="dark"
                    testIdPrefix="lyocell-toggle"
                    options={ROWS.map((r) => ({ id: r.id, label: r.label.split(" ")[0] }))}
                    value={metric}
                    onChange={setMetric}
                  />
                </div>
                <p className="mt-8 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.02em] text-sage" data-testid="lyocell-verdict">
                  {row.verdict}
                </p>
                <div className="mt-8 space-y-6">
                  {[
                    { name: "LYOCELL BOTANIC YARN", v: row.lyVal, label: row.lyocell, color: "#7D946F" },
                    { name: "CONVENTIONAL COTTON", v: row.coVal, label: row.cotton, color: "#F4F1E6" },
                  ].map((b) => (
                    <div key={b.name}>
                      <div className="flex justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/60">
                        <span>{b.name}</span>
                        <span className="text-ivory">{b.label}</span>
                      </div>
                      {b.v === null ? (
                        <p className="mt-2 text-sm text-ivory/50">Not a like-for-like figure — depends on blend and chemical finishing.</p>
                      ) : (
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-ivory/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: b.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(pct(b.v), b.v > 0 ? 2 : 0)}%` }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/40">
                  Unit: {row.unit}
                  {row.scale === "log" ? " · log scale" : ""}
                </p>
                <div className="mt-8 border-t border-ivory/10 pt-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-sage">Hand-Feel Spectrum</p>
                  <ul className="mt-4 space-y-3">
                    {FEEL.map((f) => (
                      <li key={f.k} className="flex items-center gap-3 text-sm">
                        <span className="w-40 shrink-0 text-ivory/80 sm:w-48">{f.k}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ivory/10">
                          <motion.span
                            className="block h-full rounded-full bg-sage"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${f.v}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
