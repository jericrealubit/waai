import { cn } from "@/lib/utils";

/**
 * Vertical rhythm rungs.
 *
 * `page` exists because `main` in app/layout.tsx already clears the fixed
 * header with its own `pt-24`. A section that then adds `py-24` on top stacks
 * ~190px of empty page above the first word — on a phone that is the entire
 * first screen spent on nothing, which is the worst possible use of it on an
 * evidence page a prospect has just landed on.
 */
type SectionSize = "page" | "default" | "tight";

const SIZE: Record<SectionSize, string> = {
  page: "pt-2 pb-10 md:pt-6 md:pb-14",
  default: "py-20 md:py-24",
  tight: "py-10 md:py-14",
};

interface SectionProps extends React.ComponentProps<"section"> {
  /** Renders the eyebrow / heading / description block above the children. */
  label?: string;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons, jump links or proof rendered under the description. */
  actions?: React.ReactNode;
  /** Centres the heading block from `md` up. Defaults to true. */
  centered?: boolean;
  size?: SectionSize;
  /**
   * The generated heading is an `h2` by default. A page whose main title comes
   * from a Section — /work, /services — must pass 1, or the document has no
   * `h1` at all.
   */
  headingLevel?: 1 | 2;
}

/**
 * Owns the vertical rhythm and max width that every section on the site shares,
 * replacing the `py-24 px-6 md:px-20` + `max-w-7xl mx-auto` triplet that was
 * repeated by hand in each file under app/(sections)/.
 */
export function Section({
  label,
  heading,
  description,
  actions,
  centered = true,
  size = "default",
  headingLevel = 2,
  className,
  children,
  ...props
}: SectionProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section className={cn("px-6 md:px-20", SIZE[size], className)} {...props}>
      <div className="mx-auto max-w-7xl">
        {(label || heading || description || actions) && (
          <div
            className={cn(
              /* No gap when the block *is* the section — on /work the hero
                 has no children, and a trailing 56px margin only widened the
                 hole between the jump chips and the first group. */
              children && "mb-10 md:mb-14",
              /* Centred ragged text is fine for a two-word eyebrow and a short
                 headline, but a 20-word lede wraps to four lines on a 390px
                 screen and every one of them starts in a different place — the
                 eye has to hunt for the next line. Left on mobile also lines
                 the block up with the cards and group headings below it, which
                 are left-aligned regardless. Centring resumes at `md`, where
                 the lede fits in two lines. */
              centered && "text-left md:text-center",
              !centered && "max-w-2xl",
            )}
          >
            {label && <span className="section-label">{label}</span>}
            {heading && (
              <Heading className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground md:text-6xl">
                {heading}
              </Heading>
            )}
            {description && (
              /* Measure is capped in `ch`, not `rem`. max-w-2xl at 18px is
                 ~78 characters a line, past the top of the 45–75 comfortable
                 band; the eye loses the return sweep and re-reads lines. */
              <p
                className={cn(
                  "mt-4 max-w-[58ch] text-base leading-[1.65] text-muted-foreground md:text-lg",
                  centered && "md:mx-auto",
                )}
              >
                {description}
              </p>
            )}
            {actions && (
              <div
                className={cn(
                  "mt-8 flex flex-wrap gap-2.5",
                  centered && "md:justify-center",
                )}
              >
                {actions}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
