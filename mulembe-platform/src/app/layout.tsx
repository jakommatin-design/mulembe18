import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "@/styles/theme.scss";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mulembe National Platform | Heritage, Community & Governance",
  description:
    "The official national digital platform for the Luhya community across 47 counties and the diaspora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        data-theme="dark"
        className={`${sansFont.variable} ${serifFont.variable}`}
      >
        <body className="min-vh-100 d-flex flex-column">
          <ToastProvider>
            <Navbar />
            <div className="flex-grow-1">{children}</div>
            <Footer />
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
