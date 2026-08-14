import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl">
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

        {/* Engineering title-block — real metadata, like the corner of a
            drawing. The stamp turns "live + source" into the signature mark. */}
        <aside
          className="border-2 border-bitumen bg-paper shadow-e2"
          aria-label="Firm summary"
        >
          <div className="flex items-center justify-between border-b-2 border-bitumen px-3.5 py-2.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              Drawing No. WAAI-00
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-subtle">
              Rev. 2026
            </span>
          </div>
          <div className="grid grid-cols-2">
            <TbCell k="Firm" v="WA AI Digital" />
            <TbCell k="Base" v="Perth, WA" border />
            <TbCell k="Projects shipped" v={String(shipped).padStart(2, "0")} />
            <TbCell k="Public repos" v={String(repos).padStart(2, "0")} border />
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse rounded-full bg-hivis"
            />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              Status: all builds live
            </span>
          </div>
          <div className="flex justify-center pb-6 pt-1">
            <span
              className="stamp"
              role="img"
              aria-label="Field verified: live and source open"
            >
              <span className="block text-sm font-bold tracking-widest">
                ◱ Field-Verified
              </span>
              <span className="mt-0.5 block text-[9px] tracking-[0.2em]">
                Live + Source · WA
              </span>
            </span>
          </div>
        </aside>
      </div>

      {/* The one signature accent — used exactly once, here. */}
      <div className="hazard-rule mt-14" aria-hidden="true" />
    </section>
  );
}

function TbCell({
  k,
  v,
  border,
}: {
  k: string;
  v: string;
  border?: boolean;
}) {
  return (
    <div
      className={`border-b border-line px-3.5 py-3 ${border ? "border-l border-line" : ""}`}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
        {k}
      </div>
      <div className="mt-1 font-display text-xl font-extrabold uppercase leading-none tracking-tight text-foreground">
        {v}
      </div>
    </div>
  );
}
