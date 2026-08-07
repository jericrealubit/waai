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
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-sky-600 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          All services
        </Link>

        <div className="max-w-3xl">
          <span className="section-label">{service.shortName}</span>
          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
            {service.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {service.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {formatFromPrice(service)}
            </span>
            <span className="text-sm text-slate-500">{service.priceNote}</span>
          </div>
        </div>
      </Section>

      <Section className="py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-8 md:p-10">
            <h2 className="mb-6 text-xl font-black tracking-tight text-slate-900">
              What a build includes
            </h2>
            <ul className="space-y-4">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 md:p-10">
            <h2 className="mb-2 text-xl font-black tracking-tight text-slate-900">
              Also available
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Capabilities we build on request. They aren&apos;t part of every
              project below — where a case study doesn&apos;t use one, it says so.
            </p>
            <ul className="space-y-4">
              {service.alsoAvailable.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-600">
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="mb-2 text-sm font-black tracking-tight text-slate-900">
                Best for
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
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
          className="bg-white/40"
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
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Want one of these?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tell us the business and we&apos;ll tell you what it takes.
            </p>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-sky-100 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
          >
            Start a project
          </Link>
        </div>
      </Section>
    </>
  );
}
