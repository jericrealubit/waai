"use client";

import { MotionConfig } from "framer-motion";

import { DURATION, EASE_SITE } from "@/lib/motion";

/**
 * Makes framer-motion honour the OS "reduce motion" setting, site-wide.
 *
 * This fixes a real gap. globals.css carries a catch-all that zeroes
 * `animation-duration` and `transition-duration` under
 * `prefers-reduced-motion`, and the assumption was that this covered
 * everything. It doesn't: framer-motion animates by writing inline
 * `transform`/`opacity` from JavaScript on each frame, which is neither a CSS
 * animation nor a CSS transition, so the rule could never reach it. Every
 * entrance on the site ran at full amplitude for visitors who had asked for
 * less motion.
 *
 * `reducedMotion="user"` makes framer skip transform and layout animations
 * while still cross-fading opacity, so content appears rather than slides.
 *
 * `children` is passed through as a prop, so wrapping the tree in the root
 * layout does NOT turn the pages into client components — the sections stay
 * server-rendered.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: DURATION.slow, ease: EASE_SITE }}
    >
      {children}
    </MotionConfig>
  );
}
