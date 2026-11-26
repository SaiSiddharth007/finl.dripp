"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONFIG, type CommunityDesign, type StudioConfig, type Undertone } from "@/lib/data";

export interface BodyMeasurements {
  heightCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  shoulderCm: number;
  sleeveCm: number;
  inseamCm: number;
  undertone: Undertone;
  scanId: string;
}

export type ModalId = "scan" | "film" | null;

interface AppState {
  config: StudioConfig;
  setConfig: (c: StudioConfig) => void;
  remixSource: string | null;
  remix: (design: CommunityDesign) => void;
  measurements: BodyMeasurements | null;
  applyMeasurements: (m: BodyMeasurements, recommended: Partial<StudioConfig>) => void;
  saved: CommunityDesign[];
  saveDesign: (c: StudioConfig) => CommunityDesign;
  modal: ModalId;
  openModal: (m: Exclude<ModalId, null>) => void;
  closeModal: () => void;
}

const Ctx = createContext<AppState | null>(null);
const STORAGE_KEY = "dripmint.wardrobe.v1";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StudioConfig>(DEFAULT_CONFIG);
  const [remixSource, setRemixSource] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurements | null>(null);
  const [saved, setSaved] = useState<CommunityDesign[]>([]);
  const [modal, setModal] = useState<ModalId>(null);

  // Hydrate the personal wardrobe after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setSaved(parsed as CommunityDesign[]);
      }
    } catch {
      /* corrupted storage — ignore */
    }
  }, []);

  const persist = (list: CommunityDesign[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* storage unavailable (private mode) */
    }
  };

  const remix = useCallback((design: CommunityDesign) => {
    setConfig(design.config);
    setRemixSource(`${design.title} by ${design.handle}`);
    requestAnimationFrame(() => scrollToId("studio"));
  }, []);

  const applyMeasurements = useCallback((m: BodyMeasurements, recommended: Partial<StudioConfig>) => {
    setMeasurements(m);
    setConfig((c) => ({ ...c, ...recommended }));
    setRemixSource(null);
    setModal(null);
    window.setTimeout(() => scrollToId("studio"), 120);
  }, []);

  const saveDesign = useCallback((c: StudioConfig) => {
    const design: CommunityDesign = {
      id: `you-${Date.now().toString(36)}`,
      title: "My Remix",
      handle: "@you",
      remixes: 0,
      badge: "Saved Just Now",
      config: c,
    };
    setSaved((prev) => {
      const next = [design, ...prev].slice(0, 8);
      persist(next);
      return next;
    });
    return design;
  }, []);

  const openModal = useCallback((m: Exclude<ModalId, null>) => setModal(m), []);
  const closeModal = useCallback(() => setModal(null), []);

  const value = useMemo<AppState>(
    () => ({
      config,
      setConfig: (c) => {
        setConfig(c);
      },
      remixSource,
      remix,
      measurements,
      applyMeasurements,
      saved,
      saveDesign,
      modal,
      openModal,
      closeModal,
    }),
    [config, remixSource, remix, measurements, applyMeasurements, saved, saveDesign, modal, openModal, closeModal],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}
