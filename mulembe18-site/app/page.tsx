import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import ComparisonSection from "@/components/ComparisonSection";
import AboutSection from "@/components/AboutSection";
import ChaptersSection from "@/components/ChaptersSection";
import EventsSection from "@/components/EventsSection";
import WelfareSection from "@/components/WelfareSection";
import NoticeboardSection from "@/components/NoticeboardSection";
import NewcomersGuideSection from "@/components/NewcomersGuideSection";
import NewsSection from "@/components/NewsSection";
import GallerySection from "@/components/GallerySection";
import LeadershipSection from "@/components/LeadershipSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#121714]">
      {/* Floating Modern Header (Agnos Style Island) */}
      <Header />

      <main className="flex-1">
        {/* 1. Hero: Agnos Layout with Orbit Lines & Floating Cultural Cards */}
        <HeroSection />

        {/* 2. Process Dome Arch (Agnos Style Image 4): Step 01, 02, 03 */}
        <ProcessSection />

        {/* 3. Comparison Section (Agnos Style Image 2 & 3): Transparency vs Traditional Barazas */}
        <ComparisonSection />

        {/* 4. Concept Sections 1, 2, 3, 4, 5: Executive Summary, 4 Gaps, 6 Objectives, Governance Table, Join */}
        <AboutSection />

        {/* 5. Concept Section 4 & 11: Chapter-Based National Network & Transfers (FR-05) */}
        <ChaptersSection />

        {/* 6. Concept Section 6.1: Events, Planning, Committees & Task Checklists (FR-06, FR-07, FR-08) */}
        <EventsSection />

        {/* 8. Concept Section 6.2: Welfare Dues, Active Appeals & Public Ledgers with Dual Approval (FR-09, FR-10, FR-11, FR-12) */}
        <WelfareSection />

        {/* 9. Concept Section 6.3 & FR-14: Community Noticeboard for Jobs, Rentals, Businesses & Mentorship */}
        <NoticeboardSection />

        {/* 10. Concept Section 6.4: Newcomer's Orientation Guide */}
        <NewcomersGuideSection />

        {/* 11. Concept Section 6.3: Announcements, Communiqués & News Board */}
        <NewsSection />

        {/* 12. Concept Section 6.4: Culture, Heritage & Photo Gallery */}
        <GallerySection />

        {/* 13. Concept Section 6.5 & 10: Executive Leadership, Constitution & Elections Module (FR-15) */}
        <LeadershipSection />
      </main>

      {/* 14. Secretariat Contacts, Legal Compliance & Footer */}
      <Footer />
    </div>
  );
}
