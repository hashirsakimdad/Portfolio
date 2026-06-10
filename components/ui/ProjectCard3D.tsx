"use client";

import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const accentMap = {
  cyan: "border-cyan-500/30 shadow-cyan-500/10 text-cyan-400",
  purple: "border-purple-500/30 shadow-purple-500/10 text-purple-400",
  magenta: "border-fuchsia-500/30 shadow-fuchsia-500/10 text-fuchsia-400",
  amber: "border-amber-500/30 shadow-amber-500/10 text-amber-400",
};

export function ProjectCard3D({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative block h-full perspective-[1000px]",
        "rounded-2xl border bg-white/[0.02] p-px backdrop-blur-xl",
        accentMap[project.accent]
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl p-6 md:p-8",
          `bg-gradient-to-br ${project.gradient}`
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 mb-4 flex items-start justify-between">
          <span className="text-4xl">{project.emoji}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
            {project.category}
          </span>
        </div>

        <h3 className="relative z-10 font-display text-xl font-bold text-white md:text-2xl">
          {project.title}
        </h3>
        <p className="relative z-10 mt-1 font-mono text-xs text-cyan-400/80">
          {project.tagline}
        </p>
        <p className="relative z-10 mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
          {project.description}
        </p>

        <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2 text-center"
            >
              <div className="font-display text-lg font-bold text-white">
                {m.value}
              </div>
              <div className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-2 font-mono text-xs text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
          <span>Explore Project</span>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            →
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
}
