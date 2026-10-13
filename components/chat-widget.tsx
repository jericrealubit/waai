"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";

import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useReducedFade } from "@/components/ui/use-reduced-fade";
import { track } from "@/lib/analytics";
import { CHAT_SRC } from "@/lib/chat";
import { STAMP_IN_VARIANTS } from "@/lib/motion";

const PANEL_ID = "chat-panel";
/** Lands after the hero has settled, so it never competes with the LCP heading. */
const LAND_DELAY = 0.8;

/**
 * The floating dock in the bottom-right corner: the chat launcher, with
 * ScrollToTop stacked above it so the two never overlap.
 *
 * The launcher opens the assistant in a non-modal panel (full screen on
 * phones). The iframe mounts on first open — nothing loads before that — and
 * then stays mounted: closing hides the panel but keeps the conversation, and
 * because this lives in the root layout it also survives client-side
 * navigation. Hidden on /chat, which already frames the assistant.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const onChatPage = pathname === "/chat";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reduce = useReducedMotion();
  const fade = useReducedFade(!!reduce, LAND_DELAY);

  // Arriving on /chat drops the panel's iframe, so two sessions never run at once.
  const [wasOnChatPage, setWasOnChatPage] = useState(onChatPage);
  if (onChatPage !== wasOnChatPage) {
    setWasOnChatPage(onChatPage);
    if (onChatPage) {
      setOpen(false);
      setMounted(false);
      setLoaded(false);
    }
  }

  // Set by the close controls only, so arriving on /chat doesn't steal focus.
  const restoreFocus = useRef(false);
  const close = useCallback(() => {
    restoreFocus.current = true;
    setOpen(false);
  }, []);

  // Back to the control that opened it, or keyboard users land at the top.
  // After the commit rather than inline: on phones the launcher is hidden
  // while the panel is open, and can't take focus until it is shown again.
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    launcherRef.current?.focus();
  }, [open]);

  const toggle = () => {
    if (open) return close();
    setMounted(true);
    setOpen(true);
    track("chat_open", { page: pathname });
  };

  // Focus the chat so the visitor can type straight away.
  useEffect(() => {
    if (open && loaded) iframeRef.current?.focus();
  }, [open, loaded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    // Full screen on phones: stop the page behind from scrolling.
    const root = document.documentElement;
    const previous = root.style.overflow;
    if (window.matchMedia("(max-width: 639.98px)").matches) {
      root.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <>
      {mounted && !onChatPage && (
        <div
          id={PANEL_ID}
          role="dialog"
          aria-label="WA AI Digital assistant"
          data-open={open}
          inert={!open}
          className="chat-panel motion-always fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper sm:inset-auto sm:bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.5rem)] sm:right-[max(1.25rem,env(safe-area-inset-right))] sm:h-[min(42rem,calc(100svh-12.5rem))] sm:w-[min(25rem,calc(100vw-2.5rem))] sm:border-2 sm:border-bitumen sm:shadow-e3 md:bottom-[6.5rem] md:right-8"
        >
          <div className="flex items-center justify-between gap-3 border-b-2 border-bitumen px-3.5 py-2.5">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              <span aria-hidden="true" className="beacon h-2 w-2" />
              Assistant
            </span>
            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                className="focus-ring inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-source transition-colors hover:text-hivis-text"
              >
                Full page
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="focus-ring p-1.5 text-foreground transition-colors hover:text-hivis-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-cement">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="signal-meter" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <p className="font-mono text-xs leading-relaxed text-foreground-subtle">
                  Waking the assistant — up to a minute on the first visit of
                  the day.
                </p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={CHAT_SRC}
              title="WA AI Digital assistant"
              allow="clipboard-write"
              onLoad={() => setLoaded(true)}
              className="block h-full w-full border-0"
            />
          </div>
        </div>
      )}

      <div
        className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex flex-col items-center gap-3 md:bottom-8 md:right-8 ${open ? "max-sm:hidden" : ""}`}
      >
        <ScrollToTop hidden={open} />

        {!onChatPage && (
          <motion.div
            className="relative"
            {...(reduce
              ? { style: { opacity: fade } }
              : {
                  variants: STAMP_IN_VARIANTS,
                  initial: "hidden",
                  animate: "shown",
                  custom: LAND_DELAY,
                })}
          >
            <button
              ref={launcherRef}
              type="button"
              onClick={toggle}
              onPointerEnter={() => preconnect(CHAT_SRC)}
              onFocus={() => preconnect(CHAT_SRC)}
              data-open={open}
              aria-expanded={open}
              aria-controls={PANEL_ID}
              aria-haspopup="dialog"
              aria-label={open ? "Close chat" : "Chat with the WA AI Digital assistant"}
              className="focus-ring group relative flex h-15 w-15 items-center justify-center rounded-full border-2 border-bitumen bg-hivis text-hivis-ink shadow-e2 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-e3 active:translate-y-0 active:shadow-e1"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap border-2 border-bitumen bg-paper px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground opacity-0 shadow-e1 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-data-[open=true]:hidden max-sm:hidden"
              >
                Ask the assistant
              </span>

              {/* Speech bubble (lucide's message-square path) with its own
                  dots, so they can type. Swaps to an X when open. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="chat-typing absolute h-7 w-7 transition duration-200 group-data-[open=true]:rotate-45 group-data-[open=true]:scale-50 group-data-[open=true]:opacity-0"
                fill="currentColor"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="10" r="1.4" />
                <circle cx="12" cy="10" r="1.4" />
                <circle cx="16" cy="10" r="1.4" />
              </svg>
              <X
                aria-hidden="true"
                className="absolute h-6 w-6 -rotate-45 scale-50 opacity-0 transition duration-200 group-data-[open=true]:rotate-0 group-data-[open=true]:scale-100 group-data-[open=true]:opacity-100"
              />
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}
