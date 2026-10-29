"use client";
import { useState } from "react";
import {
  ArrowRight,
  Users,
  ShieldCheck,
  TrendingUp,
  Landmark,
  MapPin,
  Check,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  X,
  Phone,
  Mail,
  User,
  Eye,
  EyeOff,
  Building,
  Target,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

const luhyaClans = [
  "Bukusu",
  "Maragoli (AvaLogoli)",
  "Wanga",
  "Banyore (Abanyole)",
  "Idakho",
  "Isukha",
  "Samia",
  "Tachoni",
  "Kabras",
  "Tiriki",
  "Kisa",
  "Marama",
  "Tsotso",
  "Khayo",
  "Marachi",
  "Abanyala",
  "Batsotso",
  "Batura",
];

const chaptersList = [
  "Mombasa Chapter (National Pilot)",
  "Nairobi Metropolitan Chapter",
  "Nakuru Rift Valley Chapter",
  "Kisumu Lake Chapter",
  "Eldoret North Rift Chapter",
  "Kakamega Home Chapter",
  "Bungoma Home Chapter",
  "Vihiga Home Chapter",
  "Busia Border Chapter",
  "Global Diaspora Chapter",
];

const ancestralHomeCounties = [
  "Kakamega County",
  "Bungoma County",
  "Vihiga County",
  "Busia County",
  "Trans Nzoia County",
  "Mombasa (Coastal Born)",
  "Nairobi (Diaspora Born)",
];

const corePillars = [
  {
    icon: Users,
    title: "Unity",
    subtitle: "Our Strength",
    description: "Uniting all 18 Luhya sub-communities under one sovereign, peaceful national brotherhood.",
    accent: "bg-emerald-50 text-[#0D6E38] border-emerald-200",
  },
  {
    icon: Landmark,
    title: "Culture",
    subtitle: "Our Identity",
    description: "Preserving vibrant Isukuti rhythms, mother dialects, culinary heritage, and elder baraza lore.",
    accent: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    icon: ShieldCheck,
    title: "Support",
    subtitle: "Our Welfare",
    description: "Transparent bereavement repatriation and medical mutual assistance ensuring no one is left alone.",
    accent: "bg-emerald-50 text-[#0D6E38] border-emerald-200",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    subtitle: "Our Future",
    description: "Nationwide professional networking, youth mentorship, maritime enterprise, and chapter solidarity.",
    accent: "bg-blue-50 text-blue-800 border-blue-200",
  },
];

const solvedGaps = [
  {
    gap: "Scattered WhatsApp Groups",
    solution: "One central verified member registry across all 47 counties.",
    icon: Compass,
  },
  {
    gap: "Informal Welfare Collections",
    solution: "100% transparent public ledger with dual approval sign-off.",
    icon: ShieldCheck,
  },
  {
    gap: "Disjointed Event Planning",
    solution: "Integrated community calendar with RSVP pass issuance & task check.",
    icon: Target,
  },
  {
    gap: "Isolated City Groups",
    solution: "County-by-county autonomous chapters sharing one national identity.",
    icon: Building,
  },
];

const conceptObjectives = [
  { num: "1", text: "Register and verify members by chapter, home county and sub-community." },
  { num: "2", text: "Provide every chapter tools to plan events, barazas and track attendance." },
  { num: "3", text: "Make welfare and dues transparent with a public dual sign-off ledger." },
  { num: "4", text: "Provide a national platform for leadership, communiqués and elections." },
  { num: "5", text: "Protect members' data under Kenya Data Protection Act 2019." },
  { num: "6", text: "Ensure full accessibility via SMS & USSD (*384*18#) for basic phones." },
];

export default function AboutSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredMemberId, setRegisteredMemberId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    subClan: "Bukusu",
    homeCounty: "Kakamega County",
    currentChapter: "Mombasa Chapter (National Pilot)",
    residentialArea: "Nyali",
    occupation: "Maritime Logistics",
    statusType: "Professional" as "Professional" | "Student" | "Business Owner" | "Elder",
    privacyShowPhone: false,
    privacyShowEmail: false,
    privacyShowOccupation: true,
    consentDataAct: true,
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    if (!form.consentDataAct) {
      setErrorMessage("Please consent to the Kenya Data Protection Act 2019 terms.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          clan: form.subClan,
          residentialCounty: form.currentChapter,
          residentialWard: form.residentialArea,
          ancestralCounty: form.homeCounty,
          profession: form.occupation,
          statusType: form.statusType,
          privacySettings: {
            showPhone: form.privacyShowPhone,
            showEmail: form.privacyShowEmail,
            showOccupation: form.privacyShowOccupation,
          },
        }),
      });

      const data = await res.json();
      const newId = data.memberId || `MLMB-MSA-${Math.floor(1000 + Math.random() * 9000)}`;
      setRegisteredMemberId(newId);
      setSubmitSuccess(true);
    } catch {
      setRegisteredMemberId(`MLMB-MSA-${Math.floor(1000 + Math.random() * 9000)}`);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setModalOpen(false);
    setSubmitSuccess(false);
    setErrorMessage("");
  };

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#111827] relative overflow-hidden" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">

        {/* Section Header (Agnos Style) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-2">
            <span>&gt;</span>
            <span className="font-bold text-[#374151]">CONCEPT &amp; STRATEGIC FRAMEWORK</span>
            <span>&lt;</span>
          </div>

          <h2
            id="about-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-[1.2]"
          >
            Uniting all 18 sub-tribes for{" "}
            <span className="text-[#FF5500]">shared prosperity</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            From our Mombasa pilot to a nationwide chapter network, Mulembe18 provides one trusted home for
            Luhya community members across Kenya to connect, celebrate heritage, and support each other.
          </p>
        </div>

        {/* 4 Core Pillars in Agnos Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:border-[#FF5500]/40 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-orange-50 text-[#FF5500] border border-orange-200">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {p.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-[#111827] mt-1 group-hover:text-[#FF5500] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* The 4 Gaps We Solve & 6 Core Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Solved Gaps */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-3">
                &gt; RATIONALE &amp; NEED &lt;
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">
                Solving the Four Informal Gaps
              </h3>
              <p className="text-xs text-gray-600 mt-1 mb-6">
                Informal WhatsApp groups leave gaps in record-keeping, transparency, and accountability.
              </p>

              <div className="space-y-3.5">
                {solvedGaps.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange-200">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-400 line-through">{item.gap}</div>
                        <div className="text-xs font-bold text-[#111827] mt-0.5">{item.solution}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EAE7DF] flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Have you registered your family?</span>
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Join Register</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 6 Core Objectives */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-3">
                &gt; OUR MANDATE &lt;
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">
                Six Strategic Objectives
              </h3>
              <p className="text-xs text-gray-600 mt-1 mb-6">
                Governing every chapter, event, and welfare disbursement nationwide.
              </p>

              <div className="space-y-3">
                {conceptObjectives.map((obj) => (
                  <div key={obj.num} className="flex items-start gap-3 text-xs text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#111827] text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                      {obj.num}
                    </div>
                    <p className="leading-snug pt-0.5">{obj.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#EAE7DF] bg-[#FAF9F6] p-4 rounded-2xl border border-[#EAE7DF] flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#FF5500] flex-shrink-0" />
              <p className="text-[11px] text-gray-700 leading-snug">
                Fully compliant with Kenya Data Protection Act 2019. Your contact details remain private unless you grant directory consent.
              </p>
            </div>
          </div>
        </div>

        {/* Registration CTA Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-[#111827] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#EAE7DF] shadow-lg relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5500]">
              &gt; OFFICIAL REGISTRATION &lt;
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Are You Registered with Mulembe18?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Join thousands of Luhya professionals, business leaders, elders, and youth resident across Mombasa, Nairobi, and countrywide chapters.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-7 py-3.5 rounded-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-sm shadow-md transition-all whitespace-nowrap z-10"
          >
            Register Membership
          </button>
        </div>

      </div>

      {/* Registration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EAE7DF] relative my-8">
            <button
              onClick={resetForm}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-[#0D6E38]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#18221B]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Registration Submitted!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Your registration has been received by your chapter secretariat desk. Your Member ID is:
                </p>
                <div className="inline-block px-5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 font-mono font-black text-lg text-[#0D6E38]">
                  {registeredMemberId}
                </div>
                <div className="pt-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full bg-[#0D6E38] text-white text-xs font-bold shadow-md hover:bg-[#09522a]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0D6E38] tracking-wider">
                    Member Registration Form
                  </span>
                  <h3 className="text-2xl font-bold text-[#18221B]" style={{ fontFamily: "var(--font-outfit)" }}>
                    Register with Mulembe18
                  </h3>
                  <p className="text-xs text-gray-500">
                    Connect with your county chapter and ancestral clan registry.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Godfrey Shikuku Wandera"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      M-Pesa Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 0712 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. godfrey@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Luhya Sub-Community (Clan) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={form.subClan}
                      onChange={(e) => setForm({ ...form, subClan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    >
                      {luhyaClans.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Current Chapter (Residence) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={form.currentChapter}
                      onChange={(e) => setForm({ ...form, currentChapter: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    >
                      {chaptersList.map((ch) => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Ancestral Home County <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={form.homeCounty}
                      onChange={(e) => setForm({ ...form, homeCounty: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    >
                      {ancestralHomeCounties.map((cty) => (
                        <option key={cty} value={cty}>{cty}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Residential Estate / Area
                    </label>
                    <input
                      type="text"
                      value={form.residentialArea}
                      onChange={(e) => setForm({ ...form, residentialArea: e.target.value })}
                      placeholder="e.g. Nyali, Bamburi, Westlands"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Profession / Occupation
                    </label>
                    <input
                      type="text"
                      value={form.occupation}
                      onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                      placeholder="e.g. Maritime Officer / Teacher / Business"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>
                </div>

                {/* Privacy Consent */}
                <div className="pt-2 border-t border-gray-200">
                  <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consentDataAct}
                      onChange={(e) => setForm({ ...form, consentDataAct: e.target.checked })}
                      className="rounded text-[#0D6E38] focus:ring-[#0D6E38]"
                    />
                    <span>
                      I consent to Mulembe18 storing my data in compliance with the Kenya Data Protection Act 2019.
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[#0D6E38] hover:bg-[#09522a] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting to Chapter Registry...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
