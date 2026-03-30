import { ShieldCheck, TrendingUp, Zap, Clock } from "lucide-react";

export default function Growth() {
  const features = [
    {
      title: "Strategic Marketing",
      description:
        "Data-driven campaigns designed to increase your local reach and drive high-intent traffic to your new systems.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "SEO Optimization",
      description:
        "Continuous fine-tuning to ensure your business stays at the top of search results in Western Australia.",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Ongoing Maintenance",
      description:
        "Weekly security patches, software updates, and performance monitoring to keep your systems running 24/7.",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Technical Support",
      description:
        "Priority access to our team for updates, changes, or troubleshooting whenever you need a hand.",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <section id="growth" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Digital Growth & Maintenance
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Building the site is just the beginning. We provide the strategic
            marketing and technical care needed to scale your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
