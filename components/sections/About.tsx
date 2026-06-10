"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const pillars = [
  {
    title: "Research to production",
    body: "Every system begins as a hypothesis in the lab and ends as deployed infrastructure serving real users.",
  },
  {
    title: "Local-first intelligence",
    body: "Pioneering offline AI with HoloHome — proving powerful assistants don't require the cloud.",
  },
  {
    title: "Precision engineering",
    body: "From 99.8% ML accuracy to sub-120ms inference — metrics matter when systems touch real lives.",
  },
];

export function About() {
  return (
    <section id="mission" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Mission"
          title="Building the next generation of intelligent systems"
          subtitle="A solo research studio operating at the intersection of large language models, computer vision, and embodied AI — headquartered in Islamabad, shipping worldwide."
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <GlassCard hover={false} className="h-full rounded-none border-0 bg-[#111113] p-8 md:p-10">
                <span className="font-mono text-[11px] text-[#5E6AD2]">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-medium tracking-[-0.02em] text-[#FAFAFA]">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
                  {p.body}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16" delay={0.2}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-white/[0.08] bg-[#111113]/50 p-8 md:flex-row md:items-center md:p-12">
            <div className="max-w-xl">
              <p className="text-2xl font-medium tracking-[-0.03em] text-[#FAFAFA] md:text-3xl">
                &ldquo;We don&apos;t build demos. We build systems that stay live.&rdquo;
              </p>
              <p className="mt-4 text-sm text-[#71717A]">
                — Hashir Sakimdad, Founder · Sakimdad Labs
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["LangGraph", "PyTorch", "FastAPI", "Three.js", "GCP", "Whisper"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.08] px-3.5 py-1.5 font-mono text-[11px] text-[#A1A1AA]"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
