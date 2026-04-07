import Image from "next/image";

export function Header() {
  return (
    // Updated: h-24 for more breathing room, removed border-b, added padding for the "floating" effect
    <header className="fixed top-0 w-full z-50 px-6 py-4 md:px-20">
      {/* Updated: Floating pill-style container with 3xl rounding, soft shadow, and horizon-style glass effect */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 px-6 py-3 md:px-8 rounded-[2rem] shadow-[0_8px_32px_-6px_rgba(0,0,0,0.04)]">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/android-chrome-192x192.png"
            alt="WA AI Digital Logo"
            width={32}
            height={32}
            className="hover:rotate-12 transition-transform duration-300"
          />
          <span className="font-black text-xl tracking-tighter text-slate-900">
            WA AI <span className="text-sky-600">Digital</span>
          </span>
        </div>

        {/* Navigation - Updated: text-slate-600 and sky-600 for hover to match the horizon theme */}
        <nav className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-wider text-slate-500">
          <a href="#services" className="hover:text-sky-600 transition-colors">
            Websites
          </a>
          <a href="#growth" className="hover:text-sky-600 transition-colors">
            Growth & Maintenance
          </a>
          <a href="#portfolio" className="hover:text-sky-600 transition-colors">
            Our Work
          </a>
          <a href="#pricing" className="hover:text-sky-600 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="hover:text-sky-600 transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          {/* Updated: 2xl rounding and sky-600 background to match the Hero buttons */}
          <button className="hidden md:block bg-slate-900 hover:bg-sky-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-slate-200 hover:shadow-sky-100 transform hover:-translate-y-0.5">
            Start Project
          </button>

          {/* Mobile Menu Icon */}
          <button className="lg:hidden p-2 text-slate-600 hover:bg-sky-50 rounded-xl transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
