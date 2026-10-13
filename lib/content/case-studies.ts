/**
 * Real, shipped projects — the evidence behind each service line, plus the
 * products we design, build and run ourselves.
 *
 * ACCURACY RULES for anything written here. Every claim was verified against
 * the live site and the repo (public for client builds, private for our own
 * products); several things people would assume are true are NOT, and the
 * copy must keep reflecting that:
 *
 *  - Jun's Maintenance quote form validates but only logs to console. There is
 *    no email backend. Never claim it delivers leads anywhere.
 *  - JRM Top Build's quote form (`submitQuote` server action) validates with
 *    Zod and only console.logs the enquiry — same situation as Jun's
 *    Maintenance, no email provider configured. Never claim it delivers leads.
 *  - HVT Prestige's gallery page is unpopulated placeholder tiles. Don't cite it.
 *  - BBQ Heaven is PICKUP ONLY with NO online payment, and is vanilla ES6 —
 *    not Next.js. Its README says Netlify; it is actually on Cloudflare Pages.
 *  - Rubbergem "replacing paper forms" is an inference from the README's
 *    "replicates physical grid checklists" — keep it hedged, never asserted.
 *  - The ecommerce storefront has no user accounts despite its README saying so.
 *  - Stripe test-vs-live mode is unverified; describe the integration, never
 *    claim revenue figures.
 *  - The ecommerce storefront and admin panel are ONE case study (`ecommerce-
 *    platform`), not two — they're presented as a single combined build in
 *    "Our work" via `secondaryLink`, since that's how the service is sold.
 *    The admin panel is still gated (its live URL only renders a Google
 *    sign-in button); the primary screenshot shown is the storefront's.
 *
 *  - Counter and Goodlist are OUR OWN products (`kind: "product"`), not client
 *    builds, and their repos are PRIVATE: no `repoUrl`, rendered as "Closed
 *    source", never a Source link. Their copy was verified against the private
 *    repos, which a reader can't do — so a product's `metrics` must be
 *    checkable from the live product or its public pages (signing up counts),
 *    never a count only the repo shows. Never imply merchants, users,
 *    installs or revenue.
 *  - Counter: "Card" is a tender LABEL the cashier picks — no card
 *    processing, no terminal integration, no split tender. Receipts print
 *    through the browser: no ESC/POS printer, cash drawer or
 *    WebUSB/Serial/Bluetooth code, and scanners work as keyboard input only.
 *    No offline mode (the cart persists in localStorage, nothing more).
 *    Subscriptions are collected manually, not through Stripe. One store per
 *    account. cpos.au is canonical — never cite the vercel.app deploy. No
 *    client store is named anywhere; don't imply one.
 *  - Goodlist: the Android build is in Google Play OPEN TESTING, not a
 *    production release — never "on Google Play" as if shipped; update this
 *    rule when it is. No iOS app (iPhone users use the web build). The repo's
 *    store screenshots are HTML mockups — never use them. Purchases and push
 *    are unverified as live: no paying-user or install claims. The home-screen
 *    widget landed after the 1.5.0 release — don't cite it. "12 languages" is
 *    a catalog count of machine-quality translations, never "fully
 *    localised". Voice entry is English-only.
 *
 *  - `metrics` carries COUNTABLE facts only — things a reader could check by
 *    opening the live site or the repo. Never a business outcome (conversion
 *    lift, revenue, traffic, "x% faster"): we have no access to any client's
 *    analytics or books, so such a figure could only be invented. Omitting the
 *    field is always allowed; padding it is not.
 *  - `testimonial` requires `consent: true` typed literally, which asserts the
 *    named client approved that exact wording for publication. Drafts awaiting
 *    a client's sign-off live in docs/testimonial-drafts.md and must NOT be
 *    added here until the client has agreed to them.
 *
 * `liveUrl` and `repoUrl` are the canonical copies of these URLs. They are
 * declared exactly once, here, so a card and its detail page cannot drift. A
 * study without a `repoUrl` is closed source, and every surface says so.
 */

import type { ServiceSlug } from "./services";

