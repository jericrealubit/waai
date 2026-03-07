export function Header() {
  return (
    <header className="w-full h-20 flex items-center justify-between px-6 md:px-20 border-b">
      <div className="text-xl font-bold">WA AI DIGITAL</div>

      <nav className="hidden md:flex gap-8 text-gray-700">
        <a href="#services">Services</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </nav>

      <button className="hidden md:block bg-brand-blue text-white px-5 py-2 rounded-lg">
        Start Project
      </button>
    </header>
  );
}
