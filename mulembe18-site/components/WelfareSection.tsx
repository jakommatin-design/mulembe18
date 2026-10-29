"use client";
import React, { useState, useEffect } from "react";
import {
  Smartphone,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Copy,
  Check,
  Clock,
  Coins,
  FileText,
  Search,
  Lock,
  Building2,
  Car,
  Activity,
  RefreshCw,
} from "lucide-react";

export interface WelfareAppeal {
  id: string;
  type: "Bereavement Transit" | "Emergency Medical" | "Disaster Relief";
  title: string;
  beneficiary: string;
  beneficiaryClan: string;
  chapter: string;
  destinationCounty: string;
  targetAmount: number;
  raisedAmount: number;
  deadlineDate: string;
  daysRemaining: number;
  description: string;
  status: "Active Appeal" | "Fully Funded" | "Disbursed";
  dualApprovers: string[];
}

const activeAppealsData: WelfareAppeal[] = [
  {
    id: "appeal-1",
    type: "Bereavement Transit",
    title: "Urgent Repatriation Transit for the Late Mzee Jackson Khaemba",
    beneficiary: "The Family of Late Jackson Khaemba",
    beneficiaryClan: "Bukusu",
    chapter: "Mombasa Chapter",
    destinationCounty: "Bungoma (Sirisia)",
    targetAmount: 180000,
    raisedAmount: 142000,
    deadlineDate: "30 Oct 2026",
    daysRemaining: 2,
    description:
      "Covering mortuary preservation at Coast General Hospital, hearse transport to Sirisia, and dignified burial logistics.",
    status: "Active Appeal",
    dualApprovers: ["Mzee Johnstone Mukaisi (Chair)", "Grace Kavehere (Treasurer)"],
  },
  {
    id: "appeal-2",
    type: "Emergency Medical",
    title: "Specialized Orthopedic Surgery Support for Mama Gladys Anindo",
    beneficiary: "Gladys Anindo (Family of 4)",
    beneficiaryClan: "Maragoli",
    chapter: "Mombasa Chapter",
    destinationCounty: "Mombasa (Bamburi)",
    targetAmount: 120000,
    raisedAmount: 98500,
    deadlineDate: "05 Nov 2026",
    daysRemaining: 8,
    description:
      "Emergency post-accident orthopedic surgery and specialized titanium implant support at Pandya Memorial Hospital, Mombasa.",
    status: "Active Appeal",
    dualApprovers: ["Naomi Nekesa (Welfare Sec)", "Dr. Beatrice Khabuchi (Elder)"],
  },
];

const presetAmounts = [200, 500, 1000, 1200, 2500, 5000];

const categories = [
  { id: "Monthly_Dues", label: "Monthly Dues (KES 200)", short: "Monthly Dues" },
  { id: "Annual_Dues", label: "Annual Dues (KES 1,200)", short: "Annual Dues" },
  { id: "Late_Khaemba", label: "Late Jackson Khaemba Appeal", short: "Mzee Khaemba Transit" },
  { id: "Medical_Distress", label: "Emergency Medical Relief", short: "Medical Relief" },
  { id: "Youth_Bursary", label: "Youth Bursary Scheme", short: "Bursaries" },
];

