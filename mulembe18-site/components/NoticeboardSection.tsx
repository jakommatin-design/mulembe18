"use client";
import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Home,
  Store,
  GraduationCap,
  Plus,
  MapPin,
  Clock,
  Phone,
  Tag,
  CheckCircle2,
  X,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
} from "lucide-react";

export interface NoticeItem {
  id: string;
  category: "Job" | "Rental" | "Business" | "Mentorship";
  title: string;
  chapter: string;
  location: string;
  author: string;
  authorClan: string;
  phone: string;
  postedDate: string;
  details: string;
  priceOrSalary?: string;
  tags: string[];
}

const initialNotices: NoticeItem[] = [
  {
    id: "notice-1",
    category: "Rental",
    title: "Spacious 2-Bedroom Apartment in Nyali (Near Links Road)",
    chapter: "Mombasa Chapter",
    location: "Nyali, Mombasa",
    author: "Eunice Khabetsa",
    authorClan: "Maragoli",
    phone: "0722 411 902",
    postedDate: "2 days ago",
    details:
      "Gated compound with fresh borehole water, ample parking, and 24/7 security. Walking distance to matatu stage. Preferred lease to a responsible community family.",
    priceOrSalary: "KES 28,000 / month",
    tags: ["2-Bedroom", "Fresh Water", "Gated Security", "Family Friendly"],
  },
  {
    id: "notice-2",
    category: "Job",
    title: "Maritime Clearing & Forwarding Logistics Assistant Needed",
    chapter: "Mombasa Chapter",
    location: "Kilindini / Mombasa Island",
    author: "Wycliffe Barasa (Logistics Director)",
    authorClan: "Bukusu",
    phone: "0711 883 451",
    postedDate: "Yesterday",
    details:
      "Seeking a graduate in Logistics or Supply Chain. Must understand Simba/ICMS systems, KRA customs clearance, and port documentation. Training provided for eager learners.",
    priceOrSalary: "KES 45,000 - 55,000 / month",
    tags: ["Full-Time", "Port Logistics", "KRA ICMS", "Career Growth"],
  },
  {
    id: "notice-3",
    category: "Business",
    title: "Western Heritage Fresh Produce & Free-Range Kienyeji Chicken",
    chapter: "Mombasa Chapter",
    location: "Bamburi & Mtwapa Delivery",
    author: "Mama Agnes Nasimiyu",
    authorClan: "Tachoni",
    phone: "0733 920 188",
    postedDate: "3 days ago",
    details:
      "Direct consignments from Bungoma & Kakamega twice weekly: original Luhya brown kienyeji chicken, fresh managu, saga, mitoo, groundnut butter, and sweet bananas.",
    priceOrSalary: "Kienyeji Chicken: KES 1,100",
    tags: ["Kienyeji Chicken", "Traditional Greens", "Fresh Farm Goods"],
  },
  {
    id: "notice-4",
    category: "Mentorship",
    title: "Free Software Engineering & Web Development Mentorship Circle",
    chapter: "Mombasa Chapter",
    location: "TUM / Mombasa Tech Hub (Hybrid)",
    author: "Eng. Davis Shikuku",
    authorClan: "Wanga",
    phone: "0704 556 120",
    postedDate: "4 days ago",
    details:
      "A 6-week weekend cohort covering full-stack web development, Git, React, and freelancing skills tailored for youth and university students looking for tech careers.",
    priceOrSalary: "100% Free for Members",
    tags: ["Tech Mentorship", "Software Skills", "Youth Empowerment"],
  },
  {
    id: "notice-5",
    category: "Rental",
    title: "Single Room & Bedsitter Units in Bamburi (Near Kiembeni Stage)",
    chapter: "Mombasa Chapter",
    location: "Bamburi, Mombasa",
    author: "Silas Wetangula",
    authorClan: "Bukusu",
    phone: "0718 209 334",
    postedDate: "5 days ago",
    details:
      "Affordable secure units ideal for new arrivals and young professionals starting out in Mombasa. Paved access, reliable water, and prepaid electricity tokens.",
    priceOrSalary: "KES 6,500 – 9,000 / month",
    tags: ["Bedsitter", "Affordable", "Newcomers Ideal", "Bamburi"],
  },
  {
    id: "notice-6",
    category: "Business",
    title: "Luhya Cultural Music & Traditional Isukuti Troupe for Events",
    chapter: "Mombasa Chapter",
    location: "Coastwide Bookings",
    author: "Mzee Evans Liyengwa",
    authorClan: "Isukha",
    phone: "0720 119 450",
    postedDate: "1 week ago",
    details:
      "Authentic Isukuti cultural drum performance troupe available for weddings, family blessings, milestone celebrations, and communal receptions across the Coast.",
    priceOrSalary: "From KES 15,000 / event",
    tags: ["Isukuti Drums", "Weddings", "Traditional Dance"],
  },
];

