import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Analytics } from "@vercel/analytics/next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tommasoruella.com"),
  title: "Tommaso Ruella",
  description:
    "Portfolio di Tommaso Ruella. Cinema, fotografia 35mm, DaVinci Resolve color grading e 3D.",
  keywords: [
    "Tommaso Ruella",
    "Cinema",
    "Regia",
    "Politecnico di Torino",
    "35mm",
    "16mm",
    "DaVinci Resolve",
    "Color Grading",
    "Portfolio",
  ],
  authors: [{ name: "Tommaso Ruella", url: "https://tommasoruella.com" }],
  creator: "Tommaso Ruella",
  openGraph: {
    title: "Tommaso Ruella",
    description:
      "Portfolio di Tommaso Ruella.",
    url: "https://tommasoruella.com",
    siteName: "Tommaso Ruella",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tommaso Ruella",
    description:
      "Portfolio di Tommaso Ruella.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`dark bg-black ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body className="bg-black text-zinc-100 antialiased min-h-screen flex flex-col font-sans selection:bg-white selection:text-black">
        {/* Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Conditional Footer (Hidden on homepage timeline, rendered on other pages) */}
        <ConditionalFooter />
        <Analytics />
      </body>
    </html>
  );
}
