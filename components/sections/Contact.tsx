"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";

const contacts = [
  {
    icon: "✉️",
    label: "hashirsakimdad@gmail.com",
    href: "mailto:hashirsakimdad@gmail.com",
  },
  {
    icon: "💼",
    label: "LinkedIn — Hashir Sakimdad",
    href: "https://www.linkedin.com/in/hashir-sakimdad-8bbb22299/",
  },
  {
    icon: "💻",
    label: "GitHub — hashirsakimdad",
    href: "https://github.com/hashirsakimdad",
  },
  {
    icon: "🚀",
    label: "Fiverr — hashirsakimdad",
    href: "https://www.fiverr.com/hashirsakimdad",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-36"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.06)_0%,rgba(168,85,247,0.04)_40%,transparent_70%)]" />

      <div className="relative mx-auto max-w-2xl">
        <SectionHeader
          eyebrow="// Open Channel"
          title="Let's Build Together"
          align="center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-xl leading-relaxed text-zinc-300 md:text-2xl"
        >
          Got an idea that needs AI?
          <br />
          <span className="text-cyan-400">I don&apos;t just consult. I ship.</span>
        </motion.p>

        <div className="space-y-3">
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 6 }}
            >
              <GlassCard className="flex items-center gap-4 p-5 transition-colors hover:border-cyan-400/30">
                <span className="text-xl">{c.icon}</span>
                <span className="flex-1 font-mono text-sm text-white">
                  {c.label}
                </span>
                <span className="text-cyan-400">→</span>
              </GlassCard>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center font-mono text-xs leading-loose tracking-wide text-zinc-600"
        >
          Currently available for freelance projects &amp; internships
          <br />
          Based in Islamabad, Pakistan · Open to remote worldwide
        </motion.p>
      </div>
    </section>
  );
}
