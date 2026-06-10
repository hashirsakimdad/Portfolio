"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface HashirAvatarProps {
  scrollProgress?: MotionValue<number>;
}

export function HashirAvatar({ scrollProgress }: HashirAvatarProps) {
  const fallback = useMotionValue(0);
  const progress = scrollProgress ?? fallback;
  const y = useTransform(progress, [0, 1], [0, -80]);
  const scale = useTransform(progress, [0, 0.5], [1, 0.92]);
  const opacity = useTransform(progress, [0, 0.6], [1, 0.3]);

  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[80px]" />
      <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-[60px] translate-x-10" />

      <svg
        viewBox="0 0 400 480"
        className="relative z-10 w-full drop-shadow-[0_0_60px_rgba(0,212,255,0.15)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="100%" stopColor="#0d1425" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Floating hologram screens */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="20" y="60" width="90" height="55" rx="4" fill="rgba(0,20,50,0.8)" stroke="#00D4FF" strokeWidth="1" opacity="0.9" />
          <rect x="25" y="68" width="80" height="4" rx="1" fill="#00D4FF" opacity="0.6" />
          <rect x="25" y="76" width="50" height="3" rx="1" fill="#A855F7" opacity="0.5" />
          <rect x="25" y="83" width="65" height="3" rx="1" fill="#F0F4FF" opacity="0.3" />
          <text x="65" y="105" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#00D4FF">neural_net.py</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <rect x="290" y="80" width="85" height="60" rx="4" fill="rgba(0,20,50,0.8)" stroke="#A855F7" strokeWidth="1" />
          <circle cx="302" cy="92" r="3" fill="#FF5F56" />
          <circle cx="312" cy="92" r="3" fill="#FFBD2E" />
          <circle cx="322" cy="92" r="3" fill="#27C93F" />
          <rect x="298" y="100" width="70" height="3" rx="1" fill="#FF2D78" opacity="0.7" />
          <rect x="298" y="108" width="45" height="3" rx="1" fill="#00D4FF" opacity="0.6" />
          <rect x="298" y="116" width="55" height="3" rx="1" fill="#FFB347" opacity="0.5" />
          <rect x="298" y="128" width="8" height="6" rx="1" fill="#00D4FF">
            <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
          </rect>
        </motion.g>

        {/* Desk */}
        <rect x="60" y="310" width="280" height="8" rx="2" fill="#0F1E3C" stroke="#00D4FF" strokeWidth="1" />
        <rect x="75" y="318" width="4" height="45" rx="1" fill="#0A1628" stroke="#00D4FF" strokeWidth="0.8" />
        <rect x="321" y="318" width="4" height="45" rx="1" fill="#0A1628" stroke="#00D4FF" strokeWidth="0.8" />

        {/* Body / Hoodie */}
        <path
          d="M140 220 Q125 225 118 250 L118 310 L282 310 L282 250 Q275 225 260 220 L200 212 Z"
          fill="url(#hoodieGrad)"
          stroke="#00D4FF"
          strokeWidth="1.5"
        />
        {/* Hoodie glow lines */}
        <line x1="200" y1="225" x2="200" y2="310" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
        <path d="M155 270 Q200 285 245 270" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.4" filter="url(#glow)" />
        <rect x="168" y="255" width="64" height="28" rx="6" fill="#0F1628" stroke="#00D4FF" strokeWidth="1" />
        <text x="200" y="273" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#00D4FF" opacity="0.8">AI_LAB</text>

        {/* Arms */}
        <path d="M118 245 Q90 260 82 285 L98 292 Q108 270 130 260 Z" fill="url(#hoodieGrad)" stroke="#00D4FF" strokeWidth="1.2" />
        <path d="M282 245 Q310 260 318 285 L302 292 Q292 270 270 260 Z" fill="url(#hoodieGrad)" stroke="#00D4FF" strokeWidth="1.2" />
        <ellipse cx="88" cy="300" rx="12" ry="9" fill="#C68642" stroke="#00D4FF" strokeWidth="1" />
        <ellipse cx="312" cy="300" rx="12" ry="9" fill="#C68642" stroke="#00D4FF" strokeWidth="1" />

        {/* Head */}
        <ellipse cx="200" cy="175" rx="42" ry="46" fill="#C68642" stroke="#00D4FF" strokeWidth="1.5" />
        <path d="M158 165 Q160 130 200 127 Q240 130 242 165 Q232 145 200 143 Q168 145 158 165Z" fill="#1A0A00" />
        {/* Hood */}
        <path d="M148 175 Q140 200 145 220 L155 215 Q150 195 158 170Z" fill="#1a2744" stroke="#00D4FF" strokeWidth="1" />
        <path d="M252 175 Q260 200 255 220 L245 215 Q250 195 242 170Z" fill="#1a2744" stroke="#00D4FF" strokeWidth="1" />

        {/* AI Glasses */}
        <rect x="168" y="168" width="26" height="18" rx="4" fill="rgba(0,212,255,0.15)" stroke="#00D4FF" strokeWidth="1.5" />
        <rect x="206" y="168" width="26" height="18" rx="4" fill="rgba(0,212,255,0.15)" stroke="#00D4FF" strokeWidth="1.5" />
        <line x1="194" y1="177" x2="206" y2="177" stroke="#00D4FF" strokeWidth="1.5" />
        <ellipse cx="181" cy="177" rx="5" ry="5" fill="#1A0A00" />
        <ellipse cx="219" cy="177" rx="5" ry="5" fill="#1A0A00" />
        <circle cx="183" cy="175" r="1.5" fill="white" opacity="0.9" />
        <circle cx="221" cy="175" r="1.5" fill="white" opacity="0.9" />
        {/* HUD overlay on glasses */}
        <line x1="170" y1="172" x2="178" y2="172" stroke="#00D4FF" strokeWidth="0.8" opacity="0.6" />
        <line x1="208" y1="172" x2="216" y2="172" stroke="#A855F7" strokeWidth="0.8" opacity="0.6" />

        {/* Smile */}
        <path d="M188 195 Q200 203 212 195" fill="none" stroke="#1A0A00" strokeWidth="1.5" strokeLinecap="round" />

        {/* Floating tech badges */}
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <rect x="30" y="250" width="52" height="18" rx="3" fill="#0D1A36" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
          <text x="56" y="262" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#00D4FF">PYTHON</text>
        </motion.g>
        <motion.g animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }}>
          <rect x="318" y="230" width="58" height="18" rx="3" fill="#0D1A36" stroke="rgba(168,85,247,0.5)" strokeWidth="1" />
          <text x="347" y="242" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#A855F7">R3F</text>
        </motion.g>

        {/* Aura ring */}
        <circle cx="200" cy="175" r="55" fill="none" stroke="url(#glowGrad)" strokeWidth="12" opacity="0.3" />
      </svg>
    </motion.div>
  );
}
