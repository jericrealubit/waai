"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect } from "react";

import { EASE_SITE } from "@/lib/motion";

/**
 * React warns when useLayoutEffect runs during SSR, and on Workers that warning
 * becomes console noise in `wrangler tail` on every single request.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A zero-padded number that counts up once, on first load.
 *
 * Follows components/docket/estimate.tsx, with one deliberate difference worth
 * understanding before "harmonising" the two:
 *
 * **The motion value is seeded at the TRUE value, not at 0.** The docket's
 * estimate genuinely is unknown until the visitor configures a job, so starting
 * it at 0 is honest there. Here the counts are real facts derived on the server
 * (`CASE_STUDIES.length`), and seeding at 0 would put "00 projects shipped" in
 * the server HTML — which is what a crawler reads, what a no-JS visitor sees,
 * and a flatly false claim on a page whose whole argument is that the work is
 * real and checkable.
 *
 * So: the server renders the true figure, and the client resets to 0 and counts
 * back up. The reset happens in a LAYOUT effect so it lands before paint —
 * with a plain effect you get a visible 06 → 00 flash on first frame.
 */
export function CountUp({
  to,
  play,
  delay = 0,
  pad = 2,
}: {
  to: number;
  /** False on client-side navigations back to the page — see use-first-load. */
  play: boolean;
  delay?: number;
  pad?: number;
}) {
  const reduce = useReducedMotion();
  const count = useMotionValue(to);

  // Round before padding so intermediate frames read "03", never "3.4152".
  const display = useTransform(count, (value) =>
    String(Math.round(value)).padStart(pad, "0"),
  );

  useIsomorphicLayoutEffect(() => {
    if (!play) return;

    count.set(0);
    const controls = animate(count, to, {
      // A raw animate() driving TEXT is not something <MotionConfig
      // reducedMotion> can filter — it is not a component animation. Under
      // reduced motion the count still ticks, just briefly, rather than
      // rolling through the full 0.4s climb. Same reasoning as Estimate.
      duration: reduce ? 0.15 : 0.4,
      delay,
      ease: EASE_SITE,
    });

    return () => controls.stop();
  }, [to, delay, play, reduce, count]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}
