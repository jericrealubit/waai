import type { NextConfig } from "next";

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

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
