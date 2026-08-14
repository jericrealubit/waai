import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/section";
import { BENCHMARK_AS_OF, SERVICES, formatFromPrice } from "@/lib/content/services";

export default function Pricing() {
  return (
    <Section
      id="pricing"
      label="Transparent pricing"
      heading="The rate card"
      description="Indicative starting prices per service line, next to what a comparable Perth agency or developer quotes for the same scope. Every line carries a flat $50/yr for hosting, domain and maintenance — a fraction of the $120–$600/yr many WA providers charge for hosting alone."
    >
      <div className="border-2 border-bitumen bg-paper">
        {SERVICES.map((service) => (
          <div
            key={service.slug}
            className="flex flex-col gap-3 border-b border-line px-6 py-6 transition-colors last:border-0 hover:bg-hivis/5 md:flex-row md:items-start md:justify-between md:gap-8 md:px-8"
          >
            <div className="md:max-w-[60ch]">
              <h3 className="font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-foreground md:text-3xl">
                <Link
                  href={`/services/${service.slug}`}
                  className="focus-ring transition-colors hover:text-hivis-text"
                >
                  {service.name}
                </Link>
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.priceNote}.{" "}
                <Link
                  href={`/services/${service.slug}`}
                  className="focus-ring inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-source transition-colors hover:text-hivis-text"
                >
                  What&apos;s included
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>

              {/* The Perth-market price you don't pay — struck, so the saving
                  reads at a glance. Figures verified in lib/content/services.ts. */}
              <p className="mt-2.5 font-mono text-[11px] tracking-wide text-foreground-subtle">
                Perth market:{" "}
                <span className="font-bold text-muted-foreground line-through decoration-hivis/70 decoration-2">
                  {service.marketBenchmark}
                </span>
              </p>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <div className="font-mono text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                {formatFromPrice(service)}
              </div>
              {service.yearlyCost && (
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-hivis-text">
                  + ${service.yearlyCost.amount}/yr
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dates the struck market figures above so they read as a point-in-time
          comparison, not an evergreen fact. Sourced from BENCHMARK_AS_OF. */}
      <p className="mt-3 font-mono text-[11px] tracking-wide text-foreground-subtle md:text-center">
        Perth-market figures benchmarked {BENCHMARK_AS_OF} — indicative, and a
        point-in-time comparison.
      </p>

      <p className="mt-8 text-sm text-muted-foreground md:text-center">
        Ongoing care is separate — see the{" "}
        <Link
          href="/#growth"
          className="font-bold text-source underline-offset-4 hover:underline"
        >
          maintenance retainer
        </Link>{" "}
        below.
      </p>
    </Section>
  );
}
