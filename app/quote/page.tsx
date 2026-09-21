import type { Metadata } from "next";

import { Docket } from "@/components/docket/docket";
import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/ui/section";
import { breadcrumbLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get a price",
  description:
    "Configure the job and see the fixed price before you give us anything. Every figure comes straight off the published rate card.",
  path: "/quote",
  ogTitle: "Get a price | WA AI Digital",
});

/**
 * The quote docket.
 *
 * Its own route rather than another landing section: it can be linked from a
 * case study, shared, indexed and pointed at from an ad, and the home page is
 * already seven sections long. The header CTA points here.
 */
export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Get a price", path: "/quote" }])} />

      <Section
        size="page"
        label="Works order"
        heading="Price the job yourself"
        description="Four questions. The estimate fills in as you answer, and it comes straight off the same rate card that's published on this site — no discovery call needed to find out what something costs."
        centered={false}
      >
        <Docket />
      </Section>
    </>
  );
}
