import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The shared share-card design, so `/`, `/services`, `/work` and each service
 * page produce one recognisable object rather than four near-misses.
 *
 * Why this exists at all: app/layout.tsx used to point `openGraph.images` at
 * `/og-image.png`, a file that was never added — so every share of the site
 * rendered a broken card. The file-convention routes that import this replace
 * that dead reference.
 *
 * Satori (what `ImageResponse` renders with) is not a browser. Two constraints
 * shape everything below:
 *  - every element with more than one child needs an explicit `display: flex`;
 *  - there is no CSS custom-property resolution, so the palette is repeated
 *    here as literals. These are the LIGHT ("daylight") values from
 *    app/globals.css — a share card has no viewer theme to follow.
 */

const CONCRETE = "#e7e2d8";
const PAPER = "#efebe2";
const BITUMEN = "#1a1813";
const HIVIS = "#e8420a";
const STEEL = "#5e5b51";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Read the display face off disk rather than fetching Google Fonts at render
 * time — these routes prerender during `next build`, and a build that depends
 * on a third-party CDN being up is a build that fails for reasons unrelated to
 * the code.
 */
export async function loadDisplayFont(): Promise<ArrayBuffer> {
  const buffer = await readFile(
    join(process.cwd(), "public/fonts/saira-condensed-800.ttf"),
  );
  return Uint8Array.from(buffer).buffer;
}

export function OgFrame({
  eyebrow,
  headline,
  accent,
  footnote,
}: {
  /** Mono-voiced label along the top rule, e.g. "SERVICES · WAAI-02". */
  eyebrow: string;
  /** The big line. Kept short — this is signage, not a paragraph. */
  headline: string;
  /** Optional second line in hi-vis, e.g. a "from $X" price. */
  accent?: string;
  footnote: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: CONCRETE,
        // The blueprint grid, as two repeating-linear-gradients. Satori
        // supports these, which is the one piece of the site's ground that
        // survives into a flat PNG.
        backgroundImage: `linear-gradient(to right, rgba(26,24,19,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,24,19,0.07) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        padding: 56,
        fontFamily: "Saira Condensed",
      }}
    >
      {/* The plate: an ink-framed sheet lifted off the ground, the same
          `border-2 border-bitumen bg-paper` figure the site uses everywhere. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          border: `4px solid ${BITUMEN}`,
          backgroundColor: PAPER,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `4px solid ${BITUMEN}`,
            padding: "18px 32px",
          }}
        >
          <span
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: BITUMEN,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: STEEL,
            }}
          >
            Perth · Western Australia
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            padding: "0 44px",
          }}
        >
          <span
            style={{
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: -1,
              textTransform: "uppercase",
              color: BITUMEN,
            }}
          >
            {headline}
          </span>
          {accent ? (
            <span
              style={{
                marginTop: 18,
                fontSize: 52,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: HIVIS,
              }}
            >
              {accent}
            </span>
          ) : null}
        </div>

        {/* Hazard rule — the site's one signature accent, reused as the
            baseline of the card. */}
        <div
          style={{
            display: "flex",
            height: 16,
            backgroundImage: `repeating-linear-gradient(-45deg, ${HIVIS} 0px, ${HIVIS} 18px, ${BITUMEN} 18px, ${BITUMEN} 36px)`,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
          }}
        >
          <span
            style={{
              fontSize: 26,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: BITUMEN,
            }}
          >
            {footnote}
          </span>
          <span
            style={{
              display: "flex",
              border: `3px solid ${HIVIS}`,
              color: HIVIS,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "8px 16px",
            }}
          >
            {/* The site's stamp uses a ◱ glyph; Saira Condensed has no such
                codepoint, and Satori answers a missing glyph by trying to
                fetch a fallback font at render time — which fails the build's
                offline assumption. Plain letterforms only in here. */}
            Field-Verified
          </span>
        </div>
      </div>
    </div>
  );
}
