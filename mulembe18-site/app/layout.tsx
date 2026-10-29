import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Caveat, Outfit, Kalam } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D6E38",
};

export const metadata: Metadata = {
  title: "Mulembe18 — Luhya Community in Mombasa | One Community, Many Roots",
  description:
    "mulembe18 is the unifying welfare and cultural association for Luhya people across Mombasa — connect, support, celebrate and grow together.",
  keywords: [
    "Mulembe18",
    "Luhya community",
    "Mombasa",
    "Luhya diaspora",
    "Kenya",
    "welfare",
    "cultural association",
  ],
  authors: [{ name: "Mulembe18 Community" }],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Mulembe18 — Luhya Community in Mombasa",
    description:
      "One Community, Many Roots, Stronger Together. Connecting the Luhya diaspora across Mombasa & Coastal Kenya.",
    type: "website",
  },
};

import ElderHelpFloatingBar from "@/components/ElderHelpFloatingBar";
import MsingiAIAssistant from "@/components/MsingiAIAssistant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0D6E38",
        },
      }}
    >
      <html
        lang="en"
        className={`${plusJakartaSans.variable} ${outfit.variable} ${caveat.variable} ${kalam.variable} scroll-smooth`}
      >
        <body
          style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
          className="selection:bg-[#0D6E38] selection:text-white"
        >
          {children}
          {/* Universal Elder & Accessibility Help Floating Bar */}
          <ElderHelpFloatingBar />
          {/* Msingi AI Community Assistant (Kenya) */}
          <MsingiAIAssistant />
        </body>
      </html>
    </ClerkProvider>
  );
}
