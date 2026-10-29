"use client";
import { useState } from "react";
import { Phone, MessageCircle, HelpCircle, X, Smartphone, ArrowRight, Bot } from "lucide-react";

export default function ElderHelpFloatingBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start">
      {/* Help Popup Modal */}
      {open && (
        <div className="mb-3 w-80 card bg-white rounded-3xl p-5 shadow-2xl border border-[#E6E0D5] animate-fade-in text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <strong className="text-sm font-bold text-[#18221B]">Msaada • Community Helpline</strong>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              aria-label="Funga"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-gray-600 text-xs leading-relaxed">
            Je, unahitaji usaidizi wa kusajiliwa, kuelewa mfuko wa ustawi, au unatumia simu ya kawaida (Mulika Mwizi)?
          </p>

          <div className="space-y-2">
            {/* 1. Launch Msingi AI */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open-msingi-ai"));
                }
              }}
              className="w-full p-2.5 rounded-2xl bg-[#DDA71D] hover:bg-[#F5C842] text-[#082f1a] font-extrabold flex items-center justify-between shadow-xs transition-all"
            >
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <div className="text-left">
                  <span className="block text-xs leading-tight">Ongea na Msingi AI</span>
                  <span className="text-[10px] text-gray-500 font-medium">Swahili &amp; Luhya AI Assistant</span>
                </div>
              </div>
              <ArrowRight size={14} />
            </button>

            {/* 2. Direct Phone Call */}
            <a
              href="tel:+254712345678"
              className="w-full p-2.5 rounded-2xl bg-[#0D6E38] hover:bg-[#082f1a] text-white font-extrabold flex items-center justify-between shadow-xs transition-all"
            >
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#F5C842]" />
                <div className="text-left">
                  <span className="block text-xs leading-tight">Piga Simu ya Ofisi</span>
                  <span className="text-[10px] text-emerald-200 font-mono">0712 345 678 (Nyali Desk)</span>
                </div>
              </div>
              <ArrowRight size={14} />
            </a>

            {/* 3. WhatsApp Chat */}
            <a
              href="https://wa.me/254712345678?text=Habari%20Mulembe18,%20nahitaji%20usaidizi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-2.5 rounded-2xl bg-[#00A859] hover:bg-[#008f4c] text-white font-extrabold flex items-center justify-between shadow-xs transition-all"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={15} />
                <div className="text-left">
                  <span className="block text-xs leading-tight">Tuma WhatsApp</span>
                  <span className="text-[10px] text-emerald-100 font-medium">Jibu la haraka ndani ya dakika 5</span>
                </div>
              </div>
              <ArrowRight size={14} />
            </a>

            {/* 4. Offline USSD */}
            <div className="p-2.5 rounded-2xl bg-[#FBF8F2] border border-[#E6E0D5] text-gray-800">
              <div className="flex items-center gap-2 font-bold mb-0.5 text-xs">
                <Smartphone size={13} className="text-[#0D6E38]" />
                <span>Simu ya Kawaida (Bila Data):</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-snug">
                Piga <strong className="text-[#0D6E38] font-mono text-xs">*384*18#</strong> (bure) kupokea taarifa za jamii kupitia SMS.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Pill */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#0D6E38] hover:bg-[#082f1a] text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-white/60 hover:scale-105 transition-all"
        aria-label="Pata Msaada"
      >
        <Phone size={14} className="text-[#DDA71D]" />
        <span className="hidden sm:inline">Usaidizi • Helpline</span>
        <span className="sm:hidden">Msaada</span>
      </button>
    </div>
  );
}
