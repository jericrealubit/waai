import { cn } from "@/lib/utils";

/**
 * One cell of an engineering title-block: a mono label over a display value.
 *
 * Extracted from the `TbCell` that lived inside app/(sections)/hero.tsx, so the
 * hero's firm summary and a case study's KPI strip are visibly the same object
 * rather than two things that happen to look similar.
 */
export function SpecCell({
  label,
  value,
  note,
  className,
}: {
  label: string;
  /**
   * A string in most places. Widened to ReactNode so the hero's title-block can
   * pass an animated span — the cell's border and label are printed by the
   * server and never move; only the entry stamps in.
   */
  value: React.ReactNode;
  /** Optional provenance, e.g. the third party a figure came from. */
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-paper px-3.5 py-3", className)}>
      <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-foreground-subtle">
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-extrabold uppercase leading-none tracking-tight text-foreground">
        {value}
      </div>
      {note && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
          via {note}
        </div>
      )}
    </div>
  );
}

/**
 * The KPI strip under a case study's title.
 *
 * Renders nothing when a study has no `metrics` — a case study without
 * countable facts is not padded out with filler, which is the rule stated on
 * the field in lib/content/case-studies.ts.
 */
export function SpecStrip({
  metrics,
  className,
}: {
  metrics?: { value: string; label: string; source?: string }[];
  className?: string;
}) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-px border-2 border-bitumen bg-line sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-paper px-4 py-4">
          <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-foreground-subtle">
            {metric.label}
          </dt>
          <dd className="mt-1.5 font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-foreground">
            {metric.value}
          </dd>
          {metric.source && (
            <dd className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
              Source: {metric.source}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
