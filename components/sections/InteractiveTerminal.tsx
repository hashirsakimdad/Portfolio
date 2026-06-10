"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useEffect, useRef, useState } from "react";

const lines = [
  { text: "holohome boot --local", type: "cmd" },
  { text: "", type: "" },
  { text: "Initializing HoloHome AI v1.0...", type: "muted" },
  { text: "Ollama llama3.2 ..................... ready", type: "ok" },
  { text: "ChromaDB vector store ............... ready", type: "ok" },
  { text: "Whisper STT engine .................. ready", type: "ok" },
  { text: "Coqui XTTS-v2 synthesis ............. ready", type: "ok" },
  { text: "LangGraph agent graph ............... ready", type: "ok" },
  { text: "FastAPI server :8000 ................ live", type: "ok" },
  { text: "", type: "" },
  { text: "All systems nominal.", type: "accent" },
  { text: "Hologram projection active.", type: "accent" },
  { text: "", type: "" },
  { text: "Hello. I am HoloHome. How may I assist?", type: "ai" },
];

export function InteractiveTerminal() {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStarted(true),
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || visible >= lines.length) return;
    const delay = lines[visible]?.text === "" ? 120 : 240;
    const t = setTimeout(() => setVisible((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [started, visible]);

  const color = (type: string) => {
    if (type === "cmd") return "text-[#FAFAFA]";
    if (type === "ok") return "text-[#71717A]";
    if (type === "accent") return "text-[#5E6AD2]";
    if (type === "ai") return "text-[#FAFAFA]";
    if (type === "muted") return "text-[#52525B]";
    return "";
  };

  return (
    <section id="interface" ref={ref} className="section-pad relative border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.05)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeader
          label="Flagship Product"
          title="HoloHome AI"
          subtitle="A 24/7 holographic home assistant — 100% local, 100% free. Inspired by Psycho-Pass. No cloud. No subscription."
          align="center"
        />

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0E]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
            <span className="ml-3 font-mono text-[11px] text-[#71717A]">
              holohome — system interface
            </span>
          </div>
          <div className="min-h-[280px] p-6 font-mono text-[13px] leading-relaxed md:p-8">
            {lines.slice(0, visible).map((line, i) => (
              <div key={i} className={`mb-1 ${color(line.type)}`}>
                {line.type === "cmd" ? (
                  <>
                    <span className="text-[#5E6AD2]">→</span> {line.text}
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}
            {started && visible >= lines.length && (
              <span className="inline-block h-4 w-1.5 animate-pulse bg-[#5E6AD2]" />
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
          {["Ollama", "LangGraph", "Whisper", "XTTS-v2", "ChromaDB", "FastAPI", "Pepper's Ghost", "Offline-first"].map(
            (item) => (
              <div
                key={item}
                className="rounded-lg border border-white/[0.06] px-3 py-2 font-mono text-[11px] text-[#71717A]"
              >
                {item}
              </div>
            )
          )}
        </div>

        <div className="mt-8 text-center">
          <Button
            href="https://github.com/hashirsakimdad/Halo-Home-Ai"
            external
            variant="secondary"
          >
            View on GitHub ↗
          </Button>
        </div>
      </div>
    </section>
  );
}