/** The fields every study carries, whoever it was built for. */
interface CaseStudyBase {
  slug: string;
  /** Project name as it should be displayed. */
  name: string;
  /** The business, and where it operates. For a product, the studio itself. */
  client: string;
  sector: string;
  liveUrl: string;
  /** Shown as the link label instead of the raw URL. */
  liveLabel: string;
  /** True when the live URL lands on a login wall rather than the product. */
  gated: boolean;
  /**
   * Null when there is no honest screenshot to show — i.e. the live URL only
   * ever renders a login screen, so a capture would show nothing about the
   * product. The card and detail page render a labelled fallback instead of
   * inventing a mockup.
   */
  screenshot: {
    src: string;
    alt: string;
    caption: string;
  } | null;
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
  /**
   * COUNTABLE facts only — a number a reader could verify for themselves by
   * opening the live site or the repo, or by looking at a public profile.
   * Page counts, catalogue sizes, review counts, form field counts.
   *
   * NEVER a business outcome: no conversion lift, no revenue, no traffic
   * figure, no "40% faster". We do not have access to any client's analytics
   * or books, so any such number would be invented — which is both a lie to
   * the reader and, presented as a marketing claim, exposure under the
   * Australian Consumer Law. `source` names where a figure came from when it
   * is not the build itself (e.g. "hipages").
   *
   * Omit the field rather than pad it. Two honest metrics beat four invented
   * ones, and a case study with none is not a weaker case study.
   */
  metrics?: { value: string; label: string; source?: string }[];
  /**
   * A real, attributed quote from the client.
   *
   * `consent: true` is a literal, not a boolean — typing it is the attestation
   * that THIS client has seen THIS wording and agreed to it being published
   * with their name and business attached. There is no way to render a
   * testimonial without asserting that, which is the point: an un-approved
   * draft cannot be committed here by accident.
   *
   * No paraphrasing, no composites, no "a client in Rockingham". If the quote
   * is not the client's own approved words, it does not go in this file.
   */
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    business: string;
    suburb?: string;
    consent: true;
  };
}

/**
 * Built for a client — or, for ecommerce, as the reference build behind a
 * service line. Always sold under a `ServiceSlug`, always live, and always
 * with a public repository: that pairing is the claim the site leads with.
 */
export interface ClientCaseStudy extends CaseStudyBase {
  kind: "client";
  service: ServiceSlug;
  repoUrl: string;
  /**
   * A second build linked from the same case study — e.g. the admin panel
   * behind a storefront. Rendered as its own labelled live+repo link pair,
   * on both the card and the detail page. Most case studies are a single
   * build and omit this.
   */
  secondaryLink?: {
    label: string;
    liveUrl: string;
    repoUrl: string;
    liveLabel: string;
    gated: boolean;
  };
}

/**
 * Designed, built and run by WA AI Digital — not a client build, and not sold
 * as a service line, so it has no `service`. Grouped on its own at
 * /work#products. Omitting `repoUrl` marks it closed source; every surface
 * then renders a "Closed source" marker instead of a Source link.
 *
 * `service` and `secondaryLink` are typed `never` rather than left off, so
 * code can read them on the union without narrowing first.
 */
export interface ProductCaseStudy extends CaseStudyBase {
  kind: "product";
  service?: never;
  repoUrl?: string;
  secondaryLink?: never;
}

export type CaseStudy = ClientCaseStudy | ProductCaseStudy;

