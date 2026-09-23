"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { useReducedFade } from "@/components/ui/use-reduced-fade";
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
 * REDUCED MOTION IS GUARDED HERE, NOT DELEGATED — and this is the important
 * part. `<MotionProvider>`'s `reducedMotion="user"` does not snap an animation
 * to its final state; measured behaviour is that the animation never runs, so
 * the element is left sitting at `initial`. With a `hidden` variant of
 * `opacity: 0` that means **the content is invisible, permanently**, for every
 * visitor who has asked for reduced motion — which was every service card,
 * case-study card, process step, pricing block and growth card on the site.
 * This held even for an opacity-only declarative variant — MotionConfig
 * suppresses the whole animate call, not just its transform properties.
 *
 * The rule this encodes: an entrance may never be the thing that makes content
 * visible. When motion is unwanted, the reduced path below still plays a
 * fade — `useReducedFade`'s raw `animate()` sits outside what MotionConfig can
 * filter — triggered by `useInView` standing in for `whileInView`.
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
  const reduce = useReducedMotion();

  // The motion components have per-element prop types that don't unify, and
  // this wrapper exposes no element-specific props anyway — so pick the
  // component and treat it as one shape.
  const Component = ELEMENTS[as] as typeof motion.div;

  // `Component` is already treated as `typeof motion.div` below (see comment
  // above); the ref element type follows the same simplification.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const opacity = useReducedFade(!!reduce && inView);

  if (reduce) {
    return (
      <Component ref={ref} className={className} style={{ opacity }}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
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
