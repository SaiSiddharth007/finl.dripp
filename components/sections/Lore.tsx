"use client";

import { Cpu, Factory, Recycle } from "lucide-react";
import { LinearShift, LiquidFlora, MOTIF_LEGEND, DotGrid, TechGrid } from "../motifs/Motifs";
import { Reveal } from "../ui";

const PILLARS = [
  { icon: Cpu, title: "AI body-scanning precision", body: "Algorithms that measure the person, not a size chart." },
  { icon: Factory, title: "Local Tirupur MSME artisans", body: "Knitters who have mastered cloth for three generations." },
  { icon: Recycle, title: "5–7x recyclable Lyocell", body: "A fibre that comes back, again and again." },
];

export default function Lore() {
  return (
    <section id="lore" className="relative overflow-hidden py-24 sm:py-32" data-testid="section-lore">
      <div className="container-edge">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-[32px] bg-sage p-8 text-ivory sm:p-10">
              <LinearShift opacity={0.22} />
              <LiquidFlora color="#F4F1E6" opacity={0.35} />
              <div className="relative flex h-full flex-col justify-between gap-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/80">09 — The Lore</p>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/75">Est. IIT Tirupati</p>
                  <p className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
                    3 engineers.
                    <br />1 dorm room.
                    <br />0 deadstock.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <article className="card relative h-full overflow-hidden p-8 sm:p-12">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage-dark" data-testid="lore-header">
                THE LORE: SOURCE CODE &amp; SUSTAINABILITY
              </h2>
              <p className="mt-6 font-display text-[clamp(1.7rem,3.4vw,2.8rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
                Three Engineers. One Dorm Room at IIT Tirupati. A Mission to Hack the Fashion Supply Chain.
              </p>
              <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-forest/75">
                <p>
                  By day, we studied elegant algorithms — gradient descent, mesh reconstruction, the quiet mathematical
                  precision that lets a machine understand a shape. By night, we came back to a dorm room full of clothes
                  that didn&apos;t fit any of us: fast-fashion shirts bought in three sizes, two returned, one forgotten
                  in a pile by the door.
                </p>
                <p>
                  That disconnect stuck with us. How could the same world that computes satellite orbits to the
                  centimetre still make clothes by guessing S, M or L — and then burn what doesn&apos;t sell? An hour
                  down the road, Tirupur&apos;s knitters were producing for brands that over-order by design.
                </p>
                <p>
                  So we built Dripmint: AI body-scanning precision, local Tirupur MSME artisans, and 5–7x recyclable
                  Lyocell, compiled into one framework. Not another brand — <span className="font-semibold text-forest">the new source code for sustainable human expression.</span>
                </p>
              </div>
              <ul className="mt-10 grid gap-4 border-t hairline pt-8 sm:grid-cols-3">
                {PILLARS.map((p) => (
                  <li key={p.title}>
                    <p.icon className="h-5 w-5 text-sage" aria-hidden />
                    <p className="mt-3 text-sm font-semibold">{p.title}</p>
                    <p className="mt-1 text-sm text-forest/60">{p.body}</p>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        {/* Surface motif legend — the Natural Synthesis pattern library */}
        <Reveal className="mt-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" data-testid="motif-legend">
            {MOTIF_LEGEND.map((m, i) => (
              <div key={m.code} className={`relative h-36 overflow-hidden rounded-[24px] border hairline ${i === 1 ? "bg-sage" : i === 3 ? "bg-forest" : "bg-white"}`}>
                {i === 0 && <DotGrid opacity={0.35} size={14} />}
                {i === 1 && <LinearShift opacity={0.4} size={10} />}
                {i === 2 && <TechGrid opacity={0.12} size={16} />}
                {i === 3 && <LiquidFlora opacity={0.7} />}
                <p className={`absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.18em] ${i === 1 || i === 3 ? "text-ivory" : "text-forest"}`}>
                  {m.code}: {m.name}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-forest/45">
            A study in natural synthesis. High-concept design elements balancing structure and liquid form.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
