import { sendGAEvent } from "@next/third-parties/google";

/**
 * Conversion tracking.
 *
 * GA4 was recording page views and nothing else, so the one question the site
 * exists to answer — how many visitors actually enquire — had no data behind
 * it. Form submissions, phone taps and clicks through to the live builds were
 * all invisible.
 *
 * Every call routes through here rather than touching `sendGAEvent` directly,
 * so the production gate and the event vocabulary live in one place. The gate
 * mirrors app/layout.tsx: the tag is only rendered in production, and calling
 * `sendGAEvent` without a tag loaded queues events into a dataLayer nothing
 * ever drains.
 *
 * Note `npm run preview` IS a production build and will emit real events —
 * filter those in GA4 under Admin > Data Streams > Define internal traffic,
 * the same caveat the GA tag itself carries.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * The events this site sends. A union rather than a bare string so a typo
 * becomes a type error instead of a metric that silently never fires.
 */
export type SiteEvent =
  /** First interaction with the enquiry form — the top of the funnel. */
  | "form_start"
  /** A successful enquiry. Mark this as a key event in GA4. */
  | "generate_lead"
  /** The form was submitted but did not go through. */
  | "form_error"
  /** A `tel:` link was followed. Also worth marking as a key event. */
  | "call_click"
  /** A `mailto:` link was followed. */
  | "email_click"
  /** A primary or ghost CTA was pressed. */
  | "cta_click"
  /** A click out to a live build or a public repository. */
  | "outbound_click";

export function track(name: SiteEvent, params: EventParams = {}): void {
  if (process.env.NODE_ENV !== "production") return;

  // Undefined values would arrive in GA as the string "undefined"; drop them
  // so an optional parameter is simply absent.
  const clean: EventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) clean[key] = value;
  }

  sendGAEvent("event", name, clean);
}

/**
 * Where an enquiry came from, captured on first page view and attached to the
 * lead when it is submitted.
 *
 * Without this, every enquiry looks like it arrived by magic: the form POSTs
 * from whichever page the visitor happened to end on, and the campaign or
 * referrer that actually brought them is long gone by then.
 */
const ATTRIBUTION_KEY = "waai:attribution";

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  landingPath?: string;
}

/** Records attribution once per browser session. Safe to call on every load. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer;

    // A visit with no campaign tags and no external referrer carries no
    // attribution worth storing — don't write an object of empty strings.
    const isInternal = referrer.startsWith(window.location.origin);
    const hasUtm = [...params.keys()].some((key) => key.startsWith("utm_"));
    if (!hasUtm && (!referrer || isInternal)) return;

    const attribution: Attribution = {
      source: params.get("utm_source") ?? undefined,
      medium: params.get("utm_medium") ?? undefined,
      campaign: params.get("utm_campaign") ?? undefined,
      term: params.get("utm_term") ?? undefined,
      content: params.get("utm_content") ?? undefined,
      referrer: referrer && !isInternal ? referrer : undefined,
      landingPath: window.location.pathname,
    };

    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Private mode, blocked storage, or a browser that throws on access.
    // Attribution is a nice-to-have; never let it break a page.
  }
}

/** Reads back what `captureAttribution` stored, if anything. */
export function readAttribution(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

/**
 * A one-line human summary for the enquiry email, so the inbox shows where a
 * lead came from without anyone opening GA.
 */
export function describeAttribution(attribution: Attribution | null): string {
  if (!attribution) return "Direct or unknown";

  const parts: string[] = [];
  if (attribution.source) parts.push(`source: ${attribution.source}`);
  if (attribution.medium) parts.push(`medium: ${attribution.medium}`);
  if (attribution.campaign) parts.push(`campaign: ${attribution.campaign}`);
  if (attribution.referrer) parts.push(`referrer: ${attribution.referrer}`);
  if (attribution.landingPath) parts.push(`landed on: ${attribution.landingPath}`);

  return parts.length > 0 ? parts.join(" · ") : "Direct or unknown";
}
