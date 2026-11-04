import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Msingi AI • Mulembe Cultural & Constitution Assistant",
  description:
    "Ask Msingi AI anything about Mulembe18 bylaws, welfare claims process, 18 Luhya sub-clans history, and chapter contacts.",
};

export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

