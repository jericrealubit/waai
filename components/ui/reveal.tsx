"use client";

import { motion } from "framer-motion";

import { REVEAL_VARIANTS, revealTransition } from "@/lib/motion";

/**
 * The scroll-into-view entrance, in one place.
 *
 * Four components each carried an identical inline copy of
 * `initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
 * viewport={{once:true}} transition={{duration:0.5, delay:index*0.1}}` — so
 * retuning the entrance meant finding and editing all four, and two sections
 * (pricing, growth) had simply never been given one.
 *
 * `margin` starts the animation slightly before the element reaches the
 * viewport edge, so a card is already settling by the time it is properly on
 * screen rather than visibly popping after it arrives.
 *
 * Reduced motion is handled globally by <MotionProvider> in the root layout,
 * not here — see components/motion-provider.tsx for why the CSS rule in
 * globals.css was never enough.
 */
const ELEMENTS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  section: motion.section,
} as const;

export function Reveal({
  index = 0,
  as = "div",
  className,
  children,
}: {
  /** Position in a list — drives the stagger. */
  index?: number;
  /** Rendered element, where the surrounding markup needs a specific tag. */
  as?: keyof typeof ELEMENTS;
  className?: string;
  children: React.ReactNode;
}) {
  // The motion components have per-element prop types that don't unify, and
  // this wrapper exposes no element-specific props anyway — so pick the
  // component and treat it as one shape.
  const Component = ELEMENTS[as] as typeof motion.div;

  return (
    <Component
      className={className}
      variants={REVEAL_VARIANTS}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={revealTransition(index)}
    >
      {children}
    </Component>
  );
}
