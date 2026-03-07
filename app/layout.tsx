import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function RootLayout({ children }) {
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
