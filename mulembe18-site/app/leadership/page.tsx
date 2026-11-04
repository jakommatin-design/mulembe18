import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadershipSection from "@/components/LeadershipSection";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, Scale } from "lucide-react";

export const metadata = {
  title: "Council of Elders & Leadership • Uongozi — Mulembe18",
  description:
    "Democratically elected, clan-representative Council of Elders steering Mulembe18 nationwide community welfare and constitutional governance.",
};

export default function LeadershipPage() {
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
                  <span className="font-bold text-[#111827]">CONSTITUTIONAL GOVERNANCE</span>
                  <span>&lt;</span>
                </div>
                <h1
                  className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight"
                  style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
                >
                  Council of Elders &amp; Leadership <span className="text-[#FF5500]">• Uongozi</span>
                </h1>
                <p className="text-sm text-[#4B5563] mt-1.5 max-w-2xl leading-relaxed">
                  Servant leadership structured according to the Mulembe18 Constitution, representing all 18 Luhya sub-communities with verified democratic oversight.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/chapters"
                  className="px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <ShieldCheck size={13} className="text-[#0D6E38]" />
                  <span>Chapter Councils</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Core Leadership & Elections Section */}
        <LeadershipSection />
      </main>

      <Footer />
    </div>
  );
}

