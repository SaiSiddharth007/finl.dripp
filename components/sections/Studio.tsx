"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Droplets, Factory, Leaf, Repeat2, Ruler, Scissors, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DYES,
  FITS,
  GARMENTS,
  computeStudioMetrics,
  formatNum,
  getDye,
  getGarment,
  type LengthId,
} from "@/lib/data";
import { useApp } from "../AppContext";
import GarmentPreview from "../GarmentPreview";
import { TechGrid } from "../motifs/Motifs";
import { Reveal, Segmented, SectionHeader } from "../ui";

function Metric({ label, value, testId, icon: Icon }: { label: string; value: string; testId: string; icon: typeof Droplets }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ivory/10 py-3 last:border-0">
      <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/55">
        <Icon className="h-3.5 w-3.5 text-sage" aria-hidden />
        {label}
      </span>
      {/* Stable wrapper carries the value for a11y/tests; the animated child is presentational. */}
      <span data-testid={testId} data-value={value} aria-live="polite" className="relative text-right font-mono text-sm text-ivory">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="inline-block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

export default function Studio() {
  const { config, setConfig, remixSource, measurements, saveDesign } = useApp();
  const [toast, setToast] = useState<string | null>(null);
  const metrics = useMemo(() => computeStudioMetrics(config), [config]);
  const garment = getGarment(config.garment);
  const dye = getDye(config.dye);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onSave = () => {
    saveDesign(config);
    setToast(`${garment.name} · ${dye.name} saved to your Social Wardrobe`);
  };

  const lengthOptions: { id: LengthId; label: string }[] = [
    { id: "full", label: garment.lengthLabels.full },
    { id: "cropped", label: garment.lengthLabels.cropped },
  ];

  return (
    <section id="studio" className="relative py-24 sm:py-32" data-testid="section-studio">
      <div className="container-edge">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            index="03"
            eyebrow="Live Customization Studio"
            title={
              <>
                Sage Shell V3. <span className="text-sage">Your rules.</span>
              </>
            }
            sub="Pick a silhouette, steep it in a mineral botanic dye, and watch the digital cutting file and impact ledger rewrite themselves in real time."
          />
          <AnimatePresence>
            {(remixSource || measurements) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 lg:items-end">
                {remixSource && (
                  <span data-testid="studio-remix-source" className="chip border-sage/40 bg-sage/10 text-sage-dark">
                    <Repeat2 className="h-3 w-3" /> Remixing: {remixSource}
                  </span>
                )}
                {measurements && (
                  <span data-testid="studio-measurements" className="chip border-forest/20 bg-white text-forest">
                    <Ruler className="h-3 w-3" /> Scan {measurements.scanId} · Chest {measurements.chestCm} cm · Waist {measurements.waistCm} cm
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {/* Preview */}
          <Reveal className="lg:col-span-7">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] border hairline bg-ivory">
              <TechGrid opacity={0.07} size={22} />
              <div className="relative flex items-center justify-between px-6 pt-6 sm:px-8">
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-forest/50">{garment.type}</p>
                  <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]" data-testid="studio-garment-name">
                    {garment.name}
                  </p>
                </div>
                <span className="chip hairline bg-white text-forest/70">
                  <span className="h-2.5 w-2.5 rounded-full border border-forest/20" style={{ background: dye.hex }} />
                  <span data-testid="studio-dye-name">{dye.name}</span>
                </span>
              </div>
              <div className="relative flex flex-1 items-center justify-center px-4 py-2">
                <div className="aspect-[400/480] w-full max-w-[540px]">
                  <GarmentPreview config={config} className="h-full w-full" />
                </div>
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-3 border-t hairline bg-white/70 px-6 py-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-forest/60 sm:px-8">
                <span>
                  Cutting File · <span className="text-forest" data-testid="metric-cutfile">{metrics.cuttingFileId}</span>
                </span>
                <span>{metrics.panelCount} pattern panels · {metrics.fabricKg.toFixed(2)} kg Lyocell</span>
              </div>
            </div>
          </Reveal>

          {/* Controls */}
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="flex h-full flex-col gap-5">
              <div className="card p-6 sm:p-7">
                <fieldset>
                  <legend className="eyebrow">Garment</legend>
                  <div className="mt-4 grid gap-2">
                    {GARMENTS.map((g) => {
                      const on = g.id === config.garment;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          aria-pressed={on}
                          data-testid={`studio-garment-${g.id}`}
                          onClick={() => setConfig({ ...config, garment: g.id })}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                            on ? "border-forest bg-forest text-ivory" : "hairline hover:border-forest/40"
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-semibold">{g.name}</span>
                            <span className={`block font-mono text-[10px] uppercase tracking-[0.16em] ${on ? "text-ivory/60" : "text-forest/50"}`}>{g.type}</span>
                          </span>
                          {on && <Check className="h-4 w-4 text-sage" />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="eyebrow">Mineral Botanic Dye</legend>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {DYES.map((d) => {
                      const on = d.id === config.dye;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${d.name} ${d.hex}`}
                          data-testid={`studio-dye-${d.id}`}
                          onClick={() => setConfig({ ...config, dye: d.id })}
                          className="group flex flex-col items-center gap-2"
                        >
                          <span
                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-105 ${
                              on ? "ring-2 ring-forest ring-offset-2 ring-offset-white" : ""
                            }`}
                            style={{ background: d.hex, borderColor: "rgba(28,34,25,0.18)" }}
                          >
                            {on && <Check className={`h-4 w-4 ${d.id === "raw-ivory" ? "text-forest" : "text-ivory"}`} />}
                          </span>
                          <span className="text-center text-[11px] font-medium leading-tight">{d.name}</span>
                          <span className="font-mono text-[9px] text-forest/45">{d.hex}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-forest/50">{dye.mineral}</p>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="eyebrow">Fit &amp; Silhouette</legend>
                  <div className="mt-4">
                    <Segmented
                      name="fit"
                      testIdPrefix="studio-fit"
                      options={FITS.map((f) => ({ id: f.id, label: f.name }))}
                      value={config.fit}
                      onChange={(fit) => setConfig({ ...config, fit })}
                    />
                  </div>
                  <div className="mt-3">
                    <Segmented
                      name="length"
                      testIdPrefix="studio-length"
                      options={lengthOptions}
                      value={config.length}
                      onChange={(length) => setConfig({ ...config, length })}
                    />
                  </div>
                </fieldset>
              </div>

              <div className="relative overflow-hidden rounded-[28px] bg-forest p-6 text-ivory sm:p-7" data-testid="studio-readout">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-sage">Live Digital Cutting File &amp; Impact</p>
                <div className="mt-3">
                  <Metric icon={Droplets} label="Water Saved" value={`${formatNum(metrics.waterSavedL)}L`} testId="metric-water" />
                  <Metric icon={Leaf} label="CO2 Reduced" value={`${metrics.co2ReductionPct}% · ${metrics.co2SavedKg.toFixed(1)} kg`} testId="metric-co2" />
                  <Metric icon={Sparkles} label="Dye Liquor" value={`${metrics.dyeLiquorL.toFixed(2)} L closed-loop`} testId="metric-dye-liquor" />
                  <Metric icon={Factory} label="MSME Node" value={metrics.msmeNode} testId="metric-node" />
                  <Metric icon={Scissors} label="Panels" value={`${metrics.panelCount} · ${metrics.fabricKg.toFixed(2)} kg`} testId="metric-panels" />
                </div>
                <button type="button" onClick={onSave} data-testid="studio-save" className="btn-primary mt-5 w-full">
                  <Repeat2 className="h-4 w-4" /> Save &amp; Remix to Social Wardrobe
                </button>
                <AnimatePresence>
                  {toast && (
                    <motion.p
                      role="status"
                      data-testid="studio-toast"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 flex items-center gap-2 text-sm text-sage"
                    >
                      <Check className="h-4 w-4" /> {toast}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
