"use client";

import { useEffect } from "react";

import { captureAttribution, track, type SiteEvent } from "@/lib/analytics";

/**
 * A plain anchor that reports the click.
 *
 * Deliberately a thin client leaf rather than something a section wraps:
 * app/(sections)/pricing.tsx and components/footer.tsx are server components,
 * and they stay that way — only the link itself crosses into the client.
 *
 * Used for `tel:`, `mailto:` and outbound links to live builds and repos, all
 * of which navigate away from the site and so are invisible to a page-view-only
 * analytics setup.
 */
export function TrackedLink({
  event,
  params,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  event: SiteEvent;
  params?: Record<string, string | number | boolean | undefined>;
}) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, params);
        props.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

/**
 * Records campaign and referrer data once per session, on first load.
 *
 * Rendered in the root layout. It draws nothing — it exists so that by the
 * time someone reaches the enquiry form, the site still knows what brought
 * them, which the form POST alone cannot tell you.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
