import { Clock, ShieldCheck, TrendingUp, Zap } from "lucide-react";

import { Section } from "@/components/ui/section";

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
    title: "Ongoing Maintenance",
    description:
      "Weekly security patches, software updates, and performance monitoring to keep your systems running 24/7.",
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

      <p className="mt-10 text-center text-sm font-bold text-foreground">
        From $99/month
        <span className="ml-2 font-medium text-muted-foreground">
          on top of any build
        </span>
      </p>
    </Section>
  );
}
