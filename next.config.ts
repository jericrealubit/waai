import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  /**
   * NOT a static export. The contact form needs a real POST handler
   * (app/api/contact/route.ts, which calls out to Resend), and static export
   * can't serve dynamic Route Handlers at all — every route would have to be
   * fully static. Deploy target is the OpenNext Cloudflare Workers path:
   * wrangler.jsonc already points at `.open-next/worker.js`, and the
   * package.json `deploy`/`preview`/`upload` scripts already run
   * `opennextjs-cloudflare build`, which expects a normal server build, not
   * a static `out/` tree. (An earlier commit set `output: "export"` here to
   * work around a Workers deploy failure; that config has since landed
   * properly via wrangler.jsonc, so the static-export override was stale and
   * actively broke the Workers path — removed.)
   */
};

/**
 * Config is exported as an async function, not a plain object, so that
 * `initOpenNextCloudflareForDev()` can be AWAITED before Next.js gets the
 * config — and so it can be skipped outside `next dev`.
 *
 * Both of those matter, and the previous shape got both wrong. It ran
 *
 *     export default nextConfig;
 *     import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
 *
 * as a floating promise *after* the default export, which produced two bugs:
 *
 *  1. A race in dev. The config resolved immediately, so a request could
 *     reach `getCloudflareContext()` in app/api/contact/route.ts before the
 *     init promise settled — the route then threw "`getCloudflareContext` has
 *     been called without having called `initOpenNextCloudflareForDev`" and
 *     the contact form 500'd. Awaiting here closes that window: Next.js has
 *     no config, and therefore serves no request, until init has finished.
 *
 *  2. A broken production build. `initOpenNextCloudflareForDev` only guards
 *     on `globalThis.AsyncLocalStorage` being present, NOT on dev-vs-build, so
 *     it also fired during `next build` and started a wrangler platform proxy
 *     mid-build. That crashed the build with an unhandled
 *     `Error: write EOF` — taking `npm run build`, `preview` and `deploy` down
 *     with it. The PHASE_DEVELOPMENT_SERVER gate is what keeps it out of the
 *     build; do not drop it.
 *
 * The import stays dynamic so the adapter (and the wrangler dependency tree
 * behind it) is never even loaded during a build.
 */
export default async function config(phase: string): Promise<NextConfig> {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");

    /*
     * Init spawns workerd (via wrangler's platform proxy), which is a native
     * binary — on Windows it needs the Microsoft Visual C++ Redistributable.
     * Without it workerd exits with STATUS_DLL_NOT_FOUND the moment it starts,
     * wrangler's pipe to it closes, and the write fails with `Error: write EOF`.
     *
     * That must not take the whole dev server down: everything except the
     * contact route works fine without the Cloudflare context. So warn loudly
     * and carry on — `getCloudflareContext()` in app/api/contact/route.ts will
     * still throw, and only that one route 500s, which is exactly the blast
     * radius it deserves.
     */
    try {
      await initOpenNextCloudflareForDev();
    } catch (error) {
      console.warn(
        "\n⚠  Cloudflare dev context failed to start — /api/contact will 500 locally.\n" +
          "   Everything else runs normally. On Windows this is usually a missing\n" +
          "   Visual C++ Redistributable (workerd can't load without it):\n" +
          "     winget install --id Microsoft.VCRedist.2015+.x64\n" +
          `   Cause: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }

  return nextConfig;
}
