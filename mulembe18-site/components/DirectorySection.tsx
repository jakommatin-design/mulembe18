"use client";
import { useState, useEffect } from "react";
import { Search, ChevronRight, X, Phone, Mail, MapPin, ShieldCheck, Users, UserPlus, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Member {
  id?: number;
  initials?: string;
  name: string;
  clan: string;
  area: string;
  profession: string;
  field: string;
  joined: string;
  status: string;
  phone?: string;
  email?: string;
  bio?: string;
  bg?: string;
  text?: string;
  birth_county?: string;
  current_county?: string;
}

const clansList = [
  "All",
  "Bukusu",
  "Maragoli",
  "Samia",
  "Wanga",
  "Tiriki",
  "Idakho",
  "Isukha",
  "Marama",
  "Banyore",
  "Kabras",
  "Batsotso",
  "Tachoni",
  "Kisa",
  "Marachi",
  "Khayo",
  "Nyore",
  "Gisu",
];

export default function DirectorySection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedClan, setSelectedClan] = useState("All");
  const [activeMember, setActiveMember] = useState<Member | null>(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoading(true);
        const res = await fetch("/api/members");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.members)) {
            const mapped: Member[] = data.members.map((m: any) => {
              const initials = (m.full_name || "M")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
              return {
                id: m.id,
                initials,
                name: m.full_name,
                clan: m.sub_clan,
                area: m.residential_zone,
                profession: m.profession || "Community Member",
                field: m.field || "General",
                joined: m.created_at ? new Date(m.created_at).getFullYear().toString() : "2025",
                status: m.status || "Verified",
                phone: m.phone,
                email: m.email,
                bio: m.bio || "Active registered member of the Mulembe18 Nationwide Network.",
                bg: "bg-emerald-100/90 border-[#DDA71D]",
                text: "text-emerald-800",
                birth_county: m.birth_county_name || m.birth_county || m.home_county || "Western Kenya",
                current_county: m.residential_county_name || m.current_county || m.county || m.area || "Mombasa",
              };
            });
            setMembers(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to load members from database", err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  const filtered = members.filter((m) => {
    const matchesClan = selectedClan === "All" || m.clan.toLowerCase() === selectedClan.toLowerCase();
    const matchesSearch = [m.name, m.clan, m.area, m.profession, m.field].some((v) =>
      v?.toLowerCase().includes(query.toLowerCase())
    );
    return matchesClan && matchesSearch;
  });

  return (
    <section id="directory" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#111827] relative overflow-hidden" aria-labelledby="directory-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Agnos Style) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-4">
            <span>&gt;</span>
            <span className="font-bold text-[#374151]">VERIFIED MEMBER DIRECTORY</span>
            <span>&lt;</span>
          </div>

          <h2
            id="directory-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-[1.2]"
          >
            Search members across{" "}
            <span className="text-[#FF5500]">47 counties</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Verified Luhya members across Kenya and the diaspora — searchable by clan, homeland county,
            professional trade, and current residence.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-white border border-[#EAE7DF] text-[#111827] text-xs font-bold shadow-2xs">
              {loading ? "Checking database..." : `${members.length} Registered &amp; Verified Members`}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl mb-10 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="relative lg:col-span-5">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, profession, clan, or area..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F6] border border-[#EAE7DF] rounded-full text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#FF5500] transition"
              />
            </div>

            {/* Clan quick tabs */}
            <div className="lg:col-span-7 flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {clansList.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedClan(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedClan === c
                      ? "bg-[#111827] text-white shadow-sm"
                      : "bg-[#FAF9F6] text-gray-700 border border-[#EAE7DF] hover:border-gray-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-3xl border border-[#EAE7DF] bg-white animate-pulse space-y-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Members Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <div
                key={m.id || m.name}
                className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#FF5500]/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#111827] text-white flex items-center justify-center text-sm font-black shadow-xs">
                      {m.initials}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200 inline-flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>{m.status}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-[#111827] text-base mt-4">
                    {m.name}
                  </h3>

                  <div className="text-xs font-medium text-gray-600 flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="font-bold text-[#111827]">Clan: {m.clan}</span>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center gap-1 text-gray-700 bg-[#FAF9F6] border border-[#EAE7DF] px-2 py-0.5 rounded-full">
                      <MapPin size={11} className="text-[#FF5500]" />
                      <span>{m.current_county || m.area}</span>
                    </span>
                    {m.birth_county && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="inline-flex items-center gap-1 text-gray-600 bg-[#FAF9F6] border border-[#EAE7DF] px-2 py-0.5 rounded-full text-[10px]">
                          <Home size={10} className="text-[#FF5500]" />
                          <span>From: {m.birth_county}</span>
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-600 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#FAF9F6] border border-[#EAE7DF] rounded-md px-2 py-0.5 text-[#111827] font-semibold text-[11px]">
                      {m.field}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium text-gray-600">{m.profession}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE7DF] flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Joined {m.joined}</span>
                  <button
                    onClick={() => setActiveMember(m)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#111827] hover:text-[#FF5500] transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5500] flex items-center justify-center mx-auto mb-3">
                  <Users size={24} />
                </div>
                <p className="text-base font-bold text-[#111827]">
                  {query || selectedClan !== "All"
                    ? "No members match this specific filter"
                    : "No registered members listed yet"}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  {query || selectedClan !== "All"
                    ? "Try resetting your search filters or selecting another clan category."
                    : "New registrations from the member portal appear automatically once authenticated."}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  {(query || selectedClan !== "All") && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setSelectedClan("All");
                      }}
                      className="px-4 py-2 rounded-full bg-white border border-[#EAE7DF] text-gray-800 text-xs font-bold hover:border-gray-400 transition-colors"
                    >
                      Reset Filters
                    </button>
                  )}
                  <Link
                    href="/dashboard"
                    className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    <UserPlus size={14} />
                    <span>Open Member Portal</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Support Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold flex-shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#111827]">Mulembe Unity — Sub-Community Coordinator</p>
              <p className="text-xs text-gray-600 mt-0.5">Need to update your clan directory record or verify your membership status?</p>
            </div>
          </div>
          <a
            href="/#contact"
            className="px-6 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
          >
            Contact Secretariat
          </a>
        </div>
      </div>

      {/* Member Profile Modal */}
      {activeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EAE7DF] relative space-y-4">
            <button
              onClick={() => setActiveMember(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#111827] text-white flex items-center justify-center text-base font-black shadow-sm">
                {activeMember.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#111827]">
                    {activeMember.name}
                  </h3>
                  <ShieldCheck size={16} className="text-[#FF5500]" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Sub-tribe: <strong className="text-[#111827]">{activeMember.clan}</strong> • {activeMember.area}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] text-xs text-gray-700 leading-relaxed">
              {activeMember.bio}
            </div>

            <div className="space-y-2.5 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-[#FF5500]" />
                <span>Current County: <strong>{activeMember.current_county || activeMember.area}</strong></span>
              </p>
              {activeMember.birth_county && (
                <p className="flex items-center gap-2">
                  <Home size={14} className="text-[#FF5500]" />
                  <span>Birth / Home County: <strong>{activeMember.birth_county}</strong></span>
                </p>
              )}
              {activeMember.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-[#FF5500]" />
                  <span>Contact: <strong>{activeMember.phone}</strong></span>
                </p>
              )}
              {activeMember.email && (
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-[#FF5500]" />
                  <span>Email: <strong>{activeMember.email}</strong></span>
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveMember(null)}
                className="w-full py-3 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-sm transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
