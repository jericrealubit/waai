import type { Metadata } from "next";

import { OG_DEFAULT } from "@/lib/og";
import { SITE } from "@/lib/site";

/**
 * One builder for every page's metadata.
 *
 * Before this, each page hand-wrote its own `openGraph` block — same
 * `siteName`, same `locale`, same `type`, retyped four times, and every one of
 * them missing `twitter` and `alternates.canonical`. A page now declares only
 * what is actually different about it.
 *
 * `metadataBase` is set once in app/layout.tsx, so every path here stays
 * root-relative and Next resolves it.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  type = "website",
  image = OG_DEFAULT,
}: {
  /** Page title WITHOUT the site suffix — this adds it. */
  title: string;
  description: string;
  /** Root-relative, e.g. "/work". Drives the canonical URL. */
  path: string;
  /** Shorter headline for the share card, if the page title is unwieldy. */
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article";
  /** Root-relative share card. Defaults to the general one. */
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    // Canonicals were absent site-wide. Without them any URL that picks up a
    // tracking parameter is a separate document as far as a crawler is
    // concerned, and the ranking signals split between them.
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle ?? fullTitle,
      description: ogDescription ?? description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? fullTitle,
      description: ogDescription ?? description,
      images: [image],
    },
  };
}
