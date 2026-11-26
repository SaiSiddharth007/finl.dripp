"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Repeat2, Sprout } from "lucide-react";
import { useState } from "react";
import { COMMUNITY, getDye, getFit, getGarment, type CommunityDesign } from "@/lib/data";
import { useApp } from "../AppContext";
import GarmentPreview from "../GarmentPreview";
import { DotGrid } from "../motifs/Motifs";
import { Reveal, SectionHeader } from "../ui";

function DesignCard({ d, mine = false }: { d: CommunityDesign; mine?: boolean }) {
  const { remix } = useApp();
  const [liked, setLiked] = useState(false);
  const g = getGarment(d.config.garment);
  const dye = getDye(d.config.dye);
  const fit = getFit(d.config.fit);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group card flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden sm:w-auto sm:max-w-none"
      data-testid={mine ? "wardrobe-card-mine" : "wardrobe-card"}
      data-design-id={d.id}
    >
      <div className="relative aspect-[4/4.4] overflow-hidden bg-ivory">
        <DotGrid opacity={0.14} size={14} />
        <div className="absolute inset-0 p-4 transition-transform duration-700 group-hover:scale-[1.04]">
          <GarmentPreview config={d.config} showSpecs={false} compact className="h-full w-full" />
        </div>
        <span className="chip absolute left-3 top-3 border-sage/40 bg-white/90 text-sage-dark">
          <Sprout className="h-3 w-3" /> {d.badge}
        </span>
        <button
          type="button"
          aria-label={liked ? "Unlike" : "Like"}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border hairline bg-white/90"
        >
          <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-clay text-clay" : "text-forest/60"}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold tracking-[-0.01em]">{d.title}</h3>
            <p className="font-mono text-[11px] text-sage-dark">{d.handle}</p>
          </div>
          <span className="flex items-center gap-1 font-mono text-[11px] text-forest/55">
            <Repeat2 className="h-3.5 w-3.5" />
            {(d.remixes + (liked ? 1 : 0)).toLocaleString("en-US")}
          </span>
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-forest/50">
          {g.name} · {dye.name} · {fit.name}
        </p>
        <button
          type="button"
          onClick={() => remix(d)}
          data-testid={`remix-${d.id}`}
          className="btn-ghost mt-5 hairline w-full bg-ivory/60 text-forest hover:border-forest hover:bg-forest hover:text-ivory"
        >
          <Repeat2 className="h-4 w-4" /> Remix This Fit
        </button>
      </div>
    </motion.article>
  );
}

export default function Wardrobe() {
  const { saved } = useApp();
  return (
    <section id="wardrobe" className="relative border-t hairline py-24 sm:py-32" data-testid="section-wardrobe">
      <div className="container-edge">
        <SectionHeader
          index="08"
          eyebrow="Social Wardrobe"
          title={
            <>
              Community Creator <span className="text-sage">Marketplace.</span>
            </>
          }
          sub="Every configuration is an open-source garment. Remix a creator's fit, make it yours, and they earn a share of every materialization."
        />

        {saved.length > 0 && (
          <div className="mt-12">
            <p className="eyebrow">Your saved remixes</p>
            <div className="no-scrollbar -mx-5 mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              <AnimatePresence initial={false}>
                {saved.slice(0, 4).map((d) => (
                  <DesignCard key={d.id} d={d} mine />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <Reveal className="mt-12">
          <div className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4" data-testid="wardrobe-feed">
            {COMMUNITY.map((d) => (
              <DesignCard key={d.id} d={d} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
