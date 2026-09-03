"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HomeExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reducedMotion) {
      reveals.forEach((element) => element.setAttribute("data-visible", "true"));
      return;
    }

    root.dataset.motion = "ready";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6%", threshold: 0.08 }
    );

    reveals.forEach((element) => observer.observe(element));

    const parallaxItems = window.matchMedia("(min-width: 768px)").matches
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"))
      : [];
    const scrollImages = window.matchMedia("(min-width: 768px)").matches
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-image]"))
      : [];
    let animationFrame = 0;

    const updateParallax = () => {
      animationFrame = 0;
      const viewportHeight = window.innerHeight;
      parallaxItems.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const progress = (bounds.top + bounds.height / 2 - viewportHeight / 2) / viewportHeight;
        const speed = Number(element.dataset.parallax || 18);
        element.style.setProperty("--parallax-y", `${progress * -speed}px`);
      });
      scrollImages.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, (viewportHeight - bounds.top) / (viewportHeight + bounds.height))
        );
        element.style.setProperty("--image-shift", `${(progress - 0.5) * 18}px`);
      });
    };

    const requestParallax = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("resize", requestParallax);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={rootRef} className="homepage-motion overflow-hidden">
      {children}
    </div>
  );
}
