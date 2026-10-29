import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import Link from "next/link";
import { ArrowLeft, PhoneCall } from "lucide-react";

export const metadata = {
  title: "Events • Matukio ya Jamii — Mulembe18",
  description: "Browse upcoming cultural celebrations, general meetings, sports tournaments, and chapter gatherings.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#121714]">
      <Header />

      <main className="flex-1">
        {/* Agnos-style Page Sub-Header */}
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
                  <span className="font-bold text-[#111827]">COMMUNITY CALENDAR</span>
                  <span>&lt;</span>
                </div>
                <h1
                  className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight"
                  style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
                >
                  Events &amp; Cultural Festivals
                </h1>
                <p className="text-sm text-[#4B5563] mt-1.5 max-w-2xl leading-relaxed">
                  Stay updated on our cultural festivals, chapter general meetings, youth sports tournaments, and
                  family gatherings across Kenya.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:+254712345678"
                  className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E4DA] text-[#111827] font-bold text-xs hover:border-[#111827] transition-all flex items-center gap-2 shadow-2xs"
                >
                  <PhoneCall size={14} className="text-[#FF5500]" />
                  <span>RSVP Helpline: 0712 345 678</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Events Content */}
        <EventsSection />
      </main>

      <Footer />
    </div>
  );
}
