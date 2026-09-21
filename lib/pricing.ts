import {
  CARE_PLAN_MONTHLY,
  SERVICES,
  TERM_MONTHS,
  type PriceTier,
  type Service,
} from "@/lib/content/services";

/**
 * The pricing arithmetic, in one place.
 *
 * This exists because of the quote docket at /quote. The docket has to show a
 * total and a monthly equivalent, and the one way that goes wrong is if it
 * computes them slightly differently from the published rate card — a visitor
 * who configures a job, sees $2,499, then opens the pricing section and reads
 * something else has been given a reason to distrust every other number on the
 * site.
 *
 * So the derivation documented in lib/content/services.ts lives here as real
 * code, the rate-card data is checked against it at module load in
 * development, and the docket is not allowed its own copy.
 */

/** Rounds up to the next multiple of ten. */
export function ceilToNearest10(value: number): number {
  return Math.ceil(value / 10) * 10;
}

/**
 * The monthly equivalent of a one-off price: the build spread over the minimum
 * term, plus the bundled care plan, rounded up to a charm price.
 *
 *     monthly = ceilToNearest10((price / TERM_MONTHS) + CARE_PLAN_MONTHLY) - 1
 *
 * A client who does this arithmetic themselves must land on the number we
 * published, which is the whole reason it is a derivation and not a guess.
 */
export function deriveMonthly(price: number): number {
  return ceilToNearest10(price / TERM_MONTHS + CARE_PLAN_MONTHLY) - 1;
}

/** Australian dollars, no cents — prices on this site are always whole. */
export function formatAUD(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-AU")}`;
}

/** A configured job: one tier plus whatever add-ons were selected. */
export interface QuoteSelection {
  service: Service;
  tier: PriceTier;
  addOnIds: string[];
}

export interface QuoteTotal {
  /** Null when the chosen tier is quoted per project. */
  oneOff: number | null;
  /** Null wherever `oneOff` is. */
  monthly: number | null;
  lineItems: { label: string; amount: number | null }[];
}

/**
 * Totals a configured job.
 *
 * A null-priced tier ("quoted per project") makes the whole quote a null —
 * adding priced extras to an unknown base would produce a number that looks
 * authoritative and means nothing.
 */
export function quoteTotal({
  service,
  tier,
  addOnIds,
}: QuoteSelection): QuoteTotal {
  const chosenAddOns = (service.addOns ?? []).filter((addOn) =>
    addOnIds.includes(addOn.id),
  );

  const lineItems = [
    { label: `${service.shortName} — ${tier.name}`, amount: tier.price },
    ...chosenAddOns.map((addOn) => ({
      label: addOn.label,
      amount: addOn.price,
    })),
  ];

  if (tier.price === null) {
    return { oneOff: null, monthly: null, lineItems };
  }

  const oneOff =
    tier.price + chosenAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  return { oneOff, monthly: deriveMonthly(oneOff), lineItems };
}

/**
 * A coarse band for analytics, so GA gets the shape of demand without a
 * cardinality explosion of exact dollar values.
 */
export function estimateBand(oneOff: number | null): string {
  if (oneOff === null) return "custom";
  if (oneOff < 1000) return "under-1k";
  if (oneOff < 2000) return "1k-2k";
  if (oneOff < 3500) return "2k-3.5k";
  if (oneOff < 6000) return "3.5k-6k";
  return "6k-plus";
}

/**
 * Development-time check that every published tier's `monthly` really is
 * `deriveMonthly(price)`.
 *
 * lib/content/services.ts asks whoever edits a price to recompute the monthly
 * in the same edit. That was a convention enforced by a comment, and the docket
 * makes it load-bearing: it derives its own monthly from the same function, so
 * a stale `monthly` in the data would show one figure on the rate card and a
 * different one on the quote for the identical job.
 *
 * Throws loudly in development and in `npm run build`, and is stripped from the
 * production bundle. It lives here rather than in services.ts because
 * services.ts cannot import this module without creating a cycle.
 */
if (process.env.NODE_ENV !== "production") {
  for (const service of SERVICES) {
    for (const tier of service.tiers) {
      if (tier.price === null) {
        if (tier.monthly !== null) {
          throw new Error(
            `[pricing] ${service.slug} / ${tier.name}: price is null (quoted per project) but monthly is ${tier.monthly}. Both must be null together.`,
          );
        }
        continue;
      }

      const expected = deriveMonthly(tier.price);
      if (tier.monthly !== expected) {
        throw new Error(
          `[pricing] ${service.slug} / ${tier.name}: monthly is ${tier.monthly}, but ${tier.price} over ${TERM_MONTHS} months plus the $${CARE_PLAN_MONTHLY} care plan derives ${expected}. Update the monthly in lib/content/services.ts, or the rate card and the quote docket will disagree.`,
        );
      }
    }
  }
}
