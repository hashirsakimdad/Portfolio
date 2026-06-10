"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experiences } from "@/lib/data/experience";

export function ExperienceTimeline() {
  return (
    <section id="chronicle" className="section-pad relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          label="Chronicle"
          title="The evolution of the lab"
          subtitle="A timeline of research milestones — from first principles to holographic intelligence."
          align="center"
        />

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[7px] w-px bg-white/[0.08] md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <Reveal key={exp.year} delay={i * 0.08}>
                <div className="relative flex gap-8 md:gap-0">
                  <div className="absolute left-0 z-10 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        i === experiences.length - 1
                          ? "bg-[#5E6AD2] ring-4 ring-[#5E6AD2]/20"
                          : "bg-[#3F3F46]"
                      }`}
                    />
                  </div>

                  <div
                    className={`ml-8 flex-1 md:ml-0 ${
                      i % 2 === 0
                        ? "md:pr-[calc(50%+2rem)] md:text-right"
                        : "md:pl-[calc(50%+2rem)]"
                    }`}
                  >
                    <span className="font-mono text-xs text-[#5E6AD2]">
                      {exp.year}
                    </span>
                    <h3 className="mt-1 text-lg font-medium tracking-[-0.02em] text-[#FAFAFA]">
                      {exp.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#71717A]">{exp.org}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
                      {exp.description}
                    </p>
                    {exp.highlight && (
                      <span className="mt-3 inline-block rounded-full border border-white/[0.08] px-3 py-1 font-mono text-[10px] text-[#A1A1AA]">
                        {exp.highlight}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
