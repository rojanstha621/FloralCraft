"use client";

import { useEffect, useState } from "react";

/**
 * Checks if WebGL is supported and available in the user's browser,
 * and whether the user prefers reduced motion.
 */
export function useWebGLSupport(): {
  isSupported: boolean;
  prefersReducedMotion: boolean;
  isLoading: boolean;
} {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      // Check reduced motion
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleMotionChange);

      // Check WebGL context
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

      setIsSupported(Boolean(gl));
      setIsLoading(false);

      return () => {
        mediaQuery.removeEventListener("change", handleMotionChange);
      };
    } catch {
      setIsSupported(false);
      setIsLoading(false);
    }
  }, []);

  return { isSupported, prefersReducedMotion, isLoading };
}
