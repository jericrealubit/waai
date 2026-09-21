"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { CountUp } from "@/components/hero/count-up";
import { useFirstLoad } from "@/components/hero/use-first-load";
import { StampPress } from "@/components/docket/stamp-press";
import { SpecCell } from "@/components/ui/spec-cell";
import { DURATION, EASE_SITE, STAMP_IN_VARIANTS, staggerDelay } from "@/lib/motion";

/**
 * The hero's engineering title-block, filling itself in.
 *
 * THE GOVERNING IDEA: the title-block is a printed form that gets filled in.
 * The server paints the blank form — the frame, every cell border, every mono
 * label, the stamp's slot — and none of that ever animates. The client only
 * stamps in the entries.
 *
 * That split is what makes this safe rather than just tidy:
 *  - the frame never carries an entrance transform, so the scroll binding on
 *    the <aside> has nothing to fight;
 *  - every box is at its final size in the server HTML, so cumulative layout
 *    shift is structurally zero, not merely small;
 *  - the left column — the <h1>, which is this page's LCP element — keeps
 *    shipping zero client JS.
 *
 * The springs come from lib/motion.ts, shared with the quote docket, so the
 * hero and /quote are provably the same gesture rather than two lookalikes.
 */

/** The beat before anything inks in. */
const HEAD_DELAY = 0.12;

/** Each cell's entry stamps in on the shared 70ms stagger. */
const cellDelay = (index: number) => HEAD_DELAY + staggerDelay(index);

/**
 * The stamp is the closing beat, not the seventh item in the list — so it gets
 * its own constant rather than `staggerDelay(6)`, which would be identical to
 * `staggerDelay(5)` anyway since that helper caps at five steps.
 */
const STAMP_DELAY = 0.62;

export function TitleBlock({
  shipped,
  repos,
}: {
  shipped: number;
  repos: number;
}) {
  const reduce = useReducedMotion();
  const firstLoad = useFirstLoad();

  /*
   * Whether the entrance runs at all.
   *
   * The reduced-motion half is NOT delegated to <MotionProvider>. Measured
   * behaviour with `reducedMotion="user"` is that the entrance does not run at
   * all, leaving every element at its `initial` — opacity 0, invisible for
   * good. An entrance must never be the thing that makes content visible, so
   * when motion is unwanted these render at rest instead.
   */
  const animateIn = firstLoad && !reduce;

  /*
   * Window scroll, deliberately not `useScroll({ target, offset })`.
   *
   * `main` carries pt-24/md:pt-32, so this block starts ~150px below the
   * viewport top. Every target-based offset therefore reports progress > 0 at
   * scroll 0, which would render the block pre-shifted on first paint. Target
   * measurement also only happens on mount, so the first client frame can jump.
   *
   * A fixed pixel range gives y:0 / opacity:1 at scrollY 0 — on the server and
   * on the first client frame alike. useTransform clamps by default, so nothing
   * keeps travelling once the hero is gone.
   */
  const { scrollY } = useScroll();

  /*
   * A motion value bound to `style` is a BINDING, not an animation, so
   * <MotionConfig reducedMotion="user"> cannot filter it — framer writes it to
   * the DOM either way. Hooks can't be conditional, so the guard neutralises
   * the output range instead of skipping the hook.
   */
  const yRaw = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, -56]);
  const y = useSpring(yRaw, { stiffness: 220, damping: 40, mass: 0.6 });

  /* Opacity is NOT sprung: a lag between the page moving and the panel dimming
     reads as jank rather than smoothness. It also starts at 240px, so it only
     begins once the visitor has committed to leaving the hero. */
  const opacity = useTransform(scrollY, [240, 700], reduce ? [1, 1] : [1, 0.55]);

  const entry = (index: number, children: React.ReactNode) => (
    <motion.span
      className="block origin-left"
      variants={STAMP_IN_VARIANTS}
      custom={cellDelay(index)}
      initial={animateIn ? "hidden" : "shown"}
      animate="shown"
    >
      {children}
    </motion.span>
  );

  return (
    <motion.aside
      style={{ y, opacity }}
      className="border-2 border-bitumen bg-paper shadow-e2"
      aria-label="Firm summary"
    >
      <motion.div
        className="flex items-center justify-between border-b-2 border-bitumen px-3.5 py-2.5"
        initial={animateIn ? { opacity: 0, y: -4 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.base, delay: HEAD_DELAY, ease: EASE_SITE }}
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
          Drawing No. WAAI-00
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-subtle">
          Rev. 2026
        </span>
      </motion.div>

      <div className="grid grid-cols-2">
        <SpecCell
          label="Firm"
          value={entry(0, "WA AI Digital")}
          className="border-b border-line"
        />
        <SpecCell
          label="Base"
          value={entry(1, "Perth, WA")}
          className="border-b border-l border-line"
        />
        <SpecCell
          label="Projects shipped"
          value={entry(
            2,
            <CountUp to={shipped} play={animateIn} delay={cellDelay(2)} />,
          )}
          className="border-b border-line"
        />
        <SpecCell
          label="Public repos"
          value={entry(
            3,
            <CountUp to={repos} play={animateIn} delay={cellDelay(3)} />,
          )}
          className="border-b border-l border-line"
        />
      </div>

      <motion.div
        className="flex items-center gap-2.5 px-3.5 py-3"
        initial={animateIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.base, delay: 0.47, ease: EASE_SITE }}
      >
        {/* Stays a CSS animation. As a framer repeat loop it would run a rAF
            loop forever on the landing page, and `reducedMotion` does not block
            opacity — so it would keep pulsing for someone who asked for less,
            which the CSS catch-all currently prevents. */}
        <span
          aria-hidden="true"
          className="h-2 w-2 animate-pulse rounded-full bg-hivis"
        />
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
          Status: all builds live
        </span>
      </motion.div>

      <div className="flex justify-center pb-6 pt-1">
        {animateIn ? (
          <StampPress
            label="Field verified: live and source open"
            delay={STAMP_DELAY}
          >
            <StampFace />
          </StampPress>
        ) : (
          /* Already-assembled on a return visit: the plain class, no wrapper
             transform, so the mark sits at exactly the -4deg `.stamp` gives it. */
          <span
            className="stamp"
            role="img"
            aria-label="Field verified: live and source open"
          >
            <StampFace />
          </span>
        )}
      </div>
    </motion.aside>
  );
}

function StampFace() {
  return (
    <>
      <span className="block text-sm font-bold tracking-widest">
        ◱ Field-Verified
      </span>
      <span className="mt-0.5 block text-[9px] tracking-[0.2em]">
        Live + Source · WA
      </span>
    </>
  );
}
