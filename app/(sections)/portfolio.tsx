export default function Portfolio() {
  const projects = [
    {
      title: "BBQ Heaven Rockingham",
      desc: "Restaurant website with digital menu and ordering flow.",
      href: "#", // replace with real demo
      image: "/images/portfolio-bbq-heaven.png",
    },
    {
      title: "Local Store Catalog",
      desc: "Product catalog with simple checkout.",
      href: "#",
      image: "/images/portfolio-store.png",
    },
    {
      title: "Food Truck Menu",
      desc: "QR-code menu with mobile-first layout.",
      href: "#",
      image: "/images/portfolio-foodtruck.png",
    },
  ];

  return (
    <section id="portfolio" className="px-6 md:px-20 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Our Work
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col"
          >
            <div className="h-40 bg-gray-100">
              {/* Replace with next/image if you like */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                {project.desc}
              </p>
              <a
                href={project.href}
                className="mt-auto inline-flex text-brand-blue font-medium"
              >
                View Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
