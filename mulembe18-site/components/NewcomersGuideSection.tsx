"use client";
import { useState } from "react";
import {
  Compass,
  Home,
  Bus,
  Church,
  Briefcase,
  Users,
  ArrowRight,
  MapPin,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

const newcomerGuides = [
  {
    id: "estates",
    title: "Mombasa Estates & Housing",
    icon: Home,
    summary: "Where community members live, typical rental ranges, and security tips.",
    details: [
      {
        area: "Bamburi & Kiembeni (Kisauni)",
        vibe: "High Luhya presence, affordable bedsitters & 1-bedrooms (KES 5,000 – 12,000), vibrant evening markets, active Bukusu & Idakho chamas.",
      },
      {
        area: "Tudor & Majengo (Mvita / Island)",
        vibe: "Central to CBD, Technical University of Mombasa (TUM), convenient for students and port professionals (KES 8,000 – 18,000).",
      },
      {
        area: "Nyali & Links Road",
        vibe: "Commercial and suburban, suited for mid-to-senior professionals, close to coastal business districts (KES 20,000+).",
      },
      {
        area: "Changamwe & Magongo",
        vibe: "Close to Mombasa Port, EPZ, and airport, great transport connectivity, active Maragoli & Samia elder cells.",
      },
      {
        area: "Likoni & Shelly Beach",
        vibe: "Across Likoni Ferry, very affordable housing, quiet coastal settlements with emerging community groups.",
      },
    ],
  },
  {
    id: "transit",
    title: "Matatu Routes & Ferry Tips",
    icon: Bus,
    summary: "Navigating Mombasa matatu stages, tuk-tuks, and Likoni Ferry.",
    details: [
      {
        area: "Coast Bus & Western Coaches Terminal",
        vibe: "Direct buses arrive in Mwembe Tayari / Bondeni from Kakamega, Bungoma, Busia, and Nairobi. Alight here for Island or connect to Nyali.",
      },
      {
        area: "Matatu Route 10 (Posta - Bamburi / Mtwapa)",
        vibe: "Boards at Posta or Digo Road; goes through Nyali Bridge directly to Bamburi and Shanzu.",
      },
      {
        area: "Matatu Route 1 (Posta - Changamwe / Airport)",
        vibe: "Main industrial and airport trunk route from downtown Mombasa.",
      },
      {
        area: "Likoni Channel Crossing",
        vibe: "Free pedestrian ferry; peak hours (6:30am–8:30am, 5:00pm–7:30pm) have heavy crowds, plan with 20 minutes buffer.",
      },
    ],
  },
  {
    id: "gatherings",
    title: "Community Churches & Meetups",
    icon: Church,
    summary: "Churches with Luhya services/choirs and weekly fellowship gatherings.",
    details: [
      {
        area: "Friends Church (Quakers) Mombasa",
        vibe: "Coast Friends Meeting in Tudor and Bamburi. Major fellowship hub for Vihiga and Western diaspora.",
      },
      {
        area: "PAG / Pentecostal Assemblies of God",
        vibe: "Active branches in Kisauni, Likoni, and Changamwe with vibrant Luhya choir and youth fellowships.",
      },
      {
        area: "ACK & Catholic Parishes",
        vibe: "Mama Ngina waterfront Sunday community walks; monthly clan barazas at Bamburi Community Centre.",
      },
    ],
  },
  {
    id: "jobs",
    title: "Mentorship & Job Placements",
    icon: Briefcase,
    summary: "Pairing newly arrived graduates and artisans with established coastal mentors.",
    details: [
      {
        area: "Maritime, Port & Logistics Mentorship",
        vibe: "Connect with senior Luhya freight forwarders, clearing agents, and maritime officers at KPA.",
      },
      {
        area: "Hospitality & Tourism Pairing",
        vibe: "Direct references to coastal beach resorts, restaurants, and hotel management in Diani, Nyali, and Malindi.",
      },
      {
        area: "Artisan & Technical Trades",
        vibe: "Electrical, plumbing, masonry, and mechanical workshops run by experienced community elders.",
      },
    ],
  },
];

export default function NewcomersGuideSection() {
  const [activeTab, setActiveTab] = useState("estates");

  const currentGuide = newcomerGuides.find((g) => g.id === activeTab) || newcomerGuides[0];

  return (
    <section
      id="newcomers"
      className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E6E0D5]"
      aria-labelledby="newcomers-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Initial First Design Style */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0D6E38]">
            <Compass size={13} />
            <span style={{ fontFamily: "var(--font-kalam), cursive" }}>Newcomer’s Orientation Guide</span>
          </div>

          <h2
            id="newcomers-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18221B] tracking-tight leading-[1.2]"
            style={{ fontFamily: "var(--font-kalam), var(--font-caveat), cursive" }}
          >
            <span>Karibu: </span>
            <span className="relative inline-block px-3.5 py-0.5 rounded-2xl bg-[#DDA71D] text-[#1E252B] -rotate-1 font-extrabold shadow-xs">
              Finding Your People
            </span>
            <span className="relative inline-block mx-2">
              <span>in New Towns</span>
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

          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            Moving from Western Kenya to Mombasa, Nairobi or beyond? Mulembe18 ensures no newcomer
            feels stranded. Explore affordable estates, matatu routes, community churches, and
            fellowship chamas.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
          {newcomerGuides.map((guide) => {
            const Icon = guide.icon;
            const isActive = activeTab === guide.id;
            return (
              <button
                key={guide.id}
                onClick={() => setActiveTab(guide.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#0D6E38] text-white shadow-sm"
                    : "bg-[#FBF8F2] hover:bg-gray-100 text-gray-700 border border-[#E6E0D5]"
                }`}
              >
                <Icon size={16} />
                <span>{guide.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="bg-[#FBF8F2] rounded-3xl p-6 sm:p-10 border border-[#E6E0D5] max-w-5xl mx-auto shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#E6E0D5]">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0D6E38] flex items-center justify-center">
              <currentGuide.icon size={22} />
            </div>
            <div>
              <h3
                className="text-xl sm:text-2xl font-bold text-[#18221B]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {currentGuide.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{currentGuide.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentGuide.details.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E6E0D5] hover:border-[#0D6E38]/40 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2 text-[#0D6E38] font-bold text-sm mb-1.5">
                  <MapPin size={15} />
                  <span>{item.area}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.vibe}</p>
              </div>
            ))}
          </div>

          {/* Emergency Assistance Hotline Callout */}
          <div className="mt-8 pt-6 border-t border-[#E6E0D5] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-[#DDA71D] flex items-center justify-center flex-shrink-0">
                <PhoneCall size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#18221B]">Just Arrived in Mombasa?</h4>
                <p className="text-xs text-gray-500">
                  Call the Mulembe18 Reception Secretariat for guidance on housing and clan chamas.
                </p>
              </div>
            </div>
            <a
              href="tel:+254712345678"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D6E38] hover:bg-[#09522a] text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
            >
              <span>Call +254 712 345 678</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
