import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal-document";
import { TERMS } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: TERMS.title,
  description: TERMS.summary,
  path: "/terms",
});

export default function TermsPage() {
  return <LegalDocumentPage doc={TERMS} />;
}
