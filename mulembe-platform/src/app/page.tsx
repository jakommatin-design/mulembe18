import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ShieldCheck,
  Compass,
  Calendar,
  ArrowRight,
  MapPin,
  ChevronRight,
  Landmark,
  Sparkles,
} from "lucide-react";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { eventRepository } from "@/server/repositories/event.repository";
import { announcementRepository } from "@/server/repositories/announcement.repository";
import { geographyRepository } from "@/server/repositories/geography.repository";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Mulembe National Platform | Official Luhya Community Platform",
  description:
    "The official national digital home for the Luhya community across Kenya's 47 counties and the global diaspora. Uniting culture, verified membership, decentralized chapters, and mutual aid.",
  openGraph: {
    title: "Mulembe National Platform",
    description:
      "A nationwide community built on trust, cultural heritage, and verified mutual aid across all 47 counties.",
    url: "https://mulembe.org",
    siteName: "Mulembe National Platform",
    type: "website",
  },
};

export default async function HomePage() {
  const { userId } = await auth();

  // Fetch live statistics and data server-side
  let countiesCount = 47;
  let activeChaptersCount = 0;
  let upcomingEventsCount = 0;
  let featuredChapters: Array<{
    id: string;
    slug: string;
    name: string;
    countyCode: string;
    description: string | null;
    meetingVenue: string | null;
  }> = [];
  let upcomingEvents: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    startTime: Date;
    venueName: string;
  }> = [];
  let latestNotices: Array<{
    id: string;
    title: string;
    content: string;
    priority: string;
    createdAt: Date;
  }> = [];

  try {
    const allCounties = await geographyRepository.getAllCounties();
    if (allCounties?.length) countiesCount = allCounties.length;

    const chapters = await chapterRepository.getAllActive();
    activeChaptersCount = chapters.length;
    featuredChapters = chapters.slice(0, 3);

    const eventsResult = await eventRepository.list({
      status: "published",
      limit: 3,
    });
    upcomingEventsCount = eventsResult.total;
    upcomingEvents = eventsResult.items.map((ev) => ({
      id: ev.id,
      slug: ev.slug,
      title: ev.title,
      category: ev.category,
      startTime: ev.startTime,
      venueName: ev.venueName,
    }));

    const noticesResult = await announcementRepository.list({ limit: 3 });
    latestNotices = noticesResult.items.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      priority: n.priority,
      createdAt: n.createdAt,
    }));
  } catch (error) {
    console.warn("Failed to query live stats for home page:", error);
  }

  // Organization Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mulembe National Community Platform",
    url: "https://mulembe.org",
    logo: "https://mulembe.org/logo.png",
    description:
      "National platform for the Luhya community spanning 47 counties and the global diaspora.",
    foundingLocation: "Kenya",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5 py-lg-6">
        <div className="container position-relative z-1 py-4 py-lg-5">
          <div className="row align-items-center justify-content-center text-center">
            <div className="col-12 col-xl-10">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill glass-badge mb-4">
                <Sparkles size={16} className="text-warning" />
                <span className="small text-warning fw-semibold tracking-wide text-uppercase">
                  The National Digital Registry
                </span>
              </div>

              <h1
                className="display-3 fw-bold text-light mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                A Nation of Chapters, One Resolute Voice
              </h1>

              <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: "780px" }}>
                Uniting over 6 million Luhya community members across all 47 counties of Kenya and
                the global diaspora. Safeguarding cultural wisdom, formalising welfare protection,
                and advancing generational prosperity.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-3">
                {userId ? (
                  <Link href="/profile" className="btn btn-gold btn-lg px-4 py-3">
                    Access Member Dashboard
                  </Link>
                ) : (
                  <Link href="/sign-up" className="btn btn-gold btn-lg px-4 py-3 shadow-lg">
                    Join the National Registry
                  </Link>
                )}
                <Link href="/chapters" className="btn btn-glass btn-lg px-4 py-3">
                  Locate Your Chapter
                </Link>
              </div>
            </div>
          </div>

          {/* Live Statistics Glass Bar */}
          <div className="row g-3 mt-5 pt-3">
            <div className="col-6 col-md-3">
              <div className="glass-panel p-4 text-center h-100">
                <span className="display-6 fw-bold text-warning d-block mb-1">
                  {countiesCount}
                </span>
                <span className="small text-secondary fw-semibold text-uppercase tracking-wider">
                  Kenyan Counties
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-panel p-4 text-center h-100">
                <span className="display-6 fw-bold text-light d-block mb-1">
                  {Math.max(activeChaptersCount, 4)}+
                </span>
                <span className="small text-secondary fw-semibold text-uppercase tracking-wider">
                  Active Chapters
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-panel p-4 text-center h-100">
                <span className="display-6 fw-bold text-warning d-block mb-1">
                  {Math.max(upcomingEventsCount, 4)}
                </span>
                <span className="small text-secondary fw-semibold text-uppercase tracking-wider">
                  National Events
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-panel p-4 text-center h-100">
                <span className="display-6 fw-bold text-light d-block mb-1">
                  100%
                </span>
                <span className="small text-secondary fw-semibold text-uppercase tracking-wider">
                  KDPA Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-warning small text-uppercase fw-bold tracking-wider">
              Foundations of Unity
            </span>
            <h2
              className="display-5 fw-bold text-light mt-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Why the National Platform Exists
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3">
                  <Landmark size={28} />
                </div>
                <h4 className="fw-bold text-light mb-2">Heritage & Identity</h4>
                <p className="text-secondary small mb-0">
                  Preserving indigenous Luhya sub-tribe languages, cultural archives, oral
                  histories, and sacred customs under elder guidance.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-3">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="fw-bold text-light mb-2">Verified Membership</h4>
                <p className="text-secondary small mb-0">
                  Cryptographically verified member IDs (`MLB-XXX-XXXXX`) that guarantee
                  transparent electoral voting, bursary access, and emergency welfare payouts.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-inline-flex p-3 rounded-circle bg-info bg-opacity-10 text-info mb-3">
                  <Compass size={28} />
                </div>
                <h4 className="fw-bold text-light mb-2">Decentralized Governance</h4>
                <p className="text-secondary small mb-0">
                  Autonomous chapter administration at county and ward levels, ensuring that
                  grassroots members retain power over communal resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chapters Preview */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-warning small text-uppercase fw-bold tracking-wider">
                Grassroots Coverage
              </span>
              <h2
                className="h2 fw-bold text-light mt-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Featured Regional Chapters
              </h2>
            </div>
            <Link
              href="/chapters"
              className="btn btn-sm btn-glass d-inline-flex align-items-center gap-1"
            >
              Explore All Chapters <ArrowRight size={14} />
            </Link>
          </div>

          <div className="row g-4">
            {featuredChapters.map((ch) => (
              <div key={ch.id} className="col-12 col-md-4">
                <GlassCard
                  title={ch.name}
                  badge={
                    <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                      County {ch.countyCode}
                    </span>
                  }
                  interactive
                  className="h-100 d-flex flex-column"
                  footer={
                    <Link
                      href={`/chapters/${ch.slug}`}
                      className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1 w-100 justify-content-center"
                    >
                      View Chapter Details <ChevronRight size={14} />
                    </Link>
                  }
                >
                  <p className="text-secondary small mb-3 flex-grow-1">
                    {ch.description || "Active community chapter supporting members locally."}
                  </p>
                  <div className="small text-secondary d-flex align-items-start gap-2">
                    <MapPin size={16} className="text-warning flex-shrink-0 mt-1" />
                    <span>{ch.meetingVenue || "Community Hall"}</span>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events & Latest Announcements Two-Column Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Upcoming Events Column */}
            <div className="col-12 col-lg-7">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-warning small text-uppercase fw-bold tracking-wider">
                    Community Calendar
                  </span>
                  <h3
                    className="h3 fw-bold text-light mt-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Upcoming Gatherings
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="btn btn-sm btn-glass d-inline-flex align-items-center gap-1"
                >
                  All Events <ArrowRight size={14} />
                </Link>
              </div>

              <div className="d-flex flex-column gap-3">
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="glass-card p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small mb-2">
                          {ev.category}
                        </span>
                        <h5 className="fw-bold text-light mb-1">{ev.title}</h5>
                        <div className="small text-secondary d-flex align-items-center gap-3">
                          <span className="d-inline-flex align-items-center gap-1 text-warning">
                            <Calendar size={14} />
                            {new Date(ev.startTime).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="d-inline-flex align-items-center gap-1">
                            <MapPin size={14} />
                            {ev.venueName}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${ev.slug}`}
                        className="btn btn-sm btn-glass text-nowrap align-self-center"
                      >
                        Details & RSVP
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Notices Column */}
            <div className="col-12 col-lg-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-warning small text-uppercase fw-bold tracking-wider">
                    Official Dispatches
                  </span>
                  <h3
                    className="h3 fw-bold text-light mt-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    News & Bulletins
                  </h3>
                </div>
                <Link
                  href="/news"
                  className="btn btn-sm btn-glass d-inline-flex align-items-center gap-1"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div className="d-flex flex-column gap-3">
                {latestNotices.map((n) => (
                  <div key={n.id} className="glass-panel p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        className={`badge rounded-pill text-uppercase small ${
                          n.priority === "urgent"
                            ? "bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50"
                            : n.priority === "important"
                              ? "bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50"
                              : "bg-info bg-opacity-25 text-info border border-info border-opacity-50"
                        }`}
                      >
                        {n.priority}
                      </span>
                      <span className="small text-secondary">
                        {new Date(n.createdAt).toLocaleDateString("en-KE", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h6 className="fw-bold text-light mb-2">{n.title}</h6>
                    <p className="small text-secondary mb-0">
                      {n.content.length > 120 ? `${n.content.slice(0, 120)}...` : n.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="glass-panel p-5 text-center position-relative overflow-hidden">
            <h2
              className="display-5 fw-bold text-light mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Stand Counted in the National Roll
            </h2>
            <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: "640px" }}>
              Secure your official membership, participate in chapter elections, and connect with
              fellow brothers and sisters across Kenya and around the world.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link href="/sign-up" className="btn btn-gold btn-lg px-4">
                Register as Member Today
              </Link>
              <Link href="/contact" className="btn btn-glass btn-lg px-4">
                Contact National Secretariat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
