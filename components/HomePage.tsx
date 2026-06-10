"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MouseGlow } from "@/components/providers/MouseGlow";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { FiverrAchievements } from "@/components/sections/FiverrAchievements";
import { Hero } from "@/components/sections/Hero";
import { InteractiveTerminal } from "@/components/sections/InteractiveTerminal";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { SkillsGalaxy } from "@/components/sections/SkillsGalaxy";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <SmoothScroll>
      <MouseGlow />

      {/* Preloader */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? "none" : "auto" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05080F]"
      >
        <div className="font-display text-6xl font-black text-white md:text-8xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-400"
          >
            {loaded ? "100" : "..."}
          </motion.span>
          <span className="text-cyan-400">%</span>
        </div>
        <p className="mt-4 font-mono text-xs tracking-[0.4em] text-cyan-400/50 uppercase">
          Initializing · Hashir_Sakimdad.AI
        </p>
      </motion.div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
        <Navbar />
        <Hero />
        <About />
        <SkillsGalaxy />
        <ProjectsShowcase />
        <FiverrAchievements />
        <ExperienceTimeline />
        <InteractiveTerminal />
        <Contact />
        <Footer />
      </motion.main>
    </SmoothScroll>
  );
}
