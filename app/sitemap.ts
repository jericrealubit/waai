import type { MetadataRoute } from "next";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SERVICES } from "@/lib/content/services";
import { absoluteUrl } from "@/lib/site";

/**
 * Derived from the same arrays the pages are, so a new service or case study
 * appears here the moment it appears on the site — the whole point of
 * lib/content being the single source. A hand-written sitemap is a sitemap
 * that silently stops listing the newest work.
 *
 * /chat is deliberately absent: it is a full-viewport iframe onto an external
 * Chainlit app with no indexable content of its own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/quote"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const workPages: MetadataRoute.Sitemap = CASE_STUDIES.map((study) => ({
    url: absoluteUrl(`/work/${study.slug}`),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...servicePages, ...workPages].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
