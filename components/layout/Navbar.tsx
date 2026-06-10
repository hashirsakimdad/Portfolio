"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#fiverr", label: "Fiverr" },
  { href: "#experience", label: "Experience" },
  { href: "#terminal", label: "Terminal" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-300 md:px-12",
          scrolled && "border-b border-white/[0.06] bg-[#05080F]/80 py-3.5 backdrop-blur-2xl"
        )}
      >
        <a
          href="#hero"
          className="font-display text-sm font-bold tracking-[0.25em] text-cyan-400"
        >
          H_SAKIMDAD
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-mono text-[11px] tracking-widest text-zinc-500 uppercase transition-colors hover:text-cyan-400"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-400 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span className={cn("block h-px w-6 bg-cyan-400 transition-all", open && "translate-y-[7px] rotate-45")} />
          <span className={cn("block h-px w-6 bg-cyan-400 transition-all", open && "opacity-0")} />
          <span className={cn("block h-px w-6 bg-cyan-400 transition-all", open && "-translate-y-[7px] -rotate-45")} />
        </button>
      </motion.nav>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[#05080F]/98 backdrop-blur-xl lg:hidden"
      >
        {links.map((l, i) => (
          <motion.a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : 20 }}
            transition={{ delay: i * 0.05 }}
            className="font-display text-2xl font-bold tracking-wider text-white hover:text-cyan-400"
          >
            {l.label}
          </motion.a>
        ))}
      </motion.div>
    </>
  );
}
