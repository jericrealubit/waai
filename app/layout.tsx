import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header"; // Corrected import
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

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
        className="bg-pcb-pattern relative min-h-screen bg-cyber-dark text-foreground antialiased selection:bg-cyber-cyan/30 selection:text-white"
        suppressHydrationWarning
      >
        {/* --- Persistent Neon Horizon Background --- */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Top Left: Cyan Glow */}
          <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-cyber-cyan/10 rounded-full blur-[120px]" />

          {/* Middle Right: Purple Glow */}
          <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] bg-cyber-purple/10 rounded-full blur-[100px]" />

          {/* Bottom Left: Faint Cyan Glow */}
          <div className="absolute -bottom-[10%] left-[10%] w-[50%] h-[50%] bg-cyber-cyan/5 rounded-full blur-[120px]" />
        </div>

        {/* Replaced <Navbar /> with <Header /> */}
        <Header />

        {/* Added pt-24 to ensure content doesn't start under the fixed floating header */}
        <main className="pt-24 md:pt-32">{children}</main>

        <ScrollToTop />

        <Footer />
      </body>
    </html>
  );
}
