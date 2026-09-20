import { Quote } from "lucide-react";

import type { CaseStudy } from "@/lib/content/case-studies";

type Testimonial = NonNullable<CaseStudy["testimonial"]>;

/**
 * A client quote, rendered as a signed-off note on the drawing.
 *
 * The `consent: true` literal in the type is what gates this: a testimonial
 * cannot exist in the data without asserting that the named client approved
 * that exact wording. Nothing here re-checks it, because the compiler already
 * has — which is the whole reason the field is shaped that way.
 *
 * Returns null when a study has no testimonial, so call sites can render it
 * unconditionally without guarding.
 */
export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial?: Testimonial;
  className?: string;
}) {
  if (!testimonial) return null;

  return (
    <figure
      className={`glass-card relative p-6 md:p-8 ${className ?? ""}`}
    >
      <Quote
        aria-hidden="true"
        className="h-6 w-6 text-hivis"
      />

      <blockquote className="mt-4 text-base leading-[1.7] text-muted-foreground md:text-lg">
        {/* Typographic quotes around the client's own words, so the quote reads
            as speech rather than as our copy. */}
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-5 border-t border-line pt-4 font-mono text-xs uppercase tracking-wider">
        <span className="font-bold text-foreground">{testimonial.author}</span>
        <span className="text-foreground-subtle">
          {" "}
          · {testimonial.role}, {testimonial.business}
          {testimonial.suburb ? ` · ${testimonial.suburb}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}
