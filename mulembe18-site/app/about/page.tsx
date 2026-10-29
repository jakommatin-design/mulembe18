import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import LeadershipSection from "@/components/LeadershipSection";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, HeartHandshake, Compass } from "lucide-react";

export const metadata = {
  title: "About Us • Kuhusu Sisi — Mulembe18",
  description: "Learn about the Mulembe18 community, our 18 sub-tribes, vision, mission, and leadership.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111827]">
      <Header />

      <main className="flex-1">
        {/* Agnos Subpage Header */}
        <div className="bg-white border-b border-[#EAE7DF] py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF5500] transition-colors mb-4"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-2">
                  &gt; COMMUNITY FOUNDATION &lt;
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] tracking-tight">
                  About Mulembe18 <span className="text-[#FF5500]">• Kuhusu Sisi</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  One trusted platform uniting all 18 Luhya sub-tribes across Kenya for peace, mutual welfare,
                  and shared community prosperity.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/chapters"
                  className="px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-sm transition-all"
                >
                  View Kenya Chapters →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* About Section Content */}
        <AboutSection />

        {/* Leadership & Principles */}
        <LeadershipSection />
      </main>

      <Footer />
    </div>
  );
}
