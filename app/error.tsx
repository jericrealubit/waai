"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Section } from "@/components/ui/section";

/**
 * Route-level error boundary. Must be a client component — React needs the
 * `reset` callback wired to an event handler.
 *
 * Deliberately shows no stack and no `error.message`: a runtime message can
 * carry an internal path or a key fragment, and a visitor can do nothing with
 * either. The `digest` is safe to show and is what correlates this render with
 * the Worker log in Cloudflare's dashboard.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in `wrangler tail` / the Workers observability log, which is
    // the only error reporting this site has.
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <Section size="page">
      <div className="mx-auto max-w-2xl">
        <div className="glass-card p-8 md:p-12">
          <span className="section-label">Error · 500</span>

          <h1 className="mt-3 font-display text-display-1 font-extrabold uppercase text-foreground">
            Something broke
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            This page failed to render. That&apos;s our fault, not yours —
            it&apos;s been logged. Try again, and if it keeps happening,{" "}
            <Link href="/#contact">tell us what you were doing</Link> and
            we&apos;ll fix it.
          </p>

          {error.digest && (
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-foreground-subtle">
              Ref. {error.digest}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={reset} className="btn-primary focus-ring">
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <Link href="/" className="btn-glass focus-ring">
              Back to the site
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
