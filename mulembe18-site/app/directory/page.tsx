import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DirectorySection from "@/components/DirectorySection";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, PhoneCall } from "lucide-react";

export const metadata = {
  title: "Member Directory — Mulembe18",
  description: "Find verified Luhya community members across Kenya by chapter, county, and sub-tribe.",
};

export default function DirectoryPage() {
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
                  &gt; COMMUNITY REGISTRY &lt;
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] tracking-tight">
                  Member Directory <span className="text-[#FF5500]">• Orodha ya Wanachama</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Search and connect with verified community members across Kenya. Find professionals and families
                  from your home county or sub-tribe residing near you.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:+254712345678"
                  className="px-4 py-2.5 rounded-full bg-white border border-[#EAE7DF] text-[#111827] font-bold text-xs hover:border-[#FF5500] hover:text-[#FF5500] flex items-center gap-2 shadow-2xs transition-all"
                >
                  <PhoneCall size={13} className="text-[#FF5500]" />
                  <span>Support: 0712 345 678</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Search & List Component */}
        <div>
          <DirectorySection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
