"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  ShieldCheck,
  HeartHandshake,
  Bot,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    chapter: "Mombasa Chapter",
    subject: "General Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        chapter: "Mombasa Chapter",
        subject: "General Inquiry",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#121714]">
      <Header />

      <main className="flex-1">
        {/* Agnos Subpage Header */}
        <div className="border-b border-[#EAE7DF] bg-white py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#111827] mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E4DA] text-[#6B7280] text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
                  <span>&gt;</span>
                  <span className="font-bold text-[#111827]">SECRETARIAT &amp; ELDERS LIAISON</span>
                  <span>&lt;</span>
                </div>
                <h1
                  className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight"
                  style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
                >
                  Contact &amp; Chapter Desks <span className="text-[#FF5500]">• Wasiliana Nasi</span>
                </h1>
                <p className="text-sm text-[#4B5563] mt-1.5 max-w-2xl leading-relaxed">
                  Reach the Mulembe18 Secretariat, chapter leadership, welfare coordinators, or initiate an urgent distress dispatch.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:+254712345678"
                  className="px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs shadow-[0_4px_14px_rgba(255,85,0,0.3)] transition-all flex items-center gap-2"
                >
                  <Phone size={13} />
                  <span>Call Hotline: +254 712 345 678</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Content Grid */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Contact Info & Offices (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E4DA] shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111827]">National Secretariat Offices</h3>
                    <p className="text-[11px] text-gray-500">Mombasa Pilot &amp; Nairobi Liaison</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#FF5500] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 font-bold">Mombasa Founding Office</strong>
                      <span>Nyali Links Plaza, 2nd Floor, Links Road, Mombasa</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#0D6E38] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 font-bold">Nairobi Liaison Desk</strong>
                      <span>UoN Towers / CBD Hub, University Way, Nairobi</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[#0D6E38] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 font-bold">Official Inquiries &amp; Secretariat</strong>
                      <a href="tel:+254712345678" className="text-[#0D6E38] font-mono hover:underline">
                        +254 712 345 678
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#0077B6] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 font-bold">Electronic Communiqués</strong>
                      <a href="mailto:info@mulembe18.org" className="text-[#0077B6] font-mono hover:underline">
                        secretariat@mulembe18.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 font-bold">Desk Operating Hours</strong>
                      <span>Monday – Friday: 8:30 AM – 5:00 PM</span>
                      <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                        *Emergency Bereavement Dispatch: 24/7 Hotline
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Msingi AI Assistance Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#082f1a] to-[#0D6E38] text-white space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot size={18} className="text-[#DDA71D]" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#DDA71D]">Msingi AI Assistant</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">Instant 24/7</span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Need quick answers regarding clan affiliation, welfare requirements, or constitution rules? Msingi AI answers in both English and Kiswahili.
                </p>
                <Link
                  href="/ai"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#082f1a] font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
                >
                  <span>Chat with Msingi AI</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right: Message / Dispatch Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DA] shadow-xs">
              <h3 className="text-lg font-bold text-[#111827] mb-1">
                Send an Inquiry or Communiqué
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Your transmission will be routed directly to the Secretariat or the respective Chapter Executive.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-[#0D6E38]">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="font-bold text-base text-[#111827]">
                    Message Transmitted Successfully!
                  </h4>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A Secretariat officer or chapter elder will follow up with you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Johnstone Khaemba"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">M-Pesa / Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. 0712 345 678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. jkhaemba@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Target Chapter</label>
                      <select
                        value={form.chapter}
                        onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                      >
                        <option value="National Secretariat">National Secretariat (Nationwide)</option>
                        <option value="Mombasa Chapter">Mombasa Chapter (001 - Coast)</option>
                        <option value="Nairobi Chapter">Nairobi Metropolitan (047)</option>
                        <option value="Kakamega Chapter">Kakamega Home Chapter (037)</option>
                        <option value="Bungoma Chapter">Bungoma Chapter (039)</option>
                        <option value="Vihiga Chapter">Vihiga Chapter (038)</option>
                        <option value="Busia Chapter">Busia Border Chapter (040)</option>
                        <option value="Nakuru Chapter">Nakuru Rift Valley (032)</option>
                        <option value="Kisumu Chapter">Kisumu Lake (042)</option>
                        <option value="Diaspora Desk">Global Diaspora Liaison (999)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry Category</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    >
                      <option value="General Inquiry">General Community Inquiry</option>
                      <option value="Emergency Welfare">Emergency Bereavement Repatriation Transit</option>
                      <option value="Medical Distress">Emergency Medical Relief Copay</option>
                      <option value="Chapter Transfer">Chapter Relocation &amp; Transfer</option>
                      <option value="Elections & Constitution">Biennial Elections &amp; Constitution</option>
                      <option value="Noticeboard Listing">Noticeboard Listing Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Message / Dispatch Details</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please write your message, dispatch inquiry, or case details here..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(255,85,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={15} />
                    <span>{submitting ? "Transmitting..." : "Send Dispatch"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

