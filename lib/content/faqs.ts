import type { ServiceSlug } from "./services";

/**
 * The questions prospects actually ask, answered on the page.
 *
 * The site had no FAQ anywhere, which means every one of these was being
 * answered — or not — in an email thread after the enquiry. A visitor who
 * can't find out whether they own the site, or what happens if they stop
 * paying, mostly just leaves.
 *
 * Answers must stay consistent with lib/content/services.ts (pricing, terms,
 * the care plan) and with the ACCURACY RULES in case-studies.ts. Anything here
 * is also emitted as FAQPage structured data, so a wrong answer is a wrong
 * answer in Google's results too.
 */

export interface Faq {
  question: string;
  /** Plain text — it is rendered AND emitted as JSON-LD, so no markup. */
  answer: string;
}

/** Asked about every service line. Rendered on each service page. */
export const GENERAL_FAQS: Faq[] = [
  {
    question: "Do I actually own the website?",
    answer:
      "Yes, completely, from day one. The code repository and the deployment pipeline are in your name — not held in our account and licensed back to you. If you stop working with us, the site keeps running and you can hand it to any other developer. Nothing is switched off and nothing is held over you.",
  },
  {
    question: "Is the price on the site the real price?",
    answer:
      "Yes. Every tier is a fixed price for the scope described next to it, not a starting point that moves once we talk. If your job needs something outside that scope we'll tell you what it costs before starting. The quote you get is in writing.",
  },
  {
    question: "What does it cost to keep running?",
    answer:
      "$50 a year covers hosting, the domain and security patches. That's it. If you want ongoing content changes, SEO work and priority support, the care plan is $75 a month and it's already included in every monthly plan.",
  },
  {
    question: "How long does a build take?",
    answer:
      "Most builds run two to four weeks from the point the content is settled. The usual delay isn't development, it's waiting on photos, service descriptions and sign-off — so the more of that you have ready, the faster it goes.",
  },
  {
    question: "What if I want to pay monthly instead?",
    answer:
      "Every service line has a monthly option with nothing upfront, over a 24-month minimum term, and hosting, domain, security patches and the care plan are all included in that price. Leave early and you settle what's left of the build cost — the site stays yours and stays online.",
  },
  {
    question: "Can I see the code before I commit?",
    answer:
      "You can see all of it right now. Every project in our case studies links both the live site and its public GitHub repository. Read the code of a finished build before you spend anything — that's the point of publishing them.",
  },
  {
    question: "Do you work with businesses outside Perth?",
    answer:
      "Yes. We're based in Beeliar and most clients are in Perth and WA, but the work is done remotely and we've shipped for a client in Christchurch. Local just means we know what a WA trade's customers search for.",
  },
];

/**
 * Extra questions specific to one service line, shown after the general ones.
 * Anything here must not contradict the ACCURACY RULES.
 */
export const SERVICE_FAQS: Partial<Record<ServiceSlug, Faq[]>> = {
  "tradie-websites": [
    {
      question: "Will I rank for my suburb?",
      answer:
        "Ranking is never something an honest developer guarantees — it depends on your competition and how long your business has been established. What we can do is build the site so it's able to rank: a separate page per service, real local structured data, your suburbs on the page, and a fast site on mobile. That's the part within our control, and it's the part most cheap trade sites skip.",
    },
    {
      question: "I get most of my work by phone. Do I even need a form?",
      answer:
        "Often not. One of our panel-beating clients has no contact form at all — the phone number is the only call to action on every page, because their customers ring with a photo of the damage. We'll build whichever suits how your customers actually get in touch, and we'll tell you if we think a form is the wrong call.",
    },
  ],
  "restaurant-ordering": [
    {
      question: "Do I pay commission on orders?",
      answer:
        "No. That's the entire reason to have your own ordering channel. A delivery platform takes a cut of every order for as long as you use it; this one takes none, because it's yours.",
    },
    {
      question: "Can customers pay online?",
      answer:
        "Card payment through Stripe is available on the Full Service tier. The lower tiers are pickup-and-pay-in-store, which is how our Rockingham smokehouse client runs — orders land on the kitchen dashboard the moment they're placed and are paid for on collection.",
    },
  ],
  "manufacturing-automation": [
    {
      question: "Will operators actually use it?",
      answer:
        "That's the main risk, and it's why we rebuild your existing paper sheet rather than imposing a generic form — the defect grid mirrors the layout people already know, so there's nothing to relearn. Timing a cycle is two taps. If it's slower than the clipboard, it won't get used, so it isn't.",
    },
    {
      question: "What happens to the data?",
      answer:
        "It stays yours, in your own database, and the totals and the printable audit sheet generate from it automatically. There's no per-seat licence and no vendor holding your shift history.",
    },
  ],
  ecommerce: [
    {
      question: "Can I manage products myself?",
      answer:
        "Yes — that's what the admin panel is for. Add and edit products, upload and reorder images, manage nested categories and see orders as they come in. A product added in the admin is live on the storefront immediately, because both read the same database.",
    },
  ],
};

/** The questions shown on a given service page: general plus that line's own. */
export function getFaqsForService(slug: ServiceSlug): Faq[] {
  return [...GENERAL_FAQS, ...(SERVICE_FAQS[slug] ?? [])];
}
