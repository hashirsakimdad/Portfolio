"use client";

import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export function ProjectCard3D({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 400,
    damping: 35,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 400,
    damping: 35,
  });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative block h-full perspective-[1000px]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] p-6 transition-colors duration-500 group-hover:border-white/[0.14] md:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#5E6AD2]/10 blur-3xl" />
        </div>

        <div className="relative z-10 mb-6 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.15em] text-[#71717A] uppercase">
            {project.category}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-[#A1A1AA] transition-all group-hover:border-[#5E6AD2]/40 group-hover:text-[#5E6AD2]">
            ↗
          </span>
        </div>

        <h3 className="relative z-10 text-xl font-semibold tracking-[-0.02em] text-[#FAFAFA] md:text-2xl">
          {project.title}
        </h3>
        <p className="relative z-10 mt-2 text-sm text-[#71717A]">
          {project.tagline}
        </p>
        <p className="relative z-10 mt-4 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
          {project.description}
        </p>

        <div className="relative z-10 mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]">
          {project.metrics.map((m) => (
            <div key={m.label} className="bg-[#111113] px-3 py-3 text-center">
              <div className="text-base font-semibold tracking-tight text-[#FAFAFA]">
                {m.value}
              </div>
              <div className="mt-0.5 font-mono text-[9px] tracking-wider text-[#71717A] uppercase">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-[#71717A]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
