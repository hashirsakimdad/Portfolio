"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skills } from "@/lib/data/skills";

export function SkillsGalaxy() {
  return (
    <section id="capabilities" className="section-pad relative border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(94,106,210,0.06)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          label="Capabilities"
          title="Core competencies"
          subtitle="The technical foundation behind every product shipped from the lab."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, i) => (
            <Reveal key={skill.name} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] p-6 transition-colors hover:border-white/[0.14]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="font-mono text-[10px] text-[#71717A] uppercase">
                    {skill.category}
                  </span>
                </div>
                <h3 className="text-base font-medium tracking-[-0.02em] text-[#FAFAFA]">
                  {skill.name}
                </h3>
                <div className="mt-4 h-px w-full bg-white/[0.06]">
                  <div
                    className="h-px bg-[#5E6AD2] transition-all duration-1000 group-hover:bg-[#8B5CF6]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] text-[#71717A]">
                  {skill.level}% proficiency
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
