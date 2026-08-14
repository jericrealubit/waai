"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Light/dark switcher. The theme lives as `data-theme` on <html>: the pre-paint
 * script in app/layout.tsx sets it before first paint (from a stored choice, or
 * the OS), so there's no flash. This button flips it and persists the choice.
 * Until an explicit choice is stored we keep following the OS live.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setTheme((root.getAttribute("data-theme") as Theme) ?? "light");

    // Keep tracking the OS until the visitor makes an explicit choice.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("theme")) {
        const os: Theme = mq.matches ? "dark" : "light";
        root.setAttribute("data-theme", os);
        setTheme(os);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode / storage disabled — the choice just won't persist */
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="focus-ring flex h-10 w-10 items-center justify-center border-2 border-bitumen text-foreground transition-colors hover:border-hivis hover:text-hivis-text"
    >
      {/* Icon only after mount — the server can't know the resolved theme, so
          rendering it before hydration would mismatch. */}
      {theme === null ? (
        <span className="h-5 w-5" />
      ) : isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
