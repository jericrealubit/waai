"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * The `data-theme` attribute on <html> IS the state — the pre-paint script in
 * app/layout.tsx writes it before React exists, and this component is only a
 * view onto it. So it is read with `useSyncExternalStore` rather than mirrored
 * into component state: copying it into `useState` inside an effect meant the
 * attribute and the React state were two sources of truth that had to be kept
 * in step by hand, and it triggered a cascading render on every mount.
 */
function subscribe(onChange: () => void): () => void {
  const root = document.documentElement;

  // The toggle below writes the attribute; this is how that write gets back
  // into React.
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Keep following the OS until the visitor makes an explicit choice.
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onOsChange = () => {
    try {
      if (localStorage.getItem("theme")) return;
    } catch {
      /* storage blocked — treat it as "no stored choice" and follow the OS */
    }
    // Writing the attribute trips the observer above, which notifies React.
    root.setAttribute("data-theme", mq.matches ? "dark" : "light");
  };
  mq.addEventListener("change", onOsChange);

  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onOsChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * The server cannot know the resolved theme, so it reports null and the button
 * renders a blank square. React re-runs the client snapshot straight after
 * hydration, which is what makes this safe rather than a mismatch.
 */
function getServerSnapshot(): null {
  return null;
}

/**
 * Light/dark switcher. The theme lives as `data-theme` on <html>: the pre-paint
 * script in app/layout.tsx sets it before first paint (from a stored choice, or
 * the OS), so there's no flash. This button flips it and persists the choice.
 * Until an explicit choice is stored we keep following the OS live.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Setting the attribute is the state change — the MutationObserver in
    // `subscribe` reports it back to React.
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode / storage disabled — the choice just won't persist */
    }
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
