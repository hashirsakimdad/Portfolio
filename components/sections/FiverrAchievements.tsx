"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fiverrServices, fiverrStats } from "@/lib/data/fiverr";
import { motion } from "framer-motion";

export function FiverrAchievements() {
  return (
    <section
      id="fiverr"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(39,201,63,0.04)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="// Freelance Operations"
          title="Fiverr Achievements"
          subtitle="Delivering AI solutions to clients worldwide while pursuing my degree."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {fiverrStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <GlassCard className="p-5 text-center">
                <div className="text-2xl">{stat.icon}</div>
                <div className="mt-2 font-display text-xl font-bold text-white md:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
                  {stat.label}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="mt-10 p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Services I Deliver
              </h3>
              <p className="mt-3 text-zinc-400">
                From prototype to production — I handle the full AI development
                lifecycle for international clients on Fiverr.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {fiverrServices.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-1.5 font-mono text-xs text-green-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">★</span>
                  <div>
                    <div className="font-display text-lg font-bold text-white">
                      Level 1 Seller
                    </div>
                    <div className="font-mono text-xs text-green-400">
                      Verified · Top Rated Performance
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-400">
                  40+ projects delivered with 4.9★ average rating and 65%
                  repeat client rate.
                </p>
                <GlowButton
                  href="https://www.fiverr.com/hashirsakimdad"
                  external
                  className="mt-5"
                >
                  Hire on Fiverr →
                </GlowButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
