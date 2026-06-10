"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const metrics = [
  { value: "40+", label: "Deployments", detail: "Production systems delivered" },
  { value: "99.8%", label: "Peak accuracy", detail: "DiscoveryOS career engine" },
  { value: "<120ms", label: "Inference", detail: "Real-time CV pipelines" },
  { value: "9", label: "Agents", detail: "Saath AI orchestration" },
  { value: "100%", label: "Local stack", detail: "HoloHome offline AI" },
  { value: "2", label: "Hackathons", detail: "Google AI Seekho 2026" },
];

export function FiverrAchievements() {
  return (
    <section id="impact" className="section-pad relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Impact"
          title="Measured outcomes"
          subtitle="The lab tracks what matters — accuracy, latency, and systems that remain operational long after launch."
          align="center"
        />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
              <div className="bg-[#111113] p-6 md:p-8">
                <div className="text-3xl font-semibold tracking-[-0.03em] text-[#FAFAFA] md:text-4xl">
                  {m.value}
                </div>
                <div className="mt-2 text-sm font-medium text-[#FAFAFA]">
                  {m.label}
                </div>
                <div className="mt-1 text-xs text-[#71717A]">{m.detail}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
