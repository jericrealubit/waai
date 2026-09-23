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
 * The two springs the site uses for things that LAND rather than ease in.
 *
 * Declared here rather than inline so the quote docket and the hero's
 * title-block are provably the same gesture — "they read as one system" stops
 * being a claim in a comment and becomes a shared import.
 */
export const SPRING_STAMP_IN: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
};

export const SPRING_STAMP_PRESS: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 18,
};

/**
 * A value stamping onto a form — a docket row's answer, a title-block cell's
 * entry. Overshoots slightly and settles square.
 *
 * `shown` is a function variant: pass the delay through framer's `custom` prop
 * so each caller owns its own choreography rather than this file guessing at
 * one. Put `origin-left` on the element — the rotation is meant to pivot from
 * where the text starts, not its centre.
 */
export const STAMP_IN_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8, rotate: -3, scale: 1.12 },
  shown: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { ...SPRING_STAMP_IN, delay },
  }),
};

/**
 * Stagger delay for an item at `index`.
 *
 * Capped deliberately. The old `index * 0.1` meant the sixth card in a grid sat
 * invisible for 500ms after the first — past the point where a stagger reads as
 * choreography and into looking like the page is still loading. 70ms, capped at
 * five steps, keeps the rhythm without the tail.
 */
/**
 * The reduced-motion fallback transition, for a raw `animate()` call on a
 * motion value rather than a declarative `variants`/`animate` prop.
 *
 * <MotionConfig reducedMotion="user"> was measured to suppress declarative
 * component animation entirely once the OS asks for reduced motion — even a
 * target with only `opacity` in it, not just `y`/`scale`/`rotate` ones. A raw
 * `animate()` call sits outside what MotionConfig can filter, so every
 * reduced-motion fallback in this codebase (`useReducedFade`, `CountUp`,
 * `Estimate`) drives an imperative motion value with this transition instead
 * of a declarative prop.
 */
export const REDUCED_FADE_TRANSITION: Transition = {
  duration: DURATION.fast,
  ease: EASE_SITE,
};

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
