"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experiences } from "@/lib/data/experience";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceTimeline() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tl-fill", {
        scrollTrigger: { trigger: lineRef.current, start: "top 70%" },
        scaleY: 0,
        duration: 1.5,
        ease: "power3.inOut",
        transformOrigin: "top",
      });
      gsap.from(".tl-item", {
        scrollTrigger: { trigger: lineRef.current, start: "top 70%" },
        x: -40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      className="relative px-6 py-28 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="// Timeline Protocol"
          title="Experience Journey"
          subtitle="From first Hello World to holographic AI — every chapter built something real."
          align="center"
        />

        <div ref={lineRef} className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-px bg-white/10 md:left-1/2 md:-translate-x-px">
            <div className="tl-fill h-full w-full origin-top bg-gradient-to-b from-cyan-400 to-purple-500" />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.year}
                className={`tl-item relative flex flex-col md:flex-row ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="hidden flex-1 md:block" />
                <div className="absolute left-6 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2">
                  <div
                    className={`h-3 w-3 rotate-45 border-2 ${
                      i === experiences.length - 1
                        ? "border-cyan-400 bg-cyan-400"
                        : "border-zinc-600 bg-[#05080F]"
                    }`}
                  />
                </div>
                <div className="flex-1 pl-14 md:pl-0 md:pr-12">
                  <GlassCard className="p-6 md:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-cyan-400">
                        {exp.year}
                      </span>
                      {exp.highlight && (
                        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 font-mono text-[10px] text-purple-400">
                          {exp.highlight}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-white">
                      {exp.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {exp.org}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {exp.description}
                    </p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
