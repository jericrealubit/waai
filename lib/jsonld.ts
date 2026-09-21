import type { CaseStudy } from "@/lib/content/case-studies";
import type { Service } from "@/lib/content/services";
import { SITE, absoluteUrl } from "@/lib/site";

/**
 * Structured data for the site.
 *
 * The site sells "LocalBusiness structured data, sitemap and per-page OG tags"
 * as a deliverable (lib/content/services.ts) and had none of its own. These
 * builders close that, and they read from lib/content so the markup and the
 * visible copy cannot drift apart.
 *
 * Deliberately hand-typed rather than pulling in `schema-dts`: the shapes here
 * are small, and a 400 KB type-only dependency to describe six objects is not
 * a trade worth making.
 *
 * NOTE ON RATINGS: there is no `AggregateRating` anywhere in this file, and
 * there must not be one until real, attributable reviews exist. Marking up a
 * rating the site cannot evidence risks a Google manual action and is the same
 * Australian Consumer Law exposure that keeps competitor prices off the site
 * (see the header comment in lib/content/services.ts).
 */

type Json = Record<string, unknown>;

/** The firm itself. Rendered once, in the root layout. */
export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    // ProfessionalService, not LocalBusiness: there is no premises a customer
    // visits, so the properties LocalBusiness implies (openingHours, a street
    // address, a map pin) would all be fiction.
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    // The ABN is a real, checkable registration — the strongest identity
    // signal the site has, and it was previously only a footer link.
    identifier: {
      "@type": "PropertyValue",
      name: "ABN",
      value: SITE.abn.replace(/\s/g, ""),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "State", name: SITE.areaServed },
    founder: { "@type": "Person", name: SITE.founder },
    sameAs: [...SITE.sameAs],
  };
}

/** One service line, with its published tiers as real Offers. */
export function serviceLd(service: Service): Json {
  // Null-priced tiers are "quoted per project" and have no price to state.
  const priced = service.tiers.filter(
    (tier): tier is typeof tier & { price: number } => tier.price !== null,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`/services/${service.slug}#service`),
    name: service.name,
    description: service.valueProp,
    serviceType: service.name,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: { "@type": "State", name: SITE.areaServed },
    url: absoluteUrl(`/services/${service.slug}`),
    offers: priced.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      description: tier.summary,
      price: tier.price,
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/services/${service.slug}`),
    })),
  };
}

/** A shipped project. `CreativeWork` — it is a built thing, not an article. */
export function caseStudyLd(study: CaseStudy): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/work/${study.slug}#work`),
    name: study.name,
    headline: study.outcome,
    description: study.summary,
    url: absoluteUrl(`/work/${study.slug}`),
    creator: { "@id": `${SITE.url}/#organization` },
    about: study.sector,
    keywords: study.stack.join(", "),
    ...(study.screenshot
      ? { image: absoluteUrl(study.screenshot.src) }
      : {}),
  };
}

/**
 * Breadcrumbs. Pass the trail without the home crumb — it is prepended here so
 * every trail on the site starts the same way.
 */
export function breadcrumbLd(trail: { name: string; path: string }[]): Json {
  const items = [{ name: "Home", path: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQ markup. Only worth emitting where the questions are actually rendered. */
export function faqLd(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
