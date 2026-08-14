import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Plus } from "lucide-react";

import { CaseStudyCard } from "@/components/case-study-card";
import { Section } from "@/components/ui/section";
import { getCaseStudiesForService } from "@/lib/content/case-studies";
import { SERVICES, formatFromPrice, getService } from "@/lib/content/services";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return { title: "Not found | WA AI Digital" };

  const title = `${service.name} | WA AI Digital`;

  return {
    title,
    description: service.valueProp,
    openGraph: {
      title,
      description: service.valueProp,
      url: `https://waai.au/services/${service.slug}`,
      siteName: "WA AI Digital",
      locale: "en_AU",
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const studies = getCaseStudiesForService(service.slug);

  return (
    <>
      <Section className="pb-12">
        <Link
          href="/services"
          className="focus-ring mb-8 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground-subtle transition-colors hover:text-hivis-text"
        >
          <ArrowLeft className="h-4 w-4" />
          All services
        </Link>

        <div className="max-w-3xl">
          <span className="section-label">{service.shortName}</span>
          <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight text-foreground md:text-7xl">
            {service.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {service.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {formatFromPrice(service)}
            </span>
            <span className="text-sm text-muted-foreground">{service.priceNote}</span>
          </div>
          {service.yearlyCost && (
            <p className="mt-2 font-mono text-sm font-bold text-hivis-text">
              + ${service.yearlyCost.amount}/year{" "}
              <span className="font-medium text-muted-foreground">
                {service.yearlyCost.note.replace(/^per year /, "")}
              </span>
            </p>
          )}
        </div>
      </Section>

      <Section className="py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-8 md:p-10">
            <h2 className="mb-6 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
              What a build includes
            </h2>
            <ul className="space-y-4">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-hivis" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 md:p-10">
            <h2 className="mb-2 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
              Also available
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Capabilities we build on request. They aren&apos;t part of every
              project below — where a case study doesn&apos;t use one, it says so.
            </p>
            <ul className="space-y-4">
              {service.alsoAvailable.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-foreground-subtle" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-line pt-6">
              <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                Best for
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.bestFor}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {studies.length > 0 && (
        <Section
          label="Proof"
          heading={studies.length === 1 ? "The case study" : "The case studies"}
          description="Live sites and public repositories, not mockups."
          className="bg-cement/30"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {studies.map((study, index) => (
              <CaseStudyCard key={study.slug} study={study} index={index} />
            ))}
          </div>
        </Section>
      )}

      <Section className="py-12">
        <div className="glass-card flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
              Want one of these?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us the business and we&apos;ll tell you what it takes.
            </p>
          </div>
          <Link
            href="/#contact"
            className="btn-primary focus-ring shrink-0"
          >
            Start a project
          </Link>
        </div>
      </Section>
    </>
  );
}
