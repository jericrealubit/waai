/**
 * The firm's own facts, declared once.
 *
 * These values were previously retyped in the footer, the contact section, the
 * pricing CTA and four separate `openGraph` blocks — which is how a phone
 * number ends up correct in three places and stale in the fourth. Anything
 * that identifies the business belongs here, and anything that renders it
 * imports from here.
 *
 * The phone number is kept in two shapes on purpose: `phone` is the E.164 form
 * a `tel:` href and schema.org both want, `phoneDisplay` is how a West
 * Australian actually reads it.
 */

export const SITE = {
  name: "WA AI Digital",
  url: "https://waai.au",
  /** Used as the OG/Twitter site name and the schema.org legal name. */
  legalName: "WA AI Digital",
  description:
    "Websites, ordering systems and factory-floor logging for Western Australian businesses. Every build runs live and every repository is public.",
  phone: "+61491098073",
  phoneDisplay: "0491 098 073",
  email: "hello@waai.au",
  abn: "85 436 177 620",
  locality: "Beeliar",
  region: "WA",
  postalCode: "6164",
  country: "AU",
  /** The trading area, not a service radius — there is no walk-in premises. */
  areaServed: "Western Australia",
  founder: "Jeric Realubit",
  locale: "en_AU",
  sameAs: ["https://www.linkedin.com/in/jericrealubit"],
} as const;

/** Absolute URL for a root-relative path. Schema.org and RSS both need these. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}
