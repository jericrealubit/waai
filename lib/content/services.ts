/**
 * The four service lines, and the single place their copy and pricing live.
 *
 * NOTE ON PRICING: figures were benchmarked against active Perth providers
 * (Aug 2026) — see waai-redesign notes. All four lines are priced below
 * their nearest comparable:
 *   - Tradie Websites: $499–$899 vs. $1,295+ for a template build,
 *     $3,000+ for a custom one. Backed by a $50/yr hosting+domain+
 *     maintenance bundle that undercuts the $120–$600/yr competitors
 *     charge for hosting alone.
 *   - Restaurant & Food Cart Ordering: $699–$999 one-time vs. SaaS
 *     ordering platforms charging $27–$99/week (i.e. $1,400–$5,150/yr)
 *     forever, with no lock-in.
 *   - Ecommerce Websites: $1,999–$4,999 vs. $1,500–$5,000 for a basic
 *     pre-built Shopify setup — despite shipping a fully custom storefront
 *     *and* admin panel, not just a Shopify theme.
 *   - Manufacturing Log Automation: $1,499–$4,999 for a single-workflow
 *     build vs. $15,000–$30,000+ from established Perth software firms
 *     for the same scope; multi-workflow builds move to a custom quote.
 *
 * Every line also carries a flat $50/yr `yearlyCost` (hosting, domain and
 * maintenance) — undercuts the $120–$600/yr competitors charge for hosting
 * alone, let alone maintenance on top.
 */

export type ServiceSlug =
  | "tradie-websites"
  | "restaurant-ordering"
  | "manufacturing-automation"
  | "ecommerce";

/** Keys into the icon map in components/service-card.tsx. */
export type ServiceIcon = "hardhat" | "utensils" | "factory" | "shopping-bag";

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
  /** Displayed price. Null means "quoted per project". */
  fromPrice: number | null;
  /** Optional upper bound — when set, displayed as a "$fromPrice–$toPrice" range instead of "From $fromPrice". */
  toPrice?: number;
  priceNote: string;
  /** Optional flat annual cost shown alongside the build price (e.g. hosting/domain/maintenance bundled in). */
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
    fromPrice: 499,
    toPrice: 899,
    priceNote: "for a multi-page site with service pages and local SEO",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and maintenance",
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
    fromPrice: 699,
    toPrice: 999,
    priceNote: "for a menu, cart and live kitchen dashboard",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and maintenance",
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
    fromPrice: 1499,
    toPrice: 4999,
    priceNote:
      "for a single-workflow digital log — multi-workflow builds are quoted separately",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and maintenance",
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
      "Multi-site and multi-line rollups",
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
    fromPrice: 1999,
    toPrice: 4999,
    priceNote: "for a storefront and admin panel on a shared catalogue",
    yearlyCost: {
      amount: 50,
      note: "per year for hosting, domain and maintenance",
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

/**
 * Formats the price for display, e.g. "From $899", "$499–$899" when a
 * `toPrice` range is set, or "Custom quote" when `fromPrice` is null.
 */
export function formatFromPrice(service: Service): string {
  if (service.fromPrice === null) return "Custom quote";

  const from = service.fromPrice.toLocaleString("en-AU");

  if (service.toPrice == null) return `From $${from}`;

  const to = service.toPrice.toLocaleString("en-AU");
  return `$${from}–$${to}`;
}
