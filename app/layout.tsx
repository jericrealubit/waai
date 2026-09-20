import type { Metadata } from "next";
import { Geist, Geist_Mono, Saira_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header"; // Corrected import
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AttributionCapture } from "@/components/analytics/tracked-link";
import { JsonLd } from "@/components/json-ld";
import { MotionProvider } from "@/components/motion-provider";
import { organizationLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site Notice display face — a condensed industrial grotesque for headlines,
// section headings and worksite labels. Heavy weights only; used uppercase.
const sairaCondensed = Saira_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "WA AI Digital | Custom Websites & Ordering Systems",
  description:
    "Innovating the West with bespoke digital solutions. From lightning-fast ordering systems to AI-driven business growth and maintenance.",
  keywords: [
    "Web Development WA",
    "AI Digital Perth",
    "Ordering Systems Rockingham",
    "Digital Growth",
    "Website Maintenance",
  ],
  authors: [{ name: SITE.founder, url: `${SITE.url}/about` }],
  creator: SITE.founder,
  publisher: SITE.name,
  // Canonical for the home page. Every other route sets its own via
  // `pageMetadata` in lib/seo.ts; without these, any URL carrying a tracking
  // parameter reads as a separate document to a crawler.
  alternates: { canonical: "/" },
  // Generated from a simplified crop of public/logo-mark.png — see
  // public/favicon*.png, apple-touch-icon.png and android-chrome-*.png.
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "WA AI Digital",
    description: "Innovating the West with Custom Web & AI Systems.",
    url: SITE.url,
    siteName: SITE.name,
    // No `images` key here on purpose. It used to point at /og-image.png, a
    // file that was never added, so every share rendered a broken card. The
    // image now comes from app/opengraph-image.tsx — the file convention,
    // which is inherited by every route that doesn't override it. Re-adding an
    // `images` array here would override that convention and undo the fix.
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WA AI Digital",
    description: "Innovating the West with Custom Web & AI Systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${geistSans.variable} ${geistMono.variable} ${sairaCondensed.variable}`}
    >
      {/* `bg-worksite` paints the concrete ground and the faint blueprint grid
          over it (a top-masked fade, see globals.css). The site follows the
          visitor's OS theme — no `dark` class, no flash-of-wrong-theme to guard
          against, since the concrete/night-shift tokens both live in CSS. */}
      <body
        className="bg-worksite relative min-h-screen text-foreground antialiased selection:bg-hivis selection:text-hivis-ink"
        suppressHydrationWarning
      >
        {/* Sets the theme before first paint (stored choice, else OS) so there
            is no flash of the wrong theme. Must run before any styled content.
            The toggle (components/theme-toggle.tsx) updates the same attribute. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        {/* Keyboard users otherwise tab through the whole fixed header on
            every page before reaching content. Visually hidden until focused. */}
        <a
          href="#main"
          className="sr-only z-[60] focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:border-2 focus:border-bitumen focus:bg-paper focus:px-5 focus:py-3 focus:font-mono focus:text-sm focus:font-bold focus:uppercase focus:tracking-wide focus:text-foreground focus:shadow-e2"
        >
          Skip to content
        </a>

        <Header />

        {/* Added pt-24 to ensure content doesn't start under the fixed floating header */}
        <main id="main" tabIndex={-1} className="pt-24 md:pt-32">
          {/* Makes framer-motion respect prefers-reduced-motion, which the CSS
              catch-all in globals.css cannot reach. `children` passes through
              as a prop, so the sections stay server components. */}
          <MotionProvider>{children}</MotionProvider>
        </main>

        <ScrollToTop />

        {/* Records utm_* and referrer on first load so an enquiry submitted
            three pages later still knows where the visitor came from. */}
        <AttributionCapture />

        <Footer />

        {/* The firm's identity, emitted once for the whole site. Every other
            schema on the site references this node by @id rather than
            restating the business details. */}
        <JsonLd data={organizationLd()} />
      </body>

      {/* GA4. Google's snippet says "paste on every page"; in the App Router
          that means exactly once, here — every route renders through this
          layout, so one placement covers /, /services/*, /work/* and /chat
          while still emitting a single tag per page. Never add a second one
          to an individual page.

          NODE_ENV keeps `npm run dev` out of the property. Note it does NOT
          exclude `npm run preview`, which is a real production build — filter
          those in GA4 under Admin > Data Streams > Define internal traffic. */}
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-QCJZ719Y5K" />
      )}
    </html>
  );
}
