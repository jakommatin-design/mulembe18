import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact & Transparency Ledger • Mulembe18",
  description:
    "Audited public ledger, transparent welfare distribution, emergency aid disbursals, and community growth metrics across 47 counties.",
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

