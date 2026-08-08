import type { Metadata } from "next";

import { ServiceCard } from "@/components/service-card";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services | WA AI Digital",
  description:
    "Four service lines for Western Australian businesses: tradie websites, restaurant ordering systems, manufacturing log automation and ecommerce builds.",
  openGraph: {
    title: "Services | WA AI Digital",
    description:
      "Tradie websites, restaurant ordering, manufacturing log automation and ecommerce — each backed by live work.",
    url: "https://waai.au/services",
    siteName: "WA AI Digital",
    locale: "en_AU",
    type: "website",
  },
};

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
