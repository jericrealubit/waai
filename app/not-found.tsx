import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/section";

/**
 * Both dynamic routes call `notFound()` on an unknown slug — app/work/[slug]
 * and app/services/[slug] — and until this file existed they fell through to
 * the bare framework 404, which drops the visitor onto an unbranded page with
 * no way back into the site.
 *
 * Written as a drawing that isn't in the set, which is the same voice as the
 * rest of the site rather than a joke bolted onto it.
 */
export default function NotFound() {
  return (
    <Section size="page">
      <div className="mx-auto max-w-2xl">
        <div className="glass-card p-8 md:p-12">
          <span className="section-label">Error · 404</span>

          <h1 className="mt-3 font-display text-display-1 font-extrabold uppercase text-foreground">
            Drawing not found
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            That page isn&apos;t in the set. It may have been renamed, or the
            link that brought you here may have a typo in it.
          </p>

          <div className="mt-8 grid gap-px border-2 border-bitumen bg-line sm:grid-cols-2">
            <div className="bg-paper px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
                Sheet
              </div>
              <div className="mt-1 font-display text-xl font-extrabold uppercase leading-none tracking-tight text-foreground">
                WAAI-404
              </div>
            </div>
            <div className="bg-paper px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
                Status
              </div>
              <div className="mt-1 font-display text-xl font-extrabold uppercase leading-none tracking-tight text-foreground">
                Not issued
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary focus-ring">
              Back to the site
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/work" className="btn-glass focus-ring">
              Inspect the work
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
