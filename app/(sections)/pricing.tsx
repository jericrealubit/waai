export default function Pricing() {
  const tiers = [
    {
      name: "Starter Website",
      price: "From $299",
      features: ["1-page site", "Digital menu", "Mobile-friendly layout"],
    },
    {
      name: "Menu + Ordering",
      price: "From $599",
      features: ["Menu system", "Online ordering", "Payment integration"],
      highlighted: true,
    },
    {
      name: "Business Website",
      price: "From $899",
      features: ["Multi-page site", "Product catalog", "Basic SEO setup"],
    },
  ];

  return (
    <section id="pricing" className="bg-gray-50 px-6 md:px-20 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Simple, Transparent Pricing
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Choose a starting point that fits your business. Custom quotes
        available.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl border bg-white p-6 shadow-sm flex flex-col ${
              tier.highlighted ? "border-brand-blue shadow-md" : ""
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
            <p className="text-2xl font-bold mb-4">{tier.price}</p>

            <ul className="space-y-2 mb-6 text-gray-600 text-sm md:text-base">
              {tier.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <button className="mt-auto w-full bg-brand-blue text-white py-2.5 rounded-lg">
              Select
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
