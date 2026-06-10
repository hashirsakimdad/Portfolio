"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mb-16 md:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      <span className="mb-4 block font-mono text-xs tracking-[0.3em] text-cyan-400/70 uppercase">
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-zinc-400 md:text-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