export default function NoticeboardSection() {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [postModal, setPostModal] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [form, setForm] = useState({
    category: "Job" as "Job" | "Rental" | "Business" | "Mentorship",
    title: "",
    location: "",
    author: "",
    authorClan: "Bukusu",
    phone: "",
    priceOrSalary: "",
    details: "",
    tags: "",
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.success && Array.isArray(data.notices) && data.notices.length > 0) {
        const mapped: NoticeItem[] = data.notices.map((n: any) => ({
          id: `notice-${n.id}`,
          category: n.category as any,
          title: n.title,
          chapter: n.chapter || "Mombasa Chapter",
          location: n.location,
          author: n.author_name,
          authorClan: n.author_clan || "Mulembe",
          phone: n.phone,
          postedDate: n.created_at ? new Date(n.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "Recently",
          details: n.description,
          priceOrSalary: n.price_or_salary || undefined,
          tags: n.tags ? n.tags.split(",").map((t: string) => t.trim()) : ["Verified Member"],
        }));
        setNotices(mapped);
      }
    } catch (err) {
      console.error("Error fetching notices from TiDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const categories = [
    { id: "All", label: "All Notices", icon: Filter },
    { id: "Rental", label: "Housing & Rentals", icon: Home },
    { id: "Job", label: "Jobs & Careers", icon: Briefcase },
    { id: "Business", label: "Community Businesses", icon: Store },
    { id: "Mentorship", label: "Mentorship & Skills", icon: GraduationCap },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = activeCategory === "All" || n.category === activeCategory;
    const matchesQuery =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.authorClan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          title: form.title,
          chapter: "Mombasa Chapter",
          location: form.location,
          author: form.author,
          authorClan: form.authorClan,
          phone: form.phone,
          priceOrSalary: form.priceOrSalary,
          details: form.details,
          tags: form.tags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPostSuccess(true);
        fetchNotices();
        setTimeout(() => {
          setPostSuccess(false);
          setPostModal(false);
          setForm({
            category: "Job",
            title: "",
            location: "",
            author: "",
            authorClan: "Bukusu",
            phone: "",
            priceOrSalary: "",
            details: "",
            tags: "",
          });
        }, 2000);
      } else {
        alert(data.message || "Failed to submit notice");
      }
    } catch (err) {
      console.error("Error submitting notice:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="notices" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#121714]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header (Agnos Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-4">
              <span>&gt;</span>
              <span className="font-bold text-[#374151]">COMMUNITY NOTICEBOARD</span>
              <span>&lt;</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.12]"
              style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
            >
              Trusted listings that move{" "}
              <span className="text-[#FF5500]">our people forward</span>
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              A verified community bulletin for housing rentals in Mombasa, employment vacancies,
              local businesses, and youth skill mentorship.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPostModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(255,85,0,0.30)] hover:shadow-[0_6px_20px_rgba(255,85,0,0.40)] transition-all transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Post a Free Notice</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar (Agnos Clean Layout) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 ${
                    activeCategory === c.id
                      ? "bg-[#111827] border-[#111827] text-white shadow-xs"
                      : "bg-white border-[#E8E4DA] text-[#4B5563] hover:border-[#111827]"
                  }`}
                >
                  <Icon size={14} className={activeCategory === c.id ? "text-white" : "text-[#FF5500]"} />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, clan..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E4DA] text-xs font-medium text-[#111827] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#FF5500]"
            />
          </div>
        </div>

        {/* Notice Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#111827] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E4DA] text-[10px] font-mono font-bold text-[#374151] uppercase">
                    {n.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                    <Clock size={11} />
                    <span>{n.postedDate}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#111827] leading-snug line-clamp-2">
                  {n.title}
                </h3>

                <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3">
                  {n.details}
                </p>

                {n.priceOrSalary && (
                  <div className="inline-block px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#FF5500] font-black text-xs font-mono">
                    {n.priceOrSalary}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {n.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-[#FAF9F6] text-[#6B7280] text-[10px] font-medium border border-[#EAE7DF]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F3F1EC] flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#111827] truncate">{n.author}</span>
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] mt-0.5">
                    <MapPin size={10} />
                    <span className="truncate">{n.location}</span>
                  </div>
                </div>

                <a
                  href={`tel:${n.phone.replace(/\s+/g, "")}`}
                  className="px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Phone size={12} />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E4DA] p-8">
            <Search size={32} className="mx-auto text-[#9CA3AF] mb-3" />
            <h4 className="font-bold text-[#111827] text-base">No notices found</h4>
            <p className="text-xs text-[#6B7280] mt-1">Try adjusting your category filter or search terms.</p>
          </div>
        )}

      </div>

      {/* Modal for Posting Notice */}
      {postModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8E4DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPostModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7280] hover:text-[#111827] hover:bg-[#FAF9F6] transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#111827] mb-1">
              Post a Community Notice
            </h3>
            <p className="text-xs text-[#6B7280] mb-5">
              Share housing, jobs, services, or mentorship directly with our verified community.
            </p>

            {postSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 size={36} className="text-[#0D6E38] mx-auto" />
                <h4 className="font-bold text-[#111827] text-base">Notice Published Successfully</h4>
                <p className="text-xs text-[#4B5563]">Your listing is now visible to all community members.</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#374151] font-bold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                  >
                    <option value="Rental">Housing &amp; Rentals</option>
                    <option value="Job">Job Opening</option>
                    <option value="Business">Community Business</option>
                    <option value="Mentorship">Mentorship &amp; Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#374151] font-bold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. 2-Bedroom Apartment in Bamburi"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#374151] font-bold mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Bamburi, Mombasa"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#374151] font-bold mb-1">Price or Salary</label>
                    <input
                      type="text"
                      value={form.priceOrSalary}
                      onChange={(e) => setForm({ ...form, priceOrSalary: e.target.value })}
                      placeholder="e.g. KES 15,000 / month"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#374151] font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#374151] font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0712 345 678"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#374151] font-bold mb-1">Details &amp; Requirements</label>
                  <textarea
                    rows={3}
                    required
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Provide full description..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DA] rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#FF5500]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm shadow-md transition-all"
                >
                  Submit Notice
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
