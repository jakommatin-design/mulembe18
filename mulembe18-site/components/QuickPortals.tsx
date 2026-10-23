import { BookOpen, Calendar, HeartHandshake, Newspaper, Award, Users } from "lucide-react";

const portals = [
  { href: "#directory",     icon: BookOpen,       label: "Member Directory",  desc: "Connect with fellow Luhya members.",       color: "bg-emerald-100/70 text-[#0D6E38]",  glow: "group-hover:border-[#0D6E38]/50" },
  { href: "#events",        icon: Calendar,       label: "Events Calendar",   desc: "Cultural, sports & annual festivals.",     color: "bg-amber-100/70 text-amber-800",    glow: "group-hover:border-[#DDA71D]/60" },
  { href: "#contributions", icon: HeartHandshake, label: "Welfare & Dues",    desc: "M-Pesa support & bereavement fund.",       color: "bg-emerald-100/70 text-[#0D6E38]",  glow: "group-hover:border-[#0D6E38]/50" },
  { href: "#news",          icon: Newspaper,      label: "News & Bulletins",  desc: "Official communiqués & announcements.",    color: "bg-blue-100/70 text-[#0077B6]",     glow: "group-hover:border-[#0077B6]/50" },
  { href: "#leadership",    icon: Award,          label: "Leadership Council",desc: "Executive committee & elder governance.",  color: "bg-purple-100/70 text-purple-700",  glow: "group-hover:border-purple-400" },
  { href: "#about",         icon: Users,          label: "18 Sub-Tribes",     desc: "Root origins, culture & unity.",           color: "bg-rose-100/70 text-rose-700",      glow: "group-hover:border-rose-400" },
];

export default function QuickPortals() {
  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Quick Access">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {portals.map(({ href, icon: Icon, label, desc, color, glow }) => (
          <a
            key={href}
            href={href}
            className={`glass-card group p-5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl ${glow}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-sm ${color}`}>
              <Icon size={22} />
            </div>
            <h2 className="text-sm font-bold text-[#18221B] mb-1 group-hover:text-[#0D6E38] transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
              {label}
            </h2>
            <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
