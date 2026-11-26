"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  sub,
  dark = false,
  className = "",
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`max-w-4xl ${className}`}>
      <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${dark ? "text-sage" : "text-sage-dark"}`}>
        <span>{index}</span>
        <span className={`h-px w-10 ${dark ? "bg-ivory/30" : "bg-forest/20"}`} />
        <span>{eyebrow}</span>
      </div>
      <h2
        className={`mt-5 font-display text-[clamp(2.1rem,5.2vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] ${
          dark ? "text-ivory" : "text-forest"
        }`}
      >
        {title}
      </h2>
      {sub && <p className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? "text-ivory/70" : "text-forest/70"}`}>{sub}</p>}
    </Reveal>
  );
}

/** Animated counter that counts up when scrolled into view. */
export function Counter({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 2,
  testId,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  testId?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  const text = val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} data-testid={testId} data-target={to} className="tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  name,
  testIdPrefix,
  tone = "light",
}: {
  tone?: "light" | "dark";
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  name: string;
  testIdPrefix?: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            data-testid={testIdPrefix ? `${testIdPrefix}-${o.id}` : undefined}
            onClick={() => onChange(o.id)}
            className={`relative rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
              tone === "dark"
                ? active
                  ? "border-sage text-forest"
                  : "border-ivory/15 text-ivory/70 hover:border-ivory/40 hover:text-ivory"
                : active
                  ? "border-forest text-ivory"
                  : "hairline bg-white text-forest/75 hover:border-forest/40 hover:text-forest"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${name}`}
                className={`absolute inset-0 rounded-full ${tone === "dark" ? "bg-sage" : "bg-forest"}`}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
