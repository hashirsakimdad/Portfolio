"use client";

import { Button } from "@/components/ui/Button";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AmbientScene = dynamic(
  () => import("@/components/three/AmbientScene").then((m) => m.AmbientScene),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useMousePosition();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-el", {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:px-8"
    >
      <AmbientScene
        mouse={mouse}
        className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full max-w-4xl opacity-70"
      />

      <div className="pointer-events-none absolute inset-0 grid-fine opacity-60" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#5E6AD2]/[0.07] blur-[120px]" />

      <motion.div
        style={{ opacity, y, scale }}
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <p className="hero-el mb-6 font-mono text-[11px] tracking-[0.25em] text-[#5E6AD2] uppercase">
          Digital Headquarters · Est. 2022
        </p>

        <h1 className="hero-el text-balance text-5xl font-semibold tracking-[-0.04em] text-[#FAFAFA] md:text-7xl lg:text-[5.5rem] lg:leading-[1.02]">
          Intelligence,
          <br />
          <span className="text-shimmer">engineered.</span>
        </h1>

        <p className="hero-el mt-8 max-w-xl text-lg leading-relaxed text-[#A1A1AA] md:text-xl">
          Sakimdad Labs is the research studio of Hashir Sakimdad — designing
          production AI systems that perceive, reason, and act in the real world.
        </p>

        <div className="hero-el mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="#products">Explore products</Button>
          <Button href="#mission" variant="secondary">
            Our mission
          </Button>
        </div>

        <div className="hero-el mt-16 flex items-center gap-8 border-t border-white/[0.06] pt-10">
          {[
            { value: "99.8%", label: "Model accuracy" },
            { value: "6+", label: "Shipped systems" },
            { value: "9", label: "Agent architecture" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-wider text-[#71717A] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#71717A] uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-[#5E6AD2] to-transparent"
        />
      </motion.div>
    </section>
  );
}
