"use client";

import { animate, useMotionValue, useReducedMotion, useTransform, motion } from "framer-motion";
import { useEffect } from "react";

import { EASE_SITE } from "@/lib/motion";
import { formatAUD } from "@/lib/pricing";

/**
 * The docket's estimate cell — the number that ticks up as rows are filled in.
 *
 * Rounded to the nearest ten while counting so the digits settle rather than
 * flickering through every intermediate dollar, then landing exactly on the
 * real figure.
 *
 * Reduced motion is handled explicitly here as well as globally. <MotionConfig
 * reducedMotion="user"> stops transform and layout animation, but this is an
 * `animate()` call on a raw motion value driving text content — the config
 * does not reach it, so the hook check is what makes the number appear at its
 * final value instead of spinning.
 */
export function Estimate({
  total,
  monthly,
}: {
  /**
   * Three distinct states, and they must not be collapsed:
   *  - `undefined`: nothing configured yet, show a ruled blank.
   *  - `null`: a tier that is genuinely quoted per project.
   *  - a number: the estimate.
   *
   * Conflating the first two showed "Quoted per project" to every visitor
   * before they had answered anything, which reads as "we won't tell you" on
   * the one page whose whole argument is that we will.
   */
  total: number | null | undefined;
  monthly: number | null | undefined;
}) {
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (value) => {
    /*
     * Round to the nearest ten WHILE counting so the digits settle instead of
     * flickering through every intermediate dollar — but snap to the exact
     * figure once the animation lands.
     *
     * Without the snap, a $2,499 tier settled on "$2,500": the docket quoted a
     * price the rate card does not list, which is the precise failure the
     * shared pricing module exists to prevent.
     */
    if (typeof total === "number" && Math.abs(value - total) < 1) {
      return formatAUD(total);
    }
    return formatAUD(Math.round(value / 10) * 10);
  });

  useEffect(() => {
    if (typeof total !== "number") return;

    if (reduce) {
      count.set(total);
      return;
    }

    const controls = animate(count, total, {
      duration: 0.55,
      ease: EASE_SITE,
    });

    return () => controls.stop();
  }, [total, reduce, count]);

  return (
    <div className="flex flex-col gap-1 px-4 py-4 md:px-6">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-hivis-ink/70">
        Estimate
      </span>

      {total === undefined ? (
        <span
          aria-hidden="true"
          className="mt-1 block h-[2px] w-28 bg-hivis-ink/35"
        />
      ) : total === null ? (
        <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-hivis-ink">
          Quoted per project
        </span>
      ) : (
        <>
          <motion.span className="font-mono text-4xl font-bold tabular-nums leading-none text-hivis-ink">
            {display}
          </motion.span>
          {monthly !== null && (
            <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-hivis-ink/80">
              or ${monthly}/mo
            </span>
          )}
        </>
      )}
    </div>
  );
}
