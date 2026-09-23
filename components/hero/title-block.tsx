"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { CountUp } from "@/components/hero/count-up";
import { useFirstLoad } from "@/components/hero/use-first-load";
import { StampPress } from "@/components/docket/stamp-press";
import { SpecCell } from "@/components/ui/spec-cell";
import { useReducedFade } from "@/components/ui/use-reduced-fade";
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
   * Whether the entrance runs at all — first load only, regardless of
   * `reduce`. `reduce` instead changes WHICH entrance runs: every element
   * below branches on it individually, swapping the full declarative
   * stamp-in for a `useReducedFade` motion value driven by a raw `animate()`
   * call — MotionConfig was measured to suppress declarative `animate`/
   * `variants` entirely under reduced motion, even an opacity-only target,
   * so the reduced path never uses those props. Never gate `animateIn` itself
   * on `!reduce` — that would send `initial` straight to `"shown"`/`false`,
   * skipping the reduced fade entirely rather than playing it, which is
   * exactly the invisible-content failure this used to have.
   */
  const animateIn = firstLoad;

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

  /*
   * One `useReducedFade` call per cell, always called (never inside `entry`,
   * a plain non-hook helper) so the hook count stays fixed across renders.
   * Each is a no-op until `reduce && animateIn`.
   */
  const headOpacity = useReducedFade(!!reduce && animateIn, HEAD_DELAY);
  const statusOpacity = useReducedFade(!!reduce && animateIn, 0.47);
  const firmOpacity = useReducedFade(!!reduce && animateIn, cellDelay(0));
  const baseOpacity = useReducedFade(!!reduce && animateIn, cellDelay(1));
  const shippedOpacity = useReducedFade(!!reduce && animateIn, cellDelay(2));
  const reposOpacity = useReducedFade(!!reduce && animateIn, cellDelay(3));

  const entry = (
    index: number,
    fadeOpacity: MotionValue<number>,
    children: React.ReactNode,
  ) => {
    if (reduce) {
      return (
        <motion.span className="block origin-left" style={{ opacity: fadeOpacity }}>
          {children}
        </motion.span>
      );
    }

    return (
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
  };

  return (
    <motion.aside
      style={{ y, opacity }}
      className="border-2 border-bitumen bg-paper shadow-e2"
      aria-label="Firm summary"
    >
      <motion.div
        className="flex items-center justify-between border-b-2 border-bitumen px-3.5 py-2.5"
        initial={reduce ? undefined : animateIn ? { opacity: 0, y: -4 } : false}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        style={reduce ? { opacity: headOpacity } : undefined}
        transition={
          reduce ? undefined : { duration: DURATION.base, delay: HEAD_DELAY, ease: EASE_SITE }
        }
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
          value={entry(0, firmOpacity, "WA AI Digital")}
          className="border-b border-line"
        />
        <SpecCell
          label="Base"
          value={entry(1, baseOpacity, "Perth, WA")}
          className="border-b border-l border-line"
        />
        <SpecCell
          label="Projects shipped"
          value={entry(
            2,
            shippedOpacity,
            <CountUp to={shipped} play={animateIn} delay={cellDelay(2)} />,
          )}
          className="border-b border-line"
        />
        <SpecCell
          label="Public repos"
          value={entry(
            3,
            reposOpacity,
            <CountUp to={repos} play={animateIn} delay={cellDelay(3)} />,
          )}
          className="border-b border-l border-line"
        />
      </div>

      <motion.div
        className="flex items-center gap-2.5 px-3.5 py-3"
        initial={reduce ? undefined : animateIn ? { opacity: 0 } : false}
        animate={reduce ? undefined : { opacity: 1 }}
        style={reduce ? { opacity: statusOpacity } : undefined}
        transition={
          reduce ? undefined : { duration: DURATION.base, delay: 0.47, ease: EASE_SITE }
        }
      >
        {/* Every loop in this row stays CSS. As framer `repeat: Infinity` each
            would hold a rAF loop open for as long as the landing page sits in
            a tab, and `reducedMotion` does not block a repeat that only moves
            opacity — so they would keep running for someone who asked for
            less, which the CSS catch-all prevents. */}
        <span aria-hidden="true" className="beacon h-2 w-2 shrink-0" />
        <StatusReadout shipped={shipped} repos={repos} />
        <span className="signal-meter shrink-0" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      </motion.div>

      <div className="flex justify-center pb-6 pt-1">
        {firstLoad ? (
          // StampPress owns the reduced-motion decision itself (fade vs. full
          // spring) — render it whenever this is a first load, reduced motion
          // or not, rather than pre-empting it here.
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

/**
 * The status row's rolling readout — the panel's live channel.
 *
 * Four lines, one at a time, on a vertical roll. Not a horizontal marquee:
 * a marquee never holds a line still long enough to be read, and these are
 * facts, not texture.
 *
 * EVERY LINE IS CHECKABLE. Two are derived from the same arrays the rest of
 * the page is built from, and the other two state things this repo can be
 * inspected for. A rolling readout is exactly the place a plausible-sounding
 * uptime figure would end up if nobody wrote this down — on a site whose whole
 * argument is that the work is real, an unverifiable number in the instrument
 * panel is the most expensive kind of decoration.
 *
 * The roll is aria-hidden and a single stable line is exposed to assistive
 * tech instead: text that reorders itself four times a minute is noise to a
 * screen reader, and worse, some will announce each change.
 */
function StatusReadout({ shipped, repos }: { shipped: number; repos: number }) {
  const pad = (value: number) => String(value).padStart(2, "0");

  const lines = [
    "All builds live",
    "Source open · GitHub",
    "Edge · Cloudflare",
    `${pad(shipped)} shipped · ${pad(repos)} repos`,
  ];

  return (
    <>
      <span className="sr-only">Status: all builds live</span>
      <span
        aria-hidden="true"
        className="readout min-w-0 flex-1 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground"
      >
        <span className="readout-track">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
          {/* The repeat of line one is load-bearing, not a typo: it is what
              lets the loop close on a translate of -80% without a snap back.
              See `.readout` in globals.css. */}
          <span>{lines[0]}</span>
        </span>
      </span>
    </>
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
