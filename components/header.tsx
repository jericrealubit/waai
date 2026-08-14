"use client"; // Required for useState and interactive toggles

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { ThemeToggle } from "@/components/theme-toggle";

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
    // A full-width worksite bar under a strong ruled edge (`.glass-nav`), not a
    // floating glass pill. `fixed`, so main clears it with pt-24 in the layout.
    <header className="glass-nav fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-20">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 focus-ring">
          <Image
            src="/logo-mark.png"
            alt="WA AI Digital — field-verified emblem"
            width={48}
            height={48}
            priority
            className="h-10 w-10 md:h-12 md:w-12"
          />
          <span className="font-display text-xl font-extrabold uppercase tracking-wide text-foreground md:text-2xl">
            WA AI <span className="text-hivis">Digital</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring border-b-2 border-transparent pb-0.5 font-mono text-xs font-bold uppercase tracking-wider text-steel transition-colors hover:border-hivis hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/#contact"
            className="hidden md:inline-flex btn-primary focus-ring"
          >
            Start Project
          </Link>

          {/* Burger Menu Button — an icon-only control, so it needs a label of
              its own, and `aria-expanded`/`aria-controls` to tie it to the
              panel it toggles. Without those a screen reader announces it as
              an unnamed button with no indication the menu opened. */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="focus-ring z-50 p-2 text-foreground transition-colors hover:bg-hivis/10 lg:hidden"
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
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel absolute left-6 right-6 top-20 flex flex-col gap-4 p-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="focus-ring border-b border-border py-2 font-mono text-base font-bold uppercase tracking-wide text-foreground transition-colors last:border-0 hover:text-hivis-text"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="btn-primary focus-ring mt-2 w-full"
            >
              Start Project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
