import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, loadDisplayFont } from "@/lib/og/frame";
import { CASE_STUDIES } from "@/lib/content/case-studies";

export const alt =
  "Shipped work from WA AI Digital — each project with a live site and a public repository.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  // Counted from the data, like the hero's title-block, so the card can't
  // claim a number the site doesn't show.
  const shipped = CASE_STUDIES.length;
  const repos = CASE_STUDIES.reduce(
    (n, study) => n + 1 + (study.secondaryLink ? 1 : 0),
    0,
  );

  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Our work · WAAI-02"
        headline="No mockups. Open the real thing."
        footnote={`${shipped} projects shipped · ${repos} public repositories`}
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
