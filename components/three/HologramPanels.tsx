"use client";

import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function HologramPanel({
  position,
  label,
  color,
  scrollProgress,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  scrollProgress: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.1;
    ref.current.rotation.y = scrollProgress * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={ref}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.7)]} />
          <lineBasicMaterial color={color} transparent opacity={0.6} />
        </lineSegments>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.08}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

export function HologramPanels({
  scrollProgress = 0,
}: {
  scrollProgress?: number;
}) {
  const panels = [
    { pos: [-2.2, 1.2, -1] as [number, number, number], label: "PyTorch", color: "#00D4FF" },
    { pos: [2.4, 0.8, -0.5] as [number, number, number], label: "LangGraph", color: "#A855F7" },
    { pos: [-1.8, -0.6, 0.5] as [number, number, number], label: "FastAPI", color: "#00D4FF" },
    { pos: [2, -1, 0] as [number, number, number], label: "OpenCV", color: "#FF2D78" },
  ];

  return (
    <>
      {panels.map((p) => (
        <HologramPanel
          key={p.label}
          position={p.pos}
          label={p.label}
          color={p.color}
          scrollProgress={scrollProgress}
        />
      ))}
    </>
  );
}
