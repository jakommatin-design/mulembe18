import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { geographyRepository } from "@/server/repositories/geography.repository";
import { eventRepository } from "@/server/repositories/event.repository";
import GlassCard from "@/components/ui/GlassCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await chapterRepository.findBySlug(slug);

  if (!chapter) {
    return {
      title: "Chapter Not Found | Mulembe National Platform",
    };
  }

  return {
    title: `${chapter.name} | Mulembe National Platform`,
    description:
      chapter.description ||
      `Official community chapter serving Luhya members in County ${chapter.countyCode}.`,
    openGraph: {
      title: `${chapter.name} | Mulembe National Platform`,
      description:
        chapter.description ||
        `Connect with chapter members, attend meetings, and view local events.`,
    },
  };
}

export default async function ChapterDetailPage({ params }: Props) {
  const { slug } = await params;
  const chapter = await chapterRepository.findBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const [county, eventsResult] = await Promise.all([
    geographyRepository.getCountyByCode(chapter.countyCode),
    eventRepository.list({
      chapterId: chapter.id,
      status: "published",
      limit: 6,
    }),
  ]);

  const chapterEvents = eventsResult.items;

  return (
    <main className="container py-5">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/chapters"
          className="btn btn-sm btn-glass d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Chapters Directory
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="glass-panel p-4 p-md-5 mb-5 position-relative overflow-hidden">
        <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
          <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1">
            Active Chapter
          </span>
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-1">
            County {chapter.countyCode} {county ? `— ${county.name}` : ""}
          </span>
        </div>

        <h1
          className="display-4 fw-bold text-light mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {chapter.name}
        </h1>

        <p className="lead text-secondary mb-4" style={{ maxWidth: "800px" }}>
          {chapter.description ||
            "An active branch of the Mulembe National Community uniting families, coordinating mutual aid, and preserving Luhya culture in the region."}
        </p>

        <div className="d-flex flex-wrap gap-3">
          <Link href="/sign-up" className="btn btn-gold btn-lg px-4">
            Join This Chapter
          </Link>
          <Link href="/contact" className="btn btn-glass btn-lg px-4">
            Contact Chapter Executives
          </Link>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Logistics Details */}
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4 h-100">
            <h3 className="h4 fw-bold text-light mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Meeting Logistics & Assembly Schedule
            </h3>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 rounded glass-badge text-warning">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="small text-secondary fw-semibold text-uppercase d-block">
                      Designated Venue
                    </span>
                    <strong className="text-light fs-5">
                      {chapter.meetingVenue || "To be confirmed by Secretary"}
                    </strong>
                    <span className="small text-secondary d-block mt-1">
                      {county ? `${county.name} County, Kenya` : "Kenya"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 rounded glass-badge text-warning">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span className="small text-secondary fw-semibold text-uppercase d-block">
                      Regular Schedule
                    </span>
                    <strong className="text-light fs-5">
                      {chapter.meetingSchedule || "Monthly assembly on weekends"}
                    </strong>
                    <span className="small text-secondary d-block mt-1">
                      Official Chapter Calendar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4 border-secondary border-opacity-25" />

            <h4 className="h5 fw-bold text-light mb-3">Chapter Welfare & Governance Mandate</h4>
            <p className="small text-secondary mb-3">
              This chapter operates under the authority of the Mulembe National Platform Community
              Charter. All active chapter members in good standing are entitled to:
            </p>
            <ul className="small text-secondary ps-3 mb-0 d-flex flex-column gap-2">
              <li>Participation in chapter elections and delegate selection.</li>
              <li>Emergency welfare and bereavement benevolent assistance allocations.</li>
              <li>Youth entrepreneurship mentorship and cooperative SACCO syndicates.</li>
              <li>Representation at the National Council of Elders forums.</li>
            </ul>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <ShieldCheck size={24} className="text-success" />
                <h5 className="fw-bold text-light mb-0">Official Accreditation</h5>
              </div>
              <p className="small text-secondary mb-4">
                This chapter is formally chartered by the National Secretariat. Member
                identification and dues records are kept in secure compliance with Kenya data
                privacy statutes.
              </p>

              <div className="p-3 rounded glass-card mb-3">
                <span className="small text-secondary d-block">Geographic Region</span>
                <strong className="text-light">
                  {county?.region || "National"} Zone ({chapter.countyCode})
                </strong>
              </div>

              <div className="p-3 rounded glass-card mb-4">
                <span className="small text-secondary d-block">Administrative Desk</span>
                <strong className="text-light">County Coordinator Office</strong>
              </div>
            </div>

            <Link href="/sign-up" className="btn btn-gold w-100 text-center">
              Register as Chapter Member
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Chapter Events */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-warning small text-uppercase fw-bold tracking-wider">
              Calendar
            </span>
            <h3 className="h3 fw-bold text-light mt-1" style={{ fontFamily: "var(--font-serif)" }}>
              Upcoming Events & Assemblies
            </h3>
          </div>
          <Link
            href="/events"
            className="btn btn-sm btn-glass d-inline-flex align-items-center gap-1"
          >
            All National Events <ChevronRight size={14} />
          </Link>
        </div>

        {chapterEvents.length === 0 ? (
          <div className="glass-panel p-5 text-center">
            <Calendar size={36} className="text-secondary mb-2" />
            <h5 className="fw-bold text-light">No Scheduled Events</h5>
            <p className="small text-secondary mb-0">
              This chapter has not posted upcoming gatherings yet. Check back soon or contact the
              secretary.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {chapterEvents.map((ev) => (
              <div key={ev.id} className="col-12 col-md-6">
                <GlassCard
                  title={ev.title}
                  badge={
                    <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small">
                      {ev.category}
                    </span>
                  }
                  footer={
                    <Link
                      href={`/events/${ev.slug}`}
                      className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1 w-100 justify-content-center"
                    >
                      View Details & RSVP <ChevronRight size={14} />
                    </Link>
                  }
                >
                  <div className="small text-warning d-flex align-items-center gap-2 mb-2">
                    <Calendar size={14} />
                    <span>
                      {new Date(ev.startTime).toLocaleDateString("en-KE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="small text-secondary mb-0">
                    {ev.description.length > 140
                      ? `${ev.description.slice(0, 140)}...`
                      : ev.description}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

