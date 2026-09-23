"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useFirstLoad } from "@/components/hero/use-first-load";
import { useReducedFade } from "@/components/ui/use-reduced-fade";
import { DURATION, EASE_SITE } from "@/lib/motion";

/**
 * The hero's baseline stripe, drawing itself across on first load.
 *
 * This is the site's ONE hazard rule — CLAUDE.md: "use exactly once". This
 * component animates that existing element; it does not add another.
 *
 * `scaleX` from `origin-left`, never an interpolation of the gradient: the rule
 * is a `repeating-linear-gradient`, which cannot be animated cheaply, whereas a
 * transform is compositor-only.
 *
 * Reduced motion is guarded explicitly rather than left to <MotionProvider>:
 * measured behaviour with `reducedMotion="user"` is that the entrance does not
 * run at all, which for a `scaleX: 0` initial would leave the rule permanently
 * collapsed to nothing — and that held even for a declarative opacity-only
 * target, not just a `scaleX` one; the whole animate call gets suppressed.
 * An entrance must never be what makes an element visible. Under reduce the
 * rule swaps from a `scaleX` draw (transform — the kind of motion being asked
 * to be dropped) to a plain opacity fade-in, via `useReducedFade`'s raw
 * `animate()` on a motion value, which sits outside what MotionConfig can
 * filter; `scaleX` never leaves its default of 1 on that path.
 *
 * It draws at the same moment the stamp presses: the sheet gets signed and
 * ruled off in one beat, and neither asks the eye to follow it.
 *
 * ONCE DRAWN, IT RUNS. The stripes travel continuously — the site's "the plant
 * is switched on" tell. That loop is CSS, not framer: an idle loop held open by
 * requestAnimationFrame costs main thread for as long as the tab is open, and
 * the CSS catch-all under prefers-reduced-motion already parks it. The belt is
 * a separate child because the travelling thing has to be an over-wide element
 * inside a clip — see `.hazard-rule__belt` in globals.css for the geometry and
 * for why the step is 50.912px and not 51.
 */
export function HazardRule({ delay = 0.62 }: { delay?: number }) {
  const reduce = useReducedMotion();
  const firstLoad = useFirstLoad();
  // First load only — `reduce` picks WHICH entrance plays, not whether one
  // plays at all. Gating this on `!reduce` would send `initial` straight to
  // `false`, skipping the reduced fade instead of playing it.
  const animateIn = firstLoad;
  const opacity = useReducedFade(!!reduce && animateIn, delay);

  if (reduce) {
    return (
      <motion.div
        className="hazard-rule mt-14 origin-left"
        aria-hidden="true"
        style={{ opacity }}
      >
        <span className="hazard-rule__belt" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="hazard-rule mt-14 origin-left"
      aria-hidden="true"
      initial={animateIn ? { scaleX: 0 } : false}
      animate={{ scaleX: 1 }}
      transition={{ duration: DURATION.slow, delay, ease: EASE_SITE }}
    >
      <span className="hazard-rule__belt" />
    </motion.div>
  );
}
