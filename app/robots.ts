import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * There was no robots.txt at all, so the sitemap had no discovery path other
 * than a manual Search Console submission.
 *
 * /api/* is disallowed because a crawler following a form POST target gets
 * nothing useful; /chat is disallowed because it renders an external iframe
 * and nothing else, so indexing it would put a contentless page in the results
 * under the site's own domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/chat"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
