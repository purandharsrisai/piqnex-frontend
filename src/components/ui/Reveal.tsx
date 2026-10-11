"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the animation starts. */
  delay?: number;
  /** Pixels the content slides up from. */
  y?: number;
}

/**
 * Fade-and-slide-up animation, done with a plain CSS transition (no animation library).
 * `start` decides when it plays: right after mount, or when the element scrolls into view.
 * With prefers-reduced-motion the content is shown immediately, with no movement.
 */
function RevealBase({ children, className, delay = 0, y = 20, start }: RevealProps & { start: "mount" | "scroll" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    if (start === "mount") {
      // Wait one frame so the hidden state is painted first, otherwise there is nothing to transition from.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/** Plays when the element scrolls into view (once). */
export function Reveal(props: RevealProps) {
  return <RevealBase {...props} start="scroll" />;
}

/** Plays immediately on mount (above the fold). */
export function RevealOnMount(props: RevealProps) {
  return <RevealBase {...props} start="mount" />;
}
