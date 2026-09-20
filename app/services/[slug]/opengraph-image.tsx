import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, loadDisplayFont } from "@/lib/og/frame";
import { SERVICES, formatFromPrice, getService } from "@/lib/content/services";

export const alt = "A WA AI Digital service line and its starting price.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * One card per service, prerendered at build. The price comes from
 * `formatFromPrice` — the same helper the page uses — so a share card can
 * never quote a rate the rate card has moved off.
 */
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={service ? service.shortName : "Services"}
        headline={service ? service.name : "WA AI Digital"}
        accent={service ? formatFromPrice(service) : undefined}
        footnote={
          service ? "Fixed price · you own the repo" : "WA AI Digital · waai.au"
        }
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
