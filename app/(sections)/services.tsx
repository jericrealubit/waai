import { FeatureCard } from "@/components/ui/feature-card";
import { Monitor, Zap, LineChart } from "lucide-react"; // Example icons

const services = [
  {
    title: "High-Speed Ordering",
    description:
      "Lightning-fast digital menus designed for high-volume WA restaurants.",
    icon: <Zap size={24} />,
  },
  {
    title: "Bespoke Web Design",
    description:
      "Custom-built React and Next.js sites that convert visitors into customers.",
    icon: <Monitor size={24} />,
  },
  {
    title: "AI Business Insights",
    description:
      "Advanced data visualization to help you understand your local market trends.",
    icon: <LineChart size={24} />,
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <FeatureCard
              key={i}
              index={i}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
