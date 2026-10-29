"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Calendar,
  CheckCircle2,
  X,
  Star,
  CalendarDays,
  Sparkles,
  RefreshCw,
  CheckSquare,
  UserCheck,
  ListTodo,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { normalizeImageUrl } from "@/lib/image-utils";

export interface CommitteeRole {
  role: string;
  name: string;
  clan: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  assignedTo: string;
}

export interface EventItem {
  id: number | string;
  title: string;
  chapter: string;
  event_date?: string;
  day?: string;
  dow?: string;
  month?: string;
  time?: string;
  venue: string;
  category: "Cultural" | "Welfare & Clan" | "Career & Mentorship" | "Sports" | "Governance" | string;
  entry_fee?: string;
  attendees?: string | number;
  description?: string;
  image_url?: string;
  is_featured?: boolean | number;
  committee?: CommitteeRole[];
  tasks?: TaskItem[];
}

const defaultEvents: EventItem[] = [
  {
    id: 1,
    title: "Annual Mulembe Coast Cultural Extravaganza & Isukuti Festival",
    chapter: "Mombasa Chapter",
    day: "14",
    dow: "SAT",
    month: "NOV 2026",
    time: "09:00 AM - 06:00 PM",
    venue: "Mombasa Sports Club Grounds, Coast",
    category: "Cultural",
    entry_fee: "Free for Members / KES 300 Public",
    attendees: 420,
    is_featured: true,
    description:
      "All 18 sub-communities unite for traditional drumming competitions, indigenous cuisine showcases, folklore storytelling with elders, and youth soccer cup.",
    image_url: "/images/isukuti-dancers.jpg",
    committee: [
      { role: "Event Chairperson", name: "Elder Johnstone Mukaisi", clan: "Bukusu" },
      { role: "Treasurer & Tickets", name: "Grace Kavehere", clan: "Maragoli" },
      { role: "Logistics & Security", name: "Wycliffe Barasa", clan: "Wanga" },
      { role: "Catering & Protocol", name: "Mama Agnes Nasimiyu", clan: "Tachoni" },
    ],
    tasks: [
      { id: "t1", title: "Secure County Cultural Permit & Police Clearance", completed: true, assignedTo: "E. Mukaisi" },
      { id: "t2", title: "Grounds sound system & Isukuti drum setup", completed: true, assignedTo: "W. Barasa" },
      { id: "t3", title: "Authentic Western food vendors confirmation", completed: true, assignedTo: "A. Nasimiyu" },
      { id: "t4", title: "M-Pesa entry ticket reconciliations", completed: false, assignedTo: "G. Kavehere" },
    ],
  },
  {
    id: 2,
    title: "Mombasa Chapter Quarterly Welfare & Bereavement Baraza",
    chapter: "Mombasa Chapter",
    day: "21",
    dow: "SAT",
    month: "NOV 2026",
    time: "02:00 PM - 05:30 PM",
    venue: "Likoni Community Centre Hall, Mombasa",
    category: "Welfare & Clan",
    entry_fee: "Free for Members",
    attendees: 185,
    description:
      "Reviewing quarterly bereavement disbursements, medical distress funds, and approving the 2027 Coast-to-Western hearse transit retainer contract.",
    image_url: "/images/luhya-bullfighting.jpg",
    committee: [
      { role: "Baraza Chair", name: "Silvanus Wetang'ula", clan: "Bukusu" },
      { role: "Welfare Officer", name: "Naomi Nekesa", clan: "Samia" },
      { role: "Secretary", name: "Evans Barasa", clan: "Wanga" },
    ],
    tasks: [
      { id: "t21", title: "Audit report printouts for member review", completed: true, assignedTo: "N. Nekesa" },
      { id: "t22", title: "Likoni hall acoustics & public address setup", completed: true, assignedTo: "E. Barasa" },
    ],
  },
  {
    id: 3,
    title: "National Leadership Council & Constitutional Review Meeting",
    chapter: "National Network",
    day: "05",
    dow: "SAT",
    month: "DEC 2026",
    time: "10:00 AM - 03:00 PM",
    venue: "Hybrid: Nairobi Secretariat Hub & Online Zoom",
    category: "Governance",
    entry_fee: "Accredited Delegates",
    attendees: 95,
    description:
      "All chapter chairs, elders, and delegates review the nationwide chapter expansion roadmap and elect standing dispute tribunal members.",
    image_url: "/images/coastal-portal.png",
    committee: [
      { role: "Convenor", name: "National Patron Hon. Walubengo", clan: "Bukusu" },
      { role: "Recording Elder", name: "Dr. Francis Atwoli", clan: "Khayo" },
    ],
    tasks: [
      { id: "t31", title: "Draft constitution amendments distribution", completed: true, assignedTo: "Patron" },
      { id: "t32", title: "Zoom link setup & delegate authentication", completed: true, assignedTo: "IT Desk" },
    ],
  },
  {
    id: 4,
    title: "Mulembe Coastal Youth & Tech Maritime Forum",
    chapter: "Mombasa Chapter",
    day: "19",
    dow: "SAT",
    month: "DEC 2026",
    time: "09:30 AM - 01:30 PM",
    venue: "Technical University of Mombasa (TUM) Assembly Hall",
    category: "Career & Mentorship",
    entry_fee: "Free Entry (Students & Graduates)",
    attendees: 210,
    description:
      "Mentoring Western youth living at the Coast into port logistics, software engineering, blue economy careers, and chama investment basics.",
    image_url: "/images/landing-hero.png",
    committee: [
      { role: "Youth Lead", name: "Brenda Khabetsa", clan: "Isukha" },
      { role: "Keynote Speaker", name: "Eng. Aggrey Masika", clan: "Bukusu" },
    ],
    tasks: [
      { id: "t41", title: "TUM auditorium venue permit clearance", completed: true, assignedTo: "B. Khabetsa" },
      { id: "t42", title: "Mentorship breakout session coaches signup", completed: false, assignedTo: "B. Khabetsa" },
    ],
  },
];

