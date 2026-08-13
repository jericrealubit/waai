import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CaseStudyCard } from "@/components/case-study-card";
import { Section } from "@/components/ui/section";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SERVICES } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Our work | WA AI Digital",
  description:
    "Five shipped projects across tradie websites, restaurant ordering, manufacturing log automation and ecommerce — each with a live site and a public repository.",
  openGraph: {
    title: "Our work | WA AI Digital",
    description:
      "Five shipped projects, each with a live site and a public GitHub repository.",
    url: "https://waai.au/work",
    siteName: "WA AI Digital",
    locale: "en_AU",
    type: "website",
  },
};

export default function WorkIndexPage() {
  /* Grouped once, up front, so the jump chips and the sections below are
     driven by the same array. Counting in two places is how a nav that says
     "3" ends up sitting above two cards. */
  const groups = SERVICES.map((service) => ({
    service,
    studies: CASE_STUDIES.filter((study) => study.service === service.slug),
  })).filter((group) => group.studies.length > 0);

  return (
    <>
      <Section
        size="page"
        headingLevel={1}
        label="Our work"
        heading="Everything we've shipped"
        description="Every project below opens the live site and the code behind it. No mockups, no stock screenshots — go and click around the real thing."
        actions={groups.map(({ service, studies }) => (
          <a
            key={service.slug}
            href={`#${service.slug}`}
            className="chip-link focus-ring"
          >
            {service.shortName}
            <span className="chip-count">{studies.length}</span>
          </a>
        ))}
      />

      {groups.map(({ service, studies }) => (
        <Section
          key={service.slug}
          id={service.slug}
          size="tight"
          className="scroll-target"
        >
          {/* The rule and the count are load-bearing, not trim: on a long
              index the eye needs a hard edge to know a new group started,
              and the count sets an expectation before the cards load in. */}
          <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-border pb-4">
            <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
              {service.name}
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-subtle">
              {studies.length} {studies.length === 1 ? "build" : "builds"}
            </span>
            <Link
              href={`/services/${service.slug}`}
              className="focus-ring inline-flex w-full md:ml-auto md:w-auto items-center gap-1.5 rounded text-sm font-bold text-cyber-cyan-soft hover:text-cyber-cyan-bright"
            >
              What&apos;s included
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {studies.map((study, index) => (
              <CaseStudyCard key={study.slug} study={study} index={index} />
            ))}
          </div>
        </Section>
      ))}

      {/* A prospect who scrolls the whole index has already decided. Ending on
          the last card and dropping them into the footer wastes that. */}
      <Section size="tight" className="pb-24">
        <div className="glass-card px-7 py-10 text-left md:px-14 md:py-14 md:text-center">
          <h2 className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
            Want one of these for your business?
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-[1.65] text-muted-foreground md:mx-auto md:text-lg">
            Tell us what you&apos;re trying to fix — quotes going unanswered,
            phone orders eating your evenings, paper job sheets piling up. We
            will tell you what it takes and what it costs before you commit to
            anything.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:justify-center">
            <Link
              href="/#contact"
              className="btn-primary focus-ring w-full sm:w-auto"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+61491098073"
              className="btn-glass focus-ring w-full sm:w-auto"
            >
              Call 0491 098 073
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
