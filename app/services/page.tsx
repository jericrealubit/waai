import type { Metadata } from "next";

import { ServiceCard } from "@/components/service-card";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/content/services";
import { OG_IMAGES } from "@/lib/og";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Four service lines for Western Australian businesses: tradie websites, restaurant ordering systems, manufacturing log automation and ecommerce builds.",
  path: "/services",
  image: OG_IMAGES.services,
  ogDescription:
    "Tradie websites, restaurant ordering, manufacturing log automation and ecommerce — each backed by live work.",
});

export default function ServicesIndexPage() {
  return (
    <Section
      label="Services"
      heading="What we build"
      description="Four service lines, each one backed by projects you can open in a browser and read on GitHub."
    >
      <div className="grid gap-8 md:grid-cols-2">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.slug} service={service} index={index} />
        ))}
      </div>
    </Section>
  );
}
