"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ParticleField } from "./ParticleField";
import { HologramPanels } from "./HologramPanels";

interface SceneCanvasProps {
  mouse: { x: number; y: number };
  scrollProgress?: number;
  className?: string;
}

export function SceneCanvas({ mouse, scrollProgress = 0, className }: SceneCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00D4FF" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#A855F7" />
        <Suspense fallback={null}>
          <ParticleField mouse={mouse} />
          <HologramPanels scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
