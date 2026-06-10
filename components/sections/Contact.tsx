"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const channels = [
  {
    label: "Email",
    value: "hashirsakimdad@gmail.com",
    href: "mailto:hashirsakimdad@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "Hashir Sakimdad",
    href: "https://www.linkedin.com/in/hashir-sakimdad-8bbb22299/",
  },
  {
    label: "GitHub",
    value: "hashirsakimdad",
    href: "https://github.com/hashirsakimdad",
  },
];

export function Contact() {
  return (
    <section id="connect" className="section-pad relative border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(94,106,210,0.08)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-2xl text-center">
        <SectionHeader
          label="Connect"
          title="Start a conversation"
          subtitle="Partnerships, research collaborations, and ambitious AI projects — the lab is open."
          align="center"
        />

        <Reveal>
          <p className="mb-12 text-2xl font-medium tracking-[-0.03em] text-[#FAFAFA] md:text-3xl">
            Let&apos;s build something
            <br />
            <span className="text-[#A1A1AA]">that thinks.</span>
          </p>
        </Reveal>

        <div className="space-y-2">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111113] px-6 py-4 transition-colors hover:border-white/[0.14] hover:bg-[#18181B]"
              >
                <div className="text-left">
                  <div className="font-mono text-[10px] tracking-wider text-[#71717A] uppercase">
                    {c.label}
                  </div>
                  <div className="mt-0.5 text-sm text-[#FAFAFA]">{c.value}</div>
                </div>
                <span className="text-[#71717A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#5E6AD2]">
                  ↗
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10" delay={0.2}>
          <Button href="mailto:hashirsakimdad@gmail.com">Send a message</Button>
          <p className="mt-6 font-mono text-[11px] tracking-wide text-[#52525B]">
            Islamabad, Pakistan · Remote worldwide
          </p>
        </Reveal>
      </div>
    </section>
  );
}
