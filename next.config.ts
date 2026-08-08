import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export. Every route in this app is Static or SSG — there are no API
   * routes, no middleware and no server actions — so there is nothing that
   * needs a server runtime. `next build` writes a plain HTML/asset tree to
   * `out/`, which Cloudflare Pages serves directly.
   *
   * This replaces the Workers/OpenNext deploy path, which was failing because
   * `wrangler versions upload` expects a wrangler.jsonc pointing at
   * `.open-next/worker.js` — config that only ever existed on the unmerged
   * `cloudflare/workers-autoconfig` branch.
   */
  output: "export",

  images: {
    // The export target has no image optimization server, so next/image must
    // emit the source files as-is. Keep committed images pre-sized.
    unoptimized: true,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
