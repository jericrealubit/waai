import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CaseStudyCard } from "@/components/case-study-card";
import { Section } from "@/components/ui/section";
import { CASE_STUDIES } from "@/lib/content/case-studies";

export default function FeaturedWork() {
  return (
    <Section
      id="work"
      label="Our work"
      heading="Real projects, live and open"
      description="Each of these is running in production. Every card links to the site itself and to the repository behind it — nothing here is a mockup."
      className="bg-white/40"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {CASE_STUDIES.map((study, index) => (
          <CaseStudyCard key={study.slug} study={study} index={index} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-sky-100 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
        >
          Browse all case studies
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
