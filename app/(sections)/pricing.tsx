import Link from "next/link";
import { Check } from "lucide-react";

import { Section } from "@/components/ui/section";
import { SERVICES, formatFromPrice } from "@/lib/content/services";

export default function Pricing() {
  return (
    <Section
      id="pricing"
      label="Transparent pricing"
      heading="What a build starts at"
      description="Indicative starting prices per service line. Scope moves the number — we quote properly once we know what you need."
      className="bg-transparent/50"
    >
      <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <div
            key={service.slug}
            className="glass-card flex h-full flex-col p-8"
          >
            <h3 className="text-lg font-black tracking-tight text-foreground">
              {service.name}
            </h3>

            <p className="mt-4 text-3xl font-black tracking-tighter text-foreground">
              {formatFromPrice(service)}
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              {service.priceNote}
            </p>
            {service.yearlyCost && (
              <p className="mt-1 text-sm font-bold text-cyber-cyan-soft">
                + ${service.yearlyCost.amount}/year{" "}
                <span className="font-medium text-muted-foreground">
                  {service.yearlyCost.note.replace(/^per year /, "")}
                </span>
              </p>
            )}

            <ul className="mt-8 space-y-3">
              {service.includes.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyber-cyan-soft" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/services/${service.slug}`}
              className="btn-glass mt-8 w-full px-5 py-3 focus-ring"
            >
              See what&apos;s included
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Ongoing care is separate — see the{" "}
        <Link
          href="/#growth"
          className="font-bold text-cyber-cyan-soft underline-offset-4 hover:underline"
        >
          maintenance retainer
        </Link>{" "}
        below.
      </p>
    </Section>
  );
}
