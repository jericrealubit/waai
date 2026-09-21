"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SPRING_STAMP_PRESS } from "@/lib/motion";

/**
 * The field-verification stamp, pressing on.
 *
 * Reuses the `.stamp` component class verbatim rather than restyling it, so
 * every stamp on the site is recognisably the same mark.
 *
 * ON THE ROTATION — this is the part that is easy to get wrong, and was:
 * `.stamp` carries `transform: rotate(-4deg)` in CSS, and this wrapper carries
 * its own transform. Nested transforms COMPOSE. An earlier version animated
 * the wrapper to `rotate: -4` "to match the class's resting rotation", which
 * actually rested the mark at -8deg — twice the intended tilt, and visibly out
 * of true with the static stamps elsewhere on the site.
 *
 * So the wrapper lands on 0 and lets `.stamp` supply the whole -4deg. The
 * opening frame is still -14deg overall (-10 here plus the class's -4).
 *
 * ON REDUCED MOTION — do not delegate this to <MotionProvider>. Measured
 * behaviour with `reducedMotion="user"` is that the entrance does not run at
 * all, leaving the element at its `initial` — i.e. `opacity: 0`, permanently
 * invisible. The stamp is confirmation, not decoration, so a visitor who asked
 * for less motion must still SEE it. The guard below renders it at rest
 * instead, which is the only correctness-safe way to do this: never rely on a
 * motion config to reveal content.
 */
export function StampPress({
  children,
  label = "Price locked, field verified",
  delay = 0,
}: {
  children: React.ReactNode;
  /** Accessible name. The docket and the hero stamp mean different things. */
  label?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    // No wrapper transform at all, so the mark sits at exactly the -4deg the
    // `.stamp` class gives it.
    return (
      <span className="stamp" role="img" aria-label={label}>
        {children}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.55, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ ...SPRING_STAMP_PRESS, delay }}
      className="inline-block"
    >
      <span className="stamp" role="img" aria-label={label}>
        {children}
      </span>
    </motion.div>
  );
}
