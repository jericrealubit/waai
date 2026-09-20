import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, loadDisplayFont } from "@/lib/og/frame";

export const alt =
  "WA AI Digital — every build live, every repository public. Perth, Western Australia.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="WAAI-00 · Rev. 2026"
        headline="Every build live. Every repo public."
        footnote="WA AI Digital · waai.au"
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
