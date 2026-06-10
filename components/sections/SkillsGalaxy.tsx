"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skills } from "@/lib/data/skills";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SkillsGalaxy() {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".orbit-ring", {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.from(".skill-node", {
        scrollTrigger: { trigger: orbitRef.current, start: "top 75%" },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(2)",
      });
    }, orbitRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="// Neural Constellation"
          title="Skills Galaxy"
          subtitle="Technologies orbiting my AI laboratory — each one battle-tested in production."
          align="center"
        />

        <div
          ref={orbitRef}
          className="relative mx-auto flex aspect-square max-w-2xl items-center justify-center"
        >
          <div className="orbit-ring absolute inset-0 rounded-full border border-cyan-500/10" />
          <div className="orbit-ring absolute inset-8 rounded-full border border-purple-500/10" />
          <div className="orbit-ring absolute inset-16 rounded-full border border-cyan-500/5" />

          <div className="relative z-10 text-center">
            <div className="font-display text-2xl font-bold text-white">AI</div>
            <div className="font-mono text-xs text-cyan-400/60">CORE</div>
          </div>

          {skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 42;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;

            return (
              <motion.div
                key={skill.name}
                className="skill-node absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                whileHover={{ scale: 1.15, zIndex: 10 }}
              >
                <GlassCard className="w-28 p-3 text-center md:w-32 md:p-4" hover={false}>
                  <span className="text-2xl">{skill.icon}</span>
                  <div className="mt-1 font-mono text-[10px] font-semibold text-white">
                    {skill.name}
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {skills.slice(0, 4).map((s) => (
            <GlassCard key={s.name} className="p-5">
              <div className="font-mono text-[10px] tracking-wider text-purple-400/70 uppercase">
                {s.category}
              </div>
              <div className="mt-1 font-display text-lg font-bold text-white">
                {s.name}
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-cyan-400">
                {s.level}%
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
