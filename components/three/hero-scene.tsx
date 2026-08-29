"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { FloralFrame3D } from "./floral-frame-3d";
import { FloatingPetals3D } from "./floating-petals-3d";
import { FallbackHero } from "./fallback-hero";
import { useWebGLSupport } from "./webgl-detector";

export function HeroScene() {
  const { isSupported, prefersReducedMotion, isLoading } = useWebGLSupport();

  if (isLoading) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-sage border-t-transparent" />
      </div>
    );
  }

  // Graceful fallback if WebGL is unsupported or user requested reduced motion
  if (!isSupported) {
    return <FallbackHero />;
  }

  return (
    <div className="relative h-[440px] w-full max-w-[480px] select-none">
      <Suspense fallback={<FallbackHero />}>
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5.8]} fov={45} />

          {/* Warm Boutique Lighting Scheme */}
          <ambientLight intensity={0.85} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            color="#FFFDFC"
          />
          <pointLight position={[-4, -3, 2]} intensity={0.4} color="#E8B8B8" />
          <pointLight position={[3, -2, 3]} intensity={0.3} color="#A7B89F" />

          {/* Floating Keepsake Frame */}
          <Float
            speed={prefersReducedMotion ? 0 : 1.5}
            rotationIntensity={prefersReducedMotion ? 0 : 0.4}
            floatIntensity={prefersReducedMotion ? 0 : 0.6}
            floatingRange={[-0.1, 0.1]}
          >
            <FloralFrame3D reducedMotion={prefersReducedMotion} />
          </Float>

          {/* Subtle Ambient Petals */}
          {!prefersReducedMotion && (
            <FloatingPetals3D count={14} reducedMotion={prefersReducedMotion} />
          )}
        </Canvas>
      </Suspense>

      {/* Interactive Micro-hint */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-brand-beige-400/40 bg-white/70 px-3 py-1 text-[10px] font-medium tracking-wider text-brand-brown-500 backdrop-blur-xs uppercase shadow-subtle">
        Move pointer to interact
      </div>
    </div>
  );
}

export default HeroScene;
