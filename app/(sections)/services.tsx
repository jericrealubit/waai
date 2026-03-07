export default function Services() {
  const services = [
    {
      title: "Restaurant Menu Websites",
      desc: "Beautiful, mobile-friendly digital menus with categories, pricing, and images.",
    },
    {
      title: "Online Ordering Systems",
      desc: "Pickup, delivery, or table service with simple, reliable ordering flows.",
    },
    {
      title: "Store Websites & Catalogs",
      desc: "Product listings, inventory display, and streamlined checkout experiences.",
    },
  ];

  return (
    <section id="services" className="bg-gray-50 px-6 md:px-20 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        What We Build
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm md:text-base">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
