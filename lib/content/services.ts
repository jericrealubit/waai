/**
 * The four service lines, and the single place their copy and pricing live.
 *
 * NOTE ON PRICING: each line is sold as three fixed tiers rather than a range.
 * A range anchors every quote conversation at its lower bound and the upper
 * bound never gets sold, so the old `fromPrice`/`toPrice` bounds became the
 * cheapest and dearest tiers and a middle tier was added between them. The
 * price points themselves are unchanged. Every tier maps to work that has
 * actually shipped — see lib/content/case-studies.ts — so nothing here is
 * speculative scope.
 *
 * The `monthly` figure on each tier is DERIVED, not invented:
 *
 *     monthly = ceilToNearest10((price / TERM_MONTHS) + CARE_PLAN_MONTHLY) - 1
 *
 * i.e. the build spread over the term, plus the care plan a monthly client
 * gets bundled, rounded up to a charm price. Keep it that way — a client who
 * does the arithmetic should arrive at the same number. If you change a
 * `price`, recompute its `monthly` in the same edit.
 *
 * We deliberately do NOT publish competitor prices. Comparative "market rate"
 * figures are unverifiable third-party quotes, they position the firm as the
 * cheap option rather than the one whose work is live and readable, and
 * presenting them as a struck-out saving on a commercial site is exposure
 * under the Australian Consumer Law. Each service carries a `replaces` line
 * instead: what the build displaces, stated as fact.
 */

/** Minimum term on a monthly plan, and the divisor behind every `monthly`. */
export const TERM_MONTHS = 24;

/**
 * The care plan — content changes, SEO and priority support. Bundled into
 * every monthly plan, and available on its own after a build. Distinct from
 * `yearlyCost`, which is only hosting, domain and security patches; the two
 * used to both call themselves "maintenance" and contradict each other.
 */
export const CARE_PLAN_MONTHLY = 75;

export type ServiceSlug =
  | "tradie-websites"
  | "restaurant-ordering"
  | "manufacturing-automation"
  | "ecommerce";

/** Keys into the icon map in components/service-card.tsx. */
export type ServiceIcon = "hardhat" | "utensils" | "factory" | "shopping-bag";

export interface PriceTier {
  /** Product name, shown as the tier heading on the rate card. */
  name: string;
  /** One-off price in AUD. Null means "quoted per project". */
  price: number | null;
  /** Equivalent monthly over TERM_MONTHS, care plan included. Null where `price` is. */
  monthly: number | null;
  /** One line on what this tier covers, relative to the one below it. */
  summary: string;
  /**
   * Marks the tier most clients actually choose. Exactly one per service, and
   * it must stay an honest statement about what gets bought — not whichever
   * tier we would prefer to sell. Rendered as a hi-vis rule and a "Most
   * chosen" tag.
   *
   * Three identical-looking tiers make the visitor do the comparison work
   * unaided, and the common result is that they pick nothing and leave.
   */
  recommended?: boolean;
}

export interface Service {
  slug: ServiceSlug;
  /** Full name, used as page titles and headings. */
  name: string;
  /** Compact name for nav, badges and breadcrumbs. */
  shortName: string;
  icon: ServiceIcon;
  /** One line, used on the home services grid. */
  valueProp: string;
  /** Lead paragraph on the service detail page. */
  intro: string;
  /**
   * The three buyable sizes of this line, cheapest first. The first tier's
   * price is what `formatFromPrice` surfaces as the headline "From $X".
   */
  tiers: PriceTier[];
  /**
   * Optional extras a client can add to any tier, priced as one-off amounts.
   * Drives the add-on step of the quote docket at /quote.
   *
   * The monthly equivalent is always DERIVED from the resulting total by
   * `deriveMonthly` in lib/pricing.ts — never stored here — so an add-on
   * cannot introduce a monthly figure that disagrees with the rate card.
   */
  addOns?: { id: string; label: string; price: number; note: string }[];
  priceNote: string;
  /**
   * What this build displaces — a statement about the alternative's model,
   * not a competitor's price. Shown under the tier table on the rate card.
   */
  replaces: string;
  /** Optional flat annual cost shown alongside the build price. Hosting only — not the care plan. */
  yearlyCost?: {
    amount: number;
    note: string;
  };
  /** What a build in this line covers. */
  includes: string[];
  /** Capabilities offered but not necessarily demonstrated in the case studies. */
  alsoAvailable: string[];
  /** Who this line is for. */
  bestFor: string;
}

