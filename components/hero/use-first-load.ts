"use client";

import { useEffect, useState } from "react";

/**
 * True only for the first mount of this JS context.
 *
 * The hero's entrance is a "this is assembling for the first time" gesture. The
 * home page is reachable from the header wordmark and from every /services and
 * /work page, so without this the full 1.2s assembly — including the count-up,
 * the most attention-grabbing part — replays on every client-side navigation
 * back. By the third visit that reads as the page being slow, not as polish.
 *
 * Module scope rather than sessionStorage on purpose: this resets exactly when
 * the JS context does, i.e. on a real navigation or a reload, which is the
 * wanted semantics. sessionStorage survives a hard refresh, so a visitor who
 * deliberately reloaded would get a dead hero — and it needs a try/catch for
 * private mode, which a module variable does not.
 *
 * Hydration-safe by construction: the flag is false in the server's module
 * instance AND false in the client's fresh one, so the first client render
 * computes the same `true` on both sides. Later SPA mounts have no SSR pass to
 * mismatch against.
 */
let hasPlayed = false;

export function useFirstLoad(): boolean {
  const [isFirst] = useState(() => !hasPlayed);

  /*
   * The flag flips in an EFFECT, not in the state initialiser.
   *
   * Two components call this — the title-block and the hazard rule — and they
   * have to agree. Flipping it during the initialiser meant whichever rendered
   * first claimed the entrance and the other read `false` and rendered at rest,
   * so the rule silently never drew. Deferring to an effect lets everything
   * mounting in the same first render pass see the same answer.
   */
  useEffect(() => {
    hasPlayed = true;
  }, []);

  return isFirst;
}
