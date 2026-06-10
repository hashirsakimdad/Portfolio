"use client";

import { motion } from "framer-motion";

const marquee = [
  "HASHIR SAKIMDAD",
  "AI ENGINEER",
  "ISLAMABAD",
  "LANGGRAPH",
  "COMPUTER VISION",
  "FASTAPI",
  "HOLOHOME AI",
  "AVAILABLE FOR HIRE",
];

export function Footer() {
  const items = [...marquee, ...marquee];

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="overflow-hidden border-b border-white/[0.04] py-5">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex w-max whitespace-nowrap"
        >
          {items.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 font-display text-sm font-bold tracking-[0.2em] text-zinc-600 transition-colors hover:text-cyan-400">
                {item}
              </span>
              <span className="text-cyan-500/40">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
      <div className="flex flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-12">
        <span className="font-display text-sm font-bold tracking-[0.25em] text-cyan-400">
          H_SAKIMDAD
        </span>
        <div className="flex flex-wrap gap-6">
          {[
            { href: "https://github.com/hashirsakimdad", label: "GitHub" },
            { href: "https://www.linkedin.com/in/hashir-sakimdad-8bbb22299/", label: "LinkedIn" },
            { href: "mailto:hashirsakimdad@gmail.com", label: "Email" },
            { href: "https://www.fiverr.com/hashirsakimdad", label: "Fiverr" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wider text-zinc-500 uppercase transition-colors hover:text-cyan-400"
            >
              {l.label}
            </a>
          ))}
        </div>
        <span className="font-mono text-[10px] tracking-wider text-zinc-700">
          © 2025 Hashir Sakimdad · PAF-IAST · Islamabad
        </span>
      </div>
    </footer>
  );
}
