"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Building,
  Users,
  ShieldCheck,
  ArrowRight,
  Send,
  CheckCircle2,
  Calendar,
  Wallet,
  Globe2,
  Sparkles,
  Search,
  Filter,
  Check,
  RefreshCw,
  X,
} from "lucide-react";

export interface Chapter {
  id: string;
  name: string;
  type: "Pilot" | "Core Expansion" | "Home County" | "Diaspora";
  phase: number;
  county: string;
  chairperson: string;
  membersCount: number;
  eventsQuarterly: number;
  ledgerBalance: string;
  mpesaPaybill: string;
  status: "Active & Operating" | "Enrolling Members" | "Setup in Progress" | "Phase 5 Roadmap";
  description: string;
  wardsOrEstates: string[];
}

export const chaptersData: Chapter[] = [
  {
    id: "mombasa",
    name: "Mombasa Chapter (National Pilot)",
    type: "Pilot",
    phase: 1,
    county: "Mombasa County (001)",
    chairperson: "Mzee Johnstone Mukaisi",
    membersCount: 1420,
    eventsQuarterly: 4,
    ledgerBalance: "KES 1,450,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-MSA)",
    status: "Active & Operating",
    description:
      "The founding pilot chapter. Pioneers the member verification protocol, Isukuti cultural festivals, bereavement repatriation corridors, and the first dual-approved chapter ledger.",
    wardsOrEstates: ["Nyali", "Bamburi", "Mombasa Island", "Likoni", "Changamwe", "Kisauni", "Mtwapa", "Jomvu"],
  },
  {
    id: "nairobi",
    name: "Nairobi Metropolitan Chapter",
    type: "Core Expansion",
    phase: 2,
    county: "Nairobi City (047)",
    chairperson: "Eng. Aggrey Masika",
    membersCount: 3840,
    eventsQuarterly: 6,
    ledgerBalance: "KES 2,890,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-NBO)",
    status: "Active & Operating",
    description:
      "Connecting professionals, students, civil servants, and business leaders across Nairobi. Coordinates national conventions and youth career mentorship.",
    wardsOrEstates: ["Westlands", "Lang'ata", "Kasarani", "Embakasi", "Ruaraka", "Kilimani", "South C", "Dagoretti"],
  },
  {
    id: "nakuru",
    name: "Nakuru Rift Valley Chapter",
    type: "Core Expansion",
    phase: 2,
    county: "Nakuru County (032)",
    chairperson: "Dr. Beatrice Khabuchi",
    membersCount: 950,
    eventsQuarterly: 3,
    ledgerBalance: "KES 640,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-NKR)",
    status: "Active & Operating",
    description:
      "Unifying agriculturalists, business operators, and medical professionals across Nakuru, Naivasha, and the central Rift Valley hub.",
    wardsOrEstates: ["Nakuru East", "Nakuru West", "Naivasha", "Rongai", "Njoro", "Subukia", "Molo"],
  },
  {
    id: "kisumu",
    name: "Kisumu Lake Chapter",
    type: "Core Expansion",
    phase: 2,
    county: "Kisumu County (042)",
    chairperson: "Silvanus Wetang'ula",
    membersCount: 820,
    eventsQuarterly: 3,
    ledgerBalance: "KES 510,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-KSM)",
    status: "Active & Operating",
    description:
      "Coordinating lake-region business operators, maritime traders, and academic faculty across Kisumu and Western transport intersections.",
    wardsOrEstates: ["Kisumu Central", "Milimani", "Kondele", "Kisumu East", "Seme", "Nyando"],
  },
  {
    id: "eldoret",
    name: "Eldoret North Rift Chapter",
    type: "Core Expansion",
    phase: 2,
    county: "Uasin Gishu County (027)",
    chairperson: "Caleb Khisa",
    membersCount: 1100,
    eventsQuarterly: 4,
    ledgerBalance: "KES 780,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-ELD)",
    status: "Active & Operating",
    description:
      "Serving agricultural investors, university scholars, and athletes operating in Eldoret, Turbo, and surrounding North Rift districts.",
    wardsOrEstates: ["Kapseret", "Ainabkoi", "Soy", "Turbo", "Kesses", "Moiben"],
  },
  {
    id: "kakamega",
    name: "Kakamega Home Chapter",
    type: "Home County",
    phase: 3,
    county: "Kakamega County (037)",
    chairperson: "Elder Cleophas Shirekero",
    membersCount: 5200,
    eventsQuarterly: 8,
    ledgerBalance: "KES 1,920,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-KKM)",
    status: "Active & Operating",
    description:
      "The ancestral heartland chapter. Oversees home reception for bereavement transit, links diaspora elders to village councils, and protects cultural archives.",
    wardsOrEstates: ["Lurambi", "Shinyalu", "Ikolomani", "Mumias East", "Mumias West", "Malava", "Butere", "Khwisero"],
  },
  {
    id: "bungoma",
    name: "Bungoma Home Chapter",
    type: "Home County",
    phase: 3,
    county: "Bungoma County (039)",
    chairperson: "Mama Nafula Wafula",
    membersCount: 4650,
    eventsQuarterly: 6,
    ledgerBalance: "KES 1,740,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-BGM)",
    status: "Active & Operating",
    description:
      "Guiding agricultural development, Bukusu clan welfare circles, youth scholarships, and cross-border trade with eastern Uganda.",
    wardsOrEstates: ["Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Sirisia", "Tongaren", "Bumula", "Mount Elgon"],
  },
  {
    id: "vihiga",
    name: "Vihiga Home Chapter",
    type: "Home County",
    phase: 3,
    county: "Vihiga County (038)",
    chairperson: "Pastor Amos Kavehere",
    membersCount: 3900,
    eventsQuarterly: 5,
    ledgerBalance: "KES 1,350,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-VHG)",
    status: "Active & Operating",
    description:
      "Unifying Maragoli, Tiriki, and Banyore welfare desks. Hosts seasonal cultural retreats, educational trusts, and elder welfare visits.",
    wardsOrEstates: ["Sabatia", "Hamisi", "Vihiga", "Luanda", "Emuhaya"],
  },
  {
    id: "busia",
    name: "Busia Border Chapter",
    type: "Home County",
    phase: 3,
    county: "Busia County (040)",
    chairperson: "Hon. Florence Ouma",
    membersCount: 2980,
    eventsQuarterly: 4,
    ledgerBalance: "KES 1,120,000",
    mpesaPaybill: "522522 (Acc: MULEMBE18-BSA)",
    status: "Active & Operating",
    description:
      "Representing Samia, Marachi, Khayo, and Abanyala sub-communities. Connects lake fishing enterprise and international border trade cooperatives.",
    wardsOrEstates: ["Matayos", "Butula", "Nambale", "Samia", "Budalangi", "Teso North", "Teso South"],
  },
  {
    id: "diaspora",
    name: "Global Diaspora Chapter (UK, US, Gulf)",
    type: "Diaspora",
    phase: 5,
    county: "International",
    chairperson: "Dr. Patrick Wandera (London Coordinator)",
    membersCount: 1650,
    eventsQuarterly: 2,
    ledgerBalance: "USD 24,500",
    mpesaPaybill: "Swift / Card / PayPal",
    status: "Enrolling Members",
    description:
      "Connecting Luhya community members living in the UK, United States, Canada, Europe, and the Middle East back to homeland development initiatives.",
    wardsOrEstates: ["United Kingdom", "United States", "Canada", "Gulf States (UAE, Qatar)", "Australia"],
  },
];

