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
      whileHover={
        hover
          ? { y: -2, borderColor: "rgba(255,255,255,0.14)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]/80 backdrop-blur-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
