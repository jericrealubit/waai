"use client";

import { animate, useMotionValue, type MotionValue } from "framer-motion";
import { useEffect } from "react";

import { REDUCED_FADE_TRANSITION } from "@/lib/motion";

/**
 * The reduced-motion fallback for a trigger-driven entrance (mount, first
 * load, scroll-into-view): a brief opacity-only fade played via a raw
 * `animate()` call on a motion value, bound to the element with `style`.
 *
 * MEASURED, NOT ASSUMED: <MotionConfig reducedMotion="user"> suppresses
 * declarative `animate`/`variants` entirely once the OS asks for reduced
 * motion — including opacity-only ones, not just transform-bearing ones (an
 * opacity-only `variants`/`initial`/`animate` fade was tried here first and
 * stayed stuck at `opacity: 0` under a real reduced-motion browser). A raw
 * `animate()` call on a motion value sits outside what MotionConfig can
 * filter, which is why CountUp and Estimate already rely on the same trick —
 * this hook generalises it for every other trigger-driven entrance.
 */
export function useReducedFade(play: boolean, delay = 0): MotionValue<number> {
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (!play) return;

    const controls = animate(opacity, 1, { ...REDUCED_FADE_TRANSITION, delay });
    return () => controls.stop();
  }, [play, delay, opacity]);

  return opacity;
}
