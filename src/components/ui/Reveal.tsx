"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-triggered reveal usable from server components. Always renders the
 * same motion element (so prefers-reduced-motion never causes a hydration
 * mismatch); with reduced motion, content is shown immediately.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const visible = { opacity: 1, y: 0 };

  if (reduce) {
    return (
      <motion.div className={className} initial={visible} animate={visible} transition={{ duration: 0 }}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={visible}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Plays immediately on mount (above the fold). */
export function RevealOnMount({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const visible = { opacity: 1, y: 0 };

  if (reduce) {
    return (
      <motion.div className={className} initial={visible} animate={visible} transition={{ duration: 0 }}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={visible}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
