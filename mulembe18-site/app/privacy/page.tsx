import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle, Scale } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Kenya Data Protection Act 2019 | mulembe18",
  description:
    "Official Privacy Policy and data protection disclosures for Mulembe18 National Community Platform under the Kenya Data Protection Act, 2019.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F2] text-[#18221B]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D6E38] hover:underline mb-6"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E0D5] shadow-xs space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E38] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Concept Section 10 &amp; NFR-05, NFR-11
              </span>
              <h1
                className="text-3xl sm:text-4xl font-black text-[#18221B] mt-3 tracking-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Privacy Policy &amp; Data Protection Compliance
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Compliance with the <strong>Kenya Data Protection Act, 2019</strong> • Office of the Data Protection Commissioner (ODPC)
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="text-lg font-bold text-[#18221B] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#0D6E38]" />
                <span>1. Data Controller Registration</span>
              </h2>
              <p>
                In accordance with Section 10 of the Mulembe18 Community Concept, the platform holds personal data of community members across Kenya.
                Mulembe18 is registered as a <strong>Data Controller</strong> with the Office of the Data Protection Commissioner (ODPC) under the Kenya Data Protection Act, 2019.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="text-lg font-bold text-[#18221B] flex items-center gap-2">
                <Lock size={18} className="text-[#0D6E38]" />
                <span>2. Information We Collect (Section 5)</span>
              </h2>
              <p>When you join a Mulembe18 chapter, we collect only the necessary verification details:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
                <li><strong>Identity:</strong> Full legal name, student or professional status.</li>
                <li><strong>Contact:</strong> Phone number (for M-Pesa reconciliation and SMS circulars) and email address.</li>
                <li><strong>Cultural Roots:</strong> Luhya sub-community (clan) and ancestral home county (Kakamega, Bungoma, Vihiga, Busia, Trans Nzoia).</li>
                <li><strong>Chapter Residence:</strong> Current residential chapter, ward, or estate.</li>
                <li><strong>Occupation:</strong> Skills, trade, or profession to enable community networking.</li>
              </ul>
            </div>

            {/* Section 3: Privacy Controls (FR-03 & NFR-05) */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="text-lg font-bold text-[#18221B] flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#0D6E38]" />
                <span>3. Member Privacy Controls (Requirement FR-03)</span>
              </h2>
              <p>
                Every member retains full sovereignty over their public visibility. In your member profile settings, you decide:
              </p>
              <div className="p-4 rounded-2xl bg-[#FBF8F2] border border-[#E6E0D5] space-y-2 text-xs">
                <p>• Whether other directory members can view your phone number (default: hidden).</p>
                <p>• Whether other directory members can view your email address (default: hidden).</p>
                <p>• Whether your professional listing appears in public directory searches.</p>
                <p>• Chapter admins see only what is needed to manage their local chapter; national officials see aggregate data unless explicit consent is provided.</p>
              </div>
            </div>

            {/* Section 4: Chapter Data Isolation (NFR-06) */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="text-lg font-bold text-[#18221B] flex items-center gap-2">
                <FileText size={18} className="text-[#0D6E38]" />
                <span>4. Chapter Data Isolation (NFR-06 &amp; NFR-07)</span>
              </h2>
              <p>
                As specified in Architecture Section 9.4, chapter isolation is strictly enforced in the data layer:
                every table carrying chapter data includes a chapter identifier. A chapter administrator (e.g. Mombasa) cannot access or view
                private member records belonging to another chapter (e.g. Nairobi or Nakuru).
              </p>
              <p>
                Every sensitive administrative export, member approval, or status update is immutably logged with <strong>who, what, and when (NFR-07)</strong>.
              </p>
            </div>

            {/* Section 5: Political Neutrality */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="text-lg font-bold text-[#18221B] flex items-center gap-2">
                <Scale size={18} className="text-[#0D6E38]" />
                <span>5. Non-Partisan &amp; Neutrality Mandate (Section 10)</span>
              </h2>
              <p>
                Mulembe18 operates as a strictly non-partisan community welfare association. The platform does not host, endorse, or permit
                partisan political campaigning, electioneering, or divisive rhetoric.
              </p>
            </div>

            {/* Contact Data Protection Officer */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5 text-[#0D6E38]">
              <strong className="block font-bold text-sm">Data Protection Officer (DPO) Contact:</strong>
              <p>If you wish to review, update, or request erasure of your data under the Kenya Data Protection Act, please contact:</p>
              <p className="font-mono">Email: privacy@mulembe18.org | Phone: +254 712 345 678</p>
              <p>Secretariat Office: Mulembe Centre, Links Road, Nyali, Mombasa County.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
