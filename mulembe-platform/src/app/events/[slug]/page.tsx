import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { eventRepository } from "@/server/repositories/event.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import EventRsvpButton from "@/components/public/EventRsvpButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await eventRepository.findBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | Mulembe National Platform",
    };
  }

  return {
    title: `${event.title} | Mulembe National Platform`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: `${event.title} | Mulembe National Platform`,
      description: event.description.slice(0, 160),
      type: "article",
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await eventRepository.findBySlug(slug);

  if (!event) {
    notFound();
  }

  const [chapter, rsvpStats] = await Promise.all([
    event.chapterId ? chapterRepository.getById(event.chapterId) : Promise.resolve(null),
    eventRepository.getRsvpStats(event.id),
  ]);

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);

  // Structured Data for Google Event Search Indexing
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startTime.toISOString(),
    endDate: event.endTime.toISOString(),
    eventAttendanceMode: event.onlineUrl
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venueAddress || "Kenya",
        addressCountry: "KE",
      },
    },
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: chapter ? chapter.name : "Mulembe National Platform",
      url: "https://mulembe.org",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <main className="container py-5">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/events"
            className="btn btn-sm btn-glass d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Events Calendar
          </Link>
        </div>

        {/* Hero Card */}
        <div className="glass-panel p-4 p-md-5 mb-5">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-1 text-uppercase">
              {event.category}
            </span>
            {chapter && (
              <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1">
                Hosted by {chapter.name}
              </span>
            )}
          </div>

          <h1
            className="display-4 fw-bold text-light mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {event.title}
          </h1>

          <div className="row g-4 pt-2 border-top border-secondary border-opacity-25">
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded glass-badge text-warning">
                  <Calendar size={24} />
                </div>
                <div>
                  <span className="small text-secondary fw-semibold text-uppercase d-block">
                    Date
                  </span>
                  <strong className="text-light">
                    {startDate.toLocaleDateString("en-KE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded glass-badge text-warning">
                  <Clock size={24} />
                </div>
                <div>
                  <span className="small text-secondary fw-semibold text-uppercase d-block">
                    Time (East Africa Time)
                  </span>
                  <strong className="text-light">
                    {startDate.toLocaleTimeString("en-KE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    —{" "}
                    {endDate.toLocaleTimeString("en-KE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded glass-badge text-warning">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="small text-secondary fw-semibold text-uppercase d-block">
                    Location
                  </span>
                  <strong className="text-light">{event.venueName}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content & RSVP Sidebar Grid */}
        <div className="row g-4">
          {/* Main Description */}
          <div className="col-12 col-lg-8">
            <div className="glass-card p-4 p-md-5">
              <h3
                className="h4 fw-bold text-light mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                About this Gathering
              </h3>

              <div
                className="text-secondary mb-4"
                style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}
              >
                {event.description}
              </div>

              {event.venueAddress && (
                <div className="p-4 rounded glass-panel mb-4">
                  <h5 className="fw-bold text-light mb-2 d-flex align-items-center gap-2">
                    <MapPin size={18} className="text-warning" /> Venue Directions
                  </h5>
                  <p className="small text-secondary mb-0">
                    {event.venueName}, {event.venueAddress}
                  </p>
                </div>
              )}

              {event.onlineUrl && (
                <div className="p-4 rounded glass-panel mb-4">
                  <h5 className="fw-bold text-light mb-2 d-flex align-items-center gap-2">
                    <Globe size={18} className="text-info" /> Virtual Stream Link
                  </h5>
                  <p className="small text-secondary mb-2">
                    Diaspora and remote participants can follow live via the official link below:
                  </p>
                  <a
                    href={event.onlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-glass text-info d-inline-flex align-items-center gap-2"
                  >
                    Open Live Video Broadcast
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action & Capacity Card */}
          <div className="col-12 col-lg-4">
            <div className="glass-panel p-4 d-flex flex-column gap-4">
              <div>
                <span className="small text-secondary fw-semibold text-uppercase d-block mb-1">
                  Attendance Status
                </span>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-6 fw-bold text-warning">
                    {rsvpStats.attending}
                  </span>
                  <span className="text-secondary small">Confirmed RSVPs</span>
                </div>
                {event.capacity && (
                  <div className="small text-secondary mt-1">
                    Venue Capacity: <strong>{event.capacity} seats</strong>
                  </div>
                )}
              </div>

              {/* Interactive RSVP Button (Opens Modal) */}
              <EventRsvpButton eventId={event.id} eventTitle={event.title} />

              <div className="p-3 rounded glass-card">
                <h6 className="fw-bold text-light mb-2 d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" /> Attendance Protocol
                </h6>
                <p className="small text-secondary mb-0">
                  Registered Mulembe members receive priority seating upon displaying their digital
                  Member ID badge on entry.
                </p>
              </div>

              {chapter && (
                <div className="p-3 rounded glass-card">
                  <span className="small text-secondary d-block">Organising Body</span>
                  <Link
                    href={`/chapters/${chapter.slug}`}
                    className="text-warning fw-semibold small text-decoration-none"
                  >
                    {chapter.name} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

