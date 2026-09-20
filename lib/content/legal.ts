import { SITE } from "@/lib/site";

/**
 * Privacy policy and terms, as data.
 *
 * These exist because the site runs Google Analytics and collects name, email,
 * phone and suburb through the contact form, and had neither document. Both
 * are written from what the site ACTUALLY does — the GA4 tag in
 * app/layout.tsx, the Resend call in app/api/contact/route.ts, the Cloudflare
 * Workers deploy target — rather than from a generic template. If any of those
 * change, this file changes in the same commit.
 *
 * NOT legal advice, and not a substitute for review by someone qualified. It
 * is an honest description of current practice, which is what the Privacy Act
 * expects a small operator to be able to give.
 */

export interface LegalSection {
  heading: string;
  /** Plain paragraphs. Keep one idea per paragraph. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  list?: string[];
}

export interface LegalDocument {
  title: string;
  /** Shown under the title and used as the page description. */
  summary: string;
  /** Human-readable, e.g. "20 September 2026". */
  effective: string;
  sections: LegalSection[];
}

const EFFECTIVE = "20 September 2026";

export const PRIVACY: LegalDocument = {
  title: "Privacy policy",
  summary:
    "What this site collects, why, who else can see it, and how to have it deleted.",
  effective: EFFECTIVE,
  sections: [
    {
      heading: "Who we are",
      body: [
        `${SITE.name} (ABN ${SITE.abn}) is a one-person web development practice based in ${SITE.locality}, Western Australia. You can reach us at ${SITE.email} or ${SITE.phoneDisplay}.`,
      ],
    },
    {
      heading: "What we collect",
      body: [
        "Two things, and nothing else.",
        "First, whatever you type into the enquiry form: your name, business name, email address, phone number, suburb, which service you're interested in, your budget range and your project description. Only name, email, the service and the description are required — the rest are optional and the form works without them.",
        "Second, standard web analytics through Google Analytics 4. That records pages viewed, approximate location derived from IP address, device and browser type, how you arrived at the site, and which buttons and links were clicked. It does not record your name or anything you type.",
      ],
    },
    {
      heading: "What we do with it",
      body: [
        "Enquiry details are used to answer your enquiry and to quote on the work. They are not added to a mailing list, not sold, and not used for advertising.",
        "Analytics are used to understand which pages and services people actually look at, so the site can be improved.",
      ],
    },
    {
      heading: "Who else sees it",
      body: [
        "Sending an enquiry means it passes through services we use to run the site:",
      ],
      list: [
        "Resend — delivers the enquiry email. Their servers are outside Australia.",
        "Cloudflare — hosts the site and processes the form submission at the edge.",
        "Google Analytics — receives the analytics described above, and Google processes it outside Australia.",
        "Google Workspace / Gmail — where the enquiry email is read and stored.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "Google Analytics sets cookies to tell repeat visits apart. The site also stores your light/dark theme choice in your browser's local storage — that never leaves your device and is not readable by us.",
        "You can block or clear both through your browser settings; the site works normally either way.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Enquiry emails are kept while there is an active or prospective working relationship, and are deleted on request. Google Analytics data expires on Google's own retention schedule.",
      ],
    },
    {
      heading: "Access, correction and deletion",
      body: [
        `Email ${SITE.email} and ask. You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted, and there is no charge for any of those. We'll respond within a reasonable time, and in any case within 30 days.`,
        "If you think we've mishandled your information, tell us first. If you're not satisfied with the response, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If this policy changes, the effective date above changes with it. Material changes will be described here rather than quietly substituted.",
      ],
    },
  ],
};

export const TERMS: LegalDocument = {
  title: "Terms of use",
  summary:
    "The terms covering this website. Project work is covered by its own written quote, not by these.",
  effective: EFFECTIVE,
  sections: [
    {
      heading: "These terms cover the website only",
      body: [
        `These terms apply to browsing waai.au. They are not the terms of any build we do for you — that work is covered by the written quote and scope you agree to before it starts, and where the two differ, the quote wins.`,
      ],
    },
    {
      heading: "Pricing shown on this site",
      body: [
        "Prices on the services and pricing pages are in Australian dollars and are the real starting prices for the scope described next to them. They are an invitation to enquire, not a binding offer: the fixed price for your project is the one in your written quote, issued once the scope is known.",
        "Monthly figures are the build spread over a minimum term, with the care plan included. The term and what the care plan covers are stated on the pricing section and repeated in your quote.",
      ],
    },
    {
      heading: "The work shown here",
      body: [
        "Every project in the case studies is a real build that is live at the URL given, with its source in the public repository linked beside it. Screenshots are of the shipped product.",
        "Client sites and their content belong to those clients and are shown as examples of our work, not as our property. Client names and logos remain their trade marks.",
      ],
    },
    {
      heading: "Links to other sites",
      body: [
        "This site links out to live client builds, public repositories and an externally hosted chat assistant. We don't control those destinations and aren't responsible for their content or availability.",
      ],
    },
    {
      heading: "Accuracy and availability",
      body: [
        "The site is kept accurate and current as a matter of practice, but it is provided as-is. We don't warrant that it will be uninterrupted or error-free, and we're not liable for loss arising from your use of it, except where Australian Consumer Law says otherwise — and nothing here excludes, restricts or modifies a guarantee that the Australian Consumer Law gives you.",
      ],
    },
    {
      heading: "This site's own content",
      body: [
        "The writing, layout and design of this site are ours. You're welcome to quote it with attribution; please don't republish it wholesale.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of Western Australia.",
      ],
    },
  ],
};
