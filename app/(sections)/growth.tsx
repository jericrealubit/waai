import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, TrendingUp, Zap } from "lucide-react";

import { Section } from "@/components/ui/section";
import { CARE_PLAN_MONTHLY } from "@/lib/content/services";

const features = [
  {
    title: "Strategic Marketing",
    description:
      "Data-driven campaigns designed to increase your local reach and drive high-intent traffic to your new systems.",
    icon: TrendingUp,
  },
  {
    title: "SEO Optimization",
    description:
      "Continuous fine-tuning to ensure your business stays at the top of search results in Western Australia.",
    icon: Zap,
  },
  {
    title: "Content & Updates",
    description:
      "Price changes, new service pages, menu updates — sent through and live the same week, without you touching the code.",
    icon: ShieldCheck,
  },
  {
    title: "Technical Support",
    description:
      "Priority access to our team for updates, changes, or troubleshooting whenever you need a hand.",
    icon: Clock,
  },
];

/**
 * Supporting retainer band — deliberately not a fifth service card, because
 * unlike the four build lines it has no case study standing behind it.
 */
export default function Growth() {
  return (
    <Section
      id="growth"
      label="After launch"
      heading="Digital Growth & Maintenance"
      description="Building the site is just the beginning. We provide the strategic marketing and technical care needed to scale your business."
      className="bg-transparent"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="glass-card p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center bg-hivis/10 text-hivis">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 font-display text-xl font-extrabold uppercase tracking-tight text-foreground">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* ${CARE_PLAN_MONTHLY} is the same figure baked into every monthly
          build plan on the rate card — the two must not drift apart, which is
          why this reads it from the data rather than hardcoding a number. */}
      <div className="mt-10 text-center">
        <p className="text-sm font-bold text-foreground">
          ${CARE_PLAN_MONTHLY}/month
          <span className="ml-2 font-medium text-muted-foreground">
            on top of a build you bought outright — already included if
            you&apos;re on a monthly plan
          </span>
        </p>
        <Link
          href="/#pricing"
          className="focus-ring mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-source transition-colors hover:text-hivis-text"
        >
          See the rate card
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Section>
  );
}