export const SERVICES: Service[] = [
  {
    slug: "tradie-websites",
    name: "Tradie Websites",
    shortName: "Tradie",
    icon: "hardhat",
    valueProp:
      "Lead-generating sites for trades — service pages, quote capture, and local search that puts you in front of nearby jobs.",
    intro:
      "Trade customers search by job and by suburb. We build a page per service so each one can rank on its own, wire up whichever conversion path suits your trade — a quote form or a tap-to-call number — and ship structured local SEO so you show up in the map pack.",
    tiers: [
      {
        name: "Site Notice",
        price: 599,
        monthly: 99,
        summary:
          "Three or four pages with your phone number as the conversion path. No forms to check, nothing to log into.",
      },
      {
        name: "Service Board",
        price: 1199,
        monthly: 129,
        summary:
          "Up to eight individually rankable service pages, a suburb-aware quote form, service-radius map and LocalBusiness markup.",
      },
      {
        name: "Lead Engine",
        price: 1999,
        monthly: 159,
        summary:
          "Thirteen or more service pages, Google Business Profile integration, and online booking or job scheduling.",
      },
    ],
    priceNote: "for a multi-page site with service pages and local SEO",
    replaces:
      "No lock-in. The repository and the deploy pipeline are yours from day one, on every tier and either way you pay.",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and security patches",
    },
    includes: [
      "A dedicated page per service so each ranks independently",
      "Quote form or tap-to-call, whichever converts for your trade",
      "Service-radius map and suburb targeting",
      "LocalBusiness structured data, sitemap and per-page OG tags",
      "Testimonial and gallery sections",
      "Deployed to Cloudflare with CI on every push",
    ],
    alsoAvailable: [
      "Quote submissions delivered to your inbox or CRM",
      "Online booking and job scheduling",
      "Google Business Profile integration",
    ],
    bestFor:
      "Bricklayers, panel beaters, landscapers, concreters — any trade where the customer searches for a job type near them.",
  },
  {
    slug: "restaurant-ordering",
    name: "Restaurant & Food Cart Ordering",
    shortName: "Restaurant",
    icon: "utensils",
    valueProp:
      "A menu people can actually order from — filterable, cart-based, with orders landing live on a kitchen dashboard.",
    intro:
      "A photo of your menu is not a menu. We build a filterable, searchable menu with item variants and dietary badges, a cart that survives a page refresh, and a staff dashboard where orders appear the moment they're placed — no phone, no third-party commission.",
    tiers: [
      {
        name: "Menu Board",
        price: 799,
        monthly: 109,
        summary:
          "A filterable, searchable menu with variants, per-option pricing and dietary badges. Browse only — no cart.",
      },
      {
        name: "Order Line",
        price: 1799,
        monthly: 149,
        summary:
          "Adds the persistent cart, the live kitchen dashboard, and trading-hours and delivery-radius gating.",
      },
      {
        name: "Full Service",
        price: 2999,
        monthly: 199,
        summary:
          "Adds card payment through Stripe, delivery as well as pickup, and SMS or email order confirmations.",
      },
    ],
    priceNote: "for a menu, cart and live kitchen dashboard",
    replaces:
      "Commission-free. An ordering platform takes a cut of every order for as long as you use it. This channel is yours and takes none.",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and security patches",
    },
    includes: [
      "Category filters, live search and dietary toggles",
      "Item variants and sizes with per-option pricing",
      "Cart that persists across refreshes, with quantity steppers",
      "Live staff dashboard — orders stream in, marked ready when done",
      "Trading-hours and delivery-radius gating so you never take an order you can't fill",
      "Automatic dietary and service badges derived from your menu data",
    ],
    alsoAvailable: [
      "Online card payment via Stripe",
      "Delivery as well as pickup",
      "SMS or email order confirmations",
    ],
    bestFor:
      "Smokehouses, cafes, food carts and takeaways that want their own ordering channel instead of paying commission per order.",
  },
  {
    slug: "manufacturing-automation",
    name: "Manufacturing Log Automation",
    shortName: "Automation",
    icon: "factory",
    valueProp:
      "Turn the clipboard on the factory floor into a tablet that times cycles, records defects, and prints the audit sheet for you.",
    intro:
      "Production floors run on grid checklists — cycle times, batch counts, defect positions. We rebuild that exact sheet as something an operator can tap through on a phone or tablet mid-shift, then have the totals, the audit sheet and the printable report generate themselves.",
    tiers: [
      {
        name: "Single Line",
        price: 1499,
        monthly: 139,
        summary:
          "One workflow: tap-to-start cycle timing, structured defect capture and the one-page printable audit sheet.",
      },
      {
        name: "Two Lines",
        price: 2499,
        monthly: 179,
        summary:
          "A second press or table on the same floor, with month-by-month history across both.",
      },
      {
        name: "Full Floor",
        price: 3999,
        monthly: 249,
        summary:
          "Three to five workflows, per-operator logins so entries are attributable, and rollups across every line.",
      },
    ],
    priceNote:
      "for a single-workflow digital log — up to five lines on the top tier",
    replaces:
      "Replaces the clipboard, not a software licence. No per-seat fee, no annual renewal, no vendor holding your shift data.",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and security patches",
    },
    includes: [
      "Digital forms that mirror your existing paper grid, not a generic replacement",
      "Tap-to-start / tap-to-end cycle timing with automatic duration calculation",
      "Structured defect capture — position grids, categories, counts",
      "Totals and fault rates computed as the shift runs",
      "One-page printable audit sheet, and month-by-month history",
      "Per-operator logins so entries are attributable",
    ],
    alsoAvailable: [
      "CSV and spreadsheet export",
      "Multi-site rollups beyond five lines",
      "Threshold alerts on fault rate",
    ],
    bestFor:
      "Small manufacturers still recording shift output on paper or in a spreadsheet nobody trusts.",
  },
  {
    slug: "ecommerce",
    name: "Ecommerce Websites",
    shortName: "Ecommerce",
    icon: "shopping-bag",
    valueProp:
      "A storefront and the admin panel behind it — you manage the catalogue, customers check out, both halves share one database.",
    intro:
      "Ecommerce is two products, not one. We build the storefront your customers see and the admin panel you actually live in, sharing a single database and image store so a product you add is live on the shop immediately and an order placed there appears in your dashboard.",
    tiers: [
      {
        name: "Storefront",
        price: 1999,
        monthly: 159,
        summary:
          "Product catalogue, cart with a running total, and Stripe Checkout confirmed by a signature-verified webhook.",
      },
      {
        name: "Storefront + Admin",
        price: 3499,
        monthly: 229,
        summary:
          "Adds the admin panel — full product CRUD, nested categories, drag-to-reorder galleries and the orders table.",
      },
      {
        name: "Full Retail",
        price: 4999,
        monthly: 289,
        summary:
          "Adds customer accounts and order history, discount codes, inventory tracking, and shipping or pickup options.",
      },
    ],
    priceNote: "for a storefront and admin panel on a shared catalogue",
    replaces:
      "Two products, one price — the storefront your customers see and the admin panel you live in, sharing one database.",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and security patches",
    },
    includes: [
      "Product catalogue with categories, images and per-category attributes",
      "Cart with quantity controls and a running total",
      "Stripe Checkout with a signature-verified webhook confirming payment",
      "Admin panel: full product CRUD, nested categories, drag-to-reorder image galleries",
      "Orders table showing what sold, to whom, and whether it's paid",
      "Cloud image storage so product photos load fast",
    ],
    alsoAvailable: [
      "Customer accounts and order history",
      "Discount codes and inventory tracking",
      "Shipping rates and pickup options",
    ],
    bestFor:
      "Retailers with a real catalogue who need to manage stock themselves rather than email a developer for every price change.",
  },
];

export const SERVICES_BY_SLUG: Record<ServiceSlug, Service> = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service]),
) as Record<ServiceSlug, Service>;

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

/** Renders one tier's one-off price, e.g. "$1,199" or "Custom quote". */
export function formatTierPrice(tier: PriceTier): string {
  if (tier.price === null) return "Custom quote";
  return `$${tier.price.toLocaleString("en-AU")}`;
}

/**
 * The headline price for a whole service line, e.g. "From $599" — the
 * cheapest tier that carries a fixed price. "Custom quote" when a line is
 * quoted per project throughout.
 *
 * Derived from `tiers` rather than stored separately, so a card and the rate
 * card cannot disagree about where a line starts.
 */
export function formatFromPrice(service: Service): string {
  const prices = service.tiers
    .map((tier) => tier.price)
    .filter((price): price is number => price !== null);

  if (prices.length === 0) return "Custom quote";

  return `From $${Math.min(...prices).toLocaleString("en-AU")}`;
}
