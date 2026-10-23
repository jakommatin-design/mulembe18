import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DirectorySection from "@/components/DirectorySection";

export const metadata = {
  title: "Member Directory — Mulembe18",
  description: "Browse the registered member directory of the Mulembe18 community.",
};

export default function MemberDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F2] text-[#18221B]">
      <Header />
      <main className="flex-1">
        <section id="directory" className="py-12 bg-white min-h-[70vh]">
          <DirectorySection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