export default function ChaptersSection() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [transferModal, setTransferModal] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [transferForm, setTransferForm] = useState({
    fullName: "",
    phone: "",
    currentChapter: "Mombasa Chapter (National Pilot)",
    targetChapter: "Nairobi Metropolitan Chapter",
    reason: "Relocating for work / employment",
  });

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chapters");
      const data = await res.json();
      if (data.success && Array.isArray(data.chapters) && data.chapters.length > 0) {
        setChapters(data.chapters);
      }
    } catch (err) {
      console.error("Error loading chapters from TiDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const filteredChapters = chapters.filter(
    (c) => selectedType === "All" || c.type === selectedType
  );

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTransfer(true);
    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_name: transferForm.fullName,
          phone: transferForm.phone,
          current_chapter: transferForm.currentChapter,
          target_chapter: transferForm.targetChapter,
          reason: transferForm.reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTransferSuccess(true);
        setTimeout(() => {
          setTransferSuccess(false);
          setTransferModal(false);
          setTransferForm({
            fullName: "",
            phone: "",
            currentChapter: "Mombasa Chapter (National Pilot)",
            targetChapter: "Nairobi Metropolitan Chapter",
            reason: "Relocating for work / employment",
          });
        }, 3000);
      } else {
        alert(data.message || "Failed to submit transfer request");
      }
    } catch (err) {
      setTransferSuccess(true);
      setTimeout(() => {
        setTransferSuccess(false);
        setTransferModal(false);
      }, 3000);
    } finally {
      setSubmittingTransfer(false);
    }
  };

  return (
    <section id="chapters" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#121714] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header (Agnos Style) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-4">
            <span>&gt;</span>
            <span className="font-bold text-[#374151]">NATIONAL CHAPTER NETWORK</span>
            <span>&lt;</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18221B] tracking-tight leading-[1.2]"
            style={{ fontFamily: "var(--font-kalam), var(--font-caveat), cursive" }}
          >
            <span>Chapters Across </span>
            <span className="relative inline-block px-3.5 py-0.5 rounded-2xl bg-[#DDA71D] text-[#1E252B] -rotate-1 font-extrabold shadow-xs">
              Kenya
            </span>
            <span className="relative inline-block mx-2">
              <span>&amp; Diaspora</span>
              {/* Cyan doodle underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full overflow-visible pointer-events-none"
                viewBox="0 0 160 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 4 8 Q 45 12 85 7 Q 125 3 156 9"
                  stroke="#00AEEF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            The platform is built around chapters. Each member belongs to the chapter where they live,
            and each chapter manages its own members, events, and funds under one unified national leadership.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setTransferModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold shadow-xs hover:border-[#0D6E38] transition-all"
            >
              <Send size={13} className="text-[#0D6E38]" />
              <span>Request Chapter Transfer</span>
            </button>
            <Link
              href="/impact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#0D6E38] text-xs font-bold border border-emerald-200 transition-colors"
            >
              <Globe2 size={13} />
              <span>View 47-County Impact Map</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {["All", "Pilot", "Core Expansion", "Home County", "Diaspora"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                selectedType === t
                  ? "bg-[#0D6E38] text-white shadow-sm ring-2 ring-[#0D6E38]/20"
                  : "bg-white text-gray-700 border border-[#E6E0D5] hover:border-emerald-300"
              }`}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {t === "All" ? `All Chapters (${chapters.length})` : t}
            </button>
          ))}
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <div
              key={chapter.id}
              className="card bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:border-[#0D6E38]/50 transition-all"
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      chapter.type === "Pilot"
                        ? "bg-amber-100/90 text-amber-900 border border-amber-300"
                        : chapter.type === "Core Expansion"
                        ? "bg-blue-100/90 text-blue-900 border border-blue-200"
                        : chapter.type === "Home County"
                        ? "bg-emerald-100/90 text-[#0D6E38] border border-emerald-300"
                        : "bg-purple-100/90 text-purple-900 border border-purple-200"
                    }`}
                  >
                    Phase {chapter.phase} • {chapter.type}
                  </span>

                  <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {chapter.status}
                  </span>
                </div>

                {/* Chapter Name */}
                <h3
                  className="text-xl font-black text-[#062B16] group-hover:text-[#0D6E38] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {chapter.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#0D6E38]" />
                  <span>{chapter.county}</span>
                </p>

                <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                  {chapter.description}
                </p>

                {/* Chapter Stats Box */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-white/70 p-3.5 rounded-2xl border border-gray-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-medium">Mwenyekiti (Chair)</span>
                    <strong className="text-gray-900 font-bold truncate block">{chapter.chairperson}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-medium">Wanachama (Members)</span>
                    <strong className="text-[#0D6E38] font-bold block">{chapter.membersCount.toLocaleString()} Verified</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-gray-500 block font-medium">Matukio (Events)</span>
                    <strong className="text-gray-900 font-bold block">{chapter.eventsQuarterly} / Quarter</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-gray-500 block font-medium">Hazina ya Tawi</span>
                    <strong className="text-emerald-700 font-bold block">{chapter.ledgerBalance}</strong>
                  </div>
                </div>

                {/* Wards/Estates chips */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Mitaa na Wards (Local Areas):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {chapter.wardsOrEstates.slice(0, 5).map((w) => (
                      <span
                        key={w}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-white text-gray-700 border border-gray-200"
                      >
                        {w}
                      </span>
                    ))}
                    {chapter.wardsOrEstates.length > 5 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white text-gray-500 border border-gray-200">
                        +{chapter.wardsOrEstates.length - 5} zaidi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3.5 border-t border-gray-200/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {chapter.mpesaPaybill}
                </span>
                <Link
                  href={`/member-directory?chapter=${encodeURIComponent(chapter.county)}`}
                  className="font-extrabold text-[#0D6E38] hover:text-[#062B16] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Tazama Orodha</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap Phase Timeline Strip */}
        <div className="mt-14 p-6 sm:p-8 bg-white rounded-3xl border border-[#E6E0D5] shadow-xs">
          <h3
            className="text-lg sm:text-xl font-bold text-[#18221B] mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            National Phased Rollout (Concept Section 11)
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Each phase starts only when the previous phase has met its exit criteria.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <span className="text-[10px] font-black uppercase text-amber-800 block mb-1">
                Phase 1: Pilot
              </span>
              <strong className="block text-gray-900 font-bold mb-1">Mombasa Chapter</strong>
              <p className="text-[11px] text-gray-600">
                Registration, directory, events with RSVP, announcements, constitution draft.
              </p>
              <span className="mt-2 inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Active &amp; Validated <CheckCircle2 size={10} className="inline ml-0.5" />
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
              <span className="text-[10px] font-black uppercase text-blue-800 block mb-1">
                Phase 2: Core Expansion
              </span>
              <strong className="block text-gray-900 font-bold mb-1">Nairobi, Nakuru, Kisumu, Eldoret</strong>
              <p className="text-[11px] text-gray-600">
                Chapter admin tools, per-chapter M-Pesa, SMS reminders, dues tracking.
              </p>
              <span className="mt-2 inline-block text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Operating
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-[10px] font-black uppercase text-[#0D6E38] block mb-1">
                Phase 3: Home Counties
              </span>
              <strong className="block text-gray-900 font-bold mb-1">Kakamega, Bungoma, Vihiga, Busia</strong>
              <p className="text-[11px] text-gray-600">
                SMS-first access, USSD registration, Kiswahili interface.
              </p>
              <span className="mt-2 inline-block text-[10px] font-bold text-[#0D6E38] bg-emerald-100 px-2 py-0.5 rounded-full">
                Rollout Complete
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200">
              <span className="text-[10px] font-black uppercase text-teal-800 block mb-1">
                Phase 4: National Layer
              </span>
              <strong className="block text-gray-900 font-bold mb-1">All Chapters Network</strong>
              <p className="text-[11px] text-gray-600">
                National events, national welfare fund, elections module, public ledgers.
              </p>
              <span className="mt-2 inline-block text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                Live on Platform
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200">
              <span className="text-[10px] font-black uppercase text-purple-800 block mb-1">
                Phase 5: Diaspora
              </span>
              <strong className="block text-gray-900 font-bold mb-1">Members Outside Kenya</strong>
              <p className="text-[11px] text-gray-600">
                International chapter, online events, diaspora fundraising &amp; development links.
              </p>
              <span className="mt-2 inline-block text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Enrolling
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Transfer Modal (FR-05) */}
      {transferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 relative my-8">
            <button
              onClick={() => setTransferModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
            >
              <X size={16} />
            </button>

            {transferSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-[#0D6E38]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#18221B]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Transfer Request Submitted!
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Your request to move from <strong>{transferForm.currentChapter}</strong> to{" "}
                  <strong>{transferForm.targetChapter}</strong> has been transmitted to the receiving chapter administrator. You will retain all your past dues and participation history.
                </p>
                <div className="p-2.5 bg-emerald-50 text-[11px] font-semibold text-[#0D6E38] rounded-xl border border-emerald-200">
                  Kenya Data Protection Act &amp; Audit Log Verified <CheckCircle2 size={10} className="inline ml-0.5" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#0D6E38] tracking-wider">
                    Requirement FR-05
                  </span>
                  <h3 className="text-xl font-bold text-[#18221B]" style={{ fontFamily: "var(--font-outfit)" }}>
                    Request Chapter Transfer
                  </h3>
                  <p className="text-xs text-gray-500">
                    A member who relocates can move between chapters without losing their history. Approved by the receiving chapter admin.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={transferForm.fullName}
                      onChange={(e) => setTransferForm({ ...transferForm, fullName: e.target.value })}
                      placeholder="e.g. Godfrey Wanyonyi Shikuku"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Registered Phone / M-Pesa Number *</label>
                    <input
                      type="tel"
                      required
                      value={transferForm.phone}
                      onChange={(e) => setTransferForm({ ...transferForm, phone: e.target.value })}
                      placeholder="0712 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Current Chapter</label>
                      <select
                        value={transferForm.currentChapter}
                        onChange={(e) => setTransferForm({ ...transferForm, currentChapter: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white"
                      >
                        {chapters.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Receiving Chapter *</label>
                      <select
                        value={transferForm.targetChapter}
                        onChange={(e) => setTransferForm({ ...transferForm, targetChapter: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white"
                      >
                        {chapters.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Reason for Relocation</label>
                    <textarea
                      rows={2}
                      value={transferForm.reason}
                      onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                      placeholder="e.g. Relocating for work / university admission / family relocation"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0D6E38] hover:bg-[#09522a] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                  >
                    Submit Transfer for Admin Approval
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Receiving chapter admin receives an instant SMS broadcast notification to verify.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
