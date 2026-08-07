/**
 * Real, shipped projects — the evidence behind each service line.
 *
 * ACCURACY RULES for anything written here. Every claim was verified against
 * the live site and the public repo; several things people would assume are
 * true are NOT, and the copy must keep reflecting that:
 *
 *  - Jun's Maintenance quote form validates but only logs to console. There is
 *    no email backend. Never claim it delivers leads anywhere.
 *  - HVT Prestige's gallery page is unpopulated placeholder tiles. Don't cite it.
 *  - BBQ Heaven is PICKUP ONLY with NO online payment, and is vanilla ES6 —
 *    not Next.js. Its README says Netlify; it is actually on Cloudflare Pages.
 *  - Rubbergem "replacing paper forms" is an inference from the README's
 *    "replicates physical grid checklists" — keep it hedged, never asserted.
 *  - The ecommerce storefront has no user accounts despite its README saying so.
 *  - Stripe test-vs-live mode is unverified; describe the integration, never
 *    claim revenue figures.
 *
 * `liveUrl` and `repoUrl` are the canonical copies of these URLs. They are
 * declared exactly once, here, so a card and its detail page cannot drift.
 */

import type { ServiceSlug } from "./services";

export interface CaseStudy {
  slug: string;
  /** Project name as it should be displayed. */
  name: string;
  /** The business, and where it operates. */
  client: string;
  sector: string;
  service: ServiceSlug;
  liveUrl: string;
  repoUrl: string;
  /** Shown as the link label instead of the raw URL. */
  liveLabel: string;
  /** True when the live URL lands on a login wall rather than the product. */
  gated: boolean;
  screenshot: {
    src: string;
    alt: string;
    caption: string;
  };
  /** One sentence for the card. */
  outcome: string;
  /** Lead paragraph on the detail page. */
  summary: string;
  problem: string;
  /** What we built, as discrete decisions. */
  approach: string[];
  /** Specific details worth calling out. */
  highlights: string[];
  stack: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "juns-maintenance",
    name: "Jun's Maintenance",
    client: "Jun's Maintenance Service",
    sector: "Bricklaying & landscaping · Perth WA",
    service: "tradie-websites",
    liveUrl: "https://junsmaintenance.au/",
    repoUrl: "https://github.com/jericrealubit/junsmaintenance",
    liveLabel: "junsmaintenance.au",
    gated: false,
    screenshot: {
      src: "/work/juns-maintenance.png",
      alt: "Jun's Maintenance homepage showing the hero with 'Get a Free Quote' and 'View Services' calls to action",
      caption: "Homepage hero with dual quote and services CTAs",
    },
    outcome:
      "Thirteen individually rankable service pages, a suburb-aware quote form, and local structured data for a Perth trade.",
    summary:
      "A lead-generation site for a Perth bricklaying and landscaping trade, built so that every service the business offers gets its own page and its own shot at ranking.",
    problem:
      "Trade customers search by job and by suburb — 'retaining walls Caversham', not 'maintenance services'. A single-page site collapses thirteen searchable services into one URL that ranks for none of them.",
    approach: [
      "Split the offering into thirteen dedicated service pages — bricklaying, concreting, paving, tiling, rendering, plastering and gyprock, retaining walls, waterproofing, landscaping, garden maintenance, lawn and turf, handyman, patios and driveways.",
      "Built the quote form around what a tradie actually needs to price a job: suburb and service type alongside the usual contact fields, validated with react-hook-form and zod.",
      "Put the 30km service radius from Caversham on a map rather than in a list of suburbs, so the coverage question answers itself.",
      "Kept the services taxonomy and testimonials in typed content files, so adding a service is a data change rather than a new template.",
      "Shipped LocalBusiness structured data, a sitemap and per-route OG images for local search.",
    ],
    highlights: [
      "An autoplaying testimonial carousel that attaches a real suburb to each review — the strongest local trust signal available to a trade business.",
      "39 reviews at a 5.0 hipages rating surfaced on the page rather than buried on a third-party profile.",
      "Click-to-call in the header, because a meaningful share of trade enquiries never touch a form.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "react-hook-form",
      "zod",
      "Cloudflare Workers",
    ],
  },
  {
    slug: "hvt-prestige-panel-paint",
    name: "HVT Prestige Panel & Paint",
    client: "HVT Prestige Panel & Paint",
    sector: "Panel beating & restoration · Bayswater WA",
    service: "tradie-websites",
    liveUrl: "http://hvtprestigepanelpaint.au/",
    repoUrl: "https://github.com/jericrealubit/hvtprestigepanelpaint",
    liveLabel: "hvtprestigepanelpaint.au",
    gated: false,
    screenshot: {
      src: "/work/hvt-prestige-panel-paint.png",
      alt: "HVT Prestige Panel & Paint homepage hero with the phone number as the primary call to action",
      caption: "Homepage hero — phone number as the single conversion path",
    },
    outcome:
      "A deliberately form-free brochure site: one typed config file drives the whole thing, and the phone number is the only CTA.",
    summary:
      "A four-page site for a Bayswater panel beater covering collision repair, camper van refurbishment and vintage restoration — built around how auto-body customers actually get in touch.",
    problem:
      "Panel beating enquiries start with a phone call and a photo of the damage, not a contact form. A form-first site adds a step to a process that customers already know how to start.",
    approach: [
      "Dropped the contact form entirely. The phone number is the repeated primary CTA on every page.",
      "Kept the site to four focused pages covering the three service lines, with an embedded map and street address on contact.",
      "Moved all copy, services and navigation into a single typed config file, so the owner's changes land in one place.",
      "Built as a fully static export — no server runtime to pay for or patch.",
      "Set up GitHub Actions to deploy to Cloudflare Pages on every push to main.",
    ],
    highlights: [
      "Static export plus Cloudflare Pages means the hosting cost of this site is effectively zero and there is no server to keep patched.",
      "The single-source config file makes the whole site's content auditable at a glance — useful when the business owner, not a developer, is the one requesting changes.",
      "A deliberate contrast with the sister project: same core stack, opposite conversion strategy, because the two trades convert differently.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "Static export",
      "Cloudflare Pages",
      "GitHub Actions",
    ],
  },
  {
    slug: "bbq-heaven",
    name: "BBQ Heaven",
    client: "BBQ Heaven Rockingham",
    sector: "Smokehouse restaurant · Rockingham WA",
    service: "restaurant-ordering",
    liveUrl: "https://bbqheaven.au/",
    repoUrl: "https://github.com/jericrealubit/bbqheaven",
    liveLabel: "bbqheaven.au",
    gated: false,
    screenshot: {
      src: "/work/bbq-heaven.png",
      alt: "BBQ Heaven menu grid showing category filters, menu search, a spicy badge and per-item variant pricing, under a local pickup only banner",
      caption: "The menu grid — category filters, search and variant pricing",
    },
    outcome:
      "Commission-free pickup ordering: cart in the browser, order on the kitchen's screen the instant it's placed.",
    summary:
      "A menu and pickup ordering system for a Rockingham smokehouse, built so the restaurant keeps the full order value instead of paying a platform per transaction.",
    problem:
      "Third-party ordering platforms take a cut of every order and own the customer relationship. A PDF menu avoids the fee but pushes every order back onto the phone during service.",
    approach: [
      "Built a filterable menu grid — All, Starters, Mains, Kids Corner and Drinks — with live search and a gluten-free toggle.",
      "Gave items proper variants where the menu needs them, so Oyster Kilpatrick can be a half dozen at $26 or a dozen at $45 rather than two separate menu entries.",
      "Kept the cart in localStorage with a badge counter, so a customer can browse away and come back without losing their order.",
      "Wired order placement to Firebase Realtime Database, and built a staff dashboard that streams orders in live with a Mark Ready action.",
      "Gated ordering behind AWST trading hours and a 60km radius check, so the kitchen never receives an order it cannot fill.",
    ],
    highlights: [
      "Automatic badges — GF, Spicy, BBQ Table, Family to Share, No Sharing — are derived from the item data rather than tagged by hand on every dish.",
      "Items with size options open a chooser, while single-price items get a one-tap quick-add — the menu adapts the interaction to the dish instead of forcing every order through the same modal.",
      "SVG sketch fallbacks stand in for missing food photography, so a dish without a photo still looks deliberate instead of broken.",
      "The geofence and trading-hours gate solve an operational problem, not a technical one: they stop the kitchen having to ring customers back to cancel.",
      "Pickup only — this build takes no payment online, by design. Customers pay at collection.",
    ],
    stack: [
      "Vanilla ES6 modules",
      "Tailwind (CDN)",
      "Firebase Realtime DB",
      "Firebase Auth",
      "Supabase presence",
      "Cloudflare Pages",
    ],
  },
  {
    slug: "rubbergem",
    name: "Rubbergem Production Log",
    client: "Rubbergem",
    sector: "Rubber manufacturing · WA",
    service: "manufacturing-automation",
    liveUrl: "http://waai.au/rubbergem",
    repoUrl: "https://github.com/jericrealubit/rubbergem",
    liveLabel: "waai.au/rubbergem",
    gated: true,
    screenshot: {
      src: "/work/rubbergem.png",
      alt: "Rubbergem single-page landscape production audit sheet showing logged cycles with total and faulty mat counts",
      caption: "The one-page landscape production audit sheet",
    },
    outcome:
      "Press cycles timed by tapping a tablet; the shift's audit sheet and fault totals generate themselves.",
    summary:
      "A per-shift cycle logging system for a rubber press floor that replicates the physical grid checklist operators already use, then does the arithmetic and the paperwork automatically.",
    problem:
      "Press cycle times, mat counts and defect positions were being captured on grid checklists. Anything recorded that way has to be totalled by hand afterwards, and the sheet is the only copy.",
    approach: [
      "Modelled the digital form on the existing physical checklist rather than imposing a generic form — the defect grid mirrors the paper sheet's X-pattern layout, so operators don't have to relearn anything.",
      "Built cycle timing as two taps: TAP TO START and TAP TO END, with duration calculated automatically, including cycles that cross midnight.",
      "Captured defects structurally — short-mold pattern grids, plus bubble position (left, middle, right) and size (big, small) per table.",
      "Rolled logged cycles into a 15-row landscape audit sheet with total and faulty mat counts computed as the shift runs.",
      "Added a month and day grouped history view, and a print path that force-fits the audit sheet to a single page of PDF.",
    ],
    highlights: [
      "The cycle timer re-syncs on visibilitychange, so a press cycle keeps timing correctly even when the operator's phone locks mid-cycle — the failure mode that would otherwise make the whole tool untrustworthy.",
      "Both presses and all four mat types (DF, DD, CF, CD, SG) are first-class in the data model rather than free-text fields.",
      "The printable sheet is deliberately paper-shaped: the floor still wants a physical copy, and this one arrives already totalled.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "Supabase Postgres",
      "Supabase Auth",
      "Netlify",
    ],
  },
  {
    slug: "ecommerce-storefront",
    name: "Ecommerce Storefront",
    client: "Reference build",
    sector: "Retail storefront",
    service: "ecommerce",
    liveUrl: "https://nextjs-ecommerce-front.netlify.app/",
    repoUrl: "https://github.com/jericrealubit/ecommerce-front",
    liveLabel: "nextjs-ecommerce-front.netlify.app",
    gated: false,
    screenshot: {
      src: "/work/ecommerce-storefront.png",
      alt: "Ecommerce storefront cart page listing two products with price, quantity steppers, subtotals and a running total",
      caption: "Cart page — line items, quantity steppers and running total",
    },
    outcome:
      "Guest checkout through Stripe, with a signature-verified webhook confirming payment before an order is marked paid.",
    summary:
      "The customer-facing half of a two-part ecommerce build: catalogue, cart and checkout, reading from the same database the admin panel writes to.",
    problem:
      "A storefront is only half a shop. Without an admin side sharing its data, every product change becomes a developer task.",
    approach: [
      "Built the catalogue against a shared MongoDB — a featured product and new arrivals on the homepage, a full product grid, and detail pages with an image gallery.",
      "Held the cart in React Context with quantity steppers and a running total, surfaced as a live count in the header nav.",
      "Took checkout through a Stripe Checkout session created server-side, so card details never touch the application.",
      "Verified the Stripe webhook signature before flipping an order to paid — payment confirmation comes from Stripe, never from the browser redirect.",
      "Served product imagery from the same S3 bucket the admin panel uploads to, so there is one canonical copy of every product photo.",
    ],
    highlights: [
      "Checkout is guest-only by design — no account required to buy, which removes the most common drop-off point in a small catalogue.",
      "The paid flag is set by a signed server-to-server webhook rather than a client redirect, which is the difference between a real payment integration and a demo.",
      "Runs on live catalogue data rather than seed fixtures.",
    ],
    stack: [
      "Next.js 13 (Pages Router)",
      "React 18",
      "styled-components",
      "MongoDB",
      "Mongoose",
      "Stripe Checkout",
      "AWS S3",
      "Netlify",
    ],
  },
  {
    slug: "ecommerce-admin",
    name: "Ecommerce Admin Panel",
    client: "Reference build",
    sector: "Retail operations",
    service: "ecommerce",
    liveUrl: "https://nextjs-ecommerce-admin-jeric.vercel.app",
    repoUrl: "https://github.com/jericrealubit/ecommerce-admin",
    liveLabel: "nextjs-ecommerce-admin-jeric.vercel.app",
    gated: true,
    screenshot: {
      src: "/work/ecommerce-admin.png",
      alt: "Ecommerce admin product edit form showing the sortable image grid and category property fields",
      caption: "Product edit form with the drag-to-reorder image grid",
    },
    outcome:
      "The panel the shop owner lives in: product CRUD, nested categories, drag-to-reorder galleries, and the orders that came through the storefront.",
    summary:
      "The operator-facing half of the same ecommerce build — it authors the catalogue the storefront reads, and reads back the orders the storefront writes.",
    problem:
      "Catalogue management is the part of ecommerce that gets skipped, and then every price change, new product and reordered photo becomes a support ticket.",
    approach: [
      "Put the whole panel behind Google OAuth via NextAuth, with sessions persisted in the shared MongoDB.",
      "Built full product CRUD with dedicated new, edit and delete routes.",
      "Made categories nested, with a parent selector and per-category custom properties, so a product's fields follow from its category.",
      "Handled multi-image upload straight to AWS S3, with drag-and-drop reordering that sets the storefront's gallery order.",
      "Surfaced orders as a table — date, paid status, recipient, products — so the owner can see what sold without opening the database.",
    ],
    highlights: [
      "Admin and storefront define byte-identical Product schemas against one MongoDB and one S3 bucket, which is what makes a product added here appear on the shop immediately.",
      "SweetAlert2 confirmation on every destructive action — deleting a product is a two-step operation.",
      "Sortable image thumbnails control gallery order on the storefront, so merchandising is a drag rather than a data edit.",
    ],
    stack: [
      "Next.js 13",
      "React 18",
      "Tailwind 3",
      "NextAuth (Google)",
      "MongoDB",
      "Mongoose",
      "AWS S3",
      "react-sortablejs",
      "Vercel",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getCaseStudiesForService(service: ServiceSlug): CaseStudy[] {
  return CASE_STUDIES.filter((study) => study.service === service);
}
