"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";

export default function ComparisonSection() {
  const [isSwitched, setIsSwitched] = useState(false);

  return (
    <section className="bg-[#FAF9F6] py-16 sm:py-24 border-b border-[#EAE7DF] text-[#121714]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* ==============================================================
            HEADLINE WITH INLINE TOGGLE SWITCH (AGNOS EXACT STYLE)
            ============================================================== */}
        <div className="text-left max-w-3xl mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-5xl md:text-[54px] font-black text-[#111827] tracking-tight leading-[1.12]"
            style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
          >
            We know choosing the right community is hard because few{" "}
            <span className="text-[#FF5500]">truly deliver</span>.
          </h2>

          <div
            className="text-2xl sm:text-4xl md:text-[44px] font-black text-[#111827] tracking-tight leading-[1.18] mt-6 flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
          >
            <span>So we made it simple</span>
            <span className="text-[#FF5500]">to compare</span>
            <span>how we work</span>
            
            {/* Inline Interactive Toggle Switch Button (Agnos Style) */}
            <button
              type="button"
              onClick={() => setIsSwitched(!isSwitched)}
              className="inline-flex items-center w-14 h-8 rounded-full bg-[#FF5500] p-1 transition-colors cursor-pointer shadow-inner shrink-0"
              aria-label="Toggle comparison view"
            >
              <span
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  isSwitched ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span>versus what you usually get</span>
            <span className="text-[#FF5500]">in traditional groups</span>.
          </div>
        </div>

        {/* ==============================================================
            COMPARISON BENTO CARDS (AGNOS EXACT TABLE LAYOUT)
            ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.04)] bg-white">
          
          {/* Left Column: Traditional groups */}
          <div className="p-6 sm:p-10 bg-white border-b md:border-b-0 md:border-r border-[#EAE7DF] flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111827] mb-6">
                Other welfare groups
              </h3>

              <ul className="space-y-4 text-sm sm:text-base text-[#4B5563]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#9CA3AF] font-bold shrink-0">&gt;</span>
                  <span>Slow, unclear paper records &amp; timelines</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#9CA3AF] font-bold shrink-0">&gt;</span>
                  <span>Extra hidden levies for emergency claims</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#9CA3AF] font-bold shrink-0">&gt;</span>
                  <span>Complex, hard-to-reach leadership hierarchy</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#9CA3AF] font-bold shrink-0">&gt;</span>
                  <span>3-week delays in bereavement repatriation vehicle logistics</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#9CA3AF] font-bold shrink-0">&gt;</span>
                  <span>Zero real-time digital transparency or public audit logs</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F3F1EC] text-xs text-[#9CA3AF]">
              Traditional baraza model with manual cash registers
            </div>
          </div>

          {/* Right Column: Mulembe18 Platform (Highlighted in warm Agnos Terracotta / Gold) */}
          <div className="p-6 sm:p-10 bg-[#FF5500] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Mulembe18 platform
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                  Verified Standard
                </span>
              </div>

              <ul className="space-y-4 text-sm sm:text-base text-white/95 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white shrink-0">&gt;</span>
                  <span>Clear weekly updates &amp; automated SMS notifications</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white shrink-0">&gt;</span>
                  <span>Transparent pricing: KES 200/mo flat with M-Pesa STK push</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white shrink-0">&gt;</span>
                  <span>100% Dual Sign-Off approvals on every welfare disbursement</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white shrink-0">&gt;</span>
                  <span>24-hr emergency bereavement vehicle logistics to Western homes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white shrink-0">&gt;</span>
                  <span>ODPC Kenya Data Protection Act 2019 compliant with digital IDs</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-xs text-white/80 relative z-10 flex items-center justify-between">
              <span>Dual-approval cryptographic cloud ledgers</span>
              <ShieldCheck size={16} />
            </div>
          </div>

        </div>

        {/* ==============================================================
            BOTTOM SOCIAL PROOF & ACTION BAR (IMAGE 3 EXACT LAYOUT)
            ============================================================== */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
          
          {/* Primary CTA Button: "Read our story" */}
          <Link
            href="/about"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,85,0,0.30)] hover:shadow-[0_6px_20px_rgba(255,85,0,0.40)] transition-all transform hover:-translate-y-0.5 text-center"
          >
            Read our story
          </Link>

          {/* Avatar Stack + Rating */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3.5">
            {/* Avatar Stack */}
            <div className="flex items-center -space-x-2 overflow-hidden">
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#0D6E38] text-white flex items-center justify-center font-bold text-xs">
                OW
              </div>
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#DDA71D] text-[#111827] flex items-center justify-center font-bold text-xs">
                MK
              </div>
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#111827] text-white flex items-center justify-center font-bold text-xs">
                JN
              </div>
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#F3F4F6] text-[#374151] font-bold text-xs flex items-center justify-center">
                +1.4k
              </div>
            </div>

            {/* Stars & Trust text */}
            <div className="text-left">
              <div className="flex items-center gap-1 text-[#FF5500]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
                <span className="font-black text-sm text-[#111827] ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                Trusted by <strong className="text-[#111827]">1,420+</strong> community members across 47 counties
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

