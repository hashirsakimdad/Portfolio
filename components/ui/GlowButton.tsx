"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import Link from "next/link";

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  external?: boolean;
}

export function GlowButton({
  href,
  children,
  variant = "primary",
  className,
  external,
}: GlowButtonProps) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 px-7 py-3.5 font-mono text-sm font-semibold tracking-wide transition-all",
    variant === "primary" &&
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)]",
    variant === "outline" &&
      "border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-500/10",
  className
  );

  const inner = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
    >
      {children}
    </motion.span>
  );

  if (external || href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
