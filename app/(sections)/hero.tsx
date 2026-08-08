"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const previews = [
  {
    id: 1,
    title: "Digital Menu & Ordering",
    image: "/menu-preview.png",
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
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % previews.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section className="relative overflow-hidden py-16 md:py-32 bg-white">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            Based in Western Australia
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
            Websites & <span className="text-blue-600">Ordering Systems</span>{" "}
            Built for WA.
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            We build lightning-fast menus, digital stores, and AI-driven systems
            specifically designed for local restaurants and retailers.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-200">
              Start Your Project
            </button>
            <button className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm">
              View Demo
            </button>
          </div>
        </div>

        {/* Dynamic System Preview Slideshow */}
        <div
          className="relative block w-full mt-8 lg:mt-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0 bg-blue-400/20 blur-[80px] lg:blur-[120px] rounded-full -z-10" />

          <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-2 md:p-4 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-slate-100">
            <div className="relative rounded-[1.5rem] lg:rounded-[1.8rem] overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3]">
              {/* Fake Browser Header with Interactive Dots */}
              <div className="bg-white px-3 py-3 lg:px-5 lg:py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex gap-1.5 lg:gap-2">
                  {previews.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIndex(i);
                        setIsPaused(true);
                      }}
                      className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 transform hover:scale-125 shadow-sm ${
                        index === i
                          ? i === 0
                            ? "bg-red-500 shadow-red-200"
                            : i === 1
                              ? "bg-amber-500 shadow-amber-200"
                              : "bg-emerald-500 shadow-emerald-200"
                          : "bg-slate-200 hover:bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="bg-slate-50 px-3 py-0.5 rounded-full text-[8px] lg:text-[10px] text-slate-400 font-mono tracking-tight truncate max-w-[140px] md:max-w-none">
                  {previews[index].url}
                </div>
                <div className="w-6 lg:w-10" />
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

              {/* Caption Overlay / Active Tab */}
              <div className="absolute bottom-3 left-3 right-3 lg:bottom-6 lg:left-6 lg:right-6">
                <div
                  className={`backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-white/20 shadow-lg transition-all duration-500 ${isPaused ? "bg-blue-600 border-blue-700" : "bg-white/80"}`}
                >
                  <p
                    className={`text-[8px] lg:text-[10px] font-bold uppercase tracking-widest mb-0.5 lg:mb-1 transition-colors ${isPaused ? "text-blue-100" : "text-blue-600"}`}
                  >
                    System Feature 0{previews[index].id}{" "}
                    {isPaused && "• Paused"}
                  </p>
                  <h4
                    className={`text-xs lg:text-sm font-bold transition-colors ${isPaused ? "text-white" : "text-slate-900"}`}
                  >
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
            className="absolute -bottom-4 -left-2 lg:-bottom-6 lg:-left-6 bg-emerald-500 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl shadow-xl flex items-center gap-2 lg:gap-3 z-30 flex"
          >
            <div
              className={`w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full ${!isPaused && "animate-pulse"}`}
            />
            <span className="text-[10px] lg:text-sm font-bold uppercase tracking-tight">
              System Live
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
