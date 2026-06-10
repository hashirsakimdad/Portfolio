"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  external?: boolean;
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
    size === "md" && "px-6 py-2.5 text-sm",
    size === "sm" && "px-4 py-2 text-xs",
    variant === "primary" &&
      "bg-[#FAFAFA] text-[#09090B] hover:bg-white",
    variant === "secondary" &&
      "border border-white/[0.12] bg-white/[0.04] text-[#FAFAFA] hover:border-white/[0.2] hover:bg-white/[0.07]",
    variant === "ghost" &&
      "text-[#A1A1AA] hover:text-[#FAFAFA]",
    className
  );

  const inner = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
