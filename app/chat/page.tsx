import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import { CHAT_REPO, CHAT_SRC } from "@/lib/chat";

export const metadata: Metadata = {
  title: "Assistant | WA AI Digital",
  description:
    "Ask the WA AI Digital assistant about services, pricing and shipped work — or chat with a PDF, or search the web live.",
  // The page is a frame around an externally hosted app — there is no content
  // of our own here for a crawler to index. app/robots.ts disallows it too.
  robots: { index: false, follow: false },
};

/**
 * The RAG assistant.
 *
 * This used to be a bare `position: fixed`, `z-index: 99999` div with a
 * hardcoded `#0d1117` background, deliberately covering the site's own header
 * and footer — and linked from nowhere at all, so the only AI feature on an AI
 * practice's site was unreachable. It now sits inside the site like any other
 * page: the header and footer stay put, and there is a way back.
 *
 * The chat itself is a Chainlit app on Hugging Face Spaces, deployed from
 * CHAT_REPO's `main` by a GitHub Action; there is no chat backend in this
 * repo. What it knows about the business comes from /llms.txt
 * (app/llms.txt/route.ts), which is generated from lib/content — so the copy
 * below claiming it answers from the site's own facts stays true only while
 * the bot keeps reading that file. A Space that has gone to sleep takes a
 * while to wake, which is what the note under the frame is for — otherwise a
 * blank rectangle reads as a broken page.
 *
 * The floating launcher (components/chat-widget.tsx) hides itself here, so
 * this page never runs a second session alongside its own frame.
 */
export default function ChatPage() {
  return (
    // The section fills the viewport under the fixed header (main's pt-24 /
    // md:pt-32), and the frame takes whatever the intro leaves — so the chat's
    // composer, which drops to the bottom of the frame as soon as the welcome
    // message lands, is on screen without scrolling at any intro height.
    <section className="flex min-h-[calc(100svh-6rem)] flex-col px-6 pb-12 pt-2 md:min-h-[calc(100svh-8rem)] md:px-20 md:pt-6">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <Link
          href="/"
          className="focus-ring mb-6 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground-subtle transition-colors hover:text-hivis-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the site
        </Link>

        <div className="max-w-3xl">
          <span className="section-label">Assistant</span>
          <h1 className="mt-3 font-display text-display-2 font-extrabold uppercase text-foreground">
            Ask about the work
          </h1>
          <p className="mt-4 text-base leading-[1.65] text-muted-foreground md:text-lg">
            Ask what a build costs, which tier fits, or how a shipped project
            works. The assistant answers from the same service, pricing and
            project data this site is built from, published as{" "}
            <a href="/llms.txt" className="focus-ring">
              llms.txt
            </a>
            . Attach a PDF and it reads that instead; ask anything else and it
            searches the web live.
          </p>
        </div>

        {/* Plate-framed like a case-study capture, so the embedded app reads as
            part of the site rather than a foreign rectangle dropped into it.
            `relative` lifts it above the blueprint grid, which is a fixed
            `body::before` that otherwise paints over the dark chat panel. */}
        {/* On a phone the intro alone fills the first screen, so rather than a
            cramped panel squeezed under it, the plate is nearly a full screen
            tall and is reached with one scroll. */}
        <div className="relative mt-8 flex min-h-[calc(100svh-8rem)] flex-1 flex-col overflow-hidden border-2 border-bitumen bg-paper shadow-e2 md:min-h-[24rem]">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b-2 border-bitumen px-3.5 py-2.5">
            <span className="whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              Drawing No. WAAI-CHAT · Rev. 2026
            </span>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <a
                href={CHAT_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-widest text-source transition-colors hover:text-hivis-text"
              >
                <Github className="h-3 w-3" />
                Source
                <span className="sr-only"> code for the assistant</span>
              </a>
              <a
                href={CHAT_SRC}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-widest text-source transition-colors hover:text-hivis-text"
              >
                <ExternalLink className="h-3 w-3" />
                Open full screen
              </a>
            </div>
          </div>

          {/* Grows into the plate, which grows into the section. The section's
              height is in `svh`, not `vh`: on iOS `100vh` includes the browser
              chrome, so a vh-sized frame is taller than the visible viewport
              and the bottom of the chat sits under the address bar. */}
          <iframe
            src={CHAT_SRC}
            title="WA AI Digital assistant"
            className="block w-full flex-1 border-0 bg-cement"
            allow="clipboard-write"
          />
        </div>

        <p className="mt-4 font-mono text-xs leading-relaxed text-foreground-subtle">
          Hosted on Hugging Face Spaces. If the panel is blank, the Space is
          waking up — it can take up to a minute on the first visit of the day.
        </p>
      </div>
    </section>
  );
}
