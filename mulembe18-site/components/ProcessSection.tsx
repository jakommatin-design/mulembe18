"use client";
import React, { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    num: "01",
    tag: "REGISTRATION",
    title: "Strategy & Clan Identity",
    desc: "Select your ancestral clan from the 18 sub-communities, link your county chapter in Mombasa or across Kenya, and obtain a secure digital membership card with QR verification.",
    tags: ["18 SUB-COMMUNITIES", "DIGITAL MEMBER ID", "CHAPTER TRANSFERS", "ODPC COMPLIANT"],
  },
  {
    num: "02",
    tag: "SOLIDARITY",
    title: "Welfare & Dual Sign-Off",
    desc: "Contribute flat monthly dues of KES 200 via direct M-Pesa STK push. Every single disbursement requires simultaneous digital approval from two officials before any shilling is released.",
    tags: ["KES 200/MO DUES", "DUAL SIGN-OFF", "PUBLIC LEDGER", "EMERGENCY FUND"],
  },
  {
    num: "03",
    tag: "COMMUNITY",
    title: "Empowerment & Cultural Festivals",
    desc: "Access vetted affordable rental housing in Bamburi/Nyali, post jobs and commercial notices, participate in youth mentorship, and celebrate our heritage at annual Isukuti festivals.",
    tags: ["HOUSING ASSIST", "NOTICEBOARD", "ISUKUTI DANCE", "BURSARY AWARDS"],
  },
];

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-[#FAF9F6] py-16 sm:py-24 border-b border-[#EAE7DF] text-[#121714] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Category Badge: > PROCESS < (Agnos Style) */}
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-5">
          <span>&gt;</span>
          <span className="font-bold text-[#374151]">PROCESS</span>
          <span>&lt;</span>
        </div>

        {/* Headline */}
        <h2
          className="text-3xl sm:text-5xl md:text-[56px] font-black text-[#111827] tracking-tight leading-[1.12]"
          style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
        >
          A collaborative, transparent approach
        </h2>

        {/* ==============================================================
            GIANT CURVED DOME ARCH (IMAGE 4 EXACT LAYOUT)
            ============================================================== */}
        <div className="mt-14 sm:mt-20 relative min-h-[380px] sm:min-h-[440px] flex flex-col items-center">
          
          {/* SVG Dome Arch Line */}
          <div className="absolute top-10 inset-x-0 w-full flex justify-center pointer-events-none select-none">
            <svg
              className="w-full max-w-4xl h-44 sm:h-52 text-[#E4DFD5]"
              viewBox="0 0 800 200"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 50 190 Q 400 10 750 190"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 50 190 Q 400 10 750 190"
                stroke="#EAE7DF"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Step Selectors along the dome top */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Step Label & Number Badge */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-2">
                STEP
              </span>

              {/* Step Navigation Pill Badges (01, 02, 03) */}
              <div className="flex items-center gap-3">
                {steps.map((st, i) => (
                  <button
                    key={st.num}
                    onClick={() => setActiveStep(i)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all transform ${
                      activeStep === i
                        ? "bg-[#FF5500] text-white shadow-[0_4px_16px_rgba(255,85,0,0.40)] scale-110"
                        : "bg-white text-[#4B5563] border border-[#E8E4DA] hover:border-[#FF5500] hover:text-[#FF5500]"
                    }`}
                  >
                    {st.num}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Content Card Under the Peak */}
            <div className="mt-8 sm:mt-12 max-w-2xl bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E4DA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center transition-all animate-fade-in">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FF5500] font-black">
                {steps[activeStep].tag}
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-2 mb-3">
                {steps[activeStep].title}
              </h3>

              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                {steps[activeStep].desc}
              </p>

              {/* Tag Marquee List under step description */}
              <div className="mt-8 pt-6 border-t border-[#F3F1EC] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-mono font-bold tracking-[0.15em] text-[#9CA3AF]">
                {steps[activeStep].tags.map((t, idx) => (
                  <React.Fragment key={t}>
                    <span>{t}</span>
                    {idx < steps[activeStep].tags.length - 1 && <span>•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

