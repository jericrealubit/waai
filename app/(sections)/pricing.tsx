import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import {
  CARE_PLAN_MONTHLY,
  SERVICES,
  TERM_MONTHS,
  formatTierPrice,
} from "@/lib/content/services";

export default function Pricing() {
  return (
    <Section
      id="pricing"
      label="Transparent pricing"
      heading="The rate card"
      description="Three fixed sizes per service line — pick one, or pay it monthly. Every price on this page is what the build costs, not a starting point that moves once we talk. Hosting, domain and security patches are a flat $50/yr on top."
    >
      <div className="space-y-10">
        {SERVICES.map((service, index) => (
          <Reveal
            key={service.slug}
            index={index}
            className="border-2 border-bitumen bg-paper shadow-e1"
          >
            <div className="flex flex-col gap-2 border-b-2 border-bitumen px-6 py-5 md:flex-row md:items-baseline md:justify-between md:px-8">
              <h3 className="font-display text-display-3 font-extrabold uppercase text-foreground">
                <Link
                  href={`/services/${service.slug}`}
                  className="focus-ring transition-colors hover:text-hivis-text"
                >
                  {service.name}
                </Link>
              </h3>

              <Link
                href={`/services/${service.slug}`}
                className="focus-ring inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-source transition-colors hover:text-hivis-text"
              >
                What&apos;s included
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Three columns on desktop, stacked on phones. Each tier is a
                product with a name, not a point inside a range — a range
                anchors every conversation at its lower bound. */}
            <div className="grid md:grid-cols-3">
              {service.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex flex-col gap-3 border-b border-line px-6 py-6 transition-colors last:border-b-0 hover:bg-hivis/5 md:border-b-0 md:border-r md:px-7 md:last:border-r-0"
                >
                  <h4 className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
                    {tier.name}
                  </h4>

                  <div>
                    <div className="font-mono text-2xl font-bold tabular-nums text-foreground">
                      {formatTierPrice(tier)}
                    </div>
                    {tier.monthly !== null && (
                      <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-hivis-text">
                        or ${tier.monthly}/mo
                      </div>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tier.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* What the build displaces, stated as fact — not a competitor's
                price. See the NOTE ON PRICING in lib/content/services.ts. */}
            <p className="border-t border-line px-6 py-4 text-sm leading-relaxed text-foreground-subtle md:px-8">
              {service.replaces}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Terms were absent from the site entirely. For a cash-poor trade, a
          four-figure number with no terms attached is the whole objection. */}
      <div className="mt-10 border-2 border-bitumen bg-cement/40 px-6 py-7 md:px-8">
        <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-foreground">
          Two ways to pay
        </h3>
        <dl className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <dt className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              Outright
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Half to start, half on launch. Then ${CARE_PLAN_MONTHLY}/month
              for the care plan if you want it, or just the $50/yr to keep it
              online if you don&apos;t.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              Monthly
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Nothing upfront, {TERM_MONTHS} months minimum. Hosting, domain,
              security patches and the care plan are all in the monthly price.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              You own it either way
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The repository and the deploy pipeline are yours on day one. Leave
              a monthly plan early and you settle what&apos;s left of the build
              — the site is never switched off or held over you.
            </dd>
          </div>
        </dl>
      </div>

      {/* The highest-intent section on the site used to end here with no way
          to act on it. Mirrors the closing band on app/work/page.tsx. */}
      <div className="glass-card mt-10 px-7 py-10 text-left md:px-14 md:py-12 md:text-center">
        <h3 className="font-display text-display-3 font-extrabold uppercase text-foreground">
          Not sure which one you need?
        </h3>
        <p className="mt-4 max-w-[54ch] text-base leading-[1.65] text-muted-foreground md:mx-auto">
          Tell us the business and we&apos;ll tell you which tier it is and what
          it takes — before you commit to anything.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:justify-center">
          <Link href="/#contact" className="btn-primary focus-ring w-full sm:w-auto">
            Start a build
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
  );
}
