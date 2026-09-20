import { Section } from "@/components/ui/section";
import type { LegalDocument } from "@/lib/content/legal";

/**
 * Renders a legal document from lib/content/legal.ts.
 *
 * One component for both pages: privacy and terms differ only in their
 * content, and giving each its own markup is how the two drift into looking
 * like they came from different sites.
 *
 * Measure is capped in `ch` for the same reason Section's description is —
 * these are the longest unbroken runs of prose anywhere on the site, and a
 * full `max-w-7xl` line length is unreadable.
 */
export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return (
    <Section size="page">
      <div className="max-w-[68ch]">
        <span className="section-label">Legal</span>

        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground md:text-6xl">
          {doc.title}
        </h1>

        <p className="mt-5 text-base leading-[1.65] text-muted-foreground md:text-lg">
          {doc.summary}
        </p>

        <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-foreground-subtle">
          In effect from {doc.effective}
        </p>

        <div className="mt-12 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
                {section.heading}
              </h2>

              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-base leading-[1.7] text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="mt-5 space-y-3 border-l-2 border-line pl-5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="text-base leading-[1.7] text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
