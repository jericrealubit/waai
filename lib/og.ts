/**
 * Share-card images.
 *
 * These are STATIC files in public/og/, not generated at request time — and
 * that is a deliberate retreat from where this started.
 *
 * The cards were originally four `opengraph-image.tsx` routes rendering through
 * `next/og`, which worked and produced the same artwork. But `next/og` pulls in
 * Satori's `yoga.wasm`, and when the OpenNext Cloudflare adapter bundles the
 * Worker on Windows it writes that file's absolute path into the bundle without
 * escaping the backslashes — so `\node_modules` becomes a newline, the path
 * collapses to nonsense, and esbuild fails with "Could not resolve". The result
 * was that `npm run preview` and `npm run deploy` both broke, while
 * `npm run build` passed, which is the worst possible place for a build to
 * break: after CI is green.
 *
 * `serverExternalPackages: ["@vercel/og"]` does not avoid it. So the artwork is
 * rendered once and committed.
 *
 * WHAT THIS COSTS: the cards no longer regenerate from the content files, so
 * nothing here may state anything that can go stale. That is why the service
 * cards carry the service NAME but no price — a price baked into a PNG keeps
 * being shared long after the rate card has moved. Keep it that way.
 *
 * TO REGENERATE after a copy or palette change: restore the deleted
 * `opengraph-image.tsx` routes from git history, run `npm run build`, copy
 * `.next/server/app/**\/opengraph-image.body` over the PNGs in public/og/, and
 * delete the routes again.
 */

import type { ServiceSlug } from "@/lib/content/services";

/** The general card: home, and anything without one of its own. */
export const OG_DEFAULT = "/og/default.png";

export const OG_IMAGES = {
  default: OG_DEFAULT,
  services: "/og/services.png",
  work: "/og/work.png",
} as const;

/** The per-service card, falling back to the general one. */
export function ogForService(slug: ServiceSlug): string {
  return `/og/service-${slug}.png`;
}
