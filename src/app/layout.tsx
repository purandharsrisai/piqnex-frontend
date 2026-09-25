import type { Metadata } from "next";
// Self-hosted variable font (all axes: weight, optical size, soft, wonk).
// Imported once here so every page gets it with no runtime network request.
import "@fontsource-variable/fraunces/full.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Piqnex - Find Your Missing Piece",
    template: "%s | Piqnex",
  },
  description:
    "Don't replace the whole product. Replace the missing piece. Buy, sell, and find individual replacement parts and components for electronics, laptops, gaming gear, wearables, cameras, appliances, and more.",
  openGraph: {
    title: "Piqnex",
    description:
      "Find your missing piece. A marketplace for individual replacement parts and components.",
    siteName: "Piqnex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piqnex",
    description: "Find your missing piece.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-clay-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
