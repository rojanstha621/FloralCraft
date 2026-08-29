"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingPetalsProps {
  count?: number;
  reducedMotion?: boolean;
}

export function FloatingPetals3D({ count = 16, reducedMotion = false }: FloatingPetalsProps) {
  const petalsRef = useRef<THREE.Group>(null);

  // Generate deterministic subtle petal particles
  const petalData = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: (Math.sin(i * 1.7) * 4) + (i % 2 === 0 ? 0.5 : -0.5),
      y: (Math.cos(i * 1.3) * 3),
      z: -1 + (i % 5) * 0.5,
      scale: 0.4 + (i % 4) * 0.15,
      rotationSpeed: 0.2 + (i % 3) * 0.15,
      driftSpeed: 0.3 + (i % 5) * 0.1,
      color: i % 3 === 0 ? "#E8B8B8" : i % 3 === 1 ? "#F1D7D7" : "#BDCBB7",
    }));
  }, [count]);

  useFrame((state) => {
    if (!petalsRef.current || reducedMotion) return;

    const time = state.clock.getElapsedTime();

    petalsRef.current.children.forEach((child, index) => {
      const data = petalData[index];
      if (!data) return;

      // Gentle continuous drifting
      child.position.y = ((data.y - time * data.driftSpeed * 0.4 + 5) % 8) - 4;
      child.position.x = data.x + Math.sin(time * 0.6 + index) * 0.2;
      child.rotation.x = time * data.rotationSpeed * 0.5;
      child.rotation.y = time * data.rotationSpeed * 0.7;
      child.rotation.z = Math.sin(time * 0.4 + index) * 0.5;
    });
  });

  return (
    <group ref={petalsRef}>
      {petalData.map((p) => (
        <mesh key={p.id} position={[p.x, p.y, p.z]} scale={p.scale}>
          <cylinderGeometry args={[0.08, 0.02, 0.2, 8]} />
          <meshStandardMaterial
            color={p.color}
            roughness={0.6}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}
    </group>
  );
}
