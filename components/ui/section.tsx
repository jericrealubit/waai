import { cn } from "@/lib/utils";

interface SectionProps extends React.ComponentProps<"section"> {
  /** Renders the eyebrow / heading / description block above the children. */
  label?: string;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  /** Centres the heading block. Defaults to true. */
  centered?: boolean;
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
  centered = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("px-6 py-24 md:px-20", className)} {...props}>
      <div className="mx-auto max-w-7xl">
        {(label || heading || description) && (
          <div
            className={cn(
              "mb-16",
              centered && "text-center",
              !centered && "max-w-2xl",
            )}
          >
            {label && <span className="section-label">{label}</span>}
            {heading && (
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "mt-4 text-lg leading-relaxed text-slate-600",
                  centered && "mx-auto max-w-2xl",
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