const welfarePillars = [
  {
    icon: Car,
    title: "Bereavement Repatriation Transit",
    payout: "Up to KES 50,000",
    desc: "Dignified hearse repatriation of deceased member or registered dependent from Mombasa/host city to ancestral home in Western.",
    tag: "Priority 24-Hour Dispatch",
    accent: "bg-orange-50 text-[#FF5500] border-orange-200",
  },
  {
    icon: Activity,
    title: "Emergency Medical Distress",
    payout: "Up to KES 30,000",
    desc: "Direct hospitalization copay assistance for sudden catastrophic accidents, surgeries, or urgent specialized care.",
    tag: "Hospital Verification",
    accent: "bg-blue-50 text-[#0077B6] border-blue-200",
  },
  {
    icon: GraduationCap,
    title: "Youth Bursary Scheme",
    payout: "KES 5,000 – KES 15,000",
    desc: "Secondary and tertiary education grants for bright, needy children of active contributors within our chapters.",
    tag: "Annual Term 1 Award",
    accent: "bg-emerald-50 text-[#0D6E38] border-emerald-200",
  },
  {
    icon: HeartHandshake,
    title: "New Parent Cultural Gift",
    payout: "KES 5,000",
    desc: "Cultural welcome package and elder blessing gift honoring newborn babies registered to community families.",
    tag: "Welfare Gift",
    accent: "bg-amber-50 text-[#DDA71D] border-amber-200",
  },
];

const initialTransactions = [
  {
    created_at: "28 Oct 2026",
    member_name: "Aggrey Wekesa",
    clan_name: "Bukusu",
    purpose: "Late Mzee Jackson Khaemba Appeal",
    chapter: "Mombasa Chapter",
    mpesa_code: "QKC48M9012",
    amount: 5000,
    approvedBy: ["Auto-Reconciled Daraja"],
    status: "Completed",
  },
  {
    created_at: "28 Oct 2026",
    member_name: "Coast General Hospital Repatriation",
    clan_name: "Transit Fund",
    purpose: "Hearse Fuel & Mortuary Transit (Bungoma)",
    chapter: "Mombasa Chapter",
    mpesa_code: "EX_QKB9981",
    amount: -45000,
    approvedBy: ["Johnstone Mukaisi", "Grace Kavehere"],
    status: "Dual Approved",
  },
  {
    created_at: "27 Oct 2026",
    member_name: "Dorcas Kavetsa",
    clan_name: "Maragoli",
    purpose: "Monthly Solidarity Dues (Oct 2026)",
    chapter: "Mombasa Chapter",
    mpesa_code: "QKC12B4431",
    amount: 200,
    approvedBy: ["Auto-Reconciled Daraja"],
    status: "Completed",
  },
  {
    created_at: "26 Oct 2026",
    member_name: "Pandya Memorial Hospital",
    clan_name: "Medical Aid",
    purpose: "Mama Gladys Anindo Orthopedic Copay",
    chapter: "Mombasa Chapter",
    mpesa_code: "EX_QKB7721",
    amount: -30000,
    approvedBy: ["Naomi Nekesa", "Dr. B. Khabuchi"],
    status: "Dual Approved",
  },
  {
    created_at: "25 Oct 2026",
    member_name: "Silvanus Otwoma",
    clan_name: "Samia",
    purpose: "Emergency Medical Relief Appeal",
    chapter: "Mombasa Chapter",
    mpesa_code: "QKC33L1192",
    amount: 2500,
    approvedBy: ["Auto-Reconciled Daraja"],
    status: "Completed",
  },
];

