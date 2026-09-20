import { SITE } from "@/lib/site";

/**
 * The founder story, as data.
 *
 * The site had no human on it anywhere except the "Smoked & Coded by: jeric"
 * credit in the footer — which, for a one-person practice asking small
 * businesses for four figures, is the single biggest thing missing. A prospect
 * who cannot find out who they'd be working with has to take the rest on faith.
 *
 * Kept as data rather than markup for the same reason services and case studies
 * are: copy changes shouldn't be template edits. Everything here is a plain
 * statement of fact — no invented awards, no invented years of experience, no
 * client count that contradicts the six case studies.
 */

export interface AboutPrinciple {
  title: string;
  body: string;
}

export const ABOUT = {
  name: SITE.founder,
  /** Shown under the name — what they'd call you at the job site. */
  role: "Developer, WA AI Digital",
  location: `${SITE.locality}, Western Australia`,

  /** The lede. Two or three sentences, first person, no throat-clearing. */
  intro:
    "I'm Jeric. I build websites and small business systems for Western Australian trades, kitchens and workshops — and I run WA AI Digital on my own, so the person who quotes your job is the person who writes the code and the person who picks up the phone afterwards.",

  body: [
    "Most of my clients have been sold a website before. Usually it was expensive, it took months, nobody explained what was happening, and at the end they didn't own any of it — the files sat on someone else's account and every change was another invoice. That's the thing I'm reacting against.",
    "So I work the opposite way. The price is on the page before you contact me. The repository is yours from day one. And every project I've shipped is linked on this site with both its live URL and its source code, so you can go and look at the actual work rather than take my word for it. If you're technical, read the code. If you're not, click the live links and see whether the thing feels fast and works on your phone.",
    "The work itself is mostly unglamorous and specific: thirteen separate service pages so a bricklayer ranks for 'retaining walls Caversham' rather than nothing. A smokehouse keeping the whole order value instead of a platform's cut. A press operator timing a cycle in two taps on a tablet, with the audit sheet coming out at the end without anyone adding up a column of numbers.",
  ],

  /** How the work is done. Each one should be falsifiable by the site itself. */
  principles: [
    {
      title: "Every build is live, every repo is public",
      body: "There are no mockups on this site. Each case study opens the running product and the source it was built from. It's the only claim here you can check yourself in under a minute, which is why it's the one the site leads with.",
    },
    {
      title: "The price is on the page",
      body: "Fixed tiers, published, in dollars. A quote confirms which tier your job is — it doesn't discover a number after we've talked and I've worked out what you can afford.",
    },
    {
      title: "You own it, including if you leave",
      body: "The repository and the deploy pipeline are in your name from the start. Leave a monthly plan early and you settle what's left of the build; the site is never switched off or held over you.",
    },
    {
      title: "Built to be cheap to keep",
      body: "Static where it can be, on infrastructure that costs about $50 a year to run. A site that's expensive to host becomes a site you resent paying for, and then a site you let lapse.",
    },
  ] as AboutPrinciple[],

  /** Answers the "can you actually do this" question without a CV. */
  facts: [
    { label: "Based", value: SITE.locality + ", WA" },
    { label: "Trading as", value: `ABN ${SITE.abn}` },
    { label: "Works with", value: "Trades, hospitality, small manufacturers" },
    { label: "Servicing", value: "Perth & WA, remote elsewhere" },
  ],
} as const;
