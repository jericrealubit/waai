export default function Portfolio() {
  const projects = [
    {
      title: "BBQ Heaven Rockingham",
      desc: "Comprehensive restaurant website featuring a digital menu and real-time ordering flow.",
      href: "#",
      image: "/images/portfolio-bbq-heaven.png",
      tags: ["Ordering System", "Next.js"],
    },
    {
      title: "Local Store Catalog",
      desc: "A streamlined product catalog designed for easy browsing and a simple checkout experience.",
      href: "#",
      image: "/images/portfolio-store.png",
      tags: ["E-commerce", "Stripe"],
    },
    {
      title: "Food Truck Menu",
      desc: "Fast, mobile-first QR-code menu layout optimized for quick outdoor service.",
      href: "#",
      image: "/images/portfolio-foodtruck.png",
      tags: ["Mobile Web", "PWA"],
    },
  ];

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="text-center mb-16">
          <span className="section-label">Our Work</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">
            Recent Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div
              key={project.title}
              className="glass-card overflow-hidden flex flex-col group"
            >
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {project.desc}
                </p>

                <a
                  href={project.href}
                  className="mt-auto inline-flex items-center text-blue-600 font-bold text-sm group/link"
                >
                  View Live Demo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
