import type { Metadata } from "next";

import { CaseStudyCard } from "@/components/case-study-card";
import { Section } from "@/components/ui/section";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SERVICES } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Our work | WA AI Digital",
  description:
    "Six shipped projects across tradie websites, restaurant ordering, manufacturing log automation and ecommerce — each with a live site and a public repository.",
  openGraph: {
    title: "Our work | WA AI Digital",
    description:
      "Six shipped projects, each with a live site and a public GitHub repository.",
    url: "https://waai.au/work",
    siteName: "WA AI Digital",
    locale: "en_AU",
    type: "website",
  },
};

export default function WorkIndexPage() {
  return (
    <>
      <Section
        label="Our work"
        heading="Everything we've shipped"
        description="Grouped by service line. Every project links to the live site and to the repository behind it."
        className="pb-8"
      />

      {SERVICES.map((service) => {
        const studies = CASE_STUDIES.filter(
          (study) => study.service === service.slug,
        );
        if (studies.length === 0) return null;

        return (
          <Section key={service.slug} id={service.slug} className="py-12">
            <h2 className="mb-8 text-2xl font-black tracking-tight text-slate-900">
              {service.name}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, index) => (
                <CaseStudyCard key={study.slug} study={study} index={index} />
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
