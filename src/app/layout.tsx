import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cinzel, Nunito } from "next/font/google";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Snowfall } from "@/components/Snowfall";
import "./globals.css";
const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "900"],
});
const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://northpole-penpal.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "North Pole Pen Pal | Magical Elf Letters for Kids",
    template: "%s | North Pole Pen Pal",
  },
  description:
    "A magical Christmas pen pal app where kids message friendly elves at the North Pole. Safe AI friendships, parent controls, countdown to Christmas, and workshop wonder.",
  keywords: [
    "Elf Pen Pal",
    "Letters from the North Pole",
    "Santa Letters",
    "Christmas App for Kids",
    "Elf Friend",
    "Santa Pen Pal",
    "Christmas Magic",
    "North Pole Letters",
    "Elf Mail",
    "Santa's Workshop",
  ],
  authors: [{ name: "North Pole Pen Pal" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "North Pole Pen Pal",
    title: "North Pole Pen Pal — Magical Elf Messaging for Kids",
    description:
      "Kids build a lasting friendship with an elf from Santa's workshop through safe, magical instant messages.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "North Pole Pen Pal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "North Pole Pen Pal",
    description:
      "Magical elf pen pals for kids — Christmas messaging from the North Pole.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "kids entertainment",
};
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "North Pole Pen Pal",
    operatingSystem: "iOS, Android, Web",
    applicationCategory: "EntertainmentApplication",
    description:
      "Magical Christmas pen pal messaging app for kids with elf friends at the North Pole.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="aurora-bg min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Snowfall />
        <TwinkleBar />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
function TwinkleBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-3 overflow-hidden">
      <div className="flex h-full w-full justify-between px-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="twinkle mt-1 h-2 w-2 rounded-full"
            style={{
              background: ["#fbbf24", "#ef4444", "#22c55e", "#38bdf8"][i % 4],
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
