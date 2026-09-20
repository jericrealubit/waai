import type { Transition, Variants } from "framer-motion";

/**
 * The site's motion vocabulary, mirroring the --ease-* tokens in globals.css so
 * CSS transitions and framer-motion animations share one curve.
 *
 * Keep these in step with `--ease-site` / `--ease-stamp`. They can't be read
 * from CSS here: framer needs a cubic-bezier array, not a `var()`.
 */
export const EASE_SITE = [0.2, 0.7, 0.2, 1] as const;
export const EASE_STAMP = [0.34, 1.56, 0.64, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
} as const;

/**
 * The entrance. Was copy-pasted verbatim into four components, each declaring
 * its own inline `initial`/`whileInView`/`transition` objects.
 */
export const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0 },
};

/**
 * Stagger delay for an item at `index`.
 *
 * Capped deliberately. The old `index * 0.1` meant the sixth card in a grid sat
 * invisible for 500ms after the first — past the point where a stagger reads as
 * choreography and into looking like the page is still loading. 70ms, capped at
 * five steps, keeps the rhythm without the tail.
 */
export function staggerDelay(index = 0): number {
  return Math.min(index, 5) * 0.07;
}

export function revealTransition(index = 0): Transition {
  return {
    duration: DURATION.slow,
    delay: staggerDelay(index),
    ease: EASE_SITE,
  };
}
