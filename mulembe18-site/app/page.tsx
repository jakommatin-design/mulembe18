import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

import EventsSection from "@/components/EventsSection";
import WelfareSection from "@/components/WelfareSection";
import NewsSection from "@/components/NewsSection";
import GallerySection from "@/components/GallerySection";
import LeadershipSection from "@/components/LeadershipSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F2] text-[#18221B]">
      {/* Header & Sticky Navigation */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* About Community Section */}
        <AboutSection />

        {/* Member Directory */}


        {/* Upcoming Community Events */}
        <EventsSection />

        {/* Welfare, M-Pesa & Treasury Transparency */}
        <WelfareSection />

        {/* News, Circulars & Announcements */}
        <NewsSection />

        {/* Photo Gallery & Community Moments */}
        <GallerySection />

        {/* Executive Leadership & Council of Elders */}
        <LeadershipSection />
      </main>

      {/* Footer & Secretarial Contacts */}
      <Footer />
    </div>
  );
}
