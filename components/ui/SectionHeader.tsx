"use client";

import { cn } from "@/lib/utils/cn";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "mb-16 max-w-3xl md:mb-24",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-[#5E6AD2] uppercase">
        {label}
      </p>
      <h2 className="text-balance text-4xl font-semibold tracking-[-0.03em] text-[#FAFAFA] md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-[#A1A1AA] md:text-xl">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
