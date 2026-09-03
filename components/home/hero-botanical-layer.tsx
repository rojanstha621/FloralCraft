"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroBotanicalScene = dynamic(
  () => import("./hero-botanical-scene").then((module) => module.HeroBotanicalScene),
  { ssr: false, loading: () => null }
);

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

export function HeroBotanicalLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const browser = navigator as NavigatorWithHints;
    const constrained =
      browser.connection?.saveData ||
      (browser.deviceMemory !== undefined && browser.deviceMemory <= 4) ||
      navigator.hardwareConcurrency <= 4;

    if (reducedMotion || !desktop || constrained) return;

    const canvas = document.createElement("canvas");
    const webgl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!webgl) return;

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const load = () => setEnabled(true);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1400 });
    } else {
      timeoutId = globalThis.setTimeout(load, 500);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !enabled) return;

    const updateVisibility = (visible: boolean) => {
      setActive(visible && document.visibilityState === "visible");
    };
    const observer = new IntersectionObserver(([entry]) => updateVisibility(entry.isIntersecting), {
      rootMargin: "120px",
      threshold: 0.01,
    });
    const onVisibilityChange = () => {
      const bounds = layer.getBoundingClientRect();
      updateVisibility(bounds.bottom > 0 && bounds.top < window.innerHeight);
    };

    observer.observe(layer);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled]);

  return (
    <div
      ref={layerRef}
      className={`hero-botanical-layer ${enabled ? "is-webgl" : "is-static"}`}
      aria-hidden="true"
    >
      <div className="hero-botanical-fallback">
        <span />
        <span />
      </div>
      {enabled && <HeroBotanicalScene active={active} />}
    </div>
  );
}
