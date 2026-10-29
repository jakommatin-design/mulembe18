"use client";
import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Vote,
  FileCheck,
  Scale,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/image-utils";

export interface Leader {
  id?: number | string;
  name: string;
  role: string;
  clan: string;
  avatar_url?: string;
  scope?: string;
}

export interface ElectionCandidate {
  id: string;
  name: string;
  clan: string;
  position: string;
  chapter: string;
  manifesto: string;
  votes: number;
}

const colorPalettes = [
  "bg-emerald-100/90 border-[#0D6E38] text-emerald-900",
  "bg-amber-100/90 border-[#DDA71D] text-amber-900",
  "bg-teal-100/90 border-teal-600 text-teal-900",
  "bg-emerald-100/90 border-[#0D6E38] text-emerald-900",
  "bg-purple-100/90 border-purple-500 text-purple-900",
  "bg-blue-100/90 border-[#0077B6] text-blue-900",
];

const defaultCouncilLeaders: Leader[] = [
  {
    name: "Elder Johnstone Mukaisi",
    role: "Chapter Chairperson",
    clan: "Bukusu",
    scope: "Mombasa Chapter",
  },
  {
    name: "Dr. Beatrice Khabuchi",
    role: "Vice Chairperson & Welfare",
    clan: "Isukha",
    scope: "Mombasa Chapter",
  },
  {
    name: "Grace Kavehere",
    role: "Chapter Treasurer",
    clan: "Maragoli",
    scope: "Mombasa Chapter",
  },
  {
    name: "Wycliffe Barasa",
    role: "Organizing Secretary",
    clan: "Wanga",
    scope: "Mombasa Chapter",
  },
  {
    name: "Naomi Nekesa",
    role: "Welfare & Bereavement",
    clan: "Samia",
    scope: "Mombasa Chapter",
  },
  {
    name: "Pastor Amos Kavehere",
    role: "Elders Liaison",
    clan: "Banyore",
    scope: "Coast Region",
  },
];

