"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#products", label: "Products" },
  { href: "#chronicle", label: "Chronicle" },
  { href: "#interface", label: "Interface" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <>
      <motion.header className="fixed top-0 right-0 left-0 z-50">
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-xl"
        />
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]"
        />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-sm font-medium tracking-[-0.02em] text-[#FAFAFA]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-[10px] font-mono text-[#5E6AD2]">
              SL
            </span>
            Sakimdad Labs
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button href="#connect" size="sm">
              Connect
            </Button>
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="relative flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
          >
            <span
              className={cn(
                "block h-px w-5 bg-[#FAFAFA] transition-all",
                open && "translate-y-[5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-[#FAFAFA] transition-all",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-[#FAFAFA] transition-all",
                open && "-translate-y-[5px] -rotate-45"
              )}
            />
          </button>
        </nav>
      </motion.header>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[#09090B]/95 backdrop-blur-2xl md:hidden"
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-2xl font-medium tracking-[-0.02em] text-[#FAFAFA]"
          >
            {l.label}
          </a>
        ))}
        <div onClick={() => setOpen(false)}>
          <Button href="#connect">Connect</Button>
        </div>
      </motion.div>
    </>
  );
}
