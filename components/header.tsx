import Image from "next/image";

export function Header() {
  return (
    <header className="w-full h-20 flex items-center justify-between px-6 md:px-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <Image
        src="/android-chrome-192x192.png"
        alt="WA AI Digital Logo"
        width={30}
        height={30}
      />
      <span className="font-bold text-xl text-blue-900">WA AI Digital</span>

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-600">
        <a href="#services" className="hover:text-blue-600 transition-colors">
          Websites
        </a>
        {/* New Navigation Item */}
        <a href="#growth" className="hover:text-blue-600 transition-colors">
          Growth & Maintenance
        </a>
        <a href="#portfolio" className="hover:text-blue-600 transition-colors">
          Our Work
        </a>
        <a href="#pricing" className="hover:text-blue-600 transition-colors">
          Pricing
        </a>
        <a href="#contact" className="hover:text-blue-600 transition-colors">
          Contact
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
          Start Project
        </button>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden p-2 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
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
    </header>
  );
}
