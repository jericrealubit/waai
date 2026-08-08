"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Real shipped projects with real URLs. These previously pointed at
// waai.au/demo/* addresses that do not exist.
const previews = [
  {
    id: 1,
    title: "Jun's Maintenance — trade services",
    image: "/work/juns-maintenance.webp",
    url: "junsmaintenance.au",
    href: "/work/juns-maintenance",
  },
  {
    id: 2,
    title: "BBQ Heaven — menu & pickup ordering",
    image: "/work/bbq-heaven.webp",
    url: "bbqheaven.au",
    href: "/work/bbq-heaven",
  },
  {
    id: 3,
    title: "Ecommerce storefront — cart & checkout",
    image: "/work/ecommerce-storefront.webp",
    url: "nextjs-ecommerce-front.netlify.app",
    href: "/work/ecommerce-storefront",
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
          <span className="section-label mb-6">Based in Western Australia</span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
            Sites and systems{" "}
            <span className="text-sky-600">that already work</span> somewhere.
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Trade websites, restaurant ordering, factory-floor logging and
            ecommerce — for WA businesses. Every service on this site is backed
            by a project you can open in a browser and read on GitHub.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link
              href="/#contact"
              className="w-full sm:w-auto text-center bg-slate-900 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200 hover:shadow-sky-100 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              Start Your Project
            </Link>
            <Link
              href="/work"
              className="w-full sm:w-auto text-center bg-white border border-slate-200 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              See the work
            </Link>
          </div>
        </div>

        {/* Dynamic System Preview Slideshow */}
        <div
          className="relative block w-full mt-8 lg:mt-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0 bg-sky-400/20 blur-[80px] lg:blur-[120px] rounded-full -z-10" />

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
                  className={`backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-white/20 shadow-lg transition-all duration-500 ${isPaused ? "bg-sky-600 border-sky-700" : "bg-white/80"}`}
                >
                  <p
                    className={`text-[8px] lg:text-[10px] font-bold uppercase tracking-widest mb-0.5 lg:mb-1 transition-colors ${isPaused ? "text-sky-100" : "text-sky-600"}`}
                  >
                    Live project 0{previews[index].id}{" "}
                    {isPaused && "• Paused"}
                  </p>
                  <Link
                    href={previews[index].href}
                    className={`text-xs lg:text-sm font-bold transition-colors hover:underline underline-offset-4 ${isPaused ? "text-white" : "text-slate-900"}`}
                  >
                    {previews[index].title}
                  </Link>
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
