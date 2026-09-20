"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 400px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    /* The global reduced-motion rule in globals.css forces `scroll-behavior:
       auto`, but that only governs CSS-driven scrolling — it cannot reach a
       scrollTo() that asks for smooth explicitly. Checked here instead, so a
       visitor who asked for less motion doesn't get the whole page flung past
       them. */
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          // A round ink-framed paper button — a hi-vis "tool" that floats over
          // the scrolling sheet and picks up the accent on hover.
          className="focus-ring group fixed bottom-8 right-8 z-50 rounded-full border-2 border-bitumen bg-paper p-4 text-foreground shadow-e2 transition-colors hover:border-hivis hover:text-hivis-text"
        >
          <ChevronUp
            size={24}
            className="group-hover:-translate-y-1 transition-transform duration-300"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
