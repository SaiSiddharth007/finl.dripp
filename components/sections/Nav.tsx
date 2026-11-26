"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ScanLine, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { useApp } from "../AppContext";

export default function Nav() {
  const { openModal } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      data-testid="site-nav"
      className={`glass-nav fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "hairline" : "border-transparent"
      }`}
    >
      <nav className="container-edge flex h-[72px] items-center justify-between gap-4" aria-label="Primary">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="Dripmint home">
          <span className="font-display text-[19px] font-extrabold sm:text-[22px] tracking-[-0.02em] text-forest">DRIPMINT</span>
          <span className="hidden items-center gap-2 rounded-full border border-sage/40 bg-sage/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-sage-dark sm:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage" />
            </span>
            AI-TO-MSME PROTOCOL v3
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    isActive ? "text-forest" : "text-forest/60 hover:text-forest"
                  }`}
                >
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-forest/[0.06]" />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="nav-scan-cta"
            onClick={() => openModal("scan")}
            className="btn-primary whitespace-nowrap px-4 py-2.5 text-[13px] sm:px-5"
          >
            <ScanLine className="h-4 w-4" aria-hidden />
            <span className="sm:hidden">Scan</span>
            <span className="hidden sm:inline">Start Your Scan</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border hairline bg-white/60 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-testid="nav-menu-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t hairline bg-ivory lg:hidden"
          >
            <ul className="container-edge flex flex-col py-4">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b hairline py-4 font-display text-2xl font-bold"
                  >
                    {l.label}
                    <span className="font-mono text-[11px] text-forest/40">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
