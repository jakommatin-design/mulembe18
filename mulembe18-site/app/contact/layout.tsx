import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Secretariat Desks • Wasiliana Nasi — Mulembe18",
  description:
    "Get in touch with the Mulembe18 National Secretariat, chapter coordinators, or urgent bereavement emergency distress hotline.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

