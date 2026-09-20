import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, loadDisplayFont } from "@/lib/og/frame";
import { SERVICES } from "@/lib/content/services";

export const alt = "The four WA AI Digital service lines, with fixed public pricing.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Services · WAAI-01"
        headline="Four service lines. Fixed public pricing."
        footnote={`${SERVICES.length} lines · every tier priced on the page`}
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: "Saira Condensed",
          data: await loadDisplayFont(),
          style: "normal",
          weight: 800,
        },
      ],
    },
  );
}
