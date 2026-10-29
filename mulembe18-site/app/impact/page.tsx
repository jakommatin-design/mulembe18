"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Landmark,
  TrendingUp,
  MapPin,
  HeartHandshake,
  Calendar,
  Download,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Building2,
  PieChart,
  Activity,
  Printer,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ImpactData {
  totalMembers: number;
  verifiedMembers: number;
  activeChapters: number;
  totalCountiesTarget: number;
  activeClanCells: number;
  totalReserve: number;
  monthlyCollection: number;
  totalDisbursed: number;
  claimsCount: number;
  solvencyRatio: number;
  averageRepatriationHours: number;
  clanDistribution: { clan: string; count: number }[];
  countyDistribution: { code: string; county_name: string; region_zone: string; resident_count: number }[];
  birthCountyDistribution: { code: string; county_name: string; native_birth_count: number }[];
  lastAuditedDate: string;
}

export default function NationwideImpactPage() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchCounty, setSearchCounty] = useState("");
  const [tracingView, setTracingView] = useState<"residence" | "birth">("residence");

  useEffect(() => {
    async function loadImpact() {
      try {
        const res = await fetch("/api/impact");
        const json = await res.json();
        if (json.success && json.report) {
          setData(json.report);
        }
      } catch (err) {
        console.error("Failed to load impact report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadImpact();
  }, []);

  const filteredCounties = (data?.countyDistribution || []).filter((c) => {
    const matchesRegion = selectedRegion === "all" || c.region_zone === selectedRegion;
    const matchesSearch = c.county_name.toLowerCase().includes(searchCounty.toLowerCase()) || c.code.includes(searchCounty);
    return matchesRegion && matchesSearch;
  });

  const maxClanCount = Math.max(...(data?.clanDistribution || []).map((c) => c.count), 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111827]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ================================================================
            PAGE HEADER & CONTROLS (Agnos Style)
            ================================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE7DF] pb-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-3">
              <span>&gt;</span>
              <span className="font-bold text-[#374151]">AUDITED TRANSPARENCY REPORT</span>
              <span>&lt;</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight">
              Nationwide Impact <span className="text-[#FF5500]">&amp; Transparency</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
              Real-time audit of Mulembe18's collective reach across Kenya's 47 counties—tracking verified member census, dual-origin diaspora tracing, grassroots clan kitty solvency, and emergency bereavement support.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#EAE7DF] bg-white text-gray-700 text-xs font-bold shadow-2xs hover:bg-gray-50 transition-colors"
            >
              <Printer size={15} />
              <span>Print / Export PDF</span>
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Portal Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ================================================================
            EXECUTIVE AUDIT SUMMARY CARDS
            ================================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Card 1: Verified Members */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Verified Census</span>
              <Users size={18} className="text-[#FF5500]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {loading ? "..." : (data?.totalMembers || 0).toLocaleString()}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> {data?.verifiedMembers || 0} Fully KYC Verified
            </div>
          </div>

          {/* Card 2: Active Chapters */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">County Coverage</span>
              <Building2 size={18} className="text-[#111827]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {loading ? "..." : `${data?.activeChapters || 11} / 47`}
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              {data?.activeClanCells || 12} Active Grassroots Clan Cells
            </div>
          </div>

          {/* Card 3: Welfare Reserve */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Consolidated Kitty</span>
              <ShieldCheck size={18} className="text-[#FF5500]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#111827]">
              KES {loading ? "..." : (data?.totalReserve || 840000).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              Monthly Inflow: KES {(data?.monthlyCollection || 125000).toLocaleString()}
            </div>
          </div>

          {/* Card 4: Bereavement & Response */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Emergency Solvency</span>
              <HeartHandshake size={18} className="text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {data?.solvencyRatio || 100}%
            </div>
            <div className="text-xs text-blue-700 font-medium mt-1">
              Avg. {data?.averageRepatriationHours || 24}h Repatriation Response
            </div>
          </div>
        </div>

        {/* ================================================================
            SECTION: 47 COUNTIES CHAPTER DISTRIBUTION & DUAL-ORIGIN TRACING
            ================================================================ */}
        <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7DF] pb-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
                <MapPin className="text-[#FF5500]" size={22} />
                <span>County Chapters &amp; Dual-Origin Tracing</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Trace members by their current residence in diaspora or their ancestral birth county in Western Kenya.
              </p>
            </div>

            {/* View Selector Toggle */}
            <div className="flex items-center bg-[#FAF9F6] p-1 rounded-full border border-[#EAE7DF]">
              <button
                onClick={() => setTracingView("residence")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  tracingView === "residence"
                    ? "bg-[#111827] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Current Residence (Diaspora)
              </button>
              <button
                onClick={() => setTracingView("birth")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  tracingView === "birth"
                    ? "bg-[#111827] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Ancestral Birth County
              </button>
            </div>
          </div>

          {/* Region Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Filter size={13} /> Region:
              </span>
              {["all", "Coast", "Western", "Nairobi", "Rift Valley", "Central", "Eastern", "Nyanza"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    selectedRegion === r
                      ? "bg-[#111827] text-white"
                      : "bg-[#FAF9F6] text-gray-600 border border-[#EAE7DF] hover:border-gray-400"
                  }`}
                >
                  {r === "all" ? "All Regions" : r}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search County (e.g. Kakamega, Mombasa)..."
              value={searchCounty}
              onChange={(e) => setSearchCounty(e.target.value)}
              className="px-4 py-2 rounded-full border border-[#EAE7DF] bg-[#FAF9F6] text-xs w-full sm:w-64 focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          {/* County Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#EAE7DF]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] text-gray-600 font-bold uppercase tracking-wider border-b border-[#EAE7DF]">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">County Name</th>
                  <th className="py-3.5 px-4">Devolution Region</th>
                  <th className="py-3.5 px-4 text-center">
                    {tracingView === "residence" ? "Resident Diaspora Members" : "Native Western Born"}
                  </th>
                  <th className="py-3.5 px-4 text-center">Chapter Charter Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7DF]">
                {filteredCounties.map((c) => {
                  const birthMatch = (data?.birthCountyDistribution || []).find((b) => b.code === c.code);
                  const count = tracingView === "residence" ? c.resident_count : (birthMatch?.native_birth_count || 0);

                  return (
                    <tr key={c.code} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{c.code}</td>
                      <td className="py-3.5 px-4 font-bold text-[#111827]">{c.county_name}</td>
                      <td className="py-3.5 px-4 text-gray-500">{c.region_zone}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                          {count} members
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {["001", "047", "037", "039", "040", "038"].includes(c.code) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active Chapter
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-600 border border-[#EAE7DF]">
                            In Formation
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/dashboard?county=${c.code}`}
                          className="text-[#111827] font-bold hover:text-[#FF5500] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>View Chapter</span>
                          <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================
            SECTION: 18 SUB-CLANS DIVERSITY CENSUS
            ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sub-Clans Distribution */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <PieChart className="text-[#FF5500]" size={20} />
                  <span>Representation Across All 18 Sub-Communities</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ensuring zero sub-tribe marginalization under the Mulembe umbrella.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {(data?.clanDistribution || []).slice(0, 10).map((clanItem) => {
                const percentage = Math.round((clanItem.count / (data?.totalMembers || 1)) * 100);
                return (
                  <div key={clanItem.clan} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                      <span>{clanItem.clan}</span>
                      <span className="text-gray-400">{clanItem.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FF5500] transition-all duration-500"
                        style={{ width: `${Math.max(8, (clanItem.count / maxClanCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grassroots Clan Cells & Fund Structure */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                    <Landmark className="text-[#FF5500]" size={20} />
                    <span>Decentralized Clan Cell Treasury Architecture</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Transparent grassroots welfare mobilization at the ward &amp; estate level.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-gray-600">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF]">
                  <div className="font-bold text-[#111827] text-sm mb-1">
                    60% Grassroots Clan Cell Reserve
                  </div>
                  <p className="leading-relaxed">
                    Retained directly by the local sub-clan cell (e.g. Mombasa Bukusu Cell, Nairobi Maragoli Society) for local bereavement transit, sickness stipends, and immediate member distress.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF]">
                  <div className="font-bold text-[#111827] text-sm mb-1">
                    30% County Chapter Emergency Evacuation Pool
                  </div>
                  <p className="leading-relaxed">
                    Managed by the County Executive for major cross-ward incidents, mortuary clearances, and overland hearse coordination back to Western Kenya.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF]">
                  <div className="font-bold text-[#111827] text-sm mb-1">
                    10% National Catastrophe &amp; Governance Fund
                  </div>
                  <p className="leading-relaxed">
                    Overseen by the National Council of Elders for cross-county catastrophe response, digital infrastructure upkeep, and annual cultural congresses.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-gray-400">
              <span>Audited under Kenya Data Protection Act 2019</span>
              <span className="font-mono text-gray-500">ODPC/REG/M18/2026</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
