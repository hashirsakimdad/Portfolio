"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-500/[0.06] before:to-purple-500/[0.04]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
