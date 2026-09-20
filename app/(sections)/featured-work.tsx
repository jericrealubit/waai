import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CaseStudyCard } from "@/components/case-study-card";
import { TestimonialCard } from "@/components/testimonial";
import { Section } from "@/components/ui/section";
import { CASE_STUDIES } from "@/lib/content/case-studies";

export default function FeaturedWork() {
  // The first two case studies carrying an approved quote. Two, because a
  // single testimonial on a wide row reads as the only one we could get.
  const testimonials = CASE_STUDIES.filter((study) => study.testimonial).slice(
    0,
    2,
  );

  return (
    <Section
      id="work"
      label="Our work"
      heading="Real projects, live and open"
      description="Each of these is running in production. Every card links to the site itself and to the repository behind it — nothing here is a mockup."
      className="bg-cement/30"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {CASE_STUDIES.map((study, index) => (
          <CaseStudyCard key={study.slug} study={study} index={index} />
        ))}
      </div>

      {/* Approved client quotes, shown inside this section rather than as a new
          landing section — the section ids here are the header nav's contract
          (see CLAUDE.md), and this page is already seven sections long.
          Renders nothing until a client has signed off on a quote. */}
      {testimonials.length > 0 && (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((study) => (
            <TestimonialCard key={study.slug} testimonial={study.testimonial} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/work"
          className="btn-primary focus-ring"
        >
          Browse all case studies
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