const filterTabs = ["All", "Cultural", "Welfare & Clan", "Career & Mentorship", "Governance"];

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");
  const [rsvpEvent, setRsvpEvent] = useState<EventItem | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [reminderChannel, setReminderChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [activeTab, setActiveTab] = useState<"details" | "committee" | "tasks">("details");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success && Array.isArray(data.events) && data.events.length > 0) {
        setEvents(data.events);
      }
    } catch {
      // Retain default rich events
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (e) => selectedCat === "All" || e.category === selectedCat
  );

  const featuredEvent = events.find((e) => Boolean(e.is_featured)) || events[0];

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpEvent && attendeeName && attendeePhone) {
      try {
        await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: rsvpEvent.id, attendees: true }),
        });
      } catch {}
      setRsvpSuccess(true);
      setTimeout(() => {
        setRsvpSuccess(false);
        setRsvpEvent(null);
        setAttendeeName("");
        setAttendeePhone("");
      }, 3000);
    }
  };

  return (
    <section id="events" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#121714] relative overflow-hidden" aria-labelledby="events-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header (Agnos Style) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-4">
            <span>&gt;</span>
            <span className="font-bold text-[#374151]">COMMUNITY GATHERINGS</span>
            <span>&lt;</span>
          </div>

          <h2
            id="events-heading"
            className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.12]"
            style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
          >
            Gathering 18 communities under{" "}
            <span className="text-[#FF5500]">one rhythm</span>
          </h2>

          <p className="text-[#4B5563] text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            From vibrant Isukuti cultural festivals to elder welfare barazas, reserve your pass and stay connected.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedCat(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCat === tab
                  ? "bg-[#111827] border-[#111827] text-white shadow-xs"
                  : "bg-white border-[#E8E4DA] text-[#4B5563] hover:border-[#111827]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured Event Banner in Initial Design Style */}
        {featuredEvent && (
          <div className="relative mb-12 rounded-3xl overflow-hidden card bg-white border border-[#E6E0D5] shadow-lg">
            <BorderBeam size={250} duration={12} delay={9} colorFrom="#0D6E38" colorTo="#DDA71D" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Image & Date Tag */}
              <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[300px] overflow-hidden">
                <img
                  src={normalizeImageUrl(featuredEvent.image_url || "/images/isukuti-dancers.jpg", "/images/isukuti.jpg")}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#DDA71D] text-[#082f1a] font-extrabold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Star size={12} className="fill-[#082f1a]" /> Featured Gathering
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 text-gray-900 font-bold text-[10px] shadow-sm">
                    {featuredEvent.chapter}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl sm:text-4xl font-black font-mono leading-none">
                    {featuredEvent.day}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {featuredEvent.dow} • {featuredEvent.month}
                  </div>
                </div>
              </div>

              {/* Event Content & Committee/Tasks Switcher */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="pill-clan">{featuredEvent.category}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {featuredEvent.attendees} Registered Attendees
                    </span>
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-bold text-[#18221B] mt-3 leading-snug"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {featuredEvent.title}
                  </h3>

                  {/* Sub-tabs for Details, Committee, Tasks */}
                  <div className="flex items-center gap-2 mt-4 border-b border-gray-100 pb-2">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`text-xs font-bold pb-1 transition-colors ${
                        activeTab === "details"
                          ? "text-[#0D6E38] border-b-2 border-[#0D6E38]"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Event Details
                    </button>
                    {featuredEvent.committee && (
                      <button
                        onClick={() => setActiveTab("committee")}
                        className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1 ${
                          activeTab === "committee"
                            ? "text-[#0D6E38] border-b-2 border-[#0D6E38]"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <UserCheck size={12} />
                        <span>Organizing Committee ({featuredEvent.committee.length})</span>
                      </button>
                    )}
                    {featuredEvent.tasks && (
                      <button
                        onClick={() => setActiveTab("tasks")}
                        className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1 ${
                          activeTab === "tasks"
                            ? "text-[#0D6E38] border-b-2 border-[#0D6E38]"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <ListTodo size={12} />
                        <span>Planning Tasks ({featuredEvent.tasks.length})</span>
                      </button>
                    )}
                  </div>

                  {activeTab === "details" && (
                    <div className="mt-3 space-y-3">
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {featuredEvent.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#0D6E38] shrink-0" />
                          <span>{featuredEvent.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#DDA71D] shrink-0" />
                          <span>{featuredEvent.time}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "committee" && featuredEvent.committee && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {featuredEvent.committee.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E6E0D5]">
                          <span className="text-[10px] text-gray-500 font-bold block">{c.role}</span>
                          <strong className="text-gray-900 block">{c.name}</strong>
                          <span className="text-[10px] text-[#0D6E38] font-semibold">{c.clan} Clan</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "tasks" && featuredEvent.tasks && (
                    <div className="mt-3 space-y-2 text-xs">
                      {featuredEvent.tasks.map((t) => (
                        <div key={t.id} className="p-2 rounded-xl bg-[#FBF8F2] border border-[#E6E0D5] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${t.completed ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                              {t.completed ? "✓" : "•"}
                            </span>
                            <span className={t.completed ? "line-through text-gray-400" : "text-gray-800 font-medium"}>
                              {t.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500">{t.assignedTo}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Entry Pass</span>
                    <strong className="text-xs text-[#0D6E38]">{featuredEvent.entry_fee}</strong>
                  </div>

                  <button
                    onClick={() => setRsvpEvent(featuredEvent)}
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0D6E38] hover:bg-[#09522a] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Reserve RSVP Seat</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Events List in Initial First Design Card Style */}
        <div className="space-y-4">
          {filteredEvents.map((e) => (
            <div
              key={e.id}
              className="card bg-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0D6E38]/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Date Block */}
                <div className="w-14 h-14 rounded-2xl bg-[#FBF8F2] border border-[#E6E0D5] text-[#18221B] flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-black leading-none" style={{ fontFamily: "var(--font-outfit)" }}>
                    {e.day || "15"}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#0D6E38] mt-0.5">
                    {e.dow || "SAT"}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="pill-clan">{e.category}</span>
                    <span className="text-[10px] font-semibold text-gray-500">{e.chapter}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#18221B] mt-1" style={{ fontFamily: "var(--font-outfit)" }}>
                    {e.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#0D6E38]" /> {e.venue}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#DDA71D]" /> {e.time || "Scheduled"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-full md:w-auto flex md:justify-end shrink-0">
                <button
                  onClick={() => setRsvpEvent(e)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-full bg-[#0D6E38] hover:bg-[#09522a] text-white text-xs font-bold transition-all shadow-xs"
                >
                  RSVP Pass
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* RSVP Modal */}
      {rsvpEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-200 relative space-y-4">
            <button
              onClick={() => {
                setRsvpEvent(null);
                setRsvpSuccess(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {rsvpSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-[#0D6E38]" />
                </div>
                <h3 className="text-xl font-bold text-[#18221B]" style={{ fontFamily: "var(--font-outfit)" }}>
                  RSVP Confirmed!
                </h3>
                <p className="text-xs text-gray-600">
                  Your seat for <strong>{rsvpEvent.title}</strong> has been secured. Event reminder will be sent via {reminderChannel}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0D6E38] tracking-wider">Event RSVP</span>
                  <h3 className="text-lg font-bold text-[#18221B]" style={{ fontFamily: "var(--font-outfit)" }}>
                    {rsvpEvent.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {rsvpEvent.venue} • {rsvpEvent.day} {rsvpEvent.month}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="e.g. Daniel Shikuku"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">M-Pesa / Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      placeholder="e.g. 0712 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D6E38]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Reminder Channel:</label>
                    <div className="grid grid-cols-3 gap-2 text-center font-bold">
                      {(["whatsapp", "sms", "email"] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setReminderChannel(ch)}
                          className={`py-2 rounded-xl uppercase text-[10px] border transition-all ${
                            reminderChannel === ch
                              ? "bg-[#0D6E38] text-white border-[#0D6E38]"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#0D6E38] hover:bg-[#0a4d29] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Confirm Event Attendance
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
