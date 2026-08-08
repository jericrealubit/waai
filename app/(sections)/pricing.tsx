const pricingPlans = [
  {
    name: "Starter",
    price: "299",
    description:
      "Perfect for local cafes needing a professional digital presence.",
    features: [
      "1-Page Custom Site",
      "Digital Menu QR Code",
      "Mobile-First Design",
      "SSL Security",
    ],
    highlight: false,
  },
  {
    name: "Full System",
    price: "599",
    description: "The complete setup for restaurants ready to take orders.",
    features: [
      "Full Online Ordering",
      "Payment Integration",
      "Admin Dashboard",
      "Order Notifications",
    ],
    highlight: false,
  },
  {
    name: "Business",
    price: "899",
    description: "Advanced solution for retailers with multiple products.",
    features: [
      "Multi-page Website",
      "Full Product Catalog",
      "Advanced SEO Setup",
      "Google Maps Integration",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "99",
    suffix: "/mo",
    description: "Strategic care to keep your business growing and secure.",
    features: [
      "Weekly Content Updates",
      "SEO Performance Reports",
      "Priority Tech Support",
      "Security & Speed Care",
    ],
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="text-center mb-16">
          <span className="section-label">Transparent Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">
            Choose Your Start Point
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Simple, upfront costs with no hidden fees. All plans are scalable as
            your business evolves.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-8 flex flex-col h-full relative ${
                plan.highlight
                  ? "border-blue-500 shadow-blue-500/10 ring-1 ring-blue-500"
                  : ""
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">$</span>
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {plan.price}
                </span>
                {plan.suffix && (
                  <span className="text-slate-500 font-medium">
                    {plan.suffix}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm text-slate-600 flex items-start gap-3"
                  >
                    <div className="mt-1 bg-blue-50 rounded-full p-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={
                  plan.highlight
                    ? "btn-primary w-full text-sm"
                    : "w-full py-3 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors text-slate-700"
                }
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
