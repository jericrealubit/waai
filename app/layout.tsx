import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// This defines the <head>, <title>, and <meta> tags for the entire site
export const metadata: Metadata = {
  title: "WA AI Digital | Websites, Ordering Systems & Growth",
  description:
    "Bespoke digital solutions for WA businesses. From custom ordering systems to strategic marketing and digital growth & maintenance.",
  keywords: [
    "Web Development WA",
    "AI Digital Perth",
    "Ordering Systems",
    "Digital Growth",
    "Website Maintenance",
  ],
  openGraph: {
    title: "WA AI Digital",
    description: "Innovating the West with Custom Web & AI Systems.",
    url: "https://waai.au",
    siteName: "WA AI Digital",
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
      <body className="antialiased bg-white text-gray-900 flex flex-col min-h-screen">
        <Header />
        {/* min-h-screen on body and flex-1 on main ensures the footer stays at the bottom */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
