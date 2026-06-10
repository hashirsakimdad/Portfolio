"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CoreOrb({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08 + mouse.y * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12 + mouse.x * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <Sphere ref={ref} args={[1.4, 64, 64]}>
        <MeshDistortMaterial
          color="#5E6AD2"
          attach="material"
          distort={0.28}
          speed={1.5}
          roughness={0.35}
          metalness={0.85}
          transparent
          opacity={0.55}
        />
      </Sphere>
    </Float>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#8B5CF6"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface AmbientSceneProps {
  mouse: { x: number; y: number };
  className?: string;
}

export function AmbientScene({ mouse, className }: AmbientSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={0.6} color="#5E6AD2" />
        <pointLight position={[-4, -2, 2]} intensity={0.3} color="#8B5CF6" />
        <CoreOrb mouse={mouse} />
        <Particles />
      </Canvas>
    </div>
  );
}
