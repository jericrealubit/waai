"use client"; // Required for useState and interactive toggles

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Websites" },
    { href: "#growth", label: "Growth & Maintenance" },
    { href: "#portfolio", label: "Our Work" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-6 py-4 md:px-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 px-6 py-3 md:px-8 rounded-[2rem] shadow-[0_8px_32px_-6px_rgba(0,0,0,0.04)]">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/android-chrome-192x192.png"
            alt="WA AI Digital Logo"
            width={32}
            height={32}
          />
          <span className="font-black text-xl tracking-tighter text-slate-900">
            WA AI <span className="text-sky-600">Digital</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-wider text-slate-500">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-sky-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block bg-slate-900 hover:bg-sky-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-slate-200 hover:shadow-sky-100 transform hover:-translate-y-0.5">
            Start Project
          </button>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-sky-50 rounded-xl transition-colors z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={
                  isOpen
                    ? { d: "M6 18L18 6M6 6l12 12" }
                    : { d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" }
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 p-6 bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-2xl lg:hidden flex flex-col gap-4 text-center"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-slate-900 py-2 hover:text-sky-600 transition-colors border-b border-slate-100 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <button className="mt-2 bg-sky-600 text-white py-4 rounded-2xl font-bold">
              Start Project
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
