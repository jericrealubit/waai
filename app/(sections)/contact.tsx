export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:pr-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-[1.1]">
              Ready to <span className="text-blue-600">Scale</span> Your
              Business?
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-md">
              Whether you need a simple menu or a full AI-integrated ordering
              system, we provide clear plans and local WA expertise.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
              {[
                {
                  label: "Phone",
                  value: "+61 491 098 073",
                  href: "tel:+61491098073",
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                },
                {
                  label: "Email",
                  value: "hello@waai.au",
                  href: "mailto:hello@waai.au",
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                },
                {
                  label: "Location",
                  value: "Waikiki, WA 6169",
                  href: "#",
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter opacity-50">
                      {item.label}
                    </h4>
                    <a
                      href={item.href}
                      className="text-slate-700 font-semibold text-lg hover:text-blue-600 transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Form Shadow/Glow Effect */}
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] -z-10 rounded-full" />

            <div className="bg-white border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2rem] p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Waikiki Cafe"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@business.com.au"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Interested In
                  </label>
                  <div className="relative">
                    <select className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all">
                      <option>Restaurant Menu Website</option>
                      <option>Menu + Ordering System</option>
                      <option>E-commerce Store</option>
                      <option>Monthly AI Automation</option>
                      <option>Custom Digital Solution</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe your vision..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Get My Free Plan
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
