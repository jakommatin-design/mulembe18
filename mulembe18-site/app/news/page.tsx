import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsSection from "@/components/NewsSection";
import Link from "next/link";
import { ArrowLeft, Newspaper, BellRing } from "lucide-react";

export const metadata = {
  title: "News & Communiqués • Habari na Matangazo — Mulembe18",
  description:
    "Official bulletins, circulars, welfare announcements, and cultural festival updates from the Mulembe18 National Secretariat.",
};

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#121714]">
      <Header />

      <main className="flex-1">
        {/* Agnos Subpage Header */}
        <div className="border-b border-[#EAE7DF] bg-white py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#111827] mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E4DA] text-[#6B7280] text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
                  <span>&gt;</span>
                  <span className="font-bold text-[#111827]">COMMUNIQUÉS &amp; DISPATCHES</span>
                  <span>&lt;</span>
                </div>
                <h1
                  className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight"
                  style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
                >
                  News &amp; Official Dispatches <span className="text-[#FF5500]">• Habari</span>
                </h1>
                <p className="text-sm text-[#4B5563] mt-1.5 max-w-2xl leading-relaxed">
                  Verified updates, resolutions from the Council of Elders, treasury welfare circulars, and community milestones nationwide.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <BellRing size={13} className="text-[#FF5500]" />
                  <span>Member Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Core News Section */}
        <NewsSection />
      </main>

      <Footer />
    </div>
  );
}

