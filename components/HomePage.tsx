"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { FiverrAchievements } from "@/components/sections/FiverrAchievements";
import { Hero } from "@/components/sections/Hero";
import { InteractiveTerminal } from "@/components/sections/InteractiveTerminal";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { SkillsGalaxy } from "@/components/sections/SkillsGalaxy";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function HomePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <SmoothScroll>
      <ScrollProgress />

      <AnimatePresence>
        {!ready && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#09090B]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] font-mono text-sm text-[#5E6AD2]">
                SL
              </div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#52525B] uppercase">
                Sakimdad Labs
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative">
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
      </main>
    </SmoothScroll>
  );
}
