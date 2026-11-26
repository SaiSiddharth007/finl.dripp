"use client";

import { MotionConfig } from "framer-motion";
import { AppProvider } from "@/components/AppContext";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Crisis from "@/components/sections/Crisis";
import Flow from "@/components/sections/Flow";
import Studio from "@/components/sections/Studio";
import Lyocell from "@/components/sections/Lyocell";
import Impact from "@/components/sections/Impact";
import Circular from "@/components/sections/Circular";
import Wardrobe from "@/components/sections/Wardrobe";
import Lore from "@/components/sections/Lore";
import Footer from "@/components/sections/Footer";
import ScanModal from "@/components/modals/ScanModal";
import FilmModal from "@/components/modals/FilmModal";

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <Nav />
        <main>
          <Hero />
          <Crisis />
          <Flow />
          <Studio />
          <Lyocell />
          <Impact />
          <Circular />
          <Wardrobe />
          <Lore />
        </main>
        <Footer />
        <ScanModal />
        <FilmModal />
      </AppProvider>
    </MotionConfig>
  );
}
