"use client";

import { motion } from "framer-motion";

/**
 * The lock moment: the field-verification stamp pressing onto the docket once
 * every row is filled.
 *
 * Reuses the `.stamp` component class verbatim rather than restyling it, so
 * this is recognisably the same mark as the one in the hero's title-block. The
 * animation lands on `rotate: -4deg` because that is the class's own resting
 * rotation — ending anywhere else would leave the stamp visibly out of true
 * with every other stamp on the site.
 *
 * Under reduced motion the MotionConfig in the root layout drops the scale and
 * rotation and this simply fades in, which is the correct outcome: the stamp
 * is confirmation, not decoration, so it must still appear.
 */
export function StampPress({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.55, rotate: -14 }}
      animate={{ opacity: 1, scale: 1, rotate: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="inline-block"
    >
      <span
        className="stamp"
        role="img"
        aria-label="Price locked, field verified"
      >
        {children}
      </span>
    </motion.div>
  );
}
