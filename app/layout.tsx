import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header"; // Corrected import
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
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
    <html lang="en" className="scroll-smooth">
      {/* Note: 'bg-slate-50' acts as a fallback for 'bg-horizon-shell'
          to ensure the background isn't pure white before the glows load.
      */}
      <body className="relative min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-900">
        {/* --- Persistent Digital Horizon Background --- */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Top Left: Ocean Blue Glow */}
          <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-sky-100/50 rounded-full blur-[120px]" />

          {/* Middle Right: Sandy Gold Glow (matches image_173b22.png) */}
          <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] bg-amber-50/70 rounded-full blur-[100px]" />

          {/* Bottom Left: Pale Sky Glow */}
          <div className="absolute -bottom-[10%] left-[10%] w-[50%] h-[50%] bg-sky-50/60 rounded-full blur-[120px]" />
        </div>

        {/* Replaced <Navbar /> with <Header /> */}
        <Header />

        {/* Added pt-24 to ensure content doesn't start under the fixed floating header */}
        <main className="pt-24 md:pt-32">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
