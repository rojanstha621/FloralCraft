"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PETALS = [
  { position: [-5.2, 2.4, 0.2], scale: 0.42, color: "#d7a09b", phase: 0.2 },
  { position: [-3.7, -2.7, 1.4], scale: 0.3, color: "#ecd0cc", phase: 1.8 },
  { position: [1.3, 3.1, -0.8], scale: 0.34, color: "#e1b6b0", phase: 3.1 },
  { position: [4.1, 2.3, 1.7], scale: 0.38, color: "#c9948f", phase: 4.6 },
  { position: [5.1, -1.8, 0.8], scale: 0.5, color: "#e7c7c2", phase: 2.5 },
  { position: [2.7, -3.2, -0.5], scale: 0.27, color: "#b9c2af", phase: 5.4 },
] as const;

function PetalField() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const time = clock.elapsedTime;
    group.current.children.forEach((child, index) => {
      const petal = PETALS[index];
      child.position.y = petal.position[1] + Math.sin(time * 0.28 + petal.phase) * 0.12;
      child.position.x = petal.position[0] + Math.cos(time * 0.18 + petal.phase) * 0.08;
      child.rotation.x += delta * (0.035 + index * 0.003);
      child.rotation.z = Math.sin(time * 0.16 + petal.phase) * 0.18;
    });
  });

  return (
    <group ref={group}>
      {PETALS.map((petal, index) => (
        <mesh
          key={index}
          position={petal.position}
          scale={[petal.scale * 0.52, petal.scale, petal.scale * 0.16]}
          rotation={[0.4 + index * 0.12, 0.25, petal.phase]}
        >
          <sphereGeometry args={[1, 16, 10]} />
          <meshStandardMaterial
            color={petal.color}
            roughness={0.82}
            metalness={0}
            transparent
            opacity={0.52}
          />
        </mesh>
      ))}
    </group>
  );
}

function BotanicalSprig() {
  const group = useRef<THREE.Group>(null);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -2.8, 0),
        new THREE.Vector3(0.18, -1.4, 0.05),
        new THREE.Vector3(-0.12, 0.2, 0),
        new THREE.Vector3(0.3, 1.8, -0.08),
        new THREE.Vector3(0.08, 3.1, 0),
      ]),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.2) * 0.018 - 0.08;
  });

  return (
    <group ref={group} position={[5.6, 0.2, -1.5]} rotation={[0, 0, -0.08]}>
      <mesh>
        <tubeGeometry args={[curve, 32, 0.018, 6, false]} />
        <meshStandardMaterial color="#7b8971" roughness={0.9} transparent opacity={0.34} />
      </mesh>
      {[-1.7, -0.65, 0.45, 1.45, 2.35].map((y, index) => (
        <mesh
          key={y}
          position={[index % 2 ? -0.22 : 0.28, y, 0]}
          scale={[0.18, 0.42, 0.06]}
          rotation={[0.2, index % 2 ? -0.35 : 0.35, index % 2 ? 0.78 : -0.78]}
        >
          <sphereGeometry args={[1, 14, 8]} />
          <meshStandardMaterial color="#8e9a83" roughness={0.88} transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function BotanicalWorld() {
  const world = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame(({ camera, clock }) => {
    if (!world.current) return;
    const time = clock.elapsedTime;
    world.current.rotation.y = THREE.MathUtils.lerp(
      world.current.rotation.y,
      pointer.current.x * 0.022 + Math.sin(time * 0.12) * 0.008,
      0.025
    );
    world.current.rotation.x = THREE.MathUtils.lerp(
      world.current.rotation.x,
      pointer.current.y * -0.012,
      0.025
    );
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 0.05, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.current.y * -0.03, 0.02);
  });

  return (
    <group ref={world}>
      <PetalField />
      <BotanicalSprig />
    </group>
  );
}

export function HeroBotanicalScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      className="hero-botanical-canvas"
    >
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={88} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[-3, 5, 7]} intensity={1.2} color="#fff8ee" />
      <directionalLight position={[5, -2, 4]} intensity={0.35} color="#e3c1b9" />
      <BotanicalWorld />
    </Canvas>
  );
}
