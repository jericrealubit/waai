"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const previews = [
  {
    title: "Digital Menu & Ordering",
    description:
      "Sleek customer-facing interface for seamless table-side or remote ordering.",
    image: "/menu-preview.png", // Replace with your saved image path
  },
  {
    title: "Kitchen Management",
    description:
      "Real-time order tracking and analytics for high-efficiency kitchen operations.",
    image: "/dashboard-preview.png", // Replace with your saved image path
  },
  {
    title: "AI Business Insights",
    description:
      "Predictive inventory and automated sales reporting driven by custom AI agents.",
    image: "/ai-insights-preview.png", // Replace with your saved image path
  },
];

export default function SystemPreview() {
  const [index, setIndex] = useState(0);

  // Auto-play the slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % previews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Powerful Systems, <span className="text-blue-600">Simplified</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            From customer ordering to back-of-house automation, our systems are
            built to scale with your business.
          </p>
        </div>

        {/* Browser Mockup Container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-slate-50">
          {/* Browser Top Bar */}
          <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="bg-slate-50 px-6 py-1 rounded-full text-[10px] text-slate-400 font-mono">
              waai.au/demo/
              {previews[index].title.toLowerCase().replace(/\s+/g, "-")}
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Slide Content */}
          <div className="relative aspect-video bg-slate-200 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={previews[index].image}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators / Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {previews.map((item, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                index === i
                  ? "bg-white border-blue-100 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10"
                  : "border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-widest ${index === i ? "text-blue-600" : "text-slate-400"}`}
              >
                0{i + 1} — {item.title}
              </span>
              <p className="text-sm text-slate-600 mt-2 font-medium">
                {item.description}
              </p>
              {index === i && (
                <motion.div
                  layoutId="active-bar"
                  className="h-1 bg-blue-600 mt-4 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
