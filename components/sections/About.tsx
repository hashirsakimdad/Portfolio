"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "99.8%", label: "ML Accuracy" },
  { value: "9", label: "AI Agents Built" },
  { value: "40+", label: "Projects Shipped" },
  { value: "2", label: "Hackathons" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-stat", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative px-6 py-28 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="// Lab Profile"
          title="The Engineer Behind the Lab"
          subtitle="Based in Islamabad, Pakistan — building production AI that solves real problems."
        />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <GlassCard className="p-8 md:p-10">
            <p className="text-lg leading-relaxed text-zinc-300">
              I&apos;m <span className="text-cyan-400">Hashir Sakimdad</span> —
              an AI engineer obsessed with shipping intelligent systems. From
              holographic assistants to multi-agent pipelines, I turn complex AI
              research into production-ready products.
            </p>
            <p className="mt-5 text-base leading-relaxed text-zinc-500">
              Currently a 3rd-year AI student at PAF-IAST, freelancing on Fiverr,
              and building HoloHome AI — a 100% local holographic home assistant
              inspired by Psycho-Pass. No cloud. No subscription. Just intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Python", "PyTorch", "LangGraph", "FastAPI", "Three.js", "GCP"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-xs text-cyan-400/80"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="about-stat"
                whileHover={{ scale: 1.03 }}
              >
                <GlassCard className="p-6 text-center" hover={false}>
                  <div className="font-display text-3xl font-black text-cyan-400 md:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                    {s.label}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
