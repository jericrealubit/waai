"use client";

import { AnimatePresence, motion } from "framer-motion";

import { EASE_STAMP, STAMP_IN_VARIANTS } from "@/lib/motion";

/**
 * One line of the works order: a mono field label, and the answer stamped in
 * beside it once given.
 *
 * `AnimatePresence mode="popLayout"` keyed on the value means changing an
 * earlier answer re-stamps that row rather than silently swapping its text —
 * the revision is visible, which is the behaviour a docket should have.
 *
 * The spring is a transform animation, so <MotionConfig reducedMotion="user">
 * in the root layout reduces it to a plain cross-fade with no extra guard here.
 */
export function DocketRow({
  label,
  value,
  amount,
}: {
  label: string;
  /** Undefined until this step has been answered. */
  value?: string;
  /** Right-hand column — the line item's price, already formatted. */
  amount?: string;
}) {
  return (
    <div className="flex items-baseline gap-3 border-b border-line px-4 py-3 last:border-b-0 md:px-6">
      <span className="w-[6.5rem] shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground-subtle md:w-32">
        {label}
      </span>

      <span className="min-w-0 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {value ? (
            <motion.span
              key={value}
              variants={STAMP_IN_VARIANTS}
              initial="hidden"
              animate="shown"
              exit={{ opacity: 0 }}
              className="block origin-left font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-foreground"
            >
              {value}
            </motion.span>
          ) : (
            // A ruled blank, like an unfilled field on a paper docket.
            <span
              key="blank"
              aria-hidden="true"
              className="block h-[1.5px] w-24 translate-y-[-0.35rem] bg-line-strong"
            />
          )}
        </AnimatePresence>
      </span>

      {amount && (
        <motion.span
          key={amount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: EASE_STAMP }}
          className="shrink-0 font-mono text-sm font-bold tabular-nums text-foreground"
        >
          {amount}
        </motion.span>
      )}
    </div>
  );
}
