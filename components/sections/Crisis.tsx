"use client";

import { Droplets, PackageX, Undo2 } from "lucide-react";
import { Reveal, SectionHeader } from "../ui";
import { TechGrid } from "../motifs/Motifs";

const STATS = [
  {
    value: "92 Million Tons",
    label: "Annual global textile waste dumped in landfills",
    code: "WASTE_INDEX // 01",
    icon: PackageX,
    span: "lg:col-span-7 lg:row-span-2",
    dark: true,
  },
  {
    value: "20,000 L",
    label: "Water consumed to produce 1 kg of conventional cotton",
    code: "H2O_LOAD // 02",
    icon: Droplets,
    span: "lg:col-span-5",
    dark: false,
  },
  {
    value: "35%–40%",
    label: "Online apparel returned due to broken standardized sizing (“bracketing”)",
    code: "RETURN_RATE // 03",
    icon: Undo2,
    span: "lg:col-span-5",
    dark: false,
  },
];

export default function Crisis() {
  return (
    <section id="crisis" className="relative py-24 sm:py-32" data-testid="section-crisis">
      <div className="container-edge">
        <SectionHeader
          index="01"
          eyebrow="The Crisis"
          title={
            <>
              We don&apos;t have a sizing problem. <span className="text-sage">We have a waste disaster.</span>
            </>
          }
          sub="Fast fashion guesses your size, produces at scale and hopes. What doesn't sell — or doesn't fit — ends up in landfill."
        />

        <div className="relative mt-14 grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
          {STATS.map((s, i) => (
            <Reveal key={s.code} delay={i * 0.1} className={s.span}>
              <article
                className={`relative h-full overflow-hidden rounded-[28px] border p-7 sm:p-10 ${
                  s.dark ? "border-forest bg-forest text-ivory" : "hairline bg-white text-forest"
                }`}
                data-testid="crisis-stat"
              >
                <TechGrid color={s.dark ? "#F4F1E6" : "#1C2219"} opacity={s.dark ? 0.06 : 0.06} />
                <div className="relative flex h-full flex-col justify-between gap-10">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${s.dark ? "text-sage" : "text-sage-dark"}`}>{s.code}</span>
                    <s.icon className={`h-5 w-5 ${s.dark ? "text-sage" : "text-forest/40"}`} aria-hidden />
                  </div>
                  <div>
                    <p
                      className={`font-display font-extrabold leading-[0.9] tracking-[-0.03em] ${
                        s.dark ? "text-[clamp(3rem,8vw,7rem)]" : "text-[clamp(2.6rem,5vw,4.2rem)]"
                      }`}
                    >
                      {s.value}
                    </p>
                    <p className={`mt-4 max-w-md text-base leading-relaxed ${s.dark ? "text-ivory/70" : "text-forest/70"}`}>{s.label}</p>
                  </div>
                  {s.dark && (
                    <svg viewBox="0 0 600 60" className="h-12 w-full" aria-hidden>
                      {Array.from({ length: 60 }).map((_, k) => (
                        <rect
                          key={k}
                          x={k * 10}
                          y={60 - (12 + ((k * 37) % 48))}
                          width="5"
                          height={12 + ((k * 37) % 48)}
                          fill="#7D946F"
                          opacity={0.25 + (k / 60) * 0.75}
                        />
                      ))}
                    </svg>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4">
          <div
            className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-sage px-7 py-8 text-ivory sm:flex-row sm:items-center sm:px-10"
            data-testid="crisis-banner"
          >
            <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold leading-tight tracking-[-0.02em]">
              On-Demand. Perfect Sizing. Pure Botanic Fiber.
            </p>
            <a href="#flow" className="btn-ghost shrink-0 border-ivory/40 text-ivory hover:bg-ivory hover:text-forest">
              How we fix it
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