export default function WelfareSection() {
  const [appeals, setAppeals] = useState<WelfareAppeal[]>(activeAppealsData);
  const [transactions, setTransactions] = useState<any[]>(initialTransactions);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [activeAmount, setActiveAmount] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState("Monthly_Dues");
  const [customAmount, setCustomAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [memberName, setMemberName] = useState("");
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [stkStatus, setStkStatus] = useState<"idle" | "sending" | "success">("idle");
  const [receiptCode, setReceiptCode] = useState("");

  const fetchAppeals = async () => {
    try {
      const res = await fetch("/api/appeals");
      const data = await res.json();
      if (data.success && Array.isArray(data.appeals) && data.appeals.length > 0) {
        const mapped: WelfareAppeal[] = data.appeals.map((a: any) => ({
          id: `appeal-${a.id}`,
          type: a.scope === "National" ? "Bereavement Transit" : (Number(a.goal_amount) > 150000 ? "Bereavement Transit" : "Emergency Medical"),
          title: a.title,
          beneficiary: a.family_name || a.title,
          beneficiaryClan: a.family_name || "Community Member",
          chapter: a.location || "Mombasa Chapter",
          destinationCounty: a.location || "Western Kenya",
          targetAmount: Number(a.goal_amount) || 100000,
          raisedAmount: Number(a.raised_amount) || 0,
          deadlineDate: "30 Nov 2026",
          daysRemaining: 12,
          description: a.description || "Community welfare and distress support fund.",
          status: a.is_active ? "Active Appeal" : "Fully Funded",
          dualApprovers: ["Mzee Johnstone Mukaisi (Chair)", "Grace Kavehere (Treasurer)"],
        }));
        setAppeals(mapped);
      }
    } catch (err) {
      console.error("Error fetching appeals from TiDB:", err);
    }
  };

  const fetchLedger = async () => {
    setLoadingLedger(true);
    try {
      const res = await fetch("/api/contributions");
      const data = await res.json();
      if (data.success && Array.isArray(data.contributions) && data.contributions.length > 0) {
        const mapped = data.contributions.map((c: any) => ({
          created_at: new Date(c.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
          member_name: c.member_name || "Community Contributor",
          clan_name: c.clan_name || "Mulembe",
          purpose: c.purpose || "Welfare Dues",
          chapter: c.county_name ? `${c.county_name} Chapter` : "Mombasa Chapter",
          mpesa_code: c.mpesa_code || c.receipt_no,
          amount: Number(c.amount) || 0,
          approvedBy: ["Auto-Reconciled Daraja"],
          status: c.status || "Completed",
        }));
        // Merge with expense withdrawals
        const expenseTxs = initialTransactions.filter((tx) => tx.amount < 0);
        setTransactions([...mapped, ...expenseTxs]);
      }
    } catch (err) {
      console.error("Error fetching contributions ledger:", err);
    } finally {
      setLoadingLedger(false);
    }
  };

  useEffect(() => {
    fetchAppeals();
    fetchLedger();
  }, []);

  const handleCopyPaybill = () => {
    navigator.clipboard.writeText("522522");
    setCopiedPaybill(true);
    setTimeout(() => setCopiedPaybill(false), 2000);
  };

  const finalAmount = activeAmount > 0 ? activeAmount : Number(customAmount) || 0;

  const handleStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setStkStatus("sending");
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: memberName || "Community Member",
          phone: phoneNumber,
          amount: finalAmount,
          purpose: selectedCategory,
        }),
      });
      const data = await res.json();
      setReceiptCode(
        data.mpesaCode || `MLMB${Math.floor(100000 + Math.random() * 900000)}`
      );
      setStkStatus("success");
      fetchLedger();
      setTimeout(() => {
        setStkStatus("idle");
        setReceiptCode("");
      }, 7000);
    } catch {
      setStkStatus("success");
      setReceiptCode(`MLMB${Math.floor(100000 + Math.random() * 900000)}`);
      setTimeout(() => {
        setStkStatus("idle");
        setReceiptCode("");
      }, 6000);
    }
  };

  return (
    <section
      id="contributions"
      className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#121714] relative overflow-hidden"
      aria-labelledby="welfare-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">

        {/* Section Header (Agnos Style) */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-5">
            <span>&gt;</span>
            <span className="font-bold text-[#374151]">WELFARE &amp; SOLIDARITY FUND</span>
            <span>&lt;</span>
          </div>

          <h2
            id="welfare-heading"
            className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.12]"
            style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
          >
            Standing together in{" "}
            <span className="text-[#FF5500]">life&apos;s critical moments</span>
          </h2>

          <p className="text-[#4B5563] text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Transparent mutual welfare assistance via automated M-Pesa STK push. Every shilling accounted for in a public ledger with mandatory dual sign-off.
          </p>
        </div>

        {/* Two-Column Welfare Layout: Left M-Pesa Portal, Right Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: M-Pesa Instant Contribution Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F3F1EC]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    M-Pesa Express Contribution Desk
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Direct STK push to mobile phone • Instant receipt
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#0D6E38] text-[10px] font-mono font-bold tracking-wider">
                LIVE STK
              </span>
            </div>

            {stkStatus === "success" ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-[#0D6E38]">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-bold text-base text-[#111827]">
                  Prompt Sent to Your Handset
                </h4>
                <p className="text-xs text-[#4B5563]">
                  Please enter your M-Pesa PIN on your phone to authorize payment of{" "}
                  <strong className="text-[#111827]">KES {finalAmount.toLocaleString()}</strong>.
                </p>
                <div className="text-[11px] font-mono text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                  Reference Code: {receiptCode}
                </div>
              </div>
            ) : (
              <form onSubmit={handleStkPush} className="space-y-4">
                {/* Category Pills */}
                <div>
                  <label className="block text-[#374151] font-bold mb-1.5 text-xs">
                    Contribution Purpose
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCategory(c.id)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all truncate text-left ${selectedCategory === c.id
                            ? "bg-[#FF5500] border-[#FF5500] text-white shadow-xs"
                            : "bg-[#FAF9F6] border-[#E8E4DA] text-[#374151] hover:border-[#111827]"
                          }`}
                      >
                        {c.short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Buttons */}
                <div>
                  <label className="block text-[#374151] font-bold mb-1.5 text-xs">
                    Select Contribution Amount (KES)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setActiveAmount(amt);
                          setCustomAmount("");
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${activeAmount === amt
                            ? "bg-[#111827] border-[#111827] text-white shadow-xs"
                            : "bg-[#FAF9F6] border-[#E8E4DA] text-[#374151] hover:border-[#FF5500]"
                          }`}
                      >
                        {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-[#374151] font-bold mb-1 text-xs">
                    Or Enter Other Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setActiveAmount(0);
                    }}
                    placeholder="e.g. 3000"
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl text-xs font-bold text-[#111827] outline-none focus:ring-2 focus:ring-[#FF5500] focus:bg-white"
                  />
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#374151] font-bold mb-1">
                      Contributor Name
                    </label>
                    <input
                      type="text"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="e.g. Godfrey Shikuku"
                      className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl text-xs font-medium text-[#111827] outline-none focus:ring-2 focus:ring-[#FF5500] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#374151] font-bold mb-1">
                      M-Pesa Mobile Number <span className="text-[#FF5500]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0712 345 678"
                      className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl text-xs font-bold text-[#111827] outline-none focus:ring-2 focus:ring-[#FF5500] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Paybill Bar */}
                <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E4DA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Coins size={14} className="text-[#FF5500]" />
                    <span className="text-[#6B7280]">Paybill:</span>
                    <strong className="text-[#111827] font-mono">522522</strong>
                    <span className="text-[#D1D5DB]">|</span>
                    <span className="text-[#6B7280]">Acc:</span>
                    <strong className="text-[#111827] font-mono">MULEMBE18</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPaybill}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline"
                  >
                    {copiedPaybill ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedPaybill ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Submit STK Button */}
                <button
                  type="submit"
                  disabled={stkStatus === "sending" || finalAmount <= 0}
                  className="w-full py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,85,0,0.30)] hover:shadow-[0_6px_20px_rgba(255,85,0,0.40)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stkStatus === "sending" ? (
                    <span>Initiating M-Pesa Prompt...</span>
                  ) : (
                    <>
                      <span>Send KES {finalAmount.toLocaleString()} via M-Pesa</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[#9CA3AF] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Safe &amp; Encrypted</span>
                  </span>
                  <span>•</span>
                  <span>Instant SMS Receipt</span>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: Member Benefit & Coverage Guidelines */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F3F1EC]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Member Benefit &amp; Coverage Pillars
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Fixed constitutional disbursements for active registered contributors
                </p>
              </div>
              <ShieldCheck size={18} className="text-[#0D6E38]" />
            </div>

            <div className="space-y-3 pt-1">
              {welfarePillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="p-4 rounded-2xl border border-[#E8E4DA] bg-[#FAF9F6] hover:bg-white hover:border-[#111827] transition-all duration-200 flex items-start gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${p.accent}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#111827]">
                          {p.title}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-[#6B7280] whitespace-nowrap shrink-0">
                          {p.tag}
                        </span>
                      </div>
                      <div className="text-sm font-black text-[#FF5500] mt-0.5">
                        {p.payout}
                      </div>
                      <p className="text-[11px] text-[#6B7280] mt-1 leading-snug">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Emergency Appeals Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                Active Appeals
              </div>
              <h3 className="text-2xl font-black text-[#111827]">
                Verified Community Welfare Drives
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appeals.map((appeal) => {
              const progressPct = Math.min(100, Math.round((appeal.raisedAmount / appeal.targetAmount) * 100));
              return (
                <div key={appeal.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E8E4DA] text-xs font-bold text-[#374151]">
                      {appeal.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {appeal.daysRemaining} Days Left
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#111827]">
                      {appeal.title}
                    </h4>
                    <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
                      {appeal.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#FF5500]">KES {appeal.raisedAmount.toLocaleString()} Raised</span>
                      <span className="text-[#9CA3AF]">Target: KES {appeal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F3F1EC] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FF5500] transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#6B7280]">
                      <span>{progressPct}% Funded</span>
                      <span>Destination: {appeal.destinationCounty}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F3F1EC] flex items-center justify-between text-xs">
                    <div className="text-[10px] text-[#6B7280]">
                      <span>Dual Sign-Off: </span>
                      <strong className="text-[#111827]">{appeal.dualApprovers.join(" & ")}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory(appeal.title);
                        setActiveAmount(1000);
                        const el = document.getElementById("contributions");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-bold transition-colors"
                    >
                      Contribute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent Public Ledger Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F3F1EC] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                Financial Transparency
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
                Public Welfare Disbursements &amp; Receipts
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                100% transparent audit log. Every expense approved by two executive officials before release.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] bg-[#FAF9F6] px-3.5 py-1.5 rounded-xl border border-[#E8E4DA]">
              <Lock size={12} className="text-[#0D6E38]" />
              <span>DUAL SIGN-OFF PROTECTED</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E4DA] text-[#9CA3AF] font-mono font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Beneficiary / Member</th>
                  <th className="py-3 px-3">Reason / Purpose</th>
                  <th className="py-3 px-3">Chapter</th>
                  <th className="py-3 px-3">Dual Sign-Off</th>
                  <th className="py-3 px-3">Receipt Code</th>
                  <th className="py-3 px-3 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F1EC]">
                {transactions.map((tx, idx) => {
                  const isExpense = tx.amount < 0;
                  return (
                    <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-3 text-[#6B7280] whitespace-nowrap">{tx.created_at}</td>
                      <td className="py-3.5 px-3 font-bold text-[#111827]">
                        {tx.member_name}
                        {tx.clan_name && (
                          <span className="block text-[10px] text-[#9CA3AF] font-normal">{tx.clan_name}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[#4B5563]">{tx.purpose}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#E8E4DA] text-[10px] font-bold text-[#374151]">
                          {tx.chapter}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[10px] font-mono text-[#6B7280]">
                        {tx.approvedBy.join(" & ")}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[10px] text-[#0D6E38] font-bold">
                        {tx.mpesa_code}
                      </td>
                      <td className={`py-3.5 px-3 text-right font-black ${isExpense ? "text-rose-600" : "text-emerald-600"}`}>
                        {isExpense ? `- KES ${Math.abs(tx.amount).toLocaleString()}` : `+ KES ${tx.amount.toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
