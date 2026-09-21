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
    <section className="px-6 pt-10 md:px-20 md:pt-16">
      <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-hivis shadow-[0_0_0_4px_color-mix(in_srgb,var(--hivis)_24%,transparent)]"
            />
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
          first load; see components/hero/hazard-rule.tsx. */}
      <HazardRule />
    </section>
  );
}
