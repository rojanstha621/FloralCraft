"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloralFrame3DProps {
  reducedMotion?: boolean;
}

// Procedural 3D Flower Blossom
function FlowerBlossom({
  position,
  scale = 1,
  color = "#E8B8B8",
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  rotation?: [number, number, number];
}) {
  const petals = 6;
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Central pistil */}
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#D7C9B8" roughness={0.7} />
      </mesh>

      {/* Outer Petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * Math.PI * 2) / petals;
        const x = Math.cos(angle) * 0.18;
        const y = Math.sin(angle) * 0.18;
        return (
          <mesh key={i} position={[x, y, 0.04]} rotation={[0, 0, angle + Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.04, 0.28, 12]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
          </mesh>
        );
      })}

      {/* Inner Petal Layer */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * Math.PI * 2) / petals + Math.PI / petals;
        const x = Math.cos(angle) * 0.1;
        const y = Math.sin(angle) * 0.1;
        return (
          <mesh key={`inner-${i}`} position={[x, y, 0.06]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.08, 0.03, 0.18, 12]} />
            <meshStandardMaterial color="#F1D7D7" roughness={0.4} metalness={0.05} />
          </mesh>
        );
      })}
    </group>
  );
}

// Procedural Botanical Leaf
function LeafMesh({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[0.12, 0.45, 8]} />
      <meshStandardMaterial color="#A7B89F" roughness={0.6} />
    </mesh>
  );
}

export function FloralFrame3D({ reducedMotion = false }: FloralFrame3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const time = state.clock.getElapsedTime();

      // Gentle floating oscillation
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.08;

      // Pointer parallax tracking
      targetRotation.current.x = state.pointer.y * 0.25;
      targetRotation.current.y = state.pointer.x * 0.35;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x + Math.sin(time * 0.5) * 0.03,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + Math.cos(time * 0.4) * 0.04,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Wooden Frame */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 4.0, 0.2]} />
        <meshStandardMaterial color="#7A5B4F" roughness={0.45} metalness={0.1} />
      </mesh>

      {/* Inner Frame Inset Border */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.8, 3.6, 0.1]} />
        <meshStandardMaterial color="#D7C9B8" roughness={0.6} />
      </mesh>

      {/* Parchment / Canvas Board */}
      <mesh position={[0, 0, 0.06]} receiveShadow>
        <planeGeometry args={[2.5, 3.3]} />
        <meshStandardMaterial color="#F9F6EF" roughness={0.9} />
      </mesh>

      {/* Inner Keepsake Card / Memory Photo Inset */}
      <mesh position={[0, 0.35, 0.08]}>
        <planeGeometry args={[1.8, 2.0]} />
        <meshStandardMaterial color="#FAF7F2" roughness={0.8} />
      </mesh>

      {/* Subtle Calligraphy Ribbon / Tagline Plate */}
      <mesh position={[0, -0.95, 0.08]}>
        <planeGeometry args={[1.8, 0.45]} />
        <meshStandardMaterial color="#E8ECE6" roughness={0.7} />
      </mesh>

      {/* Handcrafted Botanical Floral Arrangement on Frame */}
      <group position={[0, 0, 0.1]}>
        {/* Main Corner Floral Cluster - Top Right */}
        <FlowerBlossom
          position={[0.9, 1.35, 0.05]}
          scale={1.1}
          color="#E8B8B8"
          rotation={[0.1, -0.1, 0.3]}
        />
        <FlowerBlossom
          position={[1.1, 0.95, 0.04]}
          scale={0.8}
          color="#F1D7D7"
          rotation={[-0.1, 0.2, -0.4]}
        />
        <LeafMesh position={[1.2, 1.45, 0.03]} rotation={[0, 0, -Math.PI / 4]} scale={0.9} />
        <LeafMesh position={[0.7, 1.55, 0.03]} rotation={[0, 0, Math.PI / 6]} scale={0.8} />

        {/* Bottom Left Botanical Cluster */}
        <FlowerBlossom
          position={[-0.85, -1.25, 0.05]}
          scale={1.2}
          color="#E8B8B8"
          rotation={[0.2, 0.1, -0.2]}
        />
        <FlowerBlossom
          position={[-1.05, -0.85, 0.04]}
          scale={0.85}
          color="#FAF7F2"
          rotation={[-0.1, -0.2, 0.5]}
        />
        <FlowerBlossom
          position={[-0.55, -1.4, 0.03]}
          scale={0.75}
          color="#D99E9E"
          rotation={[0, 0, 0.8]}
        />
        <LeafMesh position={[-1.15, -1.4, 0.03]} rotation={[0, 0, (Math.PI * 3) / 4]} scale={1.0} />
        <LeafMesh position={[-0.4, -1.5, 0.03]} rotation={[0, 0, -Math.PI / 3]} scale={0.8} />
      </group>

      {/* Protective Transparent Acrylic/Glass Sheen */}
      <mesh position={[0, 0, 0.25]}>
        <planeGeometry args={[2.7, 3.5]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.12}
          roughness={0.1}
          transmission={0.9}
          thickness={0.2}
          color="#FFFFFF"
        />
      </mesh>
    </group>
  );
}
