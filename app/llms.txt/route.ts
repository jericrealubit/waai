import { ABOUT } from "@/lib/content/about";
import {
  CLIENT_STUDIES,
  PRODUCT_STUDIES,
  getCaseStudiesForService,
  type CaseStudy,
} from "@/lib/content/case-studies";
import { GENERAL_FAQS, SERVICE_FAQS, type Faq } from "@/lib/content/faqs";
import {
  SERVICES,
  SERVICES_BY_SLUG,
  TERM_MONTHS,
  formatFromPrice,
  formatTierPrice,
  type PriceTier,
  type Service,
} from "@/lib/content/services";
import { SITE, absoluteUrl } from "@/lib/site";

/**
 * /llms.txt — the site's facts as one plain-text document, for language models.
 *
 * Its first reader is the assistant on /chat (github.com/jericrealubit/
 * ragchatbot), which fetches this file and answers questions about the
 * business from it. That is what lets /chat say the bot answers from the same
 * facts the rest of the site is built from: every line here is generated from
 * lib/content and lib/site, so a price or a case study changed there changes
 * here too, and the ACCURACY RULES in case-studies.ts carry through without
 * being restated. Never hand-write a claim into this file.
 *
 * Kept compact on purpose — tiers, one-line outcomes, countable facts, FAQs
 * and links, not the detail pages' approach and highlight bullets. The bot
 * sends the whole document with every question about the business, and a
 * free-tier Groq key caps tokens per minute (8,000 at the time of writing), so
 * each line added here is headroom taken from the assistant.
 *
 * Static, like the pages it summarises: rendered once at build time.
 */
export const dynamic = "force-static";

function tierLine(tier: PriceTier): string {
  const monthly = tier.monthly === null ? "" : ` or $${tier.monthly}/month`;
  const chosen = tier.recommended ? " (most chosen)" : "";
  return `- ${tier.name}${chosen}: ${formatTierPrice(tier)}${monthly}. ${tier.summary}`;
}

function serviceSection(service: Service): string[] {
  const examples = getCaseStudiesForService(service.slug).map((s) => s.name);
  return [
    `### ${service.name} — ${formatFromPrice(service)}`,
    `${service.valueProp} ${absoluteUrl(`/services/${service.slug}`)}`,
    ...service.tiers.map(tierLine),
    ...(service.yearlyCost
      ? [`- Running cost: $${service.yearlyCost.amount} ${service.yearlyCost.note}.`]
      : []),
    `- Best for: ${service.bestFor}`,
    ...(examples.length > 0 ? [`- Shipped examples: ${examples.join(", ")}.`] : []),
    "",
  ];
}

/** No `repoUrl` means closed source — said outright, so the bot never offers a repo that isn't public. */
function liveLine(label: string, liveUrl: string, repoUrl: string | undefined, gated: boolean): string {
  return `- ${label}: ${liveUrl}${gated ? " (login required)" : ""} · ${repoUrl ? `source ${repoUrl}` : "closed source"}`;
}

function caseStudySection(study: CaseStudy): string[] {
  const metrics = (study.metrics ?? []).map(
    (m) => `${m.value} ${m.label}${m.source ? ` (${m.source})` : ""}`,
  );
  const group =
    study.kind === "client" ? SERVICES_BY_SLUG[study.service].name : "Our own product";
  return [
    `### ${study.name} — ${study.client}, ${study.sector}`,
    `${group}. ${study.outcome} ${absoluteUrl(`/work/${study.slug}`)}`,
    ...(metrics.length > 0 ? [`- Facts: ${metrics.join("; ")}.`] : []),
    `- Stack: ${study.stack.join(", ")}`,
    liveLine("Live", study.liveUrl, study.repoUrl, study.gated),
    ...(study.secondaryLink
      ? [
          liveLine(
            study.secondaryLink.label,
            study.secondaryLink.liveUrl,
            study.secondaryLink.repoUrl,
            study.secondaryLink.gated,
          ),
        ]
      : []),
    "",
  ];
}

function faqLines(faqs: Faq[]): string[] {
  return faqs.flatMap((faq) => [`Q: ${faq.question}`, `A: ${faq.answer}`, ""]);
}

export function GET(): Response {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Generated from the same data that builds ${SITE.url}.`,
    "",
    "## Contact",
    `- Founder: ${SITE.founder}`,
    `- Phone: ${SITE.phoneDisplay}`,
    `- Email: ${SITE.email}`,
    `- Based: ${SITE.locality} ${SITE.region} ${SITE.postalCode}; serves ${SITE.areaServed}`,
    `- ABN: ${SITE.abn}`,
    `- Get a price: ${absoluteUrl("/quote")}`,
    "",
    "## About",
    `${ABOUT.name}, in their own words: "${ABOUT.intro}"`,
    `Principles: ${ABOUT.principles.map((p) => p.title).join("; ")}.`,
    "",
    "## Services",
    `Every tier is a fixed one-off price, or monthly over ${TERM_MONTHS} months.`,
    "",
    ...SERVICES.flatMap(serviceSection),
    "## Case studies",
    "",
    ...CLIENT_STUDIES.flatMap(caseStudySection),
    ...(PRODUCT_STUDIES.length > 0
      ? [
          "## Our own products",
          "Built and run by WA AI Digital — not client work, and closed source.",
          "",
          ...PRODUCT_STUDIES.flatMap(caseStudySection),
        ]
      : []),
    "## FAQs",
    "",
    ...faqLines(GENERAL_FAQS),
    ...SERVICES.flatMap((service) => faqLines(SERVICE_FAQS[service.slug] ?? [])),
  ];

  return new Response(lines.join("\n").trimEnd() + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
