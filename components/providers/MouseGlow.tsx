"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move, { passive: true });
    document.body.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 mix-blend-screen"
      style={{
        left: pos.x,
        top: pos.y,
        background:
          "radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
      }}
      animate={{ left: pos.x, top: pos.y }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
    />
  );
}
