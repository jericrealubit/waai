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
      className="bg-slate-50/50"
    >
      <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <div
            key={service.slug}
            className="glass-card flex h-full flex-col p-8"
          >
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              {service.name}
            </h3>

            <p className="mt-4 text-3xl font-black tracking-tighter text-slate-900">
              {formatFromPrice(service)}
            </p>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
              {service.priceNote}
            </p>

            <ul className="mt-8 space-y-3">
              {service.includes.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/services/${service.slug}`}
              className="mt-8 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-bold text-slate-900 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              See what&apos;s included
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        Ongoing care is separate — see the{" "}
        <Link
          href="/#growth"
          className="font-bold text-sky-600 underline-offset-4 hover:underline"
        >
          maintenance retainer
        </Link>{" "}
        below.
      </p>
    </Section>
  );
}
