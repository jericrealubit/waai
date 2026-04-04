const services = [
  {
    title: "Restaurant Systems",
    desc: "Fast, mobile-first digital menus with instant ordering and payments.",
    icon: "🍔",
  },
  {
    title: "Online Ordering",
    desc: "Pickup, delivery, or table service with reliable, real-time flows.",
    icon: "📲",
  },
  {
    title: "Storefronts",
    desc: "Product catalogs and catalogs designed for high conversion.",
    icon: "🛍️",
  },
  {
    title: "Growth & Care",
    desc: "Strategic marketing, SEO, and ongoing technical maintenance.",
    icon: "📈",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <h2 className="text-center text-3xl font-bold mb-16">What We Build</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
