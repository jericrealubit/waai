import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// This tells TypeScript that 'children' is a React node
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
