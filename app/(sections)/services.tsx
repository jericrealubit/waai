import { ServiceCard } from "@/components/service-card";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/content/services";

export default function ServicesSection() {
  return (
    <Section
      id="services"
      label="What we build"
      heading="Four things we do properly"
      description="Every one of them is backed by work you can open in a browser and read on GitHub."
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.slug} service={service} index={index} />
        ))}
      </div>
    </Section>
  );
}
