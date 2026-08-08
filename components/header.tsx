"use client"; // Required for useState and interactive toggles

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Root-relative so these resolve from /services/* and /work/* too, not just
  // from the home page.
  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/work", label: "Our Work" },
    { href: "/#process", label: "Process" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-6 py-4 md:px-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-[#0e121a]/80 backdrop-blur-xl border border-cyber-cyan/25 px-6 py-3 md:px-8 rounded-[2rem] shadow-[0_8px_32px_-6px_rgb(0_0_0/0.7)]">
        {/* Brand Section */}
        <Link href="/" className="flex items-center gap-3 focus-visible:ring-3 focus-visible:ring-cyber-cyan/50 focus-visible:outline-none rounded-xl">
          <Image
            src="/logo-swan.png"
            alt="WA AI Digital Logo"
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-full md:h-10 md:w-10"
          />
          <span className="font-black text-xl tracking-tighter text-foreground">
            WA AI <span className="text-cyber-cyan">Digital</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-cyber-cyan transition-colors focus-visible:ring-3 focus-visible:ring-cyber-cyan/50 focus-visible:outline-none rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/#contact"
            className="hidden md:block bg-cyber-cyan hover:bg-cyan-300 text-cyber-dark px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-neon-cyan hover:shadow-[0_0_30px_rgb(0_242_255/0.6)] transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-cyber-cyan/50 focus-visible:outline-none"
          >
            Start Project
          </Link>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:bg-cyber-cyan/10 rounded-xl transition-colors z-50"
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
            className="absolute top-24 left-6 right-6 p-6 bg-[#0e121a]/95 backdrop-blur-2xl border border-cyber-cyan/25 rounded-[2rem] shadow-2xl lg:hidden flex flex-col gap-4 text-center"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-foreground py-2 hover:text-cyber-cyan transition-colors border-b border-border last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-cyber-cyan text-cyber-dark py-4 rounded-2xl font-bold text-center shadow-neon-cyan"
            >
              Start Project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
