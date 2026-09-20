import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/ui/section";
import { SpecCell } from "@/components/ui/spec-cell";
import { ABOUT } from "@/lib/content/about";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { breadcrumbLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `${ABOUT.name} builds websites and small business systems for Western Australian trades, kitchens and workshops. Every project is live and every repository is public.`,
  path: "/about",
});

export default function AboutPage() {
  const shipped = CASE_STUDIES.length;

  return (
    <>
      {/* Person, linked to the Organization's `founder` so the two schemas
          describe one practice rather than two unrelated entities. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": absoluteUrl("/about#person"),
          name: ABOUT.name,
          jobTitle: ABOUT.role,
          worksFor: { "@id": `${SITE.url}/#organization` },
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.locality,
            addressRegion: SITE.region,
            addressCountry: SITE.country,
          },
          sameAs: [...SITE.sameAs],
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: "About", path: "/about" }])} />

      <Section size="page">
        <div className="max-w-3xl">
          <span className="section-label">Who you&apos;re dealing with</span>
          <h1 className="mt-3 font-display text-display-1 font-extrabold uppercase text-foreground">
            {ABOUT.name}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground-subtle">
            {ABOUT.role} · {ABOUT.location}
          </p>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {ABOUT.intro}
          </p>
        </div>

        {/* The same title-block the hero uses, so the page reads as another
            sheet in the same set. */}
        <div className="mt-10 max-w-3xl border-2 border-bitumen bg-paper shadow-e2">
          <div className="flex items-center justify-between border-b-2 border-bitumen px-3.5 py-2.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              Drawing No. WAAI-01
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-subtle">
              Personnel
            </span>
          </div>
          <div className="grid sm:grid-cols-2">
            {ABOUT.facts.map((fact, index) => (
              <SpecCell
                key={fact.label}
                label={fact.label}
                value={fact.value}
                className={`border-b border-line ${index % 2 === 1 ? "sm:border-l" : ""}`}
              />
            ))}
          </div>
          <div className="px-3.5 py-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              {String(shipped).padStart(2, "0")} projects shipped · all live,
              all source open
            </span>
          </div>
        </div>
      </Section>

      <Section size="tight">
        <div className="max-w-[68ch] space-y-5">
          {ABOUT.body.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-[1.7] text-muted-foreground md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        label="How I work"
        heading="Four things I hold to"
        description="Each one is checkable against this site rather than a promise about attitude."
        className="bg-cement/30"
      >
        <div className="grid gap-px border-2 border-bitumen bg-line md:grid-cols-2">
          {ABOUT.principles.map((principle) => (
            <div key={principle.title} className="bg-paper p-6 md:p-8">
              <h2 className="font-display text-display-3 font-extrabold uppercase text-foreground">
                {principle.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section size="tight">
        <div className="glass-card px-7 py-10 text-left md:px-14 md:py-12 md:text-center">
          <h2 className="font-display text-display-3 font-extrabold uppercase text-foreground">
            Want to talk about a job?
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-[1.65] text-muted-foreground md:mx-auto">
            Tell me what the business does and what you need. You&apos;ll get a
            written plan and a fixed price within one business day — no charge,
            no obligation, and no call required unless you want one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:justify-center">
            <Link href="/#contact" className="btn-primary focus-ring w-full sm:w-auto">
              Start a build
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/work" className="btn-glass focus-ring w-full sm:w-auto">
              Inspect the work
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