export const CASE_STUDIES: CaseStudy[] = [
  {
    kind: "client",
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
      src: "/work/juns-maintenance.webp",
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
    /* Both countable, both checkable: the thirteen pages by opening the site,
       the rating on the trade's public hipages profile. */
    metrics: [
      { value: "13", label: "Individually rankable service pages" },
      { value: "5.0", label: "Rating across 39 reviews", source: "hipages" },
      { value: "30km", label: "Service radius mapped from Caversham" },
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
    kind: "client",
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
      src: "/work/hvt-prestige-panel-paint.webp",
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
    /* Countable by opening the site and the repo. "0 forms" is the
       deliberate design decision, not an absence of work. */
    metrics: [
      { value: "4", label: "Focused pages, three service lines" },
      { value: "0", label: "Contact forms — the phone is the CTA" },
      { value: "1", label: "Typed config file drives all copy" },
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
    kind: "client",
    slug: "jrm-top-build",
    name: "JRM Top Build",
    client: "JRM Top Build Ltd",
    sector: "Renovations & building · Christchurch NZ",
    service: "tradie-websites",
    liveUrl: "https://jrmtopbuild.nz/",
    repoUrl: "https://github.com/jericrealubit/jrmtopbuild",
    liveLabel: "jrmtopbuild.nz",
    gated: false,
    screenshot: {
      src: "/work/jrm-top-build.webp",
      alt: "JRM Top Build homepage hero with 'Get a Free Quote' and 'Call' calls to action over a decking and pergola project photo",
      caption: "Homepage hero with dual quote and call CTAs",
    },
    outcome:
      "Five dedicated service pages, a console-logged quote form and a GeneralContractor structured-data profile carrying the business's NZBN for a Christchurch building trade.",
    summary:
      "A lead-generation site for a Christchurch renovation and building company, built around the five trades it actually sells and the local search terms each one gets found by.",
    problem:
      "A general building company sells five distinct jobs — renovations, pergolas, decking, floor planks, bathrooms — and a one-page site flattens all of them into a single URL that can't rank for any single service near Christchurch.",
    approach: [
      "Split the offering into five dedicated service pages — renovations & alterations, pergolas, decking, floor planks, and bathroom renovations — each carrying its own summary, included-deliverables list, four-step process and FAQ.",
      "Built the quote form on Next.js Server Actions with Zod validation, matching the dual-CTA pattern of 'Get a Free Quote' and 'Call' rather than forcing every enquiry through one channel.",
      "Modelled twelve Christchurch and Canterbury suburbs with Hornby flagged as the business's base, feeding the service-area page and the structured-data address.",
      "Shipped schema.org GeneralContractor structured data carrying the business's NZBN and a nested Offer/Service entry per service line, not a generic LocalBusiness block.",
      "Kept services, suburbs, testimonials and business identity in typed content files (lib/services.ts, lib/suburbs.ts, lib/testimonials.ts, lib/site-config.ts), so content changes stay data edits.",
    ],
    highlights: [
      "Dual 'Get a Free Quote' and 'Call' CTAs in the hero, because trade enquiries split between a form and a phone call and the site shouldn't force a choice.",
      "GeneralContractor schema.org markup carrying the NZBN and a per-service Offer entry — richer local-SEO structured data than a flat LocalBusiness block.",
      "The quote form validates and logs every enquiry server-side today; wiring in real email delivery is a config change, not a rebuild, since the insertion point is already there.",
    ],
    /* Countable from the live site and the repo's content files. */
    metrics: [
      { value: "5", label: "Dedicated service pages" },
      { value: "12", label: "Canterbury suburbs modelled" },
      { value: "NZBN", label: "Carried in GeneralContractor schema" },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "Zod",
      "Server Actions",
      "Cloudflare Workers",
    ],
  },
  {
    kind: "client",
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
      src: "/work/bbq-heaven.webp",
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
    /* All countable from the live menu and the repo. The 0% is the point of
       the build: no platform commission on any order. */
    metrics: [
      { value: "0%", label: "Commission per order" },
      { value: "5", label: "Menu categories, filterable" },
      { value: "60km", label: "Delivery radius gate" },
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
    kind: "client",
    slug: "rubbergem",
    name: "Rubbergem Production Log",
    client: "Rubbergem",
    sector: "Rubber manufacturing · WA",
    service: "manufacturing-automation",
    liveUrl: "http://waai.au/rubbergem",
    repoUrl: "https://github.com/jericrealubit/rubbergem",
    liveLabel: "waai.au/rubbergem",
    // The entry form itself is publicly reachable; the live log, history and
    // audit sheet sit behind an operator login.
    gated: false,
    screenshot: {
      src: "/work/rubbergem.webp",
      alt: "Rubbergem press entry form showing shift information fields, the four-table mat type setup grid, and tap to start and tap to end cycle timing controls",
      caption: "The press entry terminal — shift setup and cycle timing",
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
      "Both presses, all four tables and every mat type (DF, DD, CF, CD, SG) are first-class in the data model rather than free-text fields.",
      "The printable sheet is deliberately paper-shaped: the floor still wants a physical copy, and this one arrives already totalled.",
    ],
    /* Countable from the running app. "2 taps" is the interaction cost of
       timing a cycle, which is the whole design constraint. */
    metrics: [
      { value: "2", label: "Taps to time a press cycle" },
      { value: "15", label: "Rows per printable audit sheet" },
      { value: "1", label: "Page the PDF force-fits to" },
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
    kind: "client",
    slug: "ecommerce-platform",
    name: "Ecommerce Storefront & Admin",
    client: "Reference build",
    sector: "Retail — storefront & operations",
    service: "ecommerce",
    liveUrl: "https://nextjs-ecommerce-front.netlify.app/",
    repoUrl: "https://github.com/jericrealubit/ecommerce-front",
    liveLabel: "nextjs-ecommerce-front.netlify.app",
    gated: false,
    secondaryLink: {
      label: "Admin panel",
      liveUrl: "https://nextjs-ecommerce-admin-jeric.vercel.app",
      repoUrl: "https://github.com/jericrealubit/ecommerce-admin",
      liveLabel: "nextjs-ecommerce-admin-jeric.vercel.app",
      // The deployed admin renders nothing but a "Login with Google" button —
      // there is no honest screenshot of it to show, so the card's screenshot
      // is the storefront's, and this link is labelled as gated instead.
      gated: true,
    },
    screenshot: {
      src: "/work/ecommerce-storefront.webp",
      alt: "Ecommerce storefront cart page listing two products with price, quantity steppers, subtotals and a running total",
      caption: "Cart page — line items, quantity steppers and running total",
    },
    outcome:
      "Two apps, one database — a product added in the admin panel is live on the shop immediately, and an order placed on the shop appears in the admin's orders table immediately.",
    summary:
      "A two-part ecommerce build: the storefront customers buy from (catalogue, cart, Stripe checkout) and the admin panel the owner actually lives in (product CRUD, nested categories, orders) — both reading and writing the same MongoDB and S3 bucket.",
    problem:
      "Ecommerce is two products, not one. A storefront with no admin side sharing its data turns every price change into a developer task, and an admin panel that doesn't share the storefront's exact schema drifts out of sync the moment either side changes.",
    approach: [
      "Storefront: built the catalogue against a shared MongoDB — a featured product and new arrivals on the homepage, a full product grid, and detail pages with an image gallery.",
      "Storefront: held the cart in React Context with quantity steppers and a running total, surfaced as a live count in the header nav.",
      "Storefront: took checkout through a Stripe Checkout session created server-side, then verified the webhook signature before flipping an order to paid — payment confirmation comes from Stripe, never from the browser redirect.",
      "Admin: put the whole panel behind Google OAuth via NextAuth, with sessions persisted in the same MongoDB.",
      "Admin: built full product CRUD with dedicated new, edit and delete routes, and nested categories with per-category custom properties.",
      "Admin: handled multi-image upload straight to AWS S3, with drag-and-drop reordering that sets the storefront's gallery order.",
      "Shared: defined byte-identical Product schemas on both sides against one MongoDB and one S3 bucket, so there is exactly one canonical copy of every product and its photos.",
    ],
    highlights: [
      "Admin and storefront share one schema and one database — a product added in the admin panel appears on the shop immediately, with no sync step.",
      "The paid flag is set by a signed server-to-server Stripe webhook rather than a client redirect, which is the difference between a real payment integration and a demo.",
      "Checkout is guest-only by design — no account required to buy, which removes the most common drop-off point in a small catalogue.",
      "Sortable image thumbnails in the admin control gallery order on the storefront, so merchandising is a drag rather than a data edit.",
      "SweetAlert2 confirmation on every destructive action in the admin — deleting a product is a two-step operation.",
    ],
    /* Countable from the two repos. Deliberately no revenue or order-volume
       figure — Stripe live-vs-test mode is unverified (see ACCURACY RULES). */
    metrics: [
      { value: "2", label: "Apps sharing one database" },
      { value: "S3", label: "Multi-image upload, drag to reorder" },
      { value: "Webhook", label: "Stripe signature verified server-side" },
    ],
    stack: [
      "Next.js 13 (Pages Router)",
      "React 18",
      "styled-components",
      "Tailwind 3",
      "MongoDB",
      "Mongoose",
      "Stripe Checkout",
      "NextAuth (Google)",
      "AWS S3",
      "react-sortablejs",
      "Netlify",
      "Vercel",
    ],
  },

  /* ── Our own products. Closed source: no `repoUrl` (see ACCURACY RULES). ── */

  {
    kind: "product",
    slug: "counter",
    name: "Counter",
    client: "WA AI Digital",
    sector: "Retail point of sale · AU, NZ & PH",
    liveUrl: "https://cpos.au/",
    liveLabel: "cpos.au",
    // The root is a public landing page with self-serve sign-up; only the
    // till and the back office sit behind sign-in.
    gated: false,
    screenshot: {
      src: "/work/counter.webp",
      alt: "Counter's back office product list, with category, size, price, stock and barcode columns under Categories, Receive, Import and Add product actions",
      caption: "Back office — the product catalogue, stock and barcodes",
    },
    outcome:
      "The till and the pay-later book in one app — scan, ring up, and put a regular's purchase on their tab instead of in a notebook.",
    summary:
      "Our own point of sale for a single retail store: scan a barcode with the phone's camera or a plugged-in reader, ring up the sale, and when a regular needs to pay later, it goes straight onto their tab. Built for small shops in Australia and New Zealand and sari-sari stores in the Philippines.",
    problem:
      "A shop that lets regulars pay later usually runs two systems that never meet: the till for the sale, and a notebook for who owes what. The notebook has no totals, no statement to hand the customer and no link back to what was actually bought — so every balance is added up by hand, and every reminder is awkward.",
    approach: [
      "Made the till work on the phone already in the shopkeeper's hand: camera scanning through the browser's BarcodeDetector with a zxing fallback, and USB or Bluetooth scanners picked up as keyboard input by keystroke timing — no driver, nothing to install.",
      "Built the pay-later book as an itemised ledger rather than a running number: every entry ties back to the sale it came from, with a soft credit limit, a statement PDF and a link the customer can open to see their own tab. Reminders are pre-written WhatsApp or SMS messages the shopkeeper sends from their own phone.",
      "Routed every sale through Postgres functions instead of direct table inserts. Insert rights on sales and payments were revoked after a review found a staff account could otherwise record a sale at any total it liked.",
      "Handled tax the way each market does — GST at 10% in Australia and 15% in New Zealand, VAT at 12% in the Philippines — calculated once per invoice, with discounts spread across lines by largest remainder and cash totals rounded to the nearest 5c or 10c.",
      "Derived the whole plan state — trial, Premium, lapsed — from a single paid-until date, so there is no scheduled job to forget, and priced each market on its own terms rather than converting one price by exchange rate.",
    ],
    highlights: [
      "Every one of the 16 tables runs row-level security, and column-level grants stop a store admin editing their own paid-until date — permissions are enforced by Postgres, not trusted to the screen.",
      "Philippine pricing is annual-only on purpose: on a ₱50 monthly payment, per-transaction fees would take 30–40% of it.",
      "Cash-up uses a blind count — the drawer is counted before the expected total is shown, so the count can't be nudged toward the answer.",
      "Tabs carry no late fees, by design. Charging for credit is what starts to pull a shop's book toward consumer-credit regulation, and a till shouldn't walk a corner shop over that line.",
      "Card is recorded as a tender, not processed — there's no terminal integration, and receipts print through the browser. A shop starts selling without buying any hardware.",
    ],
    /* Checkable on cpos.au or by signing up. The repo is private, so no
       repo-only counts here (see ACCURACY RULES). */
    metrics: [
      { value: "4", label: "Pricing regions — AU, NZ, PH, rest of world" },
      { value: "3", label: "Staff roles — owner, admin, cashier" },
      { value: "2", label: "Ways to scan — phone camera or USB/Bluetooth reader" },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "Supabase Postgres",
      "Supabase Auth",
      "zod",
      "pdf-lib",
      "zxing",
      "Vitest",
      "Cloudflare Workers",
    ],
  },
  {
    kind: "product",
    slug: "goodlist",
    name: "Goodlist",
    client: "WA AI Digital",
    sector: "Shared to-dos, alarms & meds · Android & web",
    liveUrl: "https://goodlist.expo.app/",
    liveLabel: "goodlist.expo.app",
    // The web build opens on sign-in; anyone can create an account.
    gated: true,
    screenshot: {
      src: "/work/goodlist.webp",
      // A real capture from the Android app, not the repo's store artwork.
      alt: "Goodlist's Tasks tab on Android: the group header, All, Today, Overdue and Next 7 days filters, Personal and Requested lists, a column of tasks with due dates, the 'I want to…' entry bar with a voice button, and the five-tab bar",
      caption: "The Tasks tab on Android — filters, the task list and voice entry",
    },
    outcome:
      "Personal and shared to-dos, medicine schedules and alarms that keep ringing until they're answered — one Expo codebase on Android and the web.",
    summary:
      "Our own task app for personal to-dos and for sharing them with a family or a small team, with recurring tasks, medicine schedules and persistent alarms built in. One codebase runs on Android and on the web; there's no iPhone app, so iPhone users use the web build.",
    problem:
      "A household's jobs end up spread across a shared list in one app, reminders in another and medicine times in a third — and a single notification is easy to swipe away and forget. The reminders that matter most are exactly the ones that can't be allowed to fail quietly.",
    approach: [
      "Built one Expo Router codebase for Android and the web — five tabs (Tasks, Calendar, Meds, Group, Settings), typed routes and the React Compiler — rather than two apps that drift apart.",
      "Made it offline-first: the query cache persists to the device, changes made without a signal queue up and replay when it returns, and Supabase Realtime keeps a shared group's lists in step.",
      "Scheduled alarms on the device rather than pushing them from a server, through a small Kotlin module for exact alarms — re-ringing every five minutes for up to twelve hours until answered. It asks only for SCHEDULE_EXACT_ALARM, because Google Play restricts USE_EXACT_ALARM.",
      "Modelled medicine as schedules plus recorded doses, and derived missed doses instead of storing them, so the history can never disagree with the schedule.",
      "Kept Premium out of the app's hands: entitlements live in the database and are written only by a RevenueCat webhook running as a Supabase Edge Function.",
    ],
    highlights: [
      "A security review of the database found four holes — hijacking someone else's task, spoofing a dose, wiping a group, and rejoining after removal. Each was closed and pinned with a regression test.",
      "Voice entry uses the phone's own speech recogniser, and no audio is kept. English only, for now.",
      "Legal and guide text is written once and rendered both in the app and on the docs site — CI fails if the two drift apart.",
      "Over-the-air updates are keyed to a fingerprint of the native runtime, so a JavaScript update can't land on a build it wasn't made for.",
      "The Android build is in Google Play open testing, not yet a production release — which is why the live link here is the web build, the version anyone can open today.",
    ],
    /* Checkable by signing up on the web build. The repo is private. */
    metrics: [
      { value: "5", label: "Tabs — tasks, calendar, meds, group, settings" },
      { value: "12", label: "Interface languages to pick from" },
      { value: "32", label: "Themes — 29 free, 3 Premium" },
    ],
    stack: [
      "Expo SDK 57",
      "React Native 0.86",
      "Expo Router",
      "TypeScript",
      "Reanimated 4",
      "TanStack Query",
      "Supabase Postgres",
      "Supabase Realtime",
      "Edge Functions",
      "RevenueCat",
      "Kotlin",
      "EAS Build & Hosting",
    ],
  },
];

/** Client builds, in array order — the studies sold under a service line. */
export const CLIENT_STUDIES: ClientCaseStudy[] = CASE_STUDIES.filter(
  (study): study is ClientCaseStudy => study.kind === "client",
);

/** Our own products, in array order — grouped on their own at /work#products. */
export const PRODUCT_STUDIES: ProductCaseStudy[] = CASE_STUDIES.filter(
  (study): study is ProductCaseStudy => study.kind === "product",
);

/**
 * Public repositories linked from the site: each study's own repo plus its
 * secondary build's. A closed-source product adds nothing. The hero's
 * title-block and /about both read this, so neither can claim a repo that
 * isn't public.
 */
export const PUBLIC_REPO_COUNT = CASE_STUDIES.reduce(
  (n, study) => n + (study.repoUrl ? 1 : 0) + (study.secondaryLink ? 1 : 0),
  0,
);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getCaseStudiesForService(
  service: ServiceSlug,
): ClientCaseStudy[] {
  return CLIENT_STUDIES.filter((study) => study.service === service);
}
