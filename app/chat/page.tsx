import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Assistant | WA AI Digital",
  description:
    "Ask the WA AI Digital assistant about services, pricing and shipped work.",
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
 * The chat itself is still hosted on Hugging Face Spaces; there is no chat
 * backend in this repo. A Space that has gone to sleep takes a while to wake,
 * which is what the note under the frame is for — otherwise a blank rectangle
 * reads as a broken page.
 */
const CHAT_SRC = "https://jericrealubit-ragchatbot.hf.space";

export default function ChatPage() {
  return (
    <section className="px-6 pb-12 pt-2 md:px-20 md:pt-6">
      <div className="mx-auto max-w-7xl">
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
            A retrieval chatbot trained on this practice&apos;s services,
            pricing and shipped projects. It answers from the same facts the
            rest of this site is built from — and like everything else here, you
            can go and read how it works.
          </p>
        </div>

        {/* Plate-framed like a case-study capture, so the embedded app reads as
            part of the site rather than a foreign rectangle dropped into it. */}
        <div className="mt-8 overflow-hidden border-2 border-bitumen bg-paper shadow-e2">
          <div className="flex items-center justify-between gap-3 border-b-2 border-bitumen px-3.5 py-2.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              Drawing No. WAAI-CHAT · Rev. 2026
            </span>
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

          {/* Height in `svh`, not `vh`: on iOS `100vh` includes the browser
              chrome, so a vh-sized frame is taller than the visible viewport
              and the bottom of the chat sits under the address bar. */}
          <iframe
            src={CHAT_SRC}
            title="WA AI Digital assistant"
            className="block h-[70svh] w-full border-0 bg-cement md:h-[75svh]"
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
