import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal-document";
import { PRIVACY } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: PRIVACY.title,
  description: PRIVACY.summary,
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalDocumentPage doc={PRIVACY} />;
}
