import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  // Generated from public/logo-swan.png — see public/favicon*.png,
  // apple-touch-icon.png and android-chrome-*.png.
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
      className={`dark scroll-smooth ${geistSans.variable} ${geistMono.variable}`}
    >
      {/* `bg-pcb-pattern` paints the dark base plus its two corner blooms; the
          `bg-cyber-dark` alongside it is the flat fallback that keeps the page
          from flashing white before that gradient resolves. */}
      <body
        className="bg-pcb-pattern relative min-h-screen bg-cyber-dark text-foreground antialiased selection:bg-cyber-cyan selection:text-cyber-dark"
        suppressHydrationWarning
      >
        {/* --- Persistent Neon Horizon Background ---
            Opacities cut roughly in half (10% -> 5/6%, 5% -> 3%). These blobs
            sit under the content, so wherever one drifts beneath a paragraph
            it lifts the background luminance and lowers that paragraph's real
            contrast ratio — the palette's measured numbers only hold if the
            floor stays put. Halved, they still read as a lit horizon while
            keeping every text pairing at its stated value. */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Top Left: Cyan Glow */}
          <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-cyber-cyan/6 rounded-full blur-[120px]" />

          {/* Middle Right: Purple Glow */}
          <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] bg-cyber-purple/5 rounded-full blur-[100px]" />

          {/* Bottom Left: Faint Cyan Glow */}
          <div className="absolute -bottom-[10%] left-[10%] w-[50%] h-[50%] bg-cyber-cyan/3 rounded-full blur-[120px]" />
        </div>

        {/* Replaced <Navbar /> with <Header /> */}
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
