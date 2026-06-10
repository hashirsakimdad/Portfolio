"use client";

import { HashirAvatar } from "@/components/hero/HashirAvatar";
import { GlowButton } from "@/components/ui/GlowButton";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll, useTransform } from "framer-motion";

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

const roles = [
  "AI Engineer · LLM Architect",
  "Computer Vision Specialist",
  "Multi-Agent Systems Builder",
  "Fiverr Level 1 Seller",
  "PAF-IAST · 3rd Year AI Student",
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useMousePosition();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [scrollProg, setScrollProg] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setScrollProg(v));
    return () => unsub();
  }, [scrollYProgress]);

  useEffect(() => {
    const cur = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayText.length < cur.length) {
      timeout = setTimeout(
        () => setDisplayText(cur.slice(0, displayText.length + 1)),
        80
      );
    } else if (!deleting && displayText.length === cur.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayText.length > 0) {
      timeout = setTimeout(
        () => setDisplayText(cur.slice(0, displayText.length - 1)),
        40
      );
    } else {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayText, deleting, roleIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.8,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20 md:px-12"
    >
      <SceneCanvas
        mouse={mouse}
        scrollProgress={scrollProg}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,212,255,0.08)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(139,92,246,0.06)_0%,transparent_50%)]" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="hero-line mb-4 font-mono text-xs tracking-[0.3em] text-cyan-400/70">
            // INITIALIZING · AI_LABORATORY.EXE
          </p>
          <h1 className="hero-line font-display text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              Hashir
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Sakimdad
            </span>
          </h1>
          <p className="hero-line mt-5 min-h-[1.5em] font-mono text-sm text-amber-400 md:text-base">
            {displayText}
            <span className="animate-pulse">▋</span>
          </p>
          <p className="hero-line mt-6 max-w-lg text-base leading-relaxed text-zinc-400 md:text-lg">
            Welcome to my personal AI laboratory. I build intelligent systems
            that don&apos;t just work — they{" "}
            <span className="text-cyan-400">think</span>, adapt, and ship to
            production.
          </p>
          <div className="hero-line mt-8 flex flex-wrap gap-4">
            <GlowButton href="#projects">View Experiments</GlowButton>
            <GlowButton href="#contact" variant="outline">
              Enter Contact
            </GlowButton>
          </div>
          <div className="hero-line mt-8 flex gap-3">
            {[
              { href: "https://github.com/hashirsakimdad", label: "GH" },
              { href: "https://www.linkedin.com/in/hashir-sakimdad-8bbb22299/", label: "IN" },
              { href: "mailto:hashirsakimdad@gmail.com", label: "@" },
              { href: "https://www.fiverr.com/hashirsakimdad", label: "FV" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-white/10 font-mono text-[10px] text-zinc-500 transition-all hover:border-cyan-400/50 hover:text-cyan-400"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hero-line relative">
          <HashirAvatar scrollProgress={scrollYProgress} />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
          Scroll to explore
        </span>
        <div className="h-8 w-px animate-pulse bg-gradient-to-b from-cyan-400 to-transparent" />
      </div>
    </section>
  );
}
