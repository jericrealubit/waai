export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-white">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            Based in Western Australia
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Websites & <span className="text-blue-600">Ordering Systems</span>{" "}
            Built for WA.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            We build lightning-fast menus, digital stores, and AI-driven systems
            specifically designed for local restaurants and retailers.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-200">
              Start Your Project
            </button>
            <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold transition-all">
              View Demo
            </button>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="bg-slate-100 rounded-3xl w-full aspect-square flex items-center justify-center border-8 border-white shadow-2xl overflow-hidden">
            {/* Replace with your actual dashboard/demo image */}
            <div className="text-slate-400 font-mono text-sm uppercase tracking-widest">
              System Preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
