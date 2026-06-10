"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowButton } from "@/components/ui/GlowButton";
import { useEffect, useRef, useState } from "react";

const terminalLines = [
  { text: "❯ python holohome.py --mode interactive", class: "text-white" },
  { text: "", class: "" },
  { text: "[ HoloHome AI ] Initializing laboratory systems...", class: "text-cyan-400/60" },
  { text: "[ Ollama      ] llama3.2 loaded ✓", class: "text-green-400" },
  { text: "[ ChromaDB    ] Vector store ready ✓", class: "text-green-400" },
  { text: "[ Whisper     ] STT engine online ✓", class: "text-green-400" },
  { text: "[ XTTS-v2     ] Voice synth ready ✓", class: "text-green-400" },
  { text: "[ LangGraph   ] 9-agent graph compiled ✓", class: "text-green-400" },
  { text: "[ FastAPI     ] Server :8000 live ✓", class: "text-green-400" },
  { text: "", class: "" },
  { text: "// ALL SYSTEMS NOMINAL", class: "text-amber-400" },
  { text: "// HOLOGRAM PROJECTION ACTIVE", class: "text-amber-400" },
  { text: "", class: "" },
  { text: "AI > Hello Hashir. Laboratory interface ready.", class: "text-white" },
  { text: "AI > Awaiting your next experiment...", class: "text-white" },
];

export function InteractiveTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || visibleLines >= terminalLines.length) return;
    const delay = visibleLines === 0 ? 200 : terminalLines[visibleLines]?.text === "" ? 150 : 280;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [started, visibleLines]);

  return (
    <section
      id="terminal"
      ref={sectionRef}
      className="relative px-6 py-28 md:px-12 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.03)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="// HoloHome Interface"
          title="Interactive Terminal"
          subtitle="A glimpse into HoloHome AI — my magnum opus. 100% local. 100% free."
          align="center"
        />

        <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#030610] shadow-[0_0_80px_rgba(0,212,255,0.08)]">
          <div className="flex items-center gap-2 border-b border-cyan-500/10 bg-cyan-500/5 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-auto font-mono text-xs text-zinc-500">
              holohome ~ main.py
            </span>
          </div>
          <div className="min-h-[320px] p-6 font-mono text-sm leading-relaxed md:p-8">
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={`mb-1 ${line.class}`}
                style={{ animation: "fadeIn 0.15s ease forwards" }}
              >
                {line.text.startsWith("❯") ? (
                  <>
                    <span className="text-cyan-400">hashir@lab</span>
                    <span className="text-zinc-600">:</span>
                    <span className="text-purple-400">~/holohome</span>
                    <span className="text-zinc-600">$ </span>
                    {line.text.slice(2)}
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}
            {started && visibleLines >= terminalLines.length && (
              <span className="inline-block h-4 w-2 animate-pulse bg-cyan-400" />
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            "🦙 Ollama llama3.2",
            "🕸️ LangGraph",
            "👂 Whisper STT",
            "🎙️ Coqui XTTS-v2",
            "🧬 ChromaDB",
            "🔮 Pepper's Ghost",
            "⚡ FastAPI",
            "🆓 100% Free Stack",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-zinc-400"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <GlowButton
            href="https://github.com/hashirsakimdad/Halo-Home-Ai"
            external
          >
            View HoloHome on GitHub →
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
