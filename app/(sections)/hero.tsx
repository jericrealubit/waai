import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HazardRule } from "@/components/hero/hazard-rule";
import { TitleBlock } from "@/components/hero/title-block";
import { CASE_STUDIES } from "@/lib/content/case-studies";

export default function Hero() {
  // Live counts, derived from the data so the title-block can't drift from
  // what's actually shipped. Repos include each case study's secondary build.
  const shipped = CASE_STUDIES.length;
  const repos = CASE_STUDIES.reduce(
    (n, s) => n + 1 + (s.secondaryLink ? 1 : 0),
    0,
  );

  return (
    // No `min-h-screen`: layout pads `main` with pt-24/32 to clear the fixed
    // header, so a full-viewport hero would push the first section off-screen.
    //
    // `isolate` scopes the survey sweep's z-index to this section, so the one
    // decorative layer below can sit at z-0 without reasoning about the fixed
    // header (z-50) or the body's blueprint grid.
    <section className="relative isolate px-6 pt-10 md:px-20 md:pt-16">
      {/* The survey head tracking across the sheet — the hero's one ambient
          loop, and pure CSS, so the LCP column stays free of client JS. See
          `.hero-scan` and the HERO AMBIENT note in app/globals.css. */}
      <div className="hero-scan" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
        <div>
          <div className="mb-5 flex items-center gap-3">
            {/* The site's live mark. Shared with the title-block's status row,
                so "this is transmitting" is one object, not two lookalikes. */}
            <span aria-hidden="true" className="beacon h-2.5 w-2.5" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground-subtle">
              WA AI Digital — Perth, Western Australia
            </span>
          </div>

          <h1 className="font-display text-display-1 font-extrabold uppercase text-foreground">
            No mockups. Every build is{" "}
            <span className="text-hivis">live</span>, the code is{" "}
            <span className="text-source">public</span>.
          </h1>

          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            Trade websites, restaurant ordering, factory-floor logging and
            ecommerce — for Western Australian businesses.{" "}
            <span className="font-semibold text-foreground">
              Every project on this site opens the real thing running in
              production, and the source it&apos;s built from.
            </span>{" "}
            Click around. Read the code.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#contact" className="btn-primary focus-ring">
              Start a build
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/work" className="btn-glass focus-ring">
              Inspect the work
            </Link>
          </div>
        </div>

        {/* The engineering title-block. A client leaf: the server still paints
            the frame, the borders and the labels — only the entries animate in.
            Counts stay derived here so they are correct without JavaScript. */}
        <TitleBlock shipped={shipped} repos={repos} />

      </div>

      {/* The one signature accent — used exactly once, here. Draws across on
          first load, then runs continuously; see
          components/hero/hazard-rule.tsx. */}
      <HazardRule />
    </section>
  );
}
