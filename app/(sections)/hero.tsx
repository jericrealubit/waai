"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const previews = [
  {
    id: 1,
    title: "Digital Menu & Ordering",
    image: "/menu-preview.png", // Ensure you save the generated images with these names in /public
    url: "waai.au/demo/ordering",
  },
  {
    id: 2,
    title: "Kitchen Management",
    image: "/dashboard-preview.png",
    url: "waai.au/demo/kitchen",
  },
  {
    id: 3,
    title: "AI Business Insights",
    image: "/ai-insights-preview.png",
    url: "waai.au/demo/insights",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % previews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-white">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            Based in Western Australia
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-6">
            Websites & <span className="text-blue-600">Ordering Systems</span>{" "}
            Built for WA.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            We build lightning-fast menus, digital stores, and AI-driven systems
            specifically designed for local restaurants and retailers.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-200">
              Start Your Project
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm">
              View Demo
            </button>
          </div>
        </div>

        {/* Dynamic System Preview Slideshow */}
        <div className="relative hidden lg:block">
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-blue-400/20 blur-[120px] rounded-full -z-10" />

          <div className="bg-white rounded-[2.5rem] p-4 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-slate-100">
            <div className="relative rounded-[1.8rem] overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3]">
              {/* Fake Browser Header */}
              <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
                <div className="bg-slate-50 px-4 py-1 rounded-full text-[10px] text-slate-400 font-mono tracking-tight">
                  {previews[index].url}
                </div>
                <div className="w-10" />
              </div>

              {/* Animated Image Container */}
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={index}
                    src={previews[index].image}
                    alt={previews[index].title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "anticipate" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">
                    System Feature 0{previews[index].id}
                  </p>
                  <h4 className="text-sm font-bold text-slate-900">
                    {previews[index].title}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Success Indicator */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-20"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-bold">System Live</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
