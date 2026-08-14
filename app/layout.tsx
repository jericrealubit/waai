import type { Metadata } from "next";
import { Geist, Geist_Mono, Saira_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header"; // Corrected import
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  metadataBase: new URL("https://waai.au"),
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
    url: "https://waai.au",
    siteName: "WA AI Digital",
    images: [
      {
        url: "/og-image.png", // Recommended: add a preview image in public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_AU",
    type: "website",
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
        <Header />

        {/* Added pt-24 to ensure content doesn't start under the fixed floating header */}
        <main className="pt-24 md:pt-32">{children}</main>

        <ScrollToTop />

        <Footer />
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
