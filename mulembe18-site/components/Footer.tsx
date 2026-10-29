"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

const quickLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About Mulembe18" },
  { href: "/chapters", label: "County Chapters" },
  { href: "/directory", label: "Member Directory" },
  { href: "/#events", label: "Events & Calendar" },
  { href: "/#contributions", label: "Welfare & Dues" },
  { href: "/noticeboard", label: "Community Noticeboard" },
  { href: "/ai", label: "Msingi AI Studio" },
  { href: "/privacy", label: "Privacy Policy (ODPC)" },
];

const subCommunities = [
  "Bukusu", "Maragoli", "Samia", "Wanga", "Tiriki", "Idakho",
  "Isukha", "Marama", "Banyore", "Kabras", "Batsotso", "Tachoni",
  "Kisa", "Marachi", "Khayo", "Nyore", "Abanyala", "Batura",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer id="contact" className="bg-[#111827] text-white pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-gray-800" aria-label="Site Footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">

        {/* Newsletter & Vision Top Row (Agnos Style) */}
        <div className="pb-12 border-b border-gray-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-[#FF5500] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span>&gt;</span>
              <span>STAY INFORMED</span>
              <span>&lt;</span>
            </div>
            <h3
              className="text-2xl sm:text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
            >
              Official SMS &amp; Email Circulars
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed">
              Receive verified baraza notices, event alerts, emergency welfare updates, and newcomer bulletins.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            {subscribed ? (
              <div className="px-5 py-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-3 text-xs rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5500] w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Body: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-gray-700 flex items-center justify-center p-0.5 overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt="Mulembe18 Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  mulembe
                </span>
                <span className="text-xl font-black text-[#FF5500]" style={{ fontFamily: "var(--font-outfit)" }}>
                  18
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Mulembe18 unites Luhya community members across Kenya—connecting residents from Mombasa, Nairobi, and nationwide back to our Western ancestral roots through cultural preservation, transparent welfare, and mutual solidarity.
            </p>

            <div className="pt-2 text-[11px] text-gray-400 space-y-1 font-mono">
              <p>• Flagship: Mombasa County (001)</p>
              <p>• Compliance: Kenya Data Protection Act 2019</p>
              <p>• Governance: 100% Dual Sign-Off Approvals</p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 18 Sub-Communities Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
              18 Sub-Communities
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-400">
              {subCommunities.map((s) => (
                <span key={s} className="hover:text-white transition-colors cursor-default">
                  • {s}
                </span>
              ))}
            </div>
          </div>

          {/* Secretariat Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
              Secretariat Desk
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <p className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#FF5500] mt-0.5 shrink-0" />
                <span>Mulembe Centre, Links Road, Nyali, Mombasa County</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#FF5500] shrink-0" />
                <span>+254 712 345 678 / +254 733 123 456</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#FF5500] shrink-0" />
                <span>secretariat@mulembe18.org</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock size={14} className="text-[#FF5500] shrink-0" />
                <span>Mon – Fri: 8:30 AM – 5:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Legal Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Mulembe18 National Community Platform. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#0D6E38]" />
              <span>ODPC Compliance</span>
            </Link>
            <Link href="/chapters" className="hover:text-white transition-colors">
              Chapter Network
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Constitution By-Laws
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
