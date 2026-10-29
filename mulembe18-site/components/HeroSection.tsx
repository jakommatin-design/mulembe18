"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, MapPin, Users, HeartHandshake, PhoneCall, Coins, Music, Globe } from "lucide-react";
import Marquee from "@/components/magicui/marquee";

const clans = [
  { name: "Bukusu", region: "Bungoma County" },
  { name: "Maragoli (AvaLogoli)", region: "Vihiga County" },
  { name: "Samia", region: "Busia County" },
  { name: "Wanga", region: "Mumias / Kakamega" },
  { name: "Tiriki", region: "Hamisi / Vihiga" },
  { name: "Idakho", region: "Ikolomani / Kakamega" },
  { name: "Isukha", region: "Shinyalu / Kakamega" },
  { name: "Marama", region: "Butere / Kakamega" },
  { name: "Banyore (Abanyole)", region: "Emuhaya / Vihiga" },
  { name: "Kabras", region: "Malava / Kakamega" },
  { name: "Batsotso", region: "Lurambi / Kakamega" },
  { name: "Tachoni", region: "Webuye / Bungoma" },
  { name: "Kisa", region: "Khwisero / Kakamega" },
  { name: "Marachi", region: "Butula / Busia" },
  { name: "Khayo", region: "Nambale / Busia" },
  { name: "Abanyala", region: "Budalangi / Busia" },
  { name: "Nyore", region: "Luanda / Vihiga" },
  { name: "Batura", region: "Western Diaspora" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative bg-[#FAF9F6] text-[#121714] overflow-hidden pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 border-b border-[#EAE7DF]"
    >
      {/* ==============================================================
          CONCENTRIC CIRCULAR SVG ORBITS & CONNECTING LINES (AGNOS STYLE)
          ============================================================== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-60">
        <svg
          className="w-[1200px] h-[1200px] text-[#E4DFD5]"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle concentric circles */}
          <circle cx="500" cy="500" r="220" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="500" cy="500" r="360" stroke="currentColor" strokeWidth="1" />
          <circle cx="500" cy="500" r="490" stroke="currentColor" strokeWidth="1" />

          {/* Curved connecting line to top-left floating card */}
          <path d="M 500 280 C 400 280 290 220 250 160" stroke="currentColor" strokeWidth="1.2" />

          {/* Curved connecting line to top-right floating card */}
          <path d="M 500 280 C 600 280 710 220 750 160" stroke="currentColor" strokeWidth="1.2" />

          {/* Curved connecting line to bottom-left floating card */}
          <path d="M 500 640 C 420 640 310 700 260 760" stroke="currentColor" strokeWidth="1.2" />

          {/* Curved connecting line to bottom-right floating card */}
          <path d="M 500 640 C 580 640 690 700 740 760" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      {/* ==============================================================
          FLOATING CULTURAL & COMMUNITY TILES (AGNOS HERO CARDS)
          ============================================================== */}
      {/* Top Left Floating Tile: Traditional Heritage & Shield */}
      <div className="hidden lg:flex absolute top-16 left-[12%] z-10 items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E4DA] rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D6E38] flex items-center justify-center shadow-2xs">
          <ShieldCheck size={20} />
        </div>
      </div>

      {/* Top Right Floating Tile: M-Pesa KES 200 Solidarity */}
      <div className="hidden lg:flex absolute top-16 right-[12%] z-10 items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E4DA] rotate-[8deg] hover:rotate-0 transition-transform duration-300">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center shadow-2xs">
          <Coins size={20} />
        </div>
      </div>

      {/* Bottom Left Floating Tile: Isukuti Cultural Music */}
      <div className="hidden lg:flex absolute bottom-24 left-[14%] z-10 items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E4DA] rotate-[10deg] hover:rotate-0 transition-transform duration-300">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#DDA71D] flex items-center justify-center shadow-2xs">
          <Music size={20} />
        </div>
      </div>

      {/* Bottom Right Floating Tile: 18 Clans Community Card */}
      <div className="hidden lg:flex absolute bottom-24 right-[14%] z-10 items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E4DA] rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center shadow-2xs">
          <Users size={20} />
        </div>
      </div>

      {/* ==============================================================
          MAIN HERO CONTENT (AGNOS ULTRA-CLEAN TYPOGRAPHY)
          ============================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 text-center">
        
        {/* Category Pill Badge (Agnos Style: > CATEGORY <) */}
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-6 sm:mb-8">
          <span>&gt;</span>
          <span className="font-bold text-[#374151]">MULEMBE18 PLATFORM</span>
          <span>&lt;</span>
        </div>

        {/* Grand Headline: High impact with vibrant accent word */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-[#111827] tracking-tight leading-[1.08] max-w-4xl mx-auto"
          style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
        >
          <span>We unite 18 roots that move </span>
          <span className="text-[#FF5500] inline-block font-black">
            people
          </span>
        </h1>

        {/* Subtitle Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-[#4B5563] max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed font-normal">
          We combine cultural heritage, transparent mutual welfare, and modern technology to help
          the 18 Luhya sub-communities stand out &amp; create meaningful solidarity across Kenya and nationwide.
        </p>

        {/* Dual CTA Buttons & Hand-drawn Script Accent */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          
          {/* Hand-drawn whimsical annotation pointing to Primary CTA (Agnos Style) */}
          <div className="hidden sm:flex absolute -left-4 md:left-6 lg:left-14 -bottom-10 items-center gap-1 select-none pointer-events-none">
            <span
              className="text-sm font-bold text-[#FF5500] -rotate-6"
              style={{ fontFamily: "var(--font-caveat), var(--font-kalam), cursive" }}
            >
              Jiunge na wanachama 1,420+ sasa
            </span>
            <svg
              className="w-10 h-8 text-[#FF5500] transform rotate-12 -mt-2"
              viewBox="0 0 40 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 22 Q 22 24 28 8 M 28 8 L 22 10 M 28 8 L 29 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Primary CTA (Vibrant Terracotta Orange - Agnos Pill) */}
          <a
            href="#register"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm sm:text-base shadow-[0_4px_14px_rgba(255,85,0,0.35)] hover:shadow-[0_6px_20px_rgba(255,85,0,0.45)] transition-all transform hover:-translate-y-0.5"
          >
            Join our community
          </a>

          {/* Secondary CTA (Deep Black - Agnos Pill) */}
          <Link
            href="/directory"
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
          >
            Member directory
          </Link>
        </div>

        {/* Marquee Banner of all 18 Sub-Communities */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#EAE7DF]">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#9CA3AF]">
              TRUSTED BY 18 LUHYA SUB-COMMUNITIES • COAST &amp; NATIONWIDE
            </span>
          </div>

          <Marquee pauseOnHover className="[--duration:36s] py-1.5">
            {clans.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E4DA] text-xs font-bold text-[#374151] hover:border-[#FF5500] hover:text-[#FF5500] transition-colors cursor-default whitespace-nowrap shadow-2xs mx-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                <span>{c.name}</span>
                <span className="text-[10px] text-[#9CA3AF] font-normal">({c.region})</span>
              </div>
            ))}
          </Marquee>
        </div>

      </div>
    </section>
  );
}