const mockCandidates: ElectionCandidate[] = [
  {
    id: "cand-1",
    name: "Mzee Johnstone Mukaisi",
    clan: "Bukusu",
    position: "Chapter Chairperson",
    chapter: "Mombasa Chapter",
    manifesto: "Fast-track bereavement transit under 18 hours, youth maritime apprenticeships, and 100% public ledgers.",
    votes: 384,
  },
  {
    id: "cand-2",
    name: "Adv. Timothy Walubengo",
    clan: "Maragoli",
    position: "Chapter Chairperson",
    chapter: "Mombasa Chapter",
    manifesto: "Legal aid clinics for small traders and institutional micro-loan revolving chama fund.",
    votes: 312,
  },
  {
    id: "cand-3",
    name: "Eng. Aggrey Masika",
    clan: "Wanga",
    position: "Chapter Chairperson",
    chapter: "Mombasa Chapter",
    manifesto: "Digitalizing clan membership cards, expanding technical scholarships, and coastal sports cup.",
    votes: 245,
  },
];

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<Leader[]>(defaultCouncilLeaders);
  const [loading, setLoading] = useState(false);
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<ElectionCandidate[]>(mockCandidates);

  useEffect(() => {
    fetch("/api/leadership")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leaders) && data.leaders.length > 0) {
          setLeaders(
            data.leaders.map((l: any) => ({
              ...l,
              avatar_url: l.avatar_url ? normalizeImageUrl(l.avatar_url, "") : null,
            }))
          );
        }
      })
      .catch(() => {});

    fetch("/api/elections")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.candidates) && data.candidates.length > 0) {
          setCandidates(data.candidates);
        }
      })
      .catch(() => {});
  }, []);

  const totalVotes = candidates.reduce((acc, c) => acc + (Number(c.votes) || 0), 0);

  const handleCastVote = async (candidateId: string) => {
    if (votedCandidateId) return;
    setVotedCandidateId(candidateId);
    try {
      const res = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json();
      if (data.success) {
        setCandidates((prev) =>
          prev.map((c) => (String(c.id) === String(candidateId) ? { ...c, votes: (Number(c.votes) || 0) + 1 } : c))
        );
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    }
  };

  return (
    <section id="leadership" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#111827] relative overflow-hidden" aria-labelledby="leadership-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">

        {/* Section Header (Agnos Style) */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-4">
            <span>&gt;</span>
            <span className="font-bold text-[#374151]">COUNCIL OF ELDERS &amp; GOVERNANCE</span>
            <span>&lt;</span>
          </div>

          <h2
            id="leadership-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-[1.2]"
          >
            Democratically elected,{" "}
            <span className="text-[#FF5500]">clan-representative</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Dedicated servant leaders steering Mulembe18&apos;s community welfare, cultural preservation, and youth empowerment nationwide.
          </p>
        </div>

        {/* 6-Column Leaders Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {leaders.map((l, idx) => {
            const initials = l.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <div
                key={l.id || l.name}
                className="bg-white p-5 rounded-3xl border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col items-center hover:border-[#FF5500]/40 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {l.avatar_url ? (
                  <img
                    src={l.avatar_url}
                    alt={l.name}
                    className="w-16 h-16 mx-auto rounded-2xl object-cover mb-3 shadow-xs border border-[#EAE7DF] group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111827] text-white flex items-center justify-center font-black text-lg mb-3 shadow-xs group-hover:scale-105 transition-transform duration-300">
                    {initials}
                  </div>
                )}
                <h4 className="font-bold text-sm text-[#111827] group-hover:text-[#FF5500] transition-colors leading-snug">
                  {l.name}
                </h4>
                <p className="text-[11px] font-semibold text-gray-500 mt-1">{l.role}</p>
                <span className="mt-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-gray-700 border border-[#EAE7DF]">
                  {l.clan} Clan
                </span>
              </div>
            );
          })}
        </div>

        {/* Democratic Chapter Elections Module */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE7DF] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">
                &gt; DEMOCRATIC BALLOT &lt;
              </div>
              <h3 className="text-xl font-bold text-[#111827] mt-1">
                Chapter Biennial Leadership Elections
              </h3>
              <p className="text-xs text-gray-500">
                1-Member 1-Vote verified by secret digital ballot. Closing: 15 Nov 2026.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111827] bg-[#FAF9F6] px-4 py-2 rounded-full border border-[#EAE7DF]">
                {totalVotes} Verified Ballots Cast
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidates.map((cand) => {
              const voteShare = totalVotes > 0 ? Math.round((cand.votes / totalVotes) * 100) : 0;
              const hasVotedForThis = votedCandidateId === cand.id;

              return (
                <div
                  key={cand.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    hasVotedForThis
                      ? "border-[#FF5500] bg-orange-50/30 ring-2 ring-[#FF5500]/20"
                      : "border-[#EAE7DF] bg-[#FAF9F6] hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-[#EAE7DF] text-gray-700">
                        {cand.clan} Clan
                      </span>
                      <span className="text-[11px] font-bold text-[#FF5500]">{voteShare}% Share</span>
                    </div>

                    <h4 className="font-bold text-base text-[#111827]">
                      {cand.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-bold block mb-2">{cand.position}</span>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      &quot;{cand.manifesto}&quot;
                    </p>
                  </div>

                  <div>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden mb-3">
                      <div className="h-full bg-[#FF5500] rounded-full transition-all" style={{ width: `${voteShare}%` }} />
                    </div>

                    <button
                      disabled={Boolean(votedCandidateId)}
                      onClick={() => handleCastVote(cand.id)}
                      className={`w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        hasVotedForThis
                          ? "bg-emerald-600 text-white cursor-default"
                          : votedCandidateId
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#111827] hover:bg-black text-white shadow-xs"
                      }`}
                    >
                      {hasVotedForThis ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Ballot Cast</span>
                        </>
                      ) : (
                        <>
                          <Vote size={13} />
                          <span>Cast 1 Vote</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Constitutional Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold">
              <Scale size={20} />
            </div>
            <h4 className="font-bold text-base text-[#111827]">
              Strict Political Neutrality
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Mulembe18 is non-partisan. It does not host political campaigning or partisan rallies, preserving sacred community unity across all clans.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-base text-[#111827]">
              Data Protection Act, 2019
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Registered with the Office of the Data Protection Commissioner (ODPC). Members control directory privacy and every export is audited.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold">
              <FileCheck size={20} />
            </div>
            <h4 className="font-bold text-base text-[#111827]">
              Sub-Community Inclusivity
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Every sub-community is represented fairly in leadership, event scheduling, and welfare decisions with elder arbitration.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
